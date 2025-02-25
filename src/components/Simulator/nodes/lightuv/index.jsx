import React, { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import SensorGraphic from "./lightuv.png";
import SensorNode from "../../uiComponents/SensorNode";

const sensorConfigLuxUv = [
  { id: "lux", emoji: "🔦", label: "Lux", min: 0, max: 10000, step: 1, initial: 2500 },
  { id: "uv", emoji: "☀️", label: "UV", min: 0, max: 100, step: 1, initial: 55 },
];

const LightUv = ({ data }) => {

  return (
  <SensorNode 
    title="TSL/VEML"
    sensors={sensorConfigLuxUv}
    imageSrc={SensorGraphic}
/>
  );
};

export default memo(LightUv);
