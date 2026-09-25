import * as Blockly from "blockly/core";

Blockly.defineBlocksWithJsonArray([
  {
    type: "sensebox_start",
    message0: "Füge hier deine Blöcke ein %1 → Dauerschleife %2",
    args0: [
      {
        type: "input_dummy",
      },
      {
        type: "input_statement",
        name: "DO",
      },
    ],
    colour: "#995ba5",
    tooltip: "Startpunkt deines Programms",
    helpUrl: "",
  },
  {
    type: "basic_setup",
    message0: "Vor dem Starten ausführen %1 → einmalig %2",
    args0: [
      {
        type: "input_dummy",
      },
      {
        type: "input_statement",
        name: "DO",
      },
    ],
    colour: "#995ba5",
    tooltip:
      "Wird einmalig ausgeführt, bevor die Loop durchlaufen wird. Ziehe hier alle Anweisungen hinein, die vor dem Starten passieren sollen.",
    helpUrl: "",
  },
]);

Blockly.Blocks["basic_if"] = {
  init: function () {
    this.appendValueInput("IF")
      .setCheck(["String", "Boolean"])
      .appendField("wenn");
    this.appendStatementInput("DO").appendField("mache");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#5b67a5");
    this.setTooltip("Wenn / sonst Verzweigung");
    this.setInputsInline(false);
  },
};

Blockly.Blocks["basic_if_else"] = {
  init: function () {
    this.appendValueInput("IF")
      .setCheck(["String", "Boolean"])
      .appendField("wenn");
    this.appendStatementInput("DO").appendField("mache");
    this.appendStatementInput("ELSE").appendField("sonst");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour("#5b67a5");
    this.setTooltip("Wenn / sonst Verzweigung");
    this.setInputsInline(false);
  },
};

Blockly.defineBlocksWithJsonArray([
  {
    type: "basic_repeat_times",
    message0: "Wiederhole %1 mal %2",
    args0: [
      {
        type: "input_value",
        name: "TIMES",
        check: "String",
      },
      {
        type: "input_statement",
        name: "DO",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: "#a5675b",
    tooltip: "Wiederholt die enthaltenen Blöcke eine bestimmte Anzahl an Malen",
    helpUrl: "",
  },
  {
    type: "basic_repeat_until",
    message0: "Wiederhole bis %1 %2",
    args0: [
      {
        type: "input_value",
        name: "CONDITION",
        check: "Boolean",
      },
      {
        type: "input_statement",
        name: "DO",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: "#a5675b",
    tooltip: "Wiederholt die enthaltenen Blöcke, bis die Bedingung erfüllt ist",
    helpUrl: "",
  },
]);
