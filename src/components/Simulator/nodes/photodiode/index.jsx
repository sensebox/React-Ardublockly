import React, { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import SensorGraphic from "./photodiode.png";
import SensorNode from "../../uiComponents/SensorNode";

const sensorConfigPhotodiode = [
  {
    id: "pd",
    emoji: "🔦",
    label: "Beleuchtung",
    min: 0,
    max: 10000,
    step: 1,
    initial: 2500,
  },
];

const Photodiode = ({ data }) => {
  return (
    <div style={{ position: "relative" }}>
      <SensorNode
        title="Photodiode"
        sensors={sensorConfigPhotodiode}
        imageSrc={SensorGraphic}
        edgeId="photodiode"
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

export default memo(Photodiode);
