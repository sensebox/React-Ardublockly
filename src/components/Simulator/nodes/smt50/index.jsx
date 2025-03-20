import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import SensorGraphic from "./smt50.png"; 
import SensorNode from "../../uiComponents/SensorNode";

const SMT50 = ({ data }) => {
  const sensorConfigSMT50 = [
    { id: "soiltemp", emoji: "🌡️", label: "Soil Temperature (°C)", min: -20, max: 60, step: 0.5, initial: 20 },
    { id: "soilmoisture", emoji: "💧", label: "Soil Moisture (%)", min: 0, max: 100, step: 1, initial: 50 }
  ];

  return (
    <SensorNode
      title="SMT50"
      sensors={sensorConfigSMT50}
      imageSrc={SensorGraphic}
      maxWidth="150px"
    />
  );
};

export default memo(SMT50);