import * as Blockly from "blockly";
import { getColour } from "../helpers/colour";
import { selectedBoard } from "../helpers/board";

Blockly.Blocks["sensebox_fluoroASM_init"] = {
  init: function () {
    this.appendDummyInput().appendField(
      "Init FluoroASM Bee",
    );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.senseBox_display_beginDisplay_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_display_helpurl);
  },
};

Blockly.Blocks['sensebox_fluoroASM_setLED'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Fluoro LED einschalten")
            .appendField(new Blockly.FieldDropdown([
                ["1", "1"], 
                ["2", "2"], 
                ["3", "3"], 
                ["4", "4"]
            ]), "LED_NUMBER");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(getColour().sensebox);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};



Blockly.Blocks["sensebox_fluoroASM_setLED2"] = {
  init: function () {
    this.setColour(getColour().sensebox);
    this.appendDummyInput()
      .appendField("LED ")
      .appendField("Nummer:")
      .appendField(
        new Blockly.FieldDropdown([
          ["1", "1"],
          ["2", "2"],
          ["3", "3"],
          ["4", "4"],
        ]),
        "LED_NUMBER",

      )
      .appendField(Blockly.Msg.senseBox_basic_state)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.senseBox_on, "HIGH"],
          [Blockly.Msg.senseBox_off, "LOW"],
        ]),
        "STAT",
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.senseBox_led_tooltip);
  },
};