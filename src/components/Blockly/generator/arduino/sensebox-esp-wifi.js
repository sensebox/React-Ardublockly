import * as Blockly from "blockly";
//import store from "@/store";

// preperations for the esp board
// var selectedBoard = store.getState().board.board;
// store.subscribe(() => {
//   selectedBoard = store.getState().board.board;
// });

/* Wifi connection and openSenseMap Blocks*/

Blockly.Generator.Arduino.forBlock["sensebox_esp_wifi"] = function (
  block,
  generator,
) {
  var pw = this.getFieldValue("Password");
  var ssid = this.getFieldValue("SSID");
  Blockly.Generator.Arduino.libraries_["library_WiFi_ESP"] =
    "#include <WiFiClientSecure.h>";
  Blockly.Generator.Arduino.variables_["ssid"] = `char* ssid = "${ssid}";`;
  Blockly.Generator.Arduino.variables_["pass"] = `char* password = "${pw}";`;
  Blockly.Generator.Arduino.variables_["wifi_Status"] =
    "int status = WL_IDLE_STATUS;";
  if (pw === "") {
    Blockly.Generator.Arduino.setupCode_["wifi_begin"] =
      "WiFi.begin(ssid, password);";
  } else
    Blockly.Generator.Arduino.setupCode_["wifi_begin"] = "WiFi.begin(ssid);";
  Blockly.Generator.Arduino.setupCode_["wifi_wait"] =
    "while (WiFi.status() != WL_CONNECTED) {delay(1000);}";
  var code = "";
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_wifi_status"] = function () {
  var code = "WiFi.status()";
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

Blockly.Generator.Arduino.forBlock["sensebox_wifi_rssi"] = function () {
  var code = "WiFi.RSSI()";
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

Blockly.Generator.Arduino.forBlock["sensebox_get_ip"] = function () {
  Blockly.Generator.Arduino.definitions_["define_ipadress"] = "IPAddress ip;";
  Blockly.Generator.Arduino.setupCode_["sensebox_get_ip"] =
    " ip = WiFi.localIP();";
  var code = "ip";
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

Blockly.Generator.Arduino.forBlock["sensebox_startap"] = function (
  block,
  generator,
) {
  var ssid = this.getFieldValue("SSID");
  Blockly.Generator.Arduino.libraries_["library_WiFi"] = "#include <WiFi101.h>";
  Blockly.Generator.Arduino.setupCode_["wifi_startAP"] =
    `WiFi.beginAP(${ssid});`;
  var code = "";
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_ethernet"] = function () {
  var ip = this.getFieldValue("ip");
  var gateway = this.getFieldValue("gateway");
  var subnetmask = this.getFieldValue("subnetmask");
  var dns = this.getFieldValue("dns");
  var mac = this.getFieldValue("mac");
  var dhcp = this.getFieldValue("dhcp");
  Blockly.Generator.Arduino.libraries_["library_ethernet"] =
    "#include <Ethernet.h> // http://librarymanager/All#Ethernet";

  Blockly.Generator.Arduino.definitions_["ethernet_config"] = `
byte mac[] = { ${mac}};`;
  if (dhcp === "Manual") {
    Blockly.Generator.Arduino.definitions_["ethernet_manual_config"] = `
//Configure static IP setup (only needed if DHCP is disabled)
IPAddress myIp(${ip.replaceAll(".", ", ")});
IPAddress myDns(${dns.replaceAll(".", ",")});
IPAddress myGateway(${gateway.replaceAll(".", ",")});
IPAddress mySubnet(${subnetmask.replaceAll(".", ",")});
    `;
    Blockly.Generator.Arduino.setupCode_["ethernet_setup"] = `
Ethernet.init(23);// start the Ethernet connection:
if (Ethernet.begin(mac) == 0) {
    // no point in carrying on, so do nothing forevermore:
    // try to congifure using IP address instead of DHCP:
    Ethernet.begin(mac, myIp);
}
// give the Ethernet shield a second to initialize:
delay(1000);
    `;
  } else {
    Blockly.Generator.Arduino.setupCode_["ethernet_setup"] = `
Ethernet.init(23); // start the Ethernet connection:
Ethernet.begin(mac); // give the Ethernet shield a second to initialize:
delay(1000);
    `;
  }

  var code = "";
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_ethernetIp"] = function () {
  var code = "Ethernet.localIP()";
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};
