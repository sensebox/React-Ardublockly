import React, { memo } from "react";
import SensorGraphic from "./sensorBME680_v9.png";
import SensorNode from "../../uiComponents/SensorNode";

const sensorConfigBME680 = [
  {
    id: "temp-bme680",
    emoji: "🌡️",
    label: "Temperatur (°C)",
    min: -20,
    max: 50,
    step: 0.5,
    initial: 20,
    type: "sensebox_bme680_temp",
  },
  {
    id: "humidity-bme680",
    emoji: "💧",
    label: "Luftfeuchte (%)",
    min: 0,
    max: 100,
    step: 1,
    initial: 50,
    type: "sensebox_bme680_humidity",
  },
  {
    id: "pressure-bme680",
    emoji: "🌬️",
    label: "Luftdruck (hPa)",
    min: 800,
    max: 1100,
    step: 1,
    initial: 1013,
    type: "sensebox_bme680_pressure",
  },
  {
    id: "iaq-bme680",
    emoji: "🏭",
    label: "IAQ (0-500)",
    min: 0,
    max: 500,
    step: 1,
    initial: 250,
    type: "sensebox_bme680_iaq",
  },
  {
    id: "iaqaccuracy-bme680",
    emoji: "🎯",
    label: "IAQ-Genauigkeit (0-3)",
    min: 0,
    max: 3,
    step: 1,
    initial: 3,
    type: "sensebox_bme680_iaq_accuracy",
  },
  {
    id: "co2-bme680",
    emoji: "🏭",
    label: "CO2-Äquivalent (ppm)",
    min: 0,
    max: 5000,
    step: 1,
    initial: 2500,
    type: "sensebox_bme680_co2",
  },
  {
    id: "voc-bme680",
    emoji: "🫁",
    label: "bVOC-Äquivalent (ppm)",
    min: 0,
    max: 100,
    step: 0.1,
    initial: 0.5,
    type: "sensebox_bme680_voc",
  },
];

const BME680 = () => {
  return (
    <SensorNode
      title="BME680"
      sensors={sensorConfigBME680}
      imageSrc={SensorGraphic}
    />
  );
};

export default memo(BME680);
