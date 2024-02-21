import Blockly from "blockly";
import { getColour } from "../helpers/colour";
import * as Types from "../helpers/types";

Blockly.Blocks["sensebox_wifi"] = {
  init: function () {
    this.setTooltip(Blockly.Msg.senseBox_wifi_tooltip);
    this.setHelpUrl("");
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_wifi_connect);
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_LEFT)
      .appendField(Blockly.Msg.senseBox_wifi_ssid)
      .appendField(new Blockly.FieldTextInput("SSID"), "SSID");
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_LEFT)
      .appendField(Blockly.Msg.senseBox_output_password)
      .appendField(new Blockly.FieldTextInput("Password"), "Password");
    this.setHelpUrl(Blockly.Msg.senseBox_wifi_helpurl);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  },
  onchange: function (e) {
    var legal = false;
    // Is the block nested in a loop?
    var block = this;
    do {
      if (this.LOOP_TYPES.indexOf(block.type) !== -1) {
        legal = true;
        break;
      }
      block = block.getSurroundParent();
    } while (block);
    if (legal) {
      this.setWarningText(null);
    } else {
      this.setWarningText(Blockly.Msg.CONTROLS_FLOW_STATEMENTS_WARNING);
    }
  },
  LOOP_TYPES: ["arduino_functions"],
};

Blockly.Blocks["sensebox_startap"] = {
  init: function () {
    this.setTooltip(Blockly.Msg.senseBox_wifi_startap_tooltip);
    this.setHelpUrl("");
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_wifi_startap);
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_LEFT)
      .appendField(Blockly.Msg.senseBox_wifi_ssid)
      .appendField(new Blockly.FieldTextInput("SSID"), "SSID");
    this.setHelpUrl(Blockly.Msg.senseBox_wifi_helpurl);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  },
};

Blockly.Blocks["sensebox_ethernet"] = {
  init: function () {
    this.setTooltip(Blockly.Msg.senseBox_ethernet_tooltip);
    this.setHelpUrl("");
    this.setColour(getColour().sensebox);
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_ethernet)
      .appendField(
        new Blockly.FieldDropdown([
          [Blockly.Msg.senseBox_ethernet_dhcp, "Dhcp"],
          [Blockly.Msg.senseBox_ethernet_manuel_config, "Manual"],
        ]),
        "dhcp"
      );
    this.appendDummyInput()
      .appendField(Blockly.Msg.senseBox_ethernet_mac)
      .appendField(
        new Blockly.FieldTextInput("0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED"),
        "mac"
      );

    this.setHelpUrl(Blockly.Msg.senseBox_ethernet_helpurl);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.getField("dhcp").setValidator(
      function (val) {
        this.updateShape_(val === "Manual");
      }.bind(this)
    );
  },

  updateShape_(isManual) {
    if (isManual) {
      this.appendDummyInput("ip-field")
        .appendField(Blockly.Msg.senseBox_ethernet_ip)
        .appendField(new Blockly.FieldTextInput("192.168.1.100"), "ip");
      this.appendDummyInput("subnetmask-field")
        .appendField(Blockly.Msg.senseBox_ethernet_subnetmask)
        .appendField(new Blockly.FieldTextInput("255.255.255.0"), "subnetmask");
      this.appendDummyInput("gateway-field")
        .appendField(Blockly.Msg.senseBox_ethernet_gateway)
        .appendField(new Blockly.FieldTextInput("192.168.1.1"), "gateway");
      this.appendDummyInput("dns-field")
        .appendField(Blockly.Msg.senseBox_ethernet_dns)
        .appendField(new Blockly.FieldTextInput("8.8.8.8"), "dns");
    } else {
      this.removeInput("ip-field", true);
      this.removeInput("subnetmask-field", true);
      this.removeInput("gateway-field", true);
      this.removeInput("dns-field", true);
    }
  },
};

Blockly.Blocks["sensebox_ethernetIp"] = {
  init: function () {
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_ethernet_ip);

    this.setColour(getColour().sensebox);
    this.setHelpUrl(Blockly.Msg.senseBox_ethernetIp_helpurl);
    this.setTooltip(Blockly.Msg.senseBox_ethernet_ip_tooltip);
    this.setOutput(true, null);
  }
};

