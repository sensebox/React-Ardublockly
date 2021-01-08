import Blockly from 'blockly'

/***
 * MQTT
 */

Blockly.Msg.senseBox_mqtt_init = "Connect to MQTT Broker";
Blockly.Msg.senseBox_mqtt_server = "Server";
Blockly.Msg.senseBox_mqtt_port = "Port";
Blockly.Msg.senseBox_mqtt_username = "Username";
Blockly.Msg.senseBox_mqtt_password = "Password";
Blockly.Msg.sensebox_mqtt_subscribe = "Subscribe to Feed"
Blockly.Msg.senseBox_mqtt_publish = "Publish to Feed/Topic";
Blockly.Msg.senseBox_mqtt_init_tooltip = "Initialise a connection to a MQTT Broker. Use this Block inside the setup()-function and make sure to connect to your wifi first."
Blockly.Msg.senseBox_mqtt_publish_tooltip = "Publish something to a specific topic to your MQTT Broker. "