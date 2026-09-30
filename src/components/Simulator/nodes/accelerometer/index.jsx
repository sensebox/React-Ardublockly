import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import SensorGraphic from "./accelerometer.png";
import SensorNode from "../../uiComponents/SensorNode";

const Accelerometer = ({ data }) => {
  const sensorConfigAccelerometer = [
    {
      id: "x",
      emoji: "↔️",
      min: -2,
      max: 2,
      step: 0.01,
      initial: 0,
      type: "accelerometer_x",
    },
    {
      id: "y",
      emoji: "↕️",
      min: -2,
      max: 2,
      step: 0.01,
      initial: 0,
      type: "accelerometer_y",
    },
    {
      id: "z",
      emoji: "⬆️",
      min: -2,
      max: 2,
      step: 0.01,
      initial: 1,
      type: "accelerometer_z",
    },
    {
      id: "temp-accel",
      emoji: "🌡️",
      min: -20,
      max: 50,
      step: 0.5,
      initial: 20,
      type: "accelerometer_temp",
    },
  ];

  return (
    <div style={{ position: "relative" }}>
      <SensorNode
        title="Accelerometer"
        sensors={sensorConfigAccelerometer}
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

export default memo(Accelerometer);
