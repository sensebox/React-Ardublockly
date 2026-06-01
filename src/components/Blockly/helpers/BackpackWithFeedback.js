import { Backpack } from "@blockly/workspace-backpack";

/**
 * Block types that should not be added to the backpack.
 */
const BACKPACK_BLOCKED_TYPES = ["arduino_functions"];

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
   * Check if a block type is allowed in the backpack.
   * @param {string} blockType - The block type to check.
   * @returns {boolean} True if the block is allowed.
   */
  isBlockAllowed(blockType) {
    return !BACKPACK_BLOCKED_TYPES.includes(blockType);
  }

  /**
   * Override onDrop to detect when blocks are added and filter blocked types.
   * @param {!Blockly.IDraggable} dragElement - The dragged element.
   * @override
   */
  onDrop(dragElement) {
    // Check if the dragged element is a block with a blocked type
    if (dragElement?.type && !this.isBlockAllowed(dragElement.type)) {
      return; // Don't add blocked blocks
    }

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
    // Don't add blocked block types
    if (!this.isBlockAllowed(block.type)) {
      return;
    }

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
