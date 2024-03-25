import Blockly from "blockly";

/**
 * Block send Data to the openSenseMap
 */
Blockly.Arduino.sensebox_send_to_osem = function (block) {
  var code = "";
  var sensor_id = this.getFieldValue("SensorID");
  var id = sensor_id.slice(-3).toUpperCase();
  var sensor_value =
    Blockly.Arduino.valueToCode(this, "Value", Blockly.Arduino.ORDER_ATOMIC) ||
    '"Keine Eingabe"';
  Blockly.Arduino.definitions_["SENSOR_ID" + id + ""] =
    "const char SENSOR_ID" + id + '[] PROGMEM = "' + sensor_id + '";';
  code += "addMeasurement(SENSOR_ID" + id + "," + sensor_value + ");\n";
  return code;
};

Blockly.Arduino.sensebox_osem_connection = function (Block) {
  var workspace = Blockly.getMainWorkspace();
  var wifi = false;
  var ethernet = false;
  if (workspace.getBlocksByType("sensebox_wifi").length > 0) {
    wifi = true;
    ethernet = false;
  } else if (workspace.getBlocksByType("sensebox_ethernet").length > 0) {
    ethernet = true;
    wifi = false;
  }
  var box_id = this.getFieldValue("BoxID");
  var branch = Blockly.Arduino.statementToCode(Block, "DO");
  var access_token = this.getFieldValue("access_token");
  var blocks = this.getDescendants();
  var type = this.getFieldValue("type");
  var ssl = this.getFieldValue("SSL");
  var restart = this.getFieldValue("RESTART");
  var port = 0;
  var count = 0;
  if (blocks !== undefined) {
    for (var i = 0; i < blocks.length; i++) {
      if (blocks[i].type === "sensebox_send_to_osem") {
        count++;
      }
    }
  }
  var num_sensors = count;
  Blockly.Arduino.definitions_["num_sensors"] =
    "static const uint8_t NUM_SENSORS = " + num_sensors + ";";
  Blockly.Arduino.definitions_["SenseBoxID"] =
    'const char SENSEBOX_ID [] PROGMEM = "' + box_id + '";';
  Blockly.Arduino.definitions_["host"] =
    'const char server [] PROGMEM ="ingress.opensensemap.org";';
  if (wifi === true) {
    if (ssl === "TRUE") {
      Blockly.Arduino.libraries_["library_bearSSL"] =
        "#include <ArduinoBearSSL.h>";
      Blockly.Arduino.libraries_["library_arduinoECC08"] =
        "#include <ArduinoECCX08.h>";
      Blockly.Arduino.definitions_["WiFiClient"] = "WiFiClient wifiClient;";
      Blockly.Arduino.definitions_["BearSSLClient"] =
        "BearSSLClient client(wifiClient);";
      Blockly.Arduino.functionNames_["getTime"] = `unsigned long getTime() {
      return WiFi.getTime();
    }`;
      Blockly.Arduino.setupCode_["initBearSSL"] =
        "ArduinoBearSSL.onGetTime(getTime);";
      port = 443;
    } else if (ssl === "FALSE") {
      Blockly.Arduino.definitions_["WiFiClient"] = "WiFiClient client;";
      port = 80;
    }
  } else if (ethernet === true) {
    if (ssl === "TRUE") {
      Blockly.Arduino.libraries_["library_bearSSL"] =
        "#include <ArduinoBearSSL.h>";
      Blockly.Arduino.libraries_["library_arduinoECC08"] =
        "#include <ArduinoECCX08.h>";
      Blockly.Arduino.libraries_["library_ethernetUdp"] =
        "#include <EthernetUdp.h>";
      Blockly.Arduino.libraries_["library_NTPClient"] =
        "#include <NTPClient.h>";
      Blockly.Arduino.definitions_["EthernetClient"] =
        "EthernetClient eclient;";
      Blockly.Arduino.definitions_["BearSSLClient"] =
        "BearSSLClient client(eclient);";
      Blockly.Arduino.definitions_["EthernetUDP"] = "EthernetUDP Udp;";
      Blockly.Arduino.definitions_["NTPClient"] = "NTPClient timeClient(Udp);";
      Blockly.Arduino.functionNames_["getTime"] = `
unsigned long getTime() {
  timeClient.update();
  return timeClient.getEpochTime();
}`;

      Blockly.Arduino.setupCode_["timeClient_begin"] = "timeClient.begin();";
      Blockly.Arduino.setupCode_["initBearSSL"] =
        "ArduinoBearSSL.onGetTime(getTime);";
      port = 443;
    } else if (ssl === "FALSE") {
      Blockly.Arduino.definitions_["EthernetClient"] = "EthernetClient client;";
      port = 80;
    }
  }
  Blockly.Arduino.definitions_["measurement"] = `typedef struct measurement {
      const char *sensorId;
      float value;
    } measurement;`;
  Blockly.Arduino.definitions_["buffer"] = "char buffer[750];";
  Blockly.Arduino.definitions_[
    "num_measurement"
  ] = `measurement measurements[NUM_SENSORS];
    uint8_t num_measurements = 0;`;
  Blockly.Arduino.definitions_["lengthMultiplikator"] =
    "const int lengthMultiplikator = 35;";
  Blockly.Arduino.functionNames_["addMeasurement"] = `
    void addMeasurement(const char *sensorId, float value) {
    measurements[num_measurements].sensorId = sensorId;
    measurements[num_measurements].value = value;
    num_measurements++;
    }`;
  if (type === "Stationary") {
    Blockly.Arduino.functionNames_["writeMeasurementsToClient"] = `
    void writeMeasurementsToClient() {
    // iterate throug the measurements array
    for (uint8_t i = 0; i < num_measurements; i++) {
      sprintf_P(buffer, PSTR("%s,%9.2f\\n"), measurements[i].sensorId,
                measurements[i].value);
      // transmit buffer to client
      client.print(buffer);
    }
    // reset num_measurements
    num_measurements = 0;
  }`;
    Blockly.Arduino.functionNames_["submitValues"] =
      `
  void submitValues() {
${
  wifi === true
    ? "if (WiFi.status() != WL_CONNECTED) {\nWiFi.disconnect();\ndelay(1000); // wait 1s\nWiFi.begin(ssid, pass);\ndelay(5000); // wait 5s\n}"
    : ""
}
  if (client.connected()) {
      client.stop();
      delay(1000);
    }
  bool connected = false;
  char _server[strlen_P(server)];
  strcpy_P(_server, server);
  for (uint8_t timeout = 2; timeout != 0; timeout--) {
    Serial.println(F("connecting..."));
    connected = client.connect(_server, ` +
      port +
      `);
    if (connected == true) {
      // construct the HTTP POST request:
      sprintf_P(buffer,
                PSTR("POST /boxes/%s/data HTTP/1.1\\nAuthorization: ${access_token}\\nHost: %s\\nContent-Type: "
                     "text/csv\\nConnection: close\\nContent-Length: %i\\n\\n"),
                SENSEBOX_ID, server, num_measurements * lengthMultiplikator);
      // send the HTTP POST request:
      client.print(buffer);
      // send measurements
      writeMeasurementsToClient();
      // send empty line to end the request
      client.println();
      uint16_t timeout = 0;
      // allow the response to be computed
      while (timeout <= 5000) {
        delay(10);
        timeout = timeout + 10;
        if (client.available()) {
          break;
        }
      }

      while (client.available()) {
        char c = client.read();
        // if the server's disconnected, stop the client:
        if (!client.connected()) {
          client.stop();
          break;
        }
      }

      num_measurements = 0;
      break;
    }
    delay(1000);
  }

  ${
    restart === "TRUE"
      ? "if (connected == false) {\n  delay(5000);\n  noInterrupts();\n NVIC_SystemReset();\n while (1)\n ;\n }"
      : ""
  }
  }`;

    var code = "";
    code += branch;
    code += "submitValues();\n";
  } else if (type === "Mobile") {
    var lat = Blockly.Arduino.valueToCode(
      Block,
      "lat",
      Blockly.Arduino.ORDER_ATOMIC
    );
    var lng = Blockly.Arduino.valueToCode(
      Block,
      "lng",
      Blockly.Arduino.ORDER_ATOMIC
    );
    var timestamp = Blockly.Arduino.valueToCode(
      Block,
      "timeStamp",
      Blockly.Arduino.ORDER_ATOMIC
    );
    var altitude = Blockly.Arduino.valueToCode(
      Block,
      "altitude",
      Blockly.Arduino.ORDER_ATOMIC
    );
    Blockly.Arduino.definitions_["lengthMultiplikator"] =
      "const int lengthMultiplikator = 77;";
    Blockly.Arduino.functionNames_["writeMeasurementsToClient"] = `
      void writeMeasurementsToClient(float lat, float lng, float altitude, char* timeStamp) {
      // iterate throug the measurements array
      for (uint8_t i = 0; i < num_measurements; i++) {
      sprintf_P(buffer, PSTR("%s,%9.2f,%s,%3.6f,%3.6f,%5.2f\\n"), measurements[i].sensorId,
                measurements[i].value, timeStamp, lng, lat, altitude);
      // transmit buffer to client
      client.print(buffer);
      }
      // reset num_measurements
      num_measurements = 0;
      }`;
    Blockly.Arduino.variables_["latitude"] = "float latitude;";
    Blockly.Arduino.variables_["longitude"] = "float longitude;";
    Blockly.Arduino.functionNames_["submitValues"] =
      `
      void submitValues(float lat, float lng, float altitude, char* timeStamp) {
    if (client.connected()) {
      client.stop();
      delay(10);
    }
    bool connected = false;
    char _server[strlen_P(server)];
    strcpy_P(_server, server);
    for (uint8_t timeout = 2; timeout != 0; timeout--) {
      Serial.println(F("connecting..."));
      connected = client.connect(_server, ` +
      port +
      `);
      if (connected == true) {
        // construct the HTTP POST request:
        sprintf_P(buffer,
                  PSTR("POST /boxes/%s/data HTTP/1.1\nHost: %s\\nContent-Type: "
                       "text/csv\\nConnection: close\\nContent-Length: %i\\n\\n"),
                  SENSEBOX_ID, server, num_measurements * lengthMultiplikator);

        // send the HTTP POST request:
        client.print(buffer);
        // send measurements
        writeMeasurementsToClient(lat, lng, altitude, timeStamp);
        // send empty line to end the request
        client.println();
        uint16_t timeout = 0;
        // allow the response to be computed
        while (timeout <= 5000) {
          delay(10);
          timeout = timeout + 10;
          if (client.available()) {
            break;
          }
        }
        while (client.available()) {
          char c = client.read();
          // if the server's disconnected, stop the client:
          if (!client.connected()) {
            client.stop();
            break;
          }
          delay(1000);
        }
    
        num_measurements = 0;
        break;
      }
    }

    ${
      restart === "TRUE"
        ? "if (connected == false) {\n  delay(5000);\n  noInterrupts();\n NVIC_SystemReset();\n while (1)\n ;\n }"
        : ""
    }

  }`;
    code = "";
    code += branch;
    code +=
      "submitValues((" +
      lat +
      "/float(10000000)),(" +
      lng +
      "/float(10000000)),(" +
      altitude +
      "/float(100))," +
      timestamp +
      ");\n";
  }
  return code;
};



