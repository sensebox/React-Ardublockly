export const text = { kind: "block", type: "text" };
export const textJoin = { kind: "block", type: "text_join" };
export const textAppend = {
  kind: "block",
  type: "text_append",
  inputs: {
    TEXT: {
      block: {
        kind: "block",
        type: "text",
      },
    },
  },
};
export const textLength = { kind: "block", type: "text_length" };
export const textIsEmpty = { kind: "block", type: "text_isEmpty" };

export default {
  mcu: [text, textJoin, textAppend, textLength, textIsEmpty],
  mini: [text, textJoin, textAppend, textLength, textIsEmpty],
  esp32: [text, textJoin, textAppend, textLength, textIsEmpty],
};
