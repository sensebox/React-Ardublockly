import React, { memo } from "react";
import SensorGraphic from "./rg15.png"; // Update to RG15 sensor image
import SensorNode from "../../uiComponents/SensorNode";
import { Handle, Position } from "@xyflow/react";

const sensorConfigRG15 = [
  {
    id: "total-rainfall-rg15",
    emoji: "🌧️",
    label: "Total Rainfall",
    min: 0,
    max: 1000,
    step: 0.1,
    initial: 0,
    type: "sensebox_rg15_total_rainfall",
  },
  {
    id: "rainfall-intensity-rg15",
    emoji: "💧",
    label: "Rainfall Intensity",
    min: 0,
    max: 200,
    step: 0.1,
    initial: 0,
    type: "sensebox_rg15_rainfall_intensity",
  },
];

const RG15 = ({ data }) => {
  return (
    <div style={{ position: "relative" }}>
      <SensorNode
        title="RG15"
        sensors={sensorConfigRG15}
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

export default memo(RG15);
