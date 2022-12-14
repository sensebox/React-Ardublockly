import * as Blockly from "blockly";
import { getColour } from "../helpers/colour";
import * as Types from "../helpers/types";

Blockly.Blocks["sensebox_ntp_init"] = {
  init: function () {
    this.setHelpUrl(Blockly.Msg.sensebox_ntp_helpurl);
    this.setColour(getColour().time);
    this.appendDummyInput().appendField(Blockly.Msg.sensebox_ntp_init);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.sensebox_ntp_tooltip);
  },
};

Blockly.Blocks["sensebox_ntp_get"] = {
  init: function () {
    this.setHelpUrl(Blockly.Msg.sensebox_ntp_get_helpurl);
    this.setColour(getColour().time);
    this.appendDummyInput()
      .appendField(Blockly.Msg.sensebox_ntp_get)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.sensebox_ntp_epochTime, "getEpochTime"],
          [Blockly.Msg.sensebox_ntp_formattedTimeStamp, "getFormattedTime"],
        ]),
        "dropdown"
      );
    this.setOutput(true, Types.LARGE_NUMBER.typeName);
    this.setTooltip(Blockly.Msg.sensebox_rtc_get_tooltip);
  },
};

Blockly.Blocks["sensebox_ntp_get_timestamp"] = {
  init: function () {
    this.setHelpUrl(Blockly.Msg.sensebox_rtc_helpurl);
    this.setColour(getColour().time);
    this.appendDummyInput().appendField(Blockly.Msg.sensebox_rtc_get_timestamp);
    this.setOutput(true);
    this.setTooltip(Blockly.Msg.sensebox_rtc_get_timestamp_tooltip);
  },
};
