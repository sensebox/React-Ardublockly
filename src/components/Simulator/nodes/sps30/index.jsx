import React, { memo } from "react";
import SensorGraphic from "./sps30.png";
import SensorNode from "../../uiComponents/SensorNode";
import { Handle, Position } from "@xyflow/react";

const sensorConfigSPS30 = [
  {
    id: "pm1-sps30",
    emoji: "🌫️",
    label: "PM1",
    min: 0,
    max: 500,
    step: 1,
    initial: 0,
    type: "sensebox_sps_pm1",
  },
  {
    id: "pm25-sps30",
    emoji: "🌁",
    label: "PM2.5",
    min: 0,
    max: 500,
    step: 1,
    initial: 0,
    type: "sensebox_sps_pm25",
  },
  {
    id: "pm4-sps30",
    emoji: "🌫️",
    label: "PM4",
    min: 0,
    max: 500,
    step: 1,
    initial: 0,
    type: "sensebox_sps_pm4",
  },
  {
    id: "pm10-sps30",
    emoji: "🌫️",
    label: "PM10",
    min: 0,
    max: 500,
    step: 1,
    initial: 0,
    type: "sensebox_sps_pm10",
  },
];

const SPS30 = ({ data }) => {
  return (
    <div style={{ position: "relative" }}>
      <SensorNode
        title="SPS30"
        sensors={sensorConfigSPS30}
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

export default memo(SPS30);
