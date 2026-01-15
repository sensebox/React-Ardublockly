// componentMap.js
const COMPONENT_MAP = {
  "mcu-s2": {
    name: "MCU-S2",
    image: "/media/hardware/3dmodels/mcus2.png",
    docUrl:
      "https://docs.sensebox.de/docs/boards/mcus2/mcu-s2-overview?board=edus2",
    sensor: "Board",
  },
  "ble-bee": {
    name: "BLE Bee",
    image: "/media/hardware/3dmodels/ble-bee.png",
    docUrl: "https://docs.sensebox.de/docs/hardware/bee/bluetooth-bee/",
    sensor: "Bee",
  },
  "lan-bee": {
    name: "LAN Bee",
    image: "/media/hardware/3dmodels/lan_bee.png",
    docUrl: "https://docs.sensebox.de/docs/hardware/bee/ethernet-bee/",
    sensor: "Bee",
  },
  sound: {
    name: "Sound Sensor",
    image: "/media/hardware/3dmodels/sound.png",
    docUrl: "https://docs.sensebox.de/docs/hardware/sensors/lautstaerke",
    sensor: "Sensor",
  },
  bme: {
    name: "BME Sensor",
    image: "/media/hardware/3dmodels/bme.png",
    docUrl: "https://docs.sensebox.de/docs/hardware/sensors/umweltsensor",
    sensor: "Sensor",
  },
  "led-matrix": {
    name: "LED Matrix",
    image: "/media/hardware/3dmodels/led_matrix.png",
    docUrl: "https://docs.sensebox.de/docs/hardware/accessoires/led-matrix/",
    sensor: "Zubehör",
  },
  sps30: {
    name: "SPS30",
    image: "/media/hardware/3dmodels/sps30.png",
    docUrl: "https://docs.sensebox.de/docs/hardware/sensors/feinstaub-sps30",
    sensor: "Sensor",
  },
  bmp280: {
    name: "BMP280",
    image: "/media/hardware/3dmodels/bmp280.png",
    docUrl: "#",
    sensor: "Sensor",
  },
  "lora-bee": {
    name: "LoRa Bee",
    image: "/media/hardware/3dmodels/lora_bee.png",
    docUrl: "https://docs.sensebox.de/docs/hardware/bee/lora-bee",
    sensor: "Bee",
  },
  tofsensor: {
    name: "TOF Sensor",
    image: "/media/hardware/3dmodels/tofsensor.png",
    docUrl: "https://docs.sensebox.de/docs/hardware/sensors/tof",
    sensor: "Sensor",
  },
  oled: {
    name: "Display",
    image: "/media/hardware/3dmodels/display.png",
    docUrl: "https://docs.sensebox.de/docs/hardware/accessoires/display",
    sensor: "Zubehör",
  },
  mic: {
    name: "Microphone",
    image: "/media/hardware/3dmodels/mic.png",
    docUrl: "https://docs.sensebox.de/docs/hardware/sensors/mikro",
    sensor: "Sensor",
  },
  uvlux: {
    name: "UV/Light Sensor",
    image: "/media/hardware/3dmodels/uvlux.png",
    docUrl: "https://docs.sensebox.de/docs/hardware/sensors/helligkeit-uv",
    sensor: "Sensor",
  },
  expander: {
    name: "Expander",
    image: "/media/hardware/3dmodels/expander.png",
    docUrl: "https://docs.sensebox.de/docs/hardware/accessoires/expander",
    sensor: "Zubehör",
  },
  scd30: {
    name: "SCD30",
    image: "/media/hardware/3dmodels/scd30.png",
    docUrl: "https://docs.sensebox.de/docs/hardware/sensors/co2",
    sensor: "Sensor",
  },
  wassertemperatur: {
    name: "Wassertemperatur",
    image: "/media/hardware/3dmodels/wassertemperatur.JPG",
    docUrl: "https://docs.sensebox.de/docs/hardware/sensors/wassertemperatur",
    sensor: "Sensor",
  },
  gps: {
    name: "GPS",
    image: "/media/hardware/3dmodels/gps.png",
    docUrl: "https://docs.sensebox.de/docs/hardware/accessoires/gps",
    sensor: "Zubehör",
  },
  "sd-bee": {
    name: "SD Bee",
    image: "/media/hardware/3dmodels/sd_bee.png",
    docUrl: "https://docs.sensebox.de/docs/hardware/sd",
    sensor: "Bee",
  },
  "wifi-bee": {
    name: "WiFi Bee",
    image: "/media/hardware/3dmodels/wifi_bee.png",
    docUrl: "https://docs.sensebox.de/docs/hardware/bee/wifi-bee",
    sensor: "Bee",
  },
  hcsr04: {
    name: "HC-SR04",
    image: "/media/hardware/3dmodels/hcsr04.png",
    docUrl: "https://docs.sensebox.de/docs/hardware/sensors/distanz",
    sensor: "Sensor",
  },
  sds011: {
    name: "SDS011",
    image: "/media/hardware/3dmodels/sds011.png",
    docUrl: "https://docs.sensebox.de/docs/hardware/sensors/feinstaub-sds011",
    sensor: "Sensor",
  },
  hdc1080: {
    name: "HDC1080",
    image: "/media/hardware/3dmodels/hdc1080.png",
    docUrl:
      "https://docs.sensebox.de/docs/hardware/sensors/temperatur-luftfeuchte",
    sensor: "Sensor",
  },
  smt50: {
    name: "SMT50",
    image: "/media/hardware/3dmodels/smt50.png",
    docUrl: "https://docs.sensebox.de/docs/hardware/sensors/truebner",
    sensor: "Sensor",
  },
  senseboxmcu: {
    name: "senseBox MCU",
    image: "/media/hardware/3dmodels/mcu.png",
    docUrl: "https://docs.sensebox.de/docs/boards/mcu/mcu-overview?board=edu",
    sensor: "Board",
  },
  "jst-jst": {
    name: "JST-Kabel",
    image: "/media/hardware/3dmodels/jstjst.png",
    docUrl: "https://docs.sensebox.de/docs/hardware/accessoires/cable_overview",
    sensor: "Kabel",
  },
  jumpertmt: {
    name: "Jumper Male-To-Male",
    image: "/media/hardware/3dmodels/jumpermtm.png",
    docUrl: "https://docs.sensebox.de/docs/hardware/accessoires/cable_overview",
    sensor: "Kabel",
  },
  jstjumperfem: {
    name: "JST-Jumper(Female)",
    image: "/media/hardware/3dmodels/jstjumperfem.png",
    docUrl: "https://docs.sensebox.de/docs/hardware/accessoires/cable_overview",
    sensor: "Kabel",
  },
  jstjumper: {
    name: "JST-Jumper(Male)",
    image: "media/hardware/3dmodels/jstjumper.png",
    docUrl: "https://docs.sensebox.de/docs/hardware/accessoires/cable_overview",
    sensor: "Kabel",
  },
};

export default COMPONENT_MAP;
