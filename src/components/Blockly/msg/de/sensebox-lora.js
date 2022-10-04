export const LORA = {
  /*
   * LoRa Blöcke
   */

  senseBox_LoRa_connect: "Zu TTN senden",
  senseBox_LoRa_device_id: "Device EUI (lsb)",
  senseBox_LoRa_app_id: "Application EUI (lsb)",
  senseBox_LoRa_app_key: "App Key (msb)",
  senseBox_LoRa_nwskey_id: "Network Session Key (msb)",
  senseBox_LoRa_appskey_id: "App Session Key (msb)",
  senseBox_LoRa_devaddr_id: "Device Adress",
  senseBox_LoRa_interval: "Intervall in Minuten",
  senseBox_measurement: "Messung",
  senseBox_measurements: "Messungen",

  senseBox_LoRa_send_message: "Sende als Lora Nachricht",
  senseBox_LoRa_send_cayenne: "Sende als Cayenne Nachricht",
  senseBox_LoRa_cayenne_temperature: "Temperatur",
  senseBox_LoRa_cayenne_channel: "Kanal",
  senseBox_LoRa_cayenne_humidity: "Luftfeuchtigkeit",
  senseBox_LoRa_cayenne_pressure: "Luftdruck",
  senseBox_LoRa_cayenne_luminosity: "Helligkeit",
  senseBox_LoRa_cayenne_analog: "Analoger Wert",
  senseBox_LoRa_cayenne_x: "X Wert",
  senseBox_LoRa_cayenne_y: "Y Wert",
  senseBox_LoRa_cayenne_z: "Z Wert",
  senseBox_LoRa_cayenne_lat: "Breitengrad",
  senseBox_LoRa_cayenne_lng: "Längengrad",
  senseBox_LoRa_cayenne_alt: "Höhe",
  senseBox_LoRa_cayenne_concentration: "Konzentration",

  senseBox_LoRa_cayenne_tip: "Sende Daten als Cayenne Payload Format",
  senseBox_LoRa_cayenne_gps_tip: "Sende GPS",
  senseBox_LoRa_cayenne_temperature_tip:
    "Sendet Temperaturwert mit einer Nachkommastelle",
  senseBox_LoRa_cayenne_pressure_tip:
    "Sendet Luftdruck mit einer Nachkommastelle",
  senseBox_LoRa_cayenne_luminosity_tip: "Sendet Helligkeitswert",
  senseBox_LoRa_cayenne_analog_tip:
    "Sendet einen Dezimalwert mit einer Nachkommastelle",

  senseBox_LoRa_cayenne_concentration_tip: "Sendet eine Konzentration in PPM",

  senseBox_LoRa_message_tooltip: "Sende eine Nachricht über LoRa",
  senseBox_LoRa_sensor_tip:
    "Sende einen Sensorwert mit einer bestimmten Anzahl an Bytes",
  senseBox_LoRa_init_abp_tooltip:
    "Initialisiere die LoRa übertragung. Die Aktivierung erfolgt über ABP. Registriere eine Application auf [thethingsnetwork](https://thethingsnetwork.com) und kopiere den **Network Session Key** und den **App Session Key** im **msb Format** und die **Device ID** im **hex Format**.",
  senseBox_LoRa_init_helpurl:
    "https://docs.sensebox.de/blockly/blockly-web-lora/",
  senseBox_LoRa_init_otaa_tooltip:
    "Initialisiere die LoRa übertragung. Die Aktivierung erfolgt über OTAA. Registriere eine Application auf [thethingsnetwork](https://thethingsnetwork.com) und kopiere die **DEVICE EUI** und die **Application EUI** im **lsb Format** den **App Key** im **msb Format**.",

  sensebox_lora_ttn_mapper_tip:
    "Mit einem TTN Mapper kannst du die LoRa-Netzabdeckung in deiner Umgebung aufzeichnen. Die Daten werden dann auf [ttnmaper](https://ttnmapper.org) angezeigt. Den notwendigen Decoder findest du [hier](https://gist.github.com/felixerdy/f959ac03df98c6947f1c7f35d537f23e#file-decoder-js).",
  sensebox_lora_ttn_mapper_helpurl:
    "https://sensebox.de/projects/de/2020-03-06-ttn-mapper",
};
