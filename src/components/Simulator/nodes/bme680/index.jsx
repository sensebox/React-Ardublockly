import React, { memo } from "react";
import SensorGraphic from "./sensorBME680 v9.png";
import SensorNode from "../../uiComponents/SensorNode";

const BME680 = ({ data }) => {
  // Für Temperatur und Luftfeuchte:

  const sensorConfigBME680 = [
    { id: "temp-bme680", emoji: "🌡️", label: "Temperatur (°C)", min: -20, max: 50, step: 0.5, initial: 20 },
    { id: "humidity-bme680", emoji: "💧", label: "Luftfeuchte (%)", min: 0, max: 100, step: 1, initial: 50 },
    { id: "pressure-bme680", emoji: "🌬️", label: "Luftdruck (hPa)", min: 800, max: 1100, step: 1, initial: 1013 },
    { id: "iaq-bme680", emoji: "🏭", label: "IAQ (0-500)", min: 0, max: 500, step: 1, initial: 250 },
    { id: "co2-bme680", emoji: "🏭", label: "CO2-Äquivalent (ppm)", min: 0, max: 5000, step: 1, initial: 2500 }
    ];

  return (
    <SensorNode
      title="BME680"
      sensors={sensorConfigBME680}
      imageSrc={SensorGraphic}
      
  
    />
  );
};

export default memo(BME680);