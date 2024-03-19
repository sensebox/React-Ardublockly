import Blockly from "blockly";
import { getColour } from "../helpers/colour";
import * as Types from "../helpers/types";

Blockly.Blocks["sensebox_esp_now"] = {
  init: function () {
    this.appendDummyInput().appendField(
      Blockly.Msg.senseBox_esp_now_tooltip
    );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(getColour().sensebox);
    this.setTooltip(Blockly.Msg.senseBox_esp_now_init_tooltip);
    this.setHelpUrl("");
  },
};

Blockly.Blocks["sensebox_esp_now_sender"] = {
  init: function () {
    this.setTooltip(Blockly.Msg.senseBox_esp_now_sender_tooltip);
    this.setHelpUrl("");
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_esp_now_sender);
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_LEFT)
      .appendField(Blockly.Msg.senseBox_mac_address)
      .appendField(new Blockly.FieldTextInput("Mac-Address"), "mac-address");
    this.setHelpUrl("");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  },
};

Blockly.Blocks["sensebox_get_mac"] = {
  init: function () {
    this.setTooltip(Blockly.Msg.senseBox_wifi_mac_tooltip);
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_wifi_mac);
    this.setOutput(true, Types.TEXT.typeName);
    this.setHelpUrl(Blockly.Msg.senseBox_wifi_ip_helpurl);
  },
};

// TODO
Blockly.Blocks["sensebox_esp_now_receive"] = {
  init: function () {
    this.setTooltip(Blockly.Msg.senseBox_wifi_mac_tooltip);
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_wifi_mac);
    this.setOutput(true, Types.TEXT.typeName);
    this.setHelpUrl(Blockly.Msg.senseBox_wifi_ip_helpurl);
  },
};

// TODO
Blockly.Blocks["sensebox_esp_now_send"] = {
  init: function () {
    this.setTooltip(Blockly.Msg.senseBox_wifi_mac_tooltip);
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_wifi_mac);
    this.setOutput(true, Types.TEXT.typeName);
    this.setHelpUrl(Blockly.Msg.senseBox_wifi_ip_helpurl);
  },
};
