import Blockly from "blockly";

/* Wifi connection and openSenseMap Blocks*/
Blockly.Arduino.sensebox_wifi = function (block) {
  var pw = this.getFieldValue("Password");
  var ssid = this.getFieldValue("SSID");
  Blockly.Arduino.libraries_["library_senseBoxIO"] = "#include <senseBoxIO.h>";
  Blockly.Arduino.libraries_["library_WiFi"] = "#include <WiFi101.h>";
  Blockly.Arduino.variables_["ssid"] = `char ssid[] = ${ssid};`;
  Blockly.Arduino.variables_["pass"] = `char pass[] = ${pw};`;
  Blockly.Arduino.variables_["wifi_Status"] = "int status = WL_IDLE_STATUS;";
  if (pw === "") {
    Blockly.Arduino.setupCode_["sensebox_network"] =
      'b->connectToWifi("' + ssid + '");\ndelay(1000);';
  } else
    Blockly.Arduino.setupCode_["sensebox_network"] = `
if (WiFi.status() == WL_NO_SHIELD) {
    while (true);
}
while (status != WL_CONNECTED) {
    status = WiFi.begin(ssid, pass);
    delay(5000);
}
`;
  var code = "";
  return code;
};

Blockly.Arduino.sensebox_startap = function (block) {
  var ssid = this.getFieldValue("SSID");
  Blockly.Arduino.libraries_["library_senseBoxMCU"] =
    '#include "SenseBoxMCU.h"';
  Blockly.Arduino.definitions_["define_network"] = "Bee* b = new Bee();";
  Blockly.Arduino.setupCode_["sensebox_network"] =
    'b->startAP("' + ssid + '");';
  var code = "";
  return code;
};