Blockly.Blocks["sensebox_wifi_status"] = {
  init: function () {
    this.setTooltip(Blockly.Msg.senseBox_wifi_status_tooltip);
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_wifi_status);
    this.setOutput(true, Types.BOOLEAN.typeName);
    this.setHelpUrl(Blockly.Msg.senseBox_wifi_status_helpurl);
  },
};

Blockly.Blocks["sensebox_get_ip"] = {
  init: function () {
    this.setTooltip(Blockly.Msg.senseBox_wifi_ip_tooltip);
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_wifi_ip);
    this.setOutput(true, Types.TEXT.typeName);
    this.setHelpUrl(Blockly.Msg.senseBox_wifi_ip_helpurl);
  },
};

Blockly.Blocks["sensebox_wifi_rssi"] = {
  init: function () {
    this.setTooltip(Blockly.Msg.senseBox_wifi_rssi_tooltip);
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_wifi_rssi);
    this.setOutput(true, Types.NUMBER.typeName);
    this.setHelpUrl(Blockly.Msg.senseBox_wifi_rssi_helpurl);
  },
};

/**
 * ESP32 WiFi
 * 
 */

Blockly.Blocks["sensebox_esp32s2_wifi_enterprise"] = {
  init: function () {
    this.setTooltip(Blockly.Msg.senseBox_wifi_tooltip);
    this.setHelpUrl("");
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_wifi_connect);
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_LEFT)
      .appendField(Blockly.Msg.senseBox_wifi_ssid)
      .appendField(new Blockly.FieldTextInput("eduroam"), "SSID");
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_LEFT)
      .appendField(Blockly.Msg.senseBox_wifi_user)
      .appendField(new Blockly.FieldTextInput("User"), "User");
      this.appendDummyInput()
      .setAlign(Blockly.ALIGN_LEFT)
      .appendField(Blockly.Msg.senseBox_user_password)
      .appendField(new Blockly.FieldTextInput("Password"), "Password");
    this.setHelpUrl(Blockly.Msg.senseBox_wifi_helpurl);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  },
  onchange: function (e) {
    var legal = false;
    // Is the block nested in a loop?
    var block = this;
    do {
      if (this.LOOP_TYPES.indexOf(block.type) !== -1) {
        legal = true;
        break;
      }
      block = block.getSurroundParent();
    } while (block);
    if (legal) {
      this.setWarningText(null);
    } else {
      this.setWarningText(Blockly.Msg.CONTROLS_FLOW_STATEMENTS_WARNING);
    }
  },
  LOOP_TYPES: ["arduino_functions"],
};

Blockly.Blocks["sensebox_esp32s2_startap"] = {
  init: function () {
    this.setTooltip(Blockly.Msg.senseBox_wifi_startap_tooltip);
    this.setHelpUrl("");
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_wifi_startap);
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_LEFT)
      .appendField(Blockly.Msg.senseBox_wifi_ssid)
      .appendField(new Blockly.FieldTextInput("SSID"), "SSID");
    this.setHelpUrl(Blockly.Msg.senseBox_wifi_helpurl);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  },
};

Blockly.Blocks["sensebox_esp32s2_wifi"] = {
  init: function () {
    this.setTooltip(Blockly.Msg.senseBox_wifi_tooltip);
    this.setHelpUrl("");
    this.setColour(getColour().sensebox);
    this.appendDummyInput().appendField(Blockly.Msg.senseBox_wifi_connect);
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_LEFT)
      .appendField(Blockly.Msg.senseBox_wifi_ssid)
      .appendField(new Blockly.FieldTextInput("SSID"), "SSID");
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_LEFT)
      .appendField(Blockly.Msg.senseBox_output_password)
      .appendField(new Blockly.FieldTextInput("Password"), "Password");
    this.setHelpUrl(Blockly.Msg.senseBox_wifi_helpurl);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  },
  onchange: function (e) {
    var legal = false;
    // Is the block nested in a loop?
    var block = this;
    do {
      if (this.LOOP_TYPES.indexOf(block.type) !== -1) {
        legal = true;
        break;
      }
      block = block.getSurroundParent();
    } while (block);
    if (legal) {
      this.setWarningText(null);
    } else {
      this.setWarningText(Blockly.Msg.CONTROLS_FLOW_STATEMENTS_WARNING);
    }
  },
  LOOP_TYPES: ["arduino_functions"],
};

