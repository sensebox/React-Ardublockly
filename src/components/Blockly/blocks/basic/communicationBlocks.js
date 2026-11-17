import * as Blockly from "blockly/core";

Blockly.defineBlocksWithJsonArray([
  {
    type: "basic_send_temperature",
    message0: "Sende Temperatur (ID 1)",
    previousStatement: null,
    nextStatement: null,
    colour: "#5ba574",
    tooltip: "Sendet die Temperatur auf Kanal/ID 1",
    helpUrl: "",
  },
  {
    type: "basic_send_humidity",
    message0: "Sende Luftfeuchtigkeit (ID 2)",
    previousStatement: null,
    nextStatement: null,
    colour: "#5ba574",
    tooltip: "Sendet die Luftfeuchtigkeit auf Kanal/ID 2",
    helpUrl: "",
  },
  {
    type: "basic_send_air_quality",
    message0: "Sende Luftqualität (ID 3)",
    previousStatement: null,
    nextStatement: null,
    colour: "#5ba574",
    tooltip: "Sendet die Luftqualität auf Kanal/ID 3",
    helpUrl: "",
  },
]);
