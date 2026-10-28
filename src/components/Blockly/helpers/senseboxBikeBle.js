/**
 * BLE service and characteristics of the senseBox:bike firmware
 * (https://github.com/sensebox/senseBox-bike-Arduino).
 *
 * Every phenomenon is one BLE characteristic. A characteristic carries one or
 * more float values that are always written together, so the order of
 * `values` must match the order the senseBox:bike app expects.
 *
 * `label` and the entries of `values` are keys of Blockly.Msg.
 */
export const SENSEBOX_BIKE_SERVICE_UUID = "CF06A218F68EE0BEAD048EBC1EB0BC84";

export const SENSEBOX_BIKE_PHENOMENA = {
  temperature: {
    uuid: "2CDF217435BEFDC44CA26FD173F8B3A8",
    label: "sensebox_bike_ble_temperature",
    values: ["sensebox_bike_ble_value_temperature"],
  },
  humidity: {
    uuid: "772DF7EC8CDC4EA986AF410ABE0BA257",
    label: "sensebox_bike_ble_humidity",
    values: ["sensebox_bike_ble_value_humidity"],
  },
  finedust: {
    uuid: "7E14E07084EA489FB45AE1317364B979",
    label: "sensebox_bike_ble_finedust",
    values: [
      "sensebox_bike_ble_value_pm1",
      "sensebox_bike_ble_value_pm25",
      "sensebox_bike_ble_value_pm4",
      "sensebox_bike_ble_value_pm10",
    ],
  },
  acceleration: {
    uuid: "B944AF10F4954560968F2F0D18CAB522",
    label: "sensebox_bike_ble_acceleration",
    values: [
      "sensebox_bike_ble_value_x",
      "sensebox_bike_ble_value_y",
      "sensebox_bike_ble_value_z",
    ],
  },
  distance: {
    uuid: "B3491B60C0F34306A30D49C91F37A62B",
    label: "sensebox_bike_ble_distance",
    values: ["sensebox_bike_ble_value_distance"],
  },
  distanceRight: {
    uuid: "B3491B60C0F34306A30D49C91F37A62C",
    label: "sensebox_bike_ble_distance_right",
    values: ["sensebox_bike_ble_value_distance"],
  },
  overtaking: {
    uuid: "FC01C6882C444965AE18373AF9FED18D",
    label: "sensebox_bike_ble_overtaking",
    values: [
      "sensebox_bike_ble_value_overtaking_car",
      "sensebox_bike_ble_value_overtaking_bike",
    ],
  },
  surfaceClassification: {
    uuid: "B944AF10F4954560968F2F0D18CAB521",
    label: "sensebox_bike_ble_surface",
    values: [
      "sensebox_bike_ble_value_asphalt",
      "sensebox_bike_ble_value_compacted",
      "sensebox_bike_ble_value_paving",
      "sensebox_bike_ble_value_sett",
      "sensebox_bike_ble_value_standing",
    ],
  },
  surfaceAnomaly: {
    uuid: "B944AF10F4954560968F2F0D18CAB523",
    label: "sensebox_bike_ble_anomaly",
    values: ["sensebox_bike_ble_value_anomaly"],
  },
  battery: {
    uuid: "2A19",
    label: "sensebox_bike_ble_battery",
    values: ["sensebox_bike_ble_value_battery"],
  },
};

export const SENSEBOX_BIKE_DEFAULT_PHENOMENON = "temperature";

export const getSenseboxBikePhenomenon = (key) =>
  SENSEBOX_BIKE_PHENOMENA[key] ||
  SENSEBOX_BIKE_PHENOMENA[SENSEBOX_BIKE_DEFAULT_PHENOMENON];

/** Name of the global variable holding the characteristic handle. */
export const getSenseboxBikeCharacteristicVar = (key) =>
  `bikeCharacteristic_${key}`;
