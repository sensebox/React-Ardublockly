import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import SensorGraphic from "./senseBox-HDC1080_v4.png";
import SensorNode from "../../uiComponents/SensorNode";

const HDC1080 = ({ data }) => {
  // Für Temperatur und Luftfeuchte:
  const sensorConfigTempHumidity = [
    {
      id: "temp",
      emoji: "🌡️",
      label: "Temperatur (°C)",
      min: -20,
      max: 50,
      step: 0.5,
      initial: 20,
    },
    {
      id: "humidity",
      emoji: "💧",
      label: "Luftfeuchte (%)",
      min: 0,
      max: 100,
      step: 1,
      initial: 50,
    },
  ];

  return (
    <div style={{ position: "relative" }}>
      <SensorNode
        title="HDC1080"
        sensors={sensorConfigTempHumidity}
        imageSrc={SensorGraphic}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#ffcc33" }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#ffcc33" }}
      />
    </div>
  );
};

export default memo(HDC1080);
