import * as Blockly from "blockly";
import { getColour } from "@/components/Blockly/helpers/colour";
import * as Types from "../helpers/types";

Blockly.Blocks["sensebox_esp_now"] = {
  init: function () {
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_esp_now_tooltip);
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
      .setAlign(Blockly.inputs.Align.LEFT)
      .appendField(Blockly.Msg.senseBox_esp_now_send_mac)
      .appendField(
        new Blockly.FieldTextInput("00:00:00:00:00:00"),
        "mac-address",
      );
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

Blockly.Blocks["sensebox_esp_now_receive"] = {
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.senseBox_esp_now_receive,
      args0: [
        {
          type: "field_variable",
          name: "VAR",
          defaultType: Types.TEXT.typeName,
          variable: "message",
          // TODO check type?
        },
        {
          type: "field_variable",
          name: "MAC",
          defaultType: Types.TEXT.typeName,
          variable: "mac_address",
          // TODO check type?
        },
      ],
    });
    this.appendStatementInput("DO").appendField(
      Blockly.Msg.CONTROLS_REPEAT_INPUT_DO,
    );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.senseBox_esp_now_receive_tooltip);
    this.setColour(getColour().sensebox);
    this.setHelpUrl(Blockly.Msg.senseBox_wifi_ip_helpurl);
  },
};

Blockly.Blocks["sensebox_esp_now_send"] = {
  init: function () {
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_esp_now_send);
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_esp_now_send_mac)
      .appendField(Blockly.Msg.senseBox_mac_address)
      .appendField(
        new Blockly.FieldTextInput("00:00:00:00:00:00"),
        "mac-address",
      );
    this.appendValueInput("value").appendField(
      Blockly.Msg.senseBox_esp_now_send_message,
    );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.senseBox_esp_now_send_tooltip);
    this.setColour(getColour().sensebox);
    this.setHelpUrl(Blockly.Msg.senseBox_wifi_ip_helpurl);
  },
};
