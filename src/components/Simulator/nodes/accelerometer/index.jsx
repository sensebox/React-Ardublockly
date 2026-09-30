import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import SensorGraphic from "./accelerometer.png";
import SensorNode from "../../uiComponents/SensorNode";

const Accelerometer = ({ data }) => {
  // Für Temperatur und Luftfeuchte:
  const sensorConfigAccelerometer = [
    {
      id: "x",
      emoji: "↔️",
      label: "X-Achse (g)",
      min: -2,
      max: 2,
      step: 0.01,
      initial: 0,
      type: "accelerometer_x",
    },
    {
      id: "y",
      emoji: "↕️",
      label: "Y-Achse (g)",
      min: -2,
      max: 2,
      step: 0.01,
      initial: 0,
      type: "accelerometer_y",
    },
    {
      id: "z",
      emoji: "⬆️",
      label: "Z-Achse (g)",
      min: -2,
      max: 2,
      step: 0.01,
      initial: 1,
      type: "accelerometer_z",
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
