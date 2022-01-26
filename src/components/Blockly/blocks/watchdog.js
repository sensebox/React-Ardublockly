import Blockly from "blockly/core";
import { getColour } from "../helpers/colour";

Blockly.Blocks["watchdog_enable"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Watchdog aktivieren")
      .appendField(new Blockly.FieldTextInput("10000"), "TIME")
      .appendField("ms");

    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(getColour().io);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["watchdog_reset"] = {
  init: function () {
    this.appendDummyInput().appendField("Watchdog zurücksetzen");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(getColour().io);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};
