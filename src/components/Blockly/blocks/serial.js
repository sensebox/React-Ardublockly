import * as Blockly from "blockly/core";
import { getColour } from "../helpers/colour";
import { selectedBoard } from "../helpers/board";

Blockly.Blocks["init_serial_monitor"] = {
  init: function () {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(getColour().serial);
    this.setHelpUrl("http://arduino.cc/en/Serial/Begin");
    this.appendDummyInput()
      .appendField(Blockly.Msg.ARD_SERIAL_SETUP)
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().serial),
        "SERIAL_ID"
      )
      .appendField(Blockly.Msg.ARD_SERIAL_SPEED)
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().serialSpeed),
        "SPEED"
      )
      .appendField(Blockly.Msg.ARD_SERIAL_BPS);
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.ARD_SERIAL_SETUP_TIP);
  },
};

Blockly.Blocks["print_serial_monitor"] = {
  init: function () {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(getColour().serial);
    this.setHelpUrl("http://www.arduino.cc/en/Serial/Print");
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldDropdown(selectedBoard().serial),
        "SERIAL_ID"
      )
      .appendField(Blockly.Msg.ARD_SERIAL_PRINT);
    this.appendValueInput("CONTENT");
    this.appendDummyInput()
      .appendField(new Blockly.FieldCheckbox("TRUE"), "NEW_LINE")
      .appendField(Blockly.Msg.ARD_SERIAL_PRINT_NEWLINE);
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.ARD_SERIAL_PRINT_TIP);
  },
};
