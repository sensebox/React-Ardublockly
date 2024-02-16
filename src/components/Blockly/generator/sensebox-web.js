import Blockly from "blockly";
//import store from "../../../store";

// preperations for the esp board
// var selectedBoard = store.getState().board.board;
// store.subscribe(() => {
//   selectedBoard = store.getState().board.board;
// });


/* Wifi connection and openSenseMap Blocks*/
Blockly.Arduino.sensebox_wifi = function (block) {
  var pw = this.getFieldValue("Password");
  var ssid = this.getFieldValue("SSID");
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
  var code = "WiFi.RSSI()";
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.sensebox_get_ip = function () {
  Blockly.Arduino.definitions_["define_ipadress"] = "IPAddress ip;";
  Blockly.Arduino.setupCode_["sensebox_get_ip"] = " ip = WiFi.localIP();";
  var code = "ip";
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.sensebox_startap = function (block) {
  var ssid = this.getFieldValue("SSID");
  Blockly.Arduino.libraries_["library_WiFi"] = "#include <WiFi101.h>";
  Blockly.Arduino.setupCode_["wifi_startAP"] = `WiFi.beginAP("${ssid}");`;
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
  Blockly.Arduino.libraries_["library_ethernet"] =
    "#include <Ethernet.h> // http://librarymanager/All#Ethernet";

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

/**
 * 
 * ESP32S2 WiFi Code 
 * 
 */

Blockly.Arduino.sensebox_esp32s2_wifi_enterprise = function () {
/* WiFi connection for eduroam networks*/
  var pw = this.getFieldValue("Password");
  var user = this.getFieldValue("User");
  var ssid = this.getFieldValue("SSID");
  Blockly.Arduino.libraries_["library_WiFi"] = "#include <WiFi.h>";
  Blockly.Arduino.libraries_["library_wpa2"] = `#include "esp_wpa2.h`;
  Blockly.Arduino.definitions_["define_identity"] = `#define EAP_IDENTITY "${user}"`;
  Blockly.Arduino.definitions_["define_username"] = `#define EAP_USERNAME "${user}"`;
  Blockly.Arduino.definitions_["define_password"] = `#define EAP_PASSWORD "${pw}"`;
  Blockly.Arduino.variables_["ssid"] = `char ssid[] = "${ssid}";`;
  Blockly.Arduino.variables_["pass"] = `char pass[] = "";`;
  Blockly.Arduino.variables_["wifi_Status"] = "int status = WL_IDLE_STATUS;";
  Blockly.Arduino.codeFunctions_["initWifi"] = `
  void initWiFi() {
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, WPA2_AUTH_PEAP, EAP_IDENTITY, EAP_USERNAME, EAP_PASSWORD);
  }
  `;
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
  Blockly.Arduino.setupCode_["wifi_begin"] = `initWiFi();`;
  var code = "";
  return code;
};

Blockly.Arduino.sensebox_esp32s2_wifi = function () {
  var pw = this.getFieldValue("Password");
  var ssid = this.getFieldValue("SSID");
  Blockly.Arduino.libraries_["library_ESPWiFi"] = "#include <WiFi.h>";
  Blockly.Arduino.variables_["ssid"] = `char ssid[] = "${ssid}";`;
  Blockly.Arduino.variables_["pass"] = `char pass[] = "${pw}";`;
  Blockly.Arduino.setupCode_["wifi_begin"] = `
    WiFi.begin(ssid, pass);
    if(WiFi.status() == WL_NO_SHIELD){
      while(true);
    }
    if(WiFi.status() != WL_CONNECTED){
      WiFi.begin(ssid, pass);
      delay(5000);
    }  
  `;
  var code = "";
  return code;
};

Blockly.Arduino.sensebox_esp32s2_startap = function (block) {
  var ssid = this.getFieldValue("SSID");
  Blockly.Arduino.libraries_["library_ESPWiFi"] = "#include <WiFi.h>";
  Blockly.Arduino.libraries_["library_ESPWiFiClient"] = "#include <WiFiClient.h>";
  Blockly.Arduino.libraries_["WiFiAP"] = "#include <WiFiAP.h>";
  Blockly.Arduino.variables_["ssid"] = `const char ssid[] = "${ssid}";`;
  Blockly.Arduino.variables_["server"] = `WiFiServer server(80);`;
  Blockly.Arduino.setupCode_["wifi_startAP"] = `WiFi.softAP(ssid);\n server.begin();`;
  var code ="";
  return code;
}



// Blockly.Arduino.definitions_["certificate"] = `
// const char* root_ca = \
//                     "-----BEGIN CERTIFICATE-----\n" \
//                     "MIIFazCCA1OgAwIBAgIRAIIQz7DSQONZRGPgu2OCiwAwDQYJKoZIhvcNAQELBQAw\n" \
//                     "TzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2Vh\n" \
//                     "cmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDEwHhcNMTUwNjA0MTEwNDM4\n" \
//                     "WhcNMzUwNjA0MTEwNDM4WjBPMQswCQYDVQQGEwJVUzEpMCcGA1UEChMgSW50ZXJu\n" \
//                     "ZXQgU2VjdXJpdHkgUmVzZWFyY2ggR3JvdXAxFTATBgNVBAMTDElTUkcgUm9vdCBY\n" \
//                     "MTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAK3oJHP0FDfzm54rVygc\n" \
//                     "h77ct984kIxuPOZXoHj3dcKi/vVqbvYATyjb3miGbESTtrFj/RQSa78f0uoxmyF+\n" \
//                     "0TM8ukj13Xnfs7j/EvEhmkvBioZxaUpmZmyPfjxwv60pIgbz5MDmgK7iS4+3mX6U\n" \
//                     "A5/TR5d8mUgjU+g4rk8Kb4Mu0UlXjIB0ttov0DiNewNwIRt18jA8+o+u3dpjq+sW\n" \
//                     "T8KOEUt+zwvo/7V3LvSye0rgTBIlDHCNAymg4VMk7BPZ7hm/ELNKjD+Jo2FR3qyH\n" \
//                     "B5T0Y3HsLuJvW5iB4YlcNHlsdu87kGJ55tukmi8mxdAQ4Q7e2RCOFvu396j3x+UC\n" \
//                     "B5iPNgiV5+I3lg02dZ77DnKxHZu8A/lJBdiB3QW0KtZB6awBdpUKD9jf1b0SHzUv\n" \
//                     "KBds0pjBqAlkd25HN7rOrFleaJ1/ctaJxQZBKT5ZPt0m9STJEadao0xAH0ahmbWn\n" \
//                     "OlFuhjuefXKnEgV4We0+UXgVCwOPjdAvBbI+e0ocS3MFEvzG6uBQE3xDk3SzynTn\n" \
//                     "jh8BCNAw1FtxNrQHusEwMFxIt4I7mKZ9YIqioymCzLq9gwQbooMDQaHWBfEbwrbw\n" \
//                     "qHyGO0aoSCqI3Haadr8faqU9GY/rOPNk3sgrDQoo//fb4hVC1CLQJ13hef4Y53CI\n" \
//                     "rU7m2Ys6xt0nUW7/vGT1M0NPAgMBAAGjQjBAMA4GA1UdDwEB/wQEAwIBBjAPBgNV\n" \
//                     "HRMBAf8EBTADAQH/MB0GA1UdDgQWBBR5tFnme7bl5AFzgAiIyBpY9umbbjANBgkq\n" \
//                     "hkiG9w0BAQsFAAOCAgEAVR9YqbyyqFDQDLHYGmkgJykIrGF1XIpu+ILlaS/V9lZL\n" \
//                     "ubhzEFnTIZd+50xx+7LSYK05qAvqFyFWhfFQDlnrzuBZ6brJFe+GnY+EgPbk6ZGQ\n" \
//                     "3BebYhtF8GaV0nxvwuo77x/Py9auJ/GpsMiu/X1+mvoiBOv/2X/qkSsisRcOj/KK\n" \
//                     "NFtY2PwByVS5uCbMiogziUwthDyC3+6WVwW6LLv3xLfHTjuCvjHIInNzktHCgKQ5\n" \
//                     "ORAzI4JMPJ+GslWYHb4phowim57iaztXOoJwTdwJx4nLCgdNbOhdjsnvzqvHu7Ur\n" \
//                     "TkXWStAmzOVyyghqpZXjFaH3pO3JLF+l+/+sKAIuvtd7u+Nxe5AW0wdeRlN8NwdC\n" \
//                     "jNPElpzVmbUq4JUagEiuTDkHzsxHpFKVK7q4+63SM1N95R1NbdWhscdCb+ZAJzVc\n" \
//                     "oyi3B43njTOQ5yOf+1CceWxG1bQVs5ZufpsMljq4Ui0/1lvh+wjChP4kqKOJ2qxq\n" \
//                     "4RgqsahDYVvTH9w7jXbyLeiNdd8XM2w9U/t7y0Ff/9yi0GE44Za4rF2LN9d11TPA\n" \
//                     "mRGunUHBcnWEvgJBQl9nJEiU0Zsnvgc/ubhPgXRR4Xq37Z0j4r7g1SgEEzwxA57d\n" \
//                     "emyPxgcYxn/eR44/KJ4EBs+lVDR3veyJm+kXQ99b21/+jh5Xos1AnX5iItreGCc=\n" \
//                     "-----END CERTIFICATE-----\n" ;
//                     `;


