import * as Blockly from "blockly";
import { getColour } from "../helpers/colour";

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
            .appendField("Set LED")
            .appendField(new Blockly.FieldDropdown([
                ["red", "RED"], 
                ["yellow", "YELLOW"], 
                ["green", "GREEN"], 
                ["blue", "BLUE"]
            ]), "LED_COLOR");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};