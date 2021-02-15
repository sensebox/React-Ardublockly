import * as Blockly from 'blockly/core';
/**
* MQTT Blocks 
*/

let service;

Blockly.Arduino.sensebox_mqtt_setup = function () {
    var server = this.getFieldValue('server');
    var port = this.getFieldValue('port');
    var username = this.getFieldValue('username');
    var pass = this.getFieldValue('password');
    service = this.getFieldValue('service');
    Blockly.Arduino.libraries_['library_senseBoxMCU'] = '#include "SenseBoxMCU.h"';
    Blockly.Arduino.libraries_['library_adafruitmqtt'] = '#include "Adafruit_MQTT.h"';
    Blockly.Arduino.libraries_['library_adafruitmqttclient'] = '#include "Adafruit_MQTT_Client.h"';
    Blockly.Arduino.definitions_['mqtt_server'] = '#define SERVER      "' + server + '"';
    Blockly.Arduino.definitions_['mqtt_port'] = '#define SERVERPORT      ' + port + '';
    Blockly.Arduino.definitions_['mqtt_username'] = '#define USERNAME      "' + username + '"';
    Blockly.Arduino.definitions_['mqtt_pass'] = '#define PASS      "' + pass + '"';
    Blockly.Arduino.definitions_['wifi_client'] = 'WiFiClient client;';
    Blockly.Arduino.definitions_['mqtt_client'] = 'Adafruit_MQTT_Client mqtt(&client, SERVER, SERVERPORT, USERNAME, PASS);'
    var code = '';
    return code;
};

Blockly.Arduino.sensebox_mqtt_publish = function (block) {
    var feedname = this.getFieldValue('publishfeed');
    var res = feedname.split("/");
    var feed_client = res[res.length - 1];
    var value = Blockly.Arduino.valueToCode(this, 'value', Blockly.Arduino.ORDER_ATOMIC) || '"No Block connected"';

    switch (service) {
        case 'adafruitio':
            Blockly.Arduino.definitions_['mqtt_' + feed_client + ''] = 'Adafruit_MQTT_Publish ' + feed_client + ' = Adafruit_MQTT_Publish(&mqtt, USERNAME "/feeds/' + feedname + '");'
            break;
        case 'dioty':
            Blockly.Arduino.definitions_['mqtt_' + feed_client + ''] = 'Adafruit_MQTT_Publish ' + feed_client + ' = Adafruit_MQTT_Publish(&mqtt, "/"USERNAME"/' + feedname + '");'
            break;
        case 'custom':
            Blockly.Arduino.definitions_['mqtt_' + feed_client + ''] = 'Adafruit_MQTT_Publish ' + feed_client + ' = Adafruit_MQTT_Publish(&mqtt, "' + feedname + '");'
            break;
        default:
            break;

    }

    //Blockly.Arduino.definitions_['mqtt_' + feed_client + ''] = 'Adafruit_MQTT_Publish ' + feed_client + ' = Adafruit_MQTT_Publish(&mqtt, USERNAME "/feeds/' + feedname + '");'
    Blockly.Arduino.codeFunctions_['mqtt_connect_function'] = `// Function to connect and reconnect as necessary to the MQTT server.
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
    Blockly.Arduino.loopCodeOnce_['mqtt_connect'] = 'MQTT_connect();';
    var code = '' + feed_client + '.publish(' + value + ');';
    return code
};

Blockly.Arduino.sensebox_mqtt_subscribe = function (block) {
    var feedname = this.getFieldValue('subscribefeed');
    var x = 5, feed_client;
    feed_client = feedname.substr(feedname.length - x, x);
    Blockly.Arduino.definitions_['mqtt_' + feed_client + ''] = 'Adafruit_MQTT_Subscribe ' + feed_client + '= Adafruit_MQTT_Subscribe(&mqtt,' + feedname + ');';
    Blockly.Arduino.codeFunctions_['mqtt_' + feed_client + 'callbackFunction'] = `void ` + feed_client + `Callback (double x){
      Serial.println(x);
    }`;
    Blockly.Arduino.setupCode_['mqtt_' + feed_client + '_callback'] = '' + feed_client + '.setCallback(' + feed_client + 'Callback);';
    Blockly.Arduino.setupCode_['mqtt_' + feed_client + '_subscribe'] = 'mqtt.subscribe(&' + feed_client + ');';
    Blockly.Arduino.loopCodeOnce_['mqtt_processPackages'] = 'mqtt.processPackets(10);';
    var code = '';
    return code;
};

