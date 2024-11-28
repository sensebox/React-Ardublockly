export const mqttSetup = {
  kind: "block",
  type: "sensebox_mqtt_setup",
};

export const mqttPublish = {
  kind: "block",
  type: "sensebox_mqtt_publish",
};

export const mqttSubscribe = {
  kind: "block",
  type: "sensebox_mqtt_subscribe",
};

export default {
  mcu: [mqttSetup, mqttPublish],
  mini: [mqttSetup, mqttPublish],
  esp32: [mqttSetup, mqttPublish],
};
