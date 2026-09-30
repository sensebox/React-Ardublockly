import React, { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import SensorGraphic from "./lightuv.png";
import SensorNode from "../../uiComponents/SensorNode";

const sensorConfigLuxUv = [
  {
    id: "lux",
    emoji: "🔦",
    label: "Lux",
    min: 0,
    max: 10000,
    step: 1,
    initial: 2500,
    type: "sensebox_light_uv",
  },
  {
    id: "uv",
    emoji: "☀️",
    label: "UV",
    min: 0,
    max: 100,
    step: 1,
    initial: 55,
    type: "sensebox_light_lux",
  },
];

const LightUv = ({ data }) => {
  return (
    <div style={{ position: "relative" }}>
      <SensorNode
        title="TSL/VEML"
        sensors={sensorConfigLuxUv}
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

export default memo(LightUv);
