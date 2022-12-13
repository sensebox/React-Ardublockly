import Blockly from "blockly";

Blockly.Arduino.sensebox_ntp_init = function () {
  Blockly.Arduino.libraries_["WiFiUdp"] = `#include <WiFiUdp.h>`;
  Blockly.Arduino.libraries_["NTPClient"] = `#include <NTPClient.h>`;
  Blockly.Arduino.definitions_["WiFiUDP"] = `WiFiUDP ntpUDP;`;
  Blockly.Arduino.definitions_["NTPClient"] = `NTPClient timeClient(ntpUDP);`;
  Blockly.Arduino.libraries_["library_senseBoxIO"] = "#include <senseBoxIO.h>";
  Blockly.Arduino.setupCode_["timeclient.begin"] = `timeClient.begin();`;
  Blockly.Arduino.setupCode_["timeclient.update"] = `timeClient.update();`;
  var code = ``;
  return code;
};

Blockly.Arduino.sensebox_ntp_get = function () {
  var format = this.getFieldValue("dropdown");
  var code = `timeClient.${format}();`;
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
