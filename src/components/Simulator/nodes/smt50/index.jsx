import React, { memo } from "react";
import SensorNode from "../../uiComponents/SensorNode";
import SensorGraphic from "./smt50.png";

const SMT50 = () => {
  const sensorConfig = [
    {
      id: "soil-temperature",
      label: "Soil Temperature (°C)",
      emoji: "🌡️",
      min: -40,
      max: 100,
      step: 0.1,
      initial: 20
    },
    {
      id: "soil-moisture",
      label: "Soil Moisture (%)",
      emoji: "💧", 
      min: 0,
      max: 100,
      step: 1,
      initial: 50
    }
  ];

  return (
    <SensorNode
      title="SMT50"
      sensors={sensorConfig}
      imageSrc={SensorGraphic}
    />
  );
};

export default memo(SMT50);