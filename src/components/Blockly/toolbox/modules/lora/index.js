export const loraInitializeOtaa = {
  kind: "block",
  type: "sensebox_lora_initialize_otaa",
};

export const loraInitializeAbp = {
  kind: "block",
  type: "sensebox_lora_initialize_abp",
};

export const loraMessageSend = {
  kind: "block",
  type: "sensebox_lora_message_send",
};

export const sendLoraSensorValue = {
  kind: "block",
  type: "sensebox_send_lora_sensor_value",
};

export const loraTtnMapper = {
  kind: "block",
  type: "sensebox_lora_ttn_mapper",
  inputs: {
    Latitude: {
      block: {
        kind: "block",
        type: "sensebox_gps",
        fields: { dropdown: "latitude" },
      },
    },
    Longitude: {
      block: {
        kind: "block",
        type: "sensebox_gps",
        fields: { dropdown: "longitude" },
      },
    },
    Altitude: {
      block: {
        kind: "block",
        type: "sensebox_gps",
        fields: { dropdown: "altitude" },
      },
    },
    pDOP: {
      block: {
        kind: "block",
        type: "sensebox_gps",
        fields: { dropdown: "pDOP" },
      },
    },
    "Fix Type": {
      block: {
        kind: "block",
        type: "sensebox_gps",
        fields: { dropdown: "fixType" },
      },
    },
  },
};

export const loraCayenneSend = {
  kind: "block",
  type: "sensebox_lora_cayenne_send",
};

export const loraCayenneTemperature = {
  kind: "block",
  type: "sensebox_lora_cayenne_temperature",
};

export const loraCayenneHumidity = {
  kind: "block",
  type: "sensebox_lora_cayenne_humidity",
};

export const loraCayennePressure = {
  kind: "block",
  type: "sensebox_lora_cayenne_pressure",
};

export const loraCayenneLuminosity = {
  kind: "block",
  type: "sensebox_lora_cayenne_luminosity",
};

export const loraCayenneConcentration = {
  kind: "block",
  type: "sensebox_lora_cayenne_concentration",
};

export const loraCayenneSensor = {
  kind: "block",
  type: "sensebox_lora_cayenne_sensor",
};

export const loraCayenneAccelerometer = {
  kind: "block",
  type: "sensebox_lora_cayenne_accelerometer",
};

export const loraCayenneGps = {
  kind: "block",
  type: "sensebox_lora_cayenne_gps",
};

export default {
  mcu: [
    loraInitializeOtaa,
    loraInitializeAbp,
    loraMessageSend,
    sendLoraSensorValue,
    loraTtnMapper,
    loraCayenneSend,
    loraCayenneTemperature,
    loraCayenneHumidity,
    loraCayennePressure,
    loraCayenneLuminosity,
    loraCayenneConcentration,
    loraCayenneSensor,
    loraCayenneAccelerometer,
    loraCayenneGps,
  ],
  mini: [
    loraInitializeOtaa,
    loraInitializeAbp,
    loraMessageSend,
    sendLoraSensorValue,
    loraTtnMapper,
    loraCayenneSend,
    loraCayenneTemperature,
    loraCayenneHumidity,
    loraCayennePressure,
    loraCayenneLuminosity,
    loraCayenneConcentration,
    loraCayenneSensor,
    loraCayenneAccelerometer,
    loraCayenneGps,
  ],
  esp32: [
    loraInitializeOtaa,
    loraInitializeAbp,
    loraMessageSend,
    sendLoraSensorValue,
    loraTtnMapper,
    loraCayenneSend,
    loraCayenneTemperature,
    loraCayenneHumidity,
    loraCayennePressure,
    loraCayenneLuminosity,
    loraCayenneConcentration,
    loraCayenneSensor,
    loraCayenneAccelerometer,
    loraCayenneGps,
  ],
};
