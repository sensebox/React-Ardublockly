import * as Blockly from "blockly/core";
/**
 * MQTT Blocks
 */

let service;

Blockly.Generator.Arduino.forBlock["sensebox_mqtt_setup"] = function () {
  var server = this.getFieldValue("server");
  var port = this.getFieldValue("port");
  var username = this.getFieldValue("username");
  var pass = this.getFieldValue("password");
  service = this.getFieldValue("service");
  Blockly.Generator.Arduino.libraries_["library_adafruitmqtt"] =
    '#include <Adafruit_MQTT.h> //http://librarymanager/All#Adafruit_MQTT_Library"';
  Blockly.Generator.Arduino.libraries_["library_adafruitmqttclient"] =
    "#include <Adafruit_MQTT_Client.h>";
  Blockly.Generator.Arduino.definitions_["mqtt_server"] =
    '#define SERVER      "' + server + '"';
  Blockly.Generator.Arduino.definitions_["mqtt_port"] =
    "#define SERVERPORT      " + port + "";
  Blockly.Generator.Arduino.definitions_["mqtt_username"] =
    '#define USERNAME      "' + username + '"';
  Blockly.Generator.Arduino.definitions_["mqtt_pass"] =
    '#define PASS      "' + pass + '"';
  Blockly.Generator.Arduino.definitions_["WiFiClient"] = "WiFiClient client;";
  Blockly.Generator.Arduino.definitions_["mqtt_client"] =
    "Adafruit_MQTT_Client mqtt(&client, SERVER, SERVERPORT, USERNAME, PASS);";
  var code = "";
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_mqtt_publish"] = function (
  block,
  generator,
) {
  function topicToVarName(topic) {
    topic = String(topic).replace(/^"+|"+$/g, "");
    const parts = topic.split("/");
    if (parts.length < 2) return "topicValue";

    const prefix = parts[parts.length - 1];
    let feed = parts[parts.length - 2];

    // Capitalize first letter
    feed = feed.charAt(0).toUpperCase() + feed.slice(1);

    // Ensure valid C identifier
    let varName = prefix + feed;
    if (!/^[A-Za-z_]/.test(varName)) {
      varName = "_" + varName;
    }
    return varName;
  }
  var feedname = this.getFieldValue("publishfeed");
  var feed_client = topicToVarName(feedname);

  var value =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "value",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || '"No Block connected"';

  switch (service) {
    case "adafruitio":
      Blockly.Generator.Arduino.definitions_["mqtt_" + feed_client + ""] =
        "Adafruit_MQTT_Publish " +
        feed_client +
        ' = Adafruit_MQTT_Publish(&mqtt, USERNAME "/feeds/' +
        feedname +
        '");';
      break;
    case "dioty":
      Blockly.Generator.Arduino.definitions_["mqtt_" + feed_client + ""] =
        "Adafruit_MQTT_Publish " +
        feed_client +
        ' = Adafruit_MQTT_Publish(&mqtt, "/"USERNAME"/' +
        feedname +
        '");';
      break;
    case "custom":
      Blockly.Generator.Arduino.definitions_["mqtt_" + feed_client + ""] =
        "Adafruit_MQTT_Publish " +
        feed_client +
        ' = Adafruit_MQTT_Publish(&mqtt, "' +
        feedname +
        '");';
      break;
    default:
      break;
  }

  //Blockly.Generator.Arduino.definitions_['mqtt_' + feed_client + ''] = 'Adafruit_MQTT_Publish ' + feed_client + ' = Adafruit_MQTT_Publish(&mqtt, USERNAME "/feeds/' + feedname + '");'
  Blockly.Generator.Arduino.codeFunctions_["mqtt_connect_function"] =
    `// Function to connect and reconnect as necessary to the MQTT server.
    // Should be called in the loop function and it will take care if connecting.
void MQTT_connect() {
      int8_t ret;
      // Stop if already connected.
      if (mqtt.connected()) {
        return;
      }  
      while ((ret = mqtt.connect()) != 0) { // connect will return 0 for connected
           mqtt.disconnect();
           delay(5000);  // wait 5 seconds
      }
}`;
  Blockly.Generator.Arduino.loopCodeOnce_["mqtt_connect"] = "MQTT_connect();";
  var code = "" + feed_client + ".publish(" + value + ");";
  return code;
};

Blockly.Generator.Arduino.forBlock["sensebox_mqtt_subscribe"] = function (
  block,
  generator,
) {
  var feedname = this.getFieldValue("subscribefeed");
  var x = 5,
    feed_client;
  feed_client = feedname.substr(feedname.length - x, x);
  Blockly.Generator.Arduino.definitions_["mqtt_" + feed_client + ""] =
    "Adafruit_MQTT_Subscribe " +
    feed_client +
    "= Adafruit_MQTT_Subscribe(&mqtt," +
    feedname +
    ");";
  Blockly.Generator.Arduino.codeFunctions_[
    "mqtt_" + feed_client + "callbackFunction"
  ] =
    `void ` +
    feed_client +
    `Callback (double x){
      Serial.println(x);
    }`;
  Blockly.Generator.Arduino.setupCode_["mqtt_" + feed_client + "_callback"] =
    "" + feed_client + ".setCallback(" + feed_client + "Callback);";
  Blockly.Generator.Arduino.setupCode_["mqtt_" + feed_client + "_subscribe"] =
    "mqtt.subscribe(&" + feed_client + ");";
  Blockly.Generator.Arduino.loopCodeOnce_["mqtt_processPackages"] =
    "mqtt.processPackets(10);";
  var code = "";
  return code;
};