Blockly.Arduino.sensebox_esp32s2_osem_connection = function (Block) {
  var workspace = Blockly.getMainWorkspace();
  var wifi = false;
  var ethernet = false;
  if (workspace.getBlocksByType("sensebox_wifi").length > 0) {
    wifi = true;
    ethernet = false;
  } else if (workspace.getBlocksByType("sensebox_ethernet").length > 0) {
    ethernet = true;
    wifi = false;
  }
  var box_id = this.getFieldValue("BoxID");
  var branch = Blockly.Arduino.statementToCode(Block, "DO");
  var access_token = this.getFieldValue("access_token");
  var blocks = this.getDescendants();
  var type = this.getFieldValue("type");
  var ssl = this.getFieldValue("SSL");
  var restart = this.getFieldValue("RESTART");
  var port;
  var count = 0;
  if (blocks !== undefined) {
    for (var i = 0; i < blocks.length; i++) {
      if (blocks[i].type === "sensebox_send_to_osem") {
        count++;
      }
    }
  }
  var num_sensors = count;
  Blockly.Arduino.definitions_["num_sensors"] =
    "static const uint8_t NUM_SENSORS = " + num_sensors + ";";
  Blockly.Arduino.definitions_["SenseBoxID"] =
    'const char* SENSEBOX_ID = "' + box_id + '";';
  Blockly.Arduino.definitions_["host"] =
    'const char* server ="ingress.opensensemap.org";';
  Blockly.Arduino.definitions_["measurement"] = `typedef struct measurement {
      const char *sensorId;
      float value;
    } measurement;`;
    if (ssl === "TRUE") {
      Blockly.Arduino.libraries_["library_wifiClientSecure"] = "#include <WiFiClientSecure.h>";
      Blockly.Arduino.definitions_["WiFiClient"] = "WiFiClientSecure client;";
      Blockly.Arduino.definitions_["root_ca"] = `const char* root_ca =
      "-----BEGIN CERTIFICATE-----\\n"
      "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\\n"
      "-----END CERTIFICATE-----\\n";`
      Blockly.Arduino.setupCode_["wifiClientSecure_setRootCa"] = "client.setCACert(root_ca);";
      port = 443;
    }
    else if (ssl === "FALSE") {
      Blockly.Arduino.definitions_["WiFiClient"] = "WiFiClient client;";
      port = 80;
    }
  Blockly.Arduino.definitions_["buffer"] = "char buffer[750];";
  Blockly.Arduino.definitions_[
    "num_measurement"
  ] = `measurement measurements[NUM_SENSORS];
    uint8_t num_measurements = 0;`;
  Blockly.Arduino.definitions_["lengthMultiplikator"] =
    "const int lengthMultiplikator = 35;";
  Blockly.Arduino.functionNames_["addMeasurement"] = `
    void addMeasurement(const char *sensorId, float value) {
    measurements[num_measurements].sensorId = sensorId;
    measurements[num_measurements].value = value;
    num_measurements++;
    }`;

  if (type === "Stationary") {
    Blockly.Arduino.functionNames_["writeMeasurementsToClient"] = `
    void writeMeasurementsToClient() {
    // iterate throug the measurements array
    for (uint8_t i = 0; i < num_measurements; i++) {
      sprintf_P(buffer, PSTR("%s,%9.2f\\n"), measurements[i].sensorId,
                measurements[i].value);
      // transmit buffer to client
      client.print(buffer);
    }
    // reset num_measurements
    num_measurements = 0;
  }`;
    Blockly.Arduino.functionNames_["submitValues"] =
      `
  void submitValues() {
${
  wifi === true
    ? "if (WiFi.status() != WL_CONNECTED) {\nWiFi.disconnect();\ndelay(1000); // wait 1s\nWiFi.begin(ssid, pass);\ndelay(5000); // wait 5s\n}"
    : ""
}
  if (client.connected()) {
      client.stop();
      delay(1000);
    }
  bool connected = false;
  char _server[strlen_P(server)];
  strcpy_P(_server, server);
  for (uint8_t timeout = 2; timeout != 0; timeout--) {
    connected = client.connect(_server, ` +
      port +
      `);
      if (connected == true) {
        // construct the HTTP POST request:
        sprintf_P(buffer,PSTR("POST /boxes/%s/data HTTP/1.1\\nAuthorization: ${access_token}\\nHost: %s\\nContent-Type:text/csv\\nConnection: close\\nContent-Length: %i\\n\\n"),
                  SENSEBOX_ID, server, num_measurements * lengthMultiplikator);
        // send the HTTP POST request:
        client.print(buffer);
        // send measurements
        writeMeasurementsToClient();
        // send empty line to end the request
        client.println();
        while(client.connected()){
          String line = client.readStringUntil('\\n');
          if ( line == "\\r"){
            break;
          }
        }
        while(client.available()){
          char c = client.read();
        }
        client.stop();
  
  
        num_measurements = 0;
        break;
      }
    delay(1000);
  }

  }`;

    var code = "";
    code += branch;
    code += "submitValues();\n";
  } else if (type === "Mobile") {
    var lat = Blockly.Arduino.valueToCode(
      Block,
      "lat",
      Blockly.Arduino.ORDER_ATOMIC
    );
    var lng = Blockly.Arduino.valueToCode(
      Block,
      "lng",
      Blockly.Arduino.ORDER_ATOMIC
    );
    var timestamp = Blockly.Arduino.valueToCode(
      Block,
      "timeStamp",
      Blockly.Arduino.ORDER_ATOMIC
    );
    var altitude = Blockly.Arduino.valueToCode(
      Block,
      "altitude",
      Blockly.Arduino.ORDER_ATOMIC
    );
    Blockly.Arduino.definitions_["lengthMultiplikator"] =
      "const int lengthMultiplikator = 77;";
    Blockly.Arduino.functionNames_["writeMeasurementsToClient"] = `
      void writeMeasurementsToClient(float lat, float lng, float altitude, char* timeStamp) {
      // iterate throug the measurements array
      for (uint8_t i = 0; i < num_measurements; i++) {
      sprintf_P(buffer, PSTR("%s,%9.2f,%s,%3.6f,%3.6f,%5.2f\\n"), measurements[i].sensorId,
                measurements[i].value, timeStamp, lng, lat, altitude);
      // transmit buffer to client
      client.print(buffer);
      }
      // reset num_measurements
      num_measurements = 0;
      }`;
    Blockly.Arduino.variables_["latitude"] = "float latitude;";
    Blockly.Arduino.variables_["longitude"] = "float longitude;";
    Blockly.Arduino.functionNames_["submitValues"] =
      `
      void submitValues(float lat, float lng, float altitude, char* timeStamp) {
    if (client.connected()) {
      client.stop();
      delay(10);
    }
    bool connected = false;
    char _server[strlen_P(server)];
    strcpy_P(_server, server);
    for (uint8_t timeout = 2; timeout != 0; timeout--) {
      connected = client.connect(_server, ` +
      port +
      `);
      if (connected == true) {
        // construct the HTTP POST request:
        sprintf_P(buffer,
                  PSTR("POST /boxes/%s/data HTTP/1.1\\nAuthorization: ${access_token}\\nHost: %s\\nContent-Type: "
                       "text/csv\\nConnection: close\\nContent-Length: %i\\n\\n"),
                  SENSEBOX_ID, server, num_measurements * lengthMultiplikator);
        // send the HTTP POST request:
        client.print(buffer);
        // send measurements
        writeMeasurementsToClient(lat, lng, altitude, timeStamp);
        // send empty line to end the request
        client.println();
        uint16_t timeout = 0;
        // allow the response to be computed
        while (timeout <= 5000) {
          delay(10);
          timeout = timeout + 10;
          if (client.available()) {
            break;
          }
        }
        while (client.available()) {
          char c = client.read();
          // if the server's disconnected, stop the client:
          if (!client.connected()) {
            client.stop();
            break;
          }
          delay(1000);
        }
    
        num_measurements = 0;
        break;
      }
    }

    ${
      restart === "TRUE"
        ? "if (connected == false) {\n  delay(5000);\n  noInterrupts();\n NVIC_SystemReset();\n while (1)\n ;\n }"
        : ""
    }

  }`;
    code = "";
    code += branch;
    code +=
      "submitValues((" +
      lat +
      "/float(10000000)),(" +
      lng +
      "/float(10000000)),(" +
      altitude +
      "/float(100))," +
      timestamp +
      ");\n";
  }
  return code;
};
