export const LORA = {
  /*
   * LoRa Blöcke
   */

  senseBox_LoRa_connect: "Send to TTN",
  senseBox_LoRa_device_id: "Device EUI (lsb)",
  senseBox_LoRa_app_id: "Alkalmazás EUI (lsb)",
  senseBox_LoRa_app_key: "Alkalmazáskulcs (msb)",
  senseBox_LoRa_nwskey_id: "Network Session Key (msb)",
  senseBox_LoRa_appskey_id: "App Session Key (msb)",
  senseBox_LoRa_devaddr_id: "Device Address",
  senseBox_LoRa_intervall: "Átviteli intervallum percben",
  senseBox_measurement: "Messung",
  senseBox_measurements: "Messungen",

  senseBox_LoRa_send_message: "Send as Lora Message",
  senseBox_LoRa_send_cayenne: "Küldés Cayenne Payloadként",
  senseBox_LoRa_cayenne_temperature: "Hőmérséklet",
  senseBox_LoRa_cayenne_channel: "Channel",
  senseBox_LoRa_cayenne_humidity: "Páratartalom",
  senseBox_LoRa_cayenne_pressure: "Nyomás",
  senseBox_LoRa_cayenne_luminosity: "Luminosity",
  senseBox_LoRa_cayenne_analog: "Analóg érték",
  senseBox_LoRa_cayenne_x: "X érték",
  senseBox_LoRa_cayenne_y: "Y érték",
  senseBox_LoRa_cayenne_z: "Z érték",
  senseBox_LoRa_cayenne_lat: "Latitude",
  senseBox_LoRa_cayenne_lng: "Longitude",
  senseBox_LoRa_cayenne_alt: "Magasság",
  senseBox_LoRa_cayenne_koncentráció: "Koncentráció",

  senseBox_LoRa_cayenne_humidity_tip: "Send temperature with one decimal",
  senseBox_LoRa_cayenne_tip: "Send Data as Cayenne Payload Format",
  senseBox_LoRa_cayenne_gps_tip: "GPS-adatok küldése",
  senseBox_LoRa_cayenne_temperature_tip: "Send temperature with one decimal",
  senseBox_LoRa_cayenne_pressure_tip: "Nyomás küldése egy tizedesjegy pontossággal",
  senseBox_LoRa_cayenne_luminosity_tip: "Fényerősség küldése tizedesjegyek nélkül",
  senseBox_LoRa_cayenne_analog_tip: "Egy tizedesjegyű érték küldése",

  senseBox_LoRa_message_tooltip: "Üzenet küldése LoRa segítségével",
  senseBox_LoRa_sensor_tip: "Érték küldése meghatározott számú bájttal",
  senseBox_LoRa_init_abp_tooltip:
    "A LoRa-átvitel inicializálása. Az aktiválás az ABP-n keresztül történik. Regisztráljon egy alkalmazást a [thethingsnetwork](https://thethingsnetwork.com) oldalon, és másolja a **hálózati munkamenetkulcsot** és az **alkalmazás munkamenetkulcsát** **msb formátumban**, valamint a **eszköz azonosítóját** **hex formátumban**.",
  senseBox_LoRa_init_helpurl:
    "https://en.docs.sensebox.de/blockly/blockly-web-lora/",

  senseBox_LoRa_init_otaa_tooltip:
    "A LoRa-átvitel inicializálása. Az aktiválás az OTAA-n keresztül történik. Regisztráljon egy alkalmazást a [thethingsnetwork](https://thethingsnetwork.com) oldalon, és másolja a **DEVICE EUI** és az **Application EUI** **lsb formátumban** az **App Key** **msb formátumban**.",
  sensebox_lora_ttn_mapper_tip:
    "A TTN Mapper segítségével feltérképezheti a LoRa hálózat lefedettségét a területén. Az adatok ezután a [ttnmaper](https://ttnmapper.org) oldalon jelennek meg. A szükséges dekódert [itt](https://gist.github.com/felixerdy/f959ac03df98c6947f1c7f35d537f23e#file-decoder-js) találja.",
};
