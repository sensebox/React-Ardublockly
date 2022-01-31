import Blockly from "blockly";

/* Wifi connection and openSenseMap Blocks*/
Blockly.Arduino.sensebox_wifi = function (block) {
  var pw = this.getFieldValue("Password");
  var ssid = this.getFieldValue("SSID");
  Blockly.Arduino.libraries_["library_senseBoxIO"] = "#include <senseBoxIO.h>";
  Blockly.Arduino.libraries_["library_WiFi"] = "#include <WiFi101.h>";
  Blockly.Arduino.variables_["ssid"] = `char ssid[] = "${ssid}";`;
  Blockly.Arduino.variables_["pass"] = `char pass[] = "${pw}";`;
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
  Blockly.Arduino.libraries_["library_WiFi"] = "#include <WiFi101.h>";
  Blockly.Arduino.setupCode_["wifi_startAP"] = `WiFi.beginAP(${ssid});`;
  var code = "";
  return code;
};


Blockly.Arduino.sensebox_ethernet = function () {
  var ip = this.getFieldValue("ip");
  var gateway = this.getFieldValue("gateway");
  var subnetmask = this.getFieldValue("subnetmask");
  var dns = this.getFieldValue("dns");
  var mac = this.getFieldValue("mac");
  var dhcp = this.getFieldValue("dhcp");

  Blockly.Arduino.libraries_["library_senseBoxMCU"] =
    '#include "SenseBoxMCU.h"';
  Blockly.Arduino.libraries_["library_ethernet"] = "#include <Ethernet.h>";

  Blockly.Arduino.definitions_["ethernet_config"] = `
byte mac[] = { ${mac}};`;
  if (dhcp === "Manual") {
    Blockly.Arduino.definitions_["ethernet_manual_config"] = `
//Configure static IP setup (only needed if DHCP is disabled)
IPAddress myIp(${ip.replaceAll(".", ", ")});
IPAddress myDns(${dns.replaceAll(".", ",")});
IPAddress myGateway(${gateway.replaceAll(".", ",")});
IPAddress mySubnet(${subnetmask.replaceAll(".", ",")});
    `;
    Blockly.Arduino.setupCode_["ethernet_setup"] = `
Ethernet.init(23);
// start the Ethernet connection:
if (Ethernet.begin(mac) == 0) {
    // no point in carrying on, so do nothing forevermore:
    // try to congifure using IP address instead of DHCP:
    Ethernet.begin(mac, myIp);
}
// give the Ethernet shield a second to initialize:
delay(1000);
    `;
  } else {
    Blockly.Arduino.setupCode_["ethernet_setup"] = `
Ethernet.init(23);
// start the Ethernet connection:
Ethernet.begin(mac);
// give the Ethernet shield a second to initialize:
delay(1000);
    `;
  }

  var code = "";
  return code;
};

Blockly.Arduino.sensebox_ethernetIp = function () {
  var code = "Ethernet.localIP()";
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
  
