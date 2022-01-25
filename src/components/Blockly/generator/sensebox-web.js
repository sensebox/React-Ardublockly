import Blockly from "blockly";

/* Wifi connection and openSenseMap Blocks*/
Blockly.Arduino.sensebox_wifi = function (block) {
  var pw = this.getFieldValue("Password");
  var ssid = this.getFieldValue("SSID");
  Blockly.Arduino.libraries_["library_senseBoxMCU"] =
    '#include "SenseBoxMCU.h"';
  Blockly.Arduino.definitions_["define_network"] = "Bee* b = new Bee();";
  if (pw === "") {
    Blockly.Arduino.setupCode_["sensebox_network"] =
      'b->connectToWifi("' + ssid + '");\ndelay(1000);';
  } else
    Blockly.Arduino.setupCode_["sensebox_network"] =
      'b->connectToWifi("' + ssid + '","' + pw + '");\ndelay(1000);';
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
