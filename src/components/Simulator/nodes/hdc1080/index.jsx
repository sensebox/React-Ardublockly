import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import SensorGraphic from "./senseBox-HDC1080_v22 v4.png";
import SensorNode from "../../uiComponents/SensorNode";

const HDC1080 = ({ data }) => {
  // Für Temperatur und Luftfeuchte:
  const sensorConfigTempHumidity = [
    { id: "temp", emoji: "🌡️", label: "Temperatur (°C)", min: -20, max: 50, step: 0.5, initial: 20 },
    { id: "humidity", emoji: "💧", label: "Luftfeuchte (%)", min: 0, max: 100, step: 1, initial: 50 },
  ];

  return (
    <SensorNode
      title="HDC1080"
      sensors={sensorConfigTempHumidity}
      imageSrc={SensorGraphic}
      
      
    />
  );
};

export default memo(HDC1080);