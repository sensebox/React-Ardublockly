import Blockly from 'blockly';
/*
 * LoRa Blöcke
 */


Blockly.Msg.senseBox_LoRa_connect = "Send to TTN";
Blockly.Msg.senseBox_LoRa_device_id = "Device EUI (lsb)";
Blockly.Msg.senseBox_LoRa_app_id = "Application EUI (lsb)";
Blockly.Msg.senseBox_LoRa_app_key = "App Key (msb)";
Blockly.Msg.senseBox_LoRa_nwskey_id = "Network Session Key (msb)";
Blockly.Msg.senseBox_LoRa_appskey_id = "App Session Key (msb)";
Blockly.Msg.senseBox_LoRa_devaddr_id = "Device Adress";
Blockly.Msg.senseBox_LoRa_interval = "Transmission interval in minutes";
Blockly.Msg.senseBox_measurement = "Messung";
Blockly.Msg.senseBox_measurements = "Messungen";

Blockly.Msg.senseBox_LoRa_send_message = "Send as Lora Message";
Blockly.Msg.senseBox_LoRa_send_cayenne = "Send as Cayenne Payload";
Blockly.Msg.senseBox_LoRa_cayenne_temperature = "Temperature";
Blockly.Msg.senseBox_LoRa_cayenne_channel = "Channel";
Blockly.Msg.senseBox_LoRa_cayenne_humidity = "Humidity"
Blockly.Msg.senseBox_LoRa_cayenne_pressure = "Pressure";
Blockly.Msg.senseBox_LoRa_cayenne_luminosity = "Luminosity";
Blockly.Msg.senseBox_LoRa_cayenne_analog = "Analog Value";
Blockly.Msg.senseBox_LoRa_cayenne_x = "X Value";
Blockly.Msg.senseBox_LoRa_cayenne_y = "Y Value";
Blockly.Msg.senseBox_LoRa_cayenne_z = "Z Value";
Blockly.Msg.senseBox_LoRa_cayenne_lat = "Latitude";
Blockly.Msg.senseBox_LoRa_cayenne_lng = "Longitude";
Blockly.Msg.senseBox_LoRa_cayenne_alt = "Altitude";

Blockly.Msg.senseBox_LoRa_cayenne_humidity_tip = "Send temperature with one decimal";
Blockly.Msg.senseBox_LoRa_cayenne_tip = "Send Data as Cayenne Payload Format";
Blockly.Msg.senseBox_LoRa_cayenne_gps_tip = "Send GPS Data";
Blockly.Msg.senseBox_LoRa_cayenne_temperature_tip = "Send temperature with one decimal";
Blockly.Msg.senseBox_LoRa_cayenne_pressure_tip = "Send pressure with one decimal";
Blockly.Msg.senseBox_LoRa_cayenne_luminosity_tip = "Send luminosity without any decimals";
Blockly.Msg.senseBox_LoRa_cayenne_analog_tip = "Send a value with one decimal";

Blockly.Msg.senseBox_LoRa_message_tooltip = "Send a message with LoRa";
Blockly.Msg.senseBox_LoRa_sensor_tip = "Send a value with a specific number of bytes";
Blockly.Msg.senseBox_LoRa_init_abp_tooltip = "Initialize the LoRa transmission. The activation is done via ABP. Register an application on [thethingsnetwork](https://thethingsnetwork.com) and copy the **Network Session Key** and the **App Session Key** in **msb format** and the **Device ID** in **hex format**.";
Blockly.Msg.senseBox_LoRa_init_helpurl = "https://en.docs.sensebox.de/blockly/blockly-web-lora/"

Blockly.Msg.senseBox_LoRa_init_otaa_tooltip = "Initialize the LoRa transmission. The activation is done via OTAA. Register an application on [thethingsnetwork](https://thethingsnetwork.com) and copy the **DEVICE EUI** and the **Application EUI** in **lsb format** the **App Key** in **msb format**.";
Blockly.Msg.senseBox_LoRa_init_helpurl = "https://en.docs.sensebox.de/blockly/blockly-web-lora/"





