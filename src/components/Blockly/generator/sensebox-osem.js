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
  Blockly.Arduino.libraries_["library_senseBoxIO"] = "#include <senseBoxIO.h>";
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
        }
    
        num_measurements = 0;
        break;
      }
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
