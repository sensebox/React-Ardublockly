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
    Blockly.Arduino.setupCode_["wifi_begin"] = `
    if (WiFi.status() == WL_NO_SHIELD) {
        while (true);
    }
    while (status != WL_CONNECTED) {
        status = WiFi.begin(ssid);
        delay(5000);
    }
    `;
  } else
    Blockly.Arduino.setupCode_["wifi_begin"] = `
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

Blockly.Arduino.sensebox_wifi_status = function () {
  var code = "WiFi.status()";
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.sensebox_wifi_rssi = function () {
  var code = "WiFi.RSSI();";
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.sensebox_get_ip = function () {
  Blockly.Arduino.definitions_["define_ipadress"] = "IPAddress ip;";
  Blockly.Arduino.setupCode_["sensebox_get_ip"] = " ip = WiFi.localIP(ip);";
  var code = "";
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.sensebox_startap = function (block) {
  var ssid = this.getFieldValue("SSID");
  Blockly.Arduino.libraries_["library_senseBoxIO"] = "#include <senseBoxIO.h>";
  Blockly.Arduino.definitions_["define_network"] = "Bee* b = new Bee();";
  Blockly.Arduino.setupCode_["wifi_startAP"] = `WiFi.beginAP(${ssid});`;
  var code = "";
  return code;
};
