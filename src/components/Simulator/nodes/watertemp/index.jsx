import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import SensorGraphic from "./WassertemperaturSensor.png";
import SensorNode from "../../uiComponents/SensorNode";

const WaterTemp = ({ data }) => {
  const sensorConfigWaterTemp = [
    {
      id: "watertemp",
      emoji: "🌡️",
      label: "Water Temperature (°C)",
      min: 0,
      max: 50,
      step: 0.5,
      initial: 20,
    },
  ];

  return (
    <div style={{ position: "relative" }}>
      <SensorNode
        title="DS18B20"
        sensors={sensorConfigWaterTemp}
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

export default memo(WaterTemp);
