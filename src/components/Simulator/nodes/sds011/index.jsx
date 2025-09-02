import React, { memo } from "react";
import SensorGraphic from "./sds011.png";
import SensorNode from "../../uiComponents/SensorNode";
import { Handle, Position } from "@xyflow/react";

const sensorConfigSDS011 = [
  {
    id: "pm10-sds011",
    emoji: "🌫️",
    label: "PM10",
    min: 0,
    max: 500,
    step: 1,
    initial: 0,
    type: "sensebox_sds_pm10",
  },
  {
    id: "pm25-sds011",
    emoji: "🌁",
    label: "PM2.5",
    min: 0,
    max: 500,
    step: 1,
    initial: 0,
    type: "sensebox_sds_pm25",
  },
];

const SDS011 = ({ data }) => {
  return (
    <div style={{ position: "relative" }}>
      <SensorNode
        title="SDS011"
        sensors={sensorConfigSDS011}
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

export default memo(SDS011);
