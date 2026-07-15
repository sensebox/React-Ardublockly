import * as Blockly from "blockly/core";

Blockly.defineBlocksWithJsonArray([
  {
    type: "basic_ble_send",
    message0: "Sende %1 über Bluetooth mit UUID %2",
    args0: [
      {
        type: "input_value",
        name: "DATA",
        check: "String",
      },
      {
        type: "input_value",
        name: "UUID",
        check: "String",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: "#5ba574",
    tooltip: "Sendet Daten über Bluetooth",
    helpUrl: "",
  },
  {
    type: "basic_serial_send",
    message0: "Sende %1 über Serial",
    args0: [
      {
        type: "input_value",
        name: "DATA",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: "#5ba574",
    tooltip: "Sendet Daten über Serial",
    helpUrl: "",
  },
]);
