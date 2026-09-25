import * as Blockly from "blockly/core";

const WHITE = "#ffffff";
const BLACK = "#000000";
const DEFAULT_SIZE = 20;

/**
 * A clickable field that toggles between white and black on each click.
 * Serialises as a colour value so it stays compatible with generators that
 * read "#ffffff" / "#000000".
 */
class ToggleColourField extends Blockly.Field {
  constructor(value, validator, config) {
    super(value === undefined ? BLACK : value, validator, config);
    this.SERIALIZABLE = true;
    this.CURSOR = "pointer";
    const dimension = (config && config.size) || DEFAULT_SIZE;
    this.size_ = new Blockly.utils.Size(dimension, dimension);
  }

  static fromJson(options) {
    const value = options.colour !== undefined ? options.colour : options.value;
    return new this(value, undefined, options);
  }

  initView() {
    this.borderRect_ = Blockly.utils.dom.createSvgElement(
      "rect",
      {
        rx: 4,
        ry: 2,
        x: 0,
        y: 0,
        width: this.size_.width,
        height: this.size_.height,
        stroke: "#888888",
        "stroke-width": 1,
      },
      this.fieldGroup_,
    );
    this.applyColour();
  }

  applyColour() {
    if (this.borderRect_) {
      // Inline style beats Blockly's ".blocklyEditableField > rect" CSS rule.
      this.borderRect_.style.fill = this.getValue();
    }
  }

  doClassValidation_(newValue) {
    return newValue === BLACK ? BLACK : WHITE;
  }

  doValueUpdate_(newValue) {
    this.value_ = newValue;
    this.applyColour();
  }

  // Fixed square size; skip the text-based measurement of the base class.
  updateSize_() {}

  // Clicking the field toggles the colour instead of opening an editor.
  showEditor_() {
    this.setValue(this.getValue() === BLACK ? WHITE : BLACK);
  }

  getText_() {
    return this.getValue();
  }
}

Blockly.fieldRegistry.register("field_toggle_colour", ToggleColourField);

export default ToggleColourField;
