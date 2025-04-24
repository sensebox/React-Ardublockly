import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import SensorGraphic from "./SMT50_v2.png";
import SensorNode from "../../uiComponents/SensorNode";

const SMT50 = ({ data }) => {
  const sensorConfigSMT50 = [
    {
      id: "soiltemp",
      emoji: "🌡️",
      label: "Soil Temperature (°C)",
      min: -20,
      max: 60,
      step: 0.5,
      initial: 20,
    },
    {
      id: "soilmoisture",
      emoji: "💧",
      label: "Soil Moisture (%)",
      min: 0,
      max: 100,
      step: 1,
      initial: 50,
    },
  ];

  return (
    <div style={{ position: "relative" }}>
      <SensorNode
        title="SMT50"
        sensors={sensorConfigSMT50}
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

export default memo(SMT50);
