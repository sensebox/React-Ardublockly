import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import SensorGraphic from "./ToF-LensCover.png";
import SensorNode from "../../uiComponents/SensorNode";

const tofimager = ({ data }) => {
  const sensorConfigTOF = [
    {
      id: "dist",
      emoji: "📏",
      label: "Distance (mm)",
      min: 0,
      max: 4000,
      step: 1,
      initial: 1000,
      type: "sensebox_tof_dist",
    },
  ];

  return (
    <div style={{ position: "relative" }}>
      <SensorNode
        title="TOF Imager"
        sensors={sensorConfigTOF}
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

export default memo(tofimager);
