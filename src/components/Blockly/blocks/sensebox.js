import * as Blockly from "blockly/core";
import { getColour } from "../helpers/colour";
import * as Types from "../helpers/types";

Blockly.Blocks["sensebox_multiplexer_init"] = {
  init: function () {
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_multiplexer_init);
    this.appendValueInput("nrChannels").setCheck(
      Types.getCompatibleTypes("int"),
    );
    this.appendDummyInput().appendField(
      Blockly.Msg.senseBox_multplexer_nchannels,
    );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setInputsInline("true");
    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.senseBox_multiplexer_init_tooltip);
    this.setHelpUrl(Blockly.Msg.senseBox_multiplexer_init_helpurl);
  },
};

Blockly.Blocks["sensebox_multiplexer_changeChannel"] = {
  init: function () {
    this.appendDummyInput().appendField(
      Blockly.Msg.senseBox_multiplexer_changeChannel,
    );
    this.appendValueInput("Channel").setCheck(Types.getCompatibleTypes("int"));
    this.setInputsInline("true");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.sensebox_multiplexer_changeChannel_tooltip);
    this.setHelpUrl(Blockly.Msg.sensebox_multiplexer_changeChannel_helpurl);
  },
};
