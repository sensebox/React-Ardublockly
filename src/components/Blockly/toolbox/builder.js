import { getColour } from "../helpers/colour";

// Builder class for the toolbox
class ToolboxBuilder {
  constructor() {
    this.toolbox = {
      kind: "categoryToolbox",
      contents: [],
    };
  }

  // Method to build the whole toolbox
  buildToolbox() {
    return this.toolbox;
  }

  addCategory(name, colour, blocks) {
    if (!blocks || !name || !colour) {
      return this; // Return early to prevent adding an invalid category
    }

    const category = new CategoryBuilder(name, colour)
      .addBlocks(blocks)
      .buildCategory();

    this.toolbox.contents.push(category);
    return this;
  }

  addCustomCategory(name, colour, custom) {
    if (!name || !colour || !custom) {
      return this; // Return early to prevent adding an invalid category
    }

    const category = {
      kind: "category",
      name,
      colour,
      custom,
    };

    this.toolbox.contents.push(category);
    return this;
  }

  addNestedCategory(name, colour, categories) {
    if (!categories || !name || !colour) {
      return this; // Return early to prevent adding an invalid category
    }

    const category = {
      kind: "category",
      name,
      colour,
      contents: categories,
    };

    this.toolbox.contents.push(category);
    return this;
  }
}

// Builder class for a category
class CategoryBuilder {
  constructor(name, colour) {
    this.category = {
      name,
      kind: "category",
      colour: colour || getColour().default,
      contents: [],
    };
  }

  // Method to add blocks to the category
  addBlocks(blocks) {
    blocks.forEach((block) => {
      this.category.contents.push(block);
    });
    return this;
  }

  // Method to build the category
  buildCategory() {
    return this.category;
  }
}

export { ToolboxBuilder, CategoryBuilder };
