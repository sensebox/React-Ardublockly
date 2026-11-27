import * as Blockly from "blockly/core";
// Registers the original ToolboxSearchCategory under the kind "search"
import "@blockly/toolbox-search";
import "./search-category.css";

const SEARCH_KIND = "search";
const MIN_QUERY_LENGTH = 3;

const BaseSearchCategory = Blockly.registry.getClass(
  Blockly.registry.Type.TOOLBOX_ITEM,
  SEARCH_KIND,
);

/**
 * Extends the @blockly/toolbox-search category with translated texts,
 * de-duplicated results and fault-tolerant indexing.
 */
class SenseboxToolboxSearchCategory extends BaseSearchCategory {
  createDom_() {
    const dom = super.createDom_();
    if (this.searchField) {
      this.searchField.placeholder = Blockly.Msg.toolbox_search_placeholder;
      this.searchField.setAttribute(
        "aria-label",
        Blockly.Msg.toolbox_search_placeholder,
      );
    }
    return dom;
  }

  /**
   * Indexes every block on its own so a single block that fails to
   * initialise on a headless workspace doesn't break the whole search.
   */
  initBlockSearcher() {
    const blockInfos = new Set();
    this.workspace_.options.languageTree?.contents?.forEach((item) =>
      this.getAvailableBlocks(item, blockInfos),
    );
    blockInfos.forEach((blockInfo) => {
      try {
        this.blockSearcher.indexBlocks([blockInfo]);
      } catch (err) {
        console.warn(
          `Toolbox search: could not index block "${blockInfo.type}"`,
          err,
        );
      }
    });
    this.initCategoryIndex();
  }

  /**
   * Remembers the (lower-case) name of every category together with the
   * blocks and buttons it contains, including those of nested sub-categories,
   * so searching for a category name ("mathe") lists its contents. Dynamic
   * categories (custom="...") only store their callback key, their contents
   * are generated on every search.
   */
  initCategoryIndex() {
    this.categoryIndex_ = [];
    this.staticButtons_ = [];
    this.customKeys_ = new Set();
    const visit = (item) => {
      const kind = item.kind?.toLowerCase();
      if (kind === "block") {
        return { items: item.type ? [item] : [], customs: [] };
      }
      if (kind === "button") {
        this.staticButtons_.push(item);
        return { items: [item], customs: [] };
      }
      const result = { items: [], customs: [] };
      if (kind !== "category") return result;
      if (item.custom) {
        result.customs.push(item.custom);
        this.customKeys_.add(item.custom);
      }
      (Array.isArray(item.contents) ? item.contents : []).forEach((child) => {
        const childResult = visit(child);
        result.items.push(...childResult.items);
        result.customs.push(...childResult.customs);
      });
      if (item.name) {
        this.categoryIndex_.push({ name: item.name.toLowerCase(), ...result });
      }
      return result;
    };
    this.workspace_.options.languageTree?.contents?.forEach(visit);
  }

  /**
   * Returns the current flyout contents of a dynamic category (e.g. the
   * "create variable" button and the existing variables) as JSON items.
   */
  getDynamicItems(customKey) {
    const callback = this.workspace_.getToolboxCategoryCallback(customKey);
    if (!callback) return [];
    try {
      return Blockly.utils.toolbox.convertFlyoutDefToJsonArray(
        callback(this.workspace_),
      );
    } catch (err) {
      console.warn(
        `Toolbox search: could not load category "${customKey}"`,
        err,
      );
      return [];
    }
  }

  matchBlocks() {
    const query = this.searchField?.value.trim() || "";
    const lowerQuery = query.toLowerCase();
    const isLongEnough = query.length >= MIN_QUERY_LENGTH;

    // Short queries only match a category name exactly (e.g. "KI")
    const categoryMatches = query
      ? (this.categoryIndex_ || [])
          .filter((category) =>
            isLongEnough
              ? category.name.includes(lowerQuery)
              : category.name === lowerQuery,
          )
          .flatMap((category) => [
            ...category.items,
            ...category.customs.flatMap((key) => this.getDynamicItems(key)),
          ])
      : [];

    const buttonMatches = isLongEnough
      ? [
          ...(this.staticButtons_ || []),
          ...[...(this.customKeys_ || [])].flatMap((key) =>
            this.getDynamicItems(key),
          ),
        ].filter(
          (item) =>
            item.kind?.toLowerCase() === "button" &&
            item.text?.toLowerCase().includes(lowerQuery),
        )
      : [];

    const blockMatches = isLongEnough
      ? this.blockSearcher.blockTypesMatching(query)
      : [];

    const seenKeys = new Set();
    const matches = [
      ...categoryMatches,
      ...buttonMatches,
      ...blockMatches,
    ].filter((item) => {
      // The same block or button can be listed in several categories.
      // Dynamic blocks (blockxml, e.g. one getter per variable) share a type
      // and are therefore never de-duplicated.
      const kind = item.kind?.toLowerCase();
      const key =
        kind === "block" && !item.blockxml
          ? `block:${item.type}`
          : kind === "button"
            ? `button:${item.text}`
            : null;
      if (!key) return true;
      if (seenKeys.has(key)) return false;
      seenKeys.add(key);
      return true;
    });

    this.flyoutItems_ = matches.length
      ? matches
      : [
          {
            kind: "label",
            text:
              query.length < MIN_QUERY_LENGTH
                ? Blockly.Msg.toolbox_search_hint
                : Blockly.Msg.toolbox_search_no_results,
          },
        ];
    this.parentToolbox_.refreshSelection();
  }
}

Blockly.registry.register(
  Blockly.registry.Type.TOOLBOX_ITEM,
  SEARCH_KIND,
  SenseboxToolboxSearchCategory,
  true,
);

export default SenseboxToolboxSearchCategory;
