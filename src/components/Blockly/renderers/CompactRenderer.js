import * as Blockly from "blockly/core";

/**
 * Custom renderer that extends Geras with smaller blocks and borders
 */
class CompactRenderer extends Blockly.geras.Renderer {
  constructor() {
    super("compact");
  }

  /**
   * @override
   */
  makeConstants_() {
    const constants = super.makeConstants_();

    // Make blocks smaller by scaling down various constants
    // Reduce by ~15% to make blocks more compact
    constants.FIELD_HEIGHT = constants.FIELD_HEIGHT * 0.85;
    constants.FIELD_TEXT_HEIGHT = constants.FIELD_TEXT_HEIGHT * 0.85;
    constants.FIELD_BORDER_RECT_HEIGHT =
      constants.FIELD_BORDER_RECT_HEIGHT * 0.85;

    // Reduce spacing
    constants.MEDIUM_PADDING = constants.MEDIUM_PADDING * 0.45;
    constants.SMALL_PADDING = constants.SMALL_PADDING * 0.45;
    constants.LARGE_PADDING = constants.LARGE_PADDING * 0.45;

    // Reduce corner radius slightly
    constants.CORNER_RADIUS = constants.CORNER_RADIUS * 0.9;

    // Add visible borders to blocks
    constants.STROKE_WIDTH = 2; // Border thickness (default is usually 1)

    // Make the border more visible by using a darker color
    // This adds a subtle black border at 30% opacity
    constants.DARK_PATH_OPACITY = 1;

    return constants;
  }

  /**
   * @override
   */
  getConstants() {
    const constants = super.getConstants();

    // Ensure stroke width is applied
    if (constants.STROKE_WIDTH === undefined) {
      constants.STROKE_WIDTH = 2;
    }

    return constants;
  }
}

// Register the custom renderer with Blockly
Blockly.blockRendering.register("compact", CompactRenderer);

export default CompactRenderer;
