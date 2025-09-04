import * as Blockly from "blockly/core";

Blockly.defineBlocksWithJsonArray([
  {
    type: "basic_display",
    message0: "Zeige auf dem Display %1",
    args0: [{ type: "field_input", name: "value", text: "Text" }],
    previousStatement: true,
    nextStatement: null,
    colour: 230,
  },
]);

Blockly.defineBlocksWithJsonArray([
  {
    type: "basic_red",
    message0: "%1",
    args0: [
      {
        type: "field_image",
        src: "./media/blockly/redLed.png",
        width: 30,
        height: 30,
        alt: "*",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
  },
  {
    type: "basic_yellow",
    message0: "%1",
    args0: [
      {
        type: "field_image",
        src: "./media/blockly/yellowLed.png",
        width: 30,
        height: 30,
        alt: "*",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
  },
  {
    type: "basic_blue",
    message0: "%1",
    args0: [
      {
        type: "field_image",
        src: "./media/blockly/blueLed.png",
        width: 30,
        height: 30,
        alt: "*",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
  },
  {
    type: "basic_off",
    message0: "%1",
    args0: [
      {
        type: "field_image",
        src: "./media/blockly/offLed.png",
        width: 30,
        height: 30,
        alt: "*",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
  },
]);
