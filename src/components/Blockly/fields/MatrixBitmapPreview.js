import * as Blockly from "blockly/core";

const WIDTH = 12;
const HEIGHT = 8;
const PIXEL_SIZE = 8;

function bitmapImage(block) {
  const pixels = Array.from({ length: WIDTH * HEIGHT }, (_, index) => {
    const row = Math.floor(index / WIDTH);
    const column = index % WIDTH;
    const value = block?.getFieldValue(`${row + 1},${column + 1}`);
    const color = /^#[0-9a-f]{6}$/i.test(value) ? value : "#000000";
    return `<rect x="${column * PIXEL_SIZE + 1}" y="${row * PIXEL_SIZE + 1}" width="7" height="7" fill="${color}"/>`;
  }).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="97" height="65" viewBox="0 0 97 65"><rect width="97" height="65" rx="2" fill="#444"/>${pixels}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** A derived preview; only the original pixel fields are saved or undone. */
export default class MatrixBitmapPreview extends Blockly.FieldImage {
  constructor() {
    super(
      bitmapImage(),
      97,
      65,
      Blockly.Msg.senseBox_matrix_editor_open,
      (field) => {
        field.getSourceBlock().getField("EDITOR").showEditor();
      },
    );
  }

  initView() {
    super.initView();
    this.refresh();
  }

  refresh() {
    // Update the image directly without generating additional change events.
    this.doValueUpdate_(bitmapImage(this.getSourceBlock()));
  }
}
