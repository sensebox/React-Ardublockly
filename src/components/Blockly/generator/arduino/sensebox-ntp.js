import * as Blockly from "blockly";

Blockly.Generator.Arduino.forBlock["sensebox_ntp_init"] = function () {
  Blockly.Generator.Arduino.libraries_["WiFiUdp"] = `#include <WiFiUdp.h>`;
  Blockly.Generator.Arduino.libraries_["NTPClient"] = `#include <NTPClient.h>`;
  Blockly.Generator.Arduino.definitions_["WiFiUDP"] = `WiFiUDP ntpUDP;`;
  Blockly.Generator.Arduino.definitions_["NTPClient"] =
    `NTPClient timeClient(ntpUDP);`;
  Blockly.Generator.Arduino.setupCode_["timeclient.begin"] =
    `timeClient.begin();`;
  Blockly.Generator.Arduino.setupCode_["timeclient.update"] =
    `timeClient.update();`;
  var code = ``;
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_ntp_get"] = function () {
  var format = this.getFieldValue("dropdown");
  var code = `timeClient.${format}()`;
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};
