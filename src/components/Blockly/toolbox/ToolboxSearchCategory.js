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
  }

  matchBlocks() {
    const query = this.searchField?.value.trim() || "";
    const seenTypes = new Set();
    const matches =
      query.length >= MIN_QUERY_LENGTH
        ? this.blockSearcher.blockTypesMatching(query).filter((blockInfo) => {
            // The same block can be listed in several categories
            if (seenTypes.has(blockInfo.type)) return false;
            seenTypes.add(blockInfo.type);
            return true;
          })
        : [];

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
