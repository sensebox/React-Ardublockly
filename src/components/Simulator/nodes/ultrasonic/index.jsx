import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import SensorGraphic from "./hc-sr04.png";
import SensorNode from "../../uiComponents/SensorNode";

const UltrasonicSensor = ({ data }) => {
  const sensorConfigUltrasonic = [
    {
      id: "distance",
      emoji: "📏",
      label: "Distance (cm)",
      min: 0,
      max: 250,
      step: 1,
      initial: 100,
    },
  ];

  return (
    <div style={{ position: "relative" }}>
      <SensorNode
        title="Ultrasonic HC-SR04"
        sensors={sensorConfigUltrasonic}
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

export default memo(UltrasonicSensor);
