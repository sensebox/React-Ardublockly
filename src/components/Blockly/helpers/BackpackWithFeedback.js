import { Backpack } from "@blockly/workspace-backpack";

/**
 * Custom Backpack that fires callbacks when blocks are added/removed.
 * Extends the @blockly/workspace-backpack Backpack class.
 */
export class BackpackWithFeedback extends Backpack {
  /**
   * @param {!Blockly.WorkspaceSvg} workspace - The workspace to add the backpack to.
   * @param {Object} options - Optional configuration
   * @param {Function} options.onAdd - Callback when a block is added to the backpack
   * @param {Function} options.onRemove - Callback when a block is removed from the backpack
   */
  constructor(workspace, options = {}) {
    super(workspace);
    this.onAddCallback = options.onAdd || null;
    this.onRemoveCallback = options.onRemove || null;
    this.previousCount = 0;
  }

  /**
   * Initialize the backpack and set up content tracking.
   */
  init() {
    super.init();
    this.previousCount = this.getCount();
  }

  /**
   * Override onDrop to detect when blocks are added.
   * @param {!Blockly.IDraggable} dragElement - The dragged element.
   * @override
   */
  onDrop(dragElement) {
    const countBefore = this.getCount();
    super.onDrop(dragElement);
    const countAfter = this.getCount();

    if (countAfter > countBefore && this.onAddCallback) {
      this.onAddCallback(countAfter - countBefore);
    }
  }

  /**
   * Override addBlock to detect when blocks are added programmatically.
   * @param {!Blockly.Block} block - The block to add.
   * @override
   */
  addBlock(block) {
    const countBefore = this.getCount();
    super.addBlock(block);
    const countAfter = this.getCount();

    if (countAfter > countBefore && this.onAddCallback) {
      this.onAddCallback(countAfter - countBefore);
    }
  }

  /**
   * Override removeItem to detect when blocks are removed.
   * @param {string} item - The item to remove.
   * @override
   */
  removeItem(item) {
    super.removeItem(item);
    if (this.onRemoveCallback) {
      this.onRemoveCallback();
    }
  }
}
