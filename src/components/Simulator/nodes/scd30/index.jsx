import React, { memo } from "react";
import SensorGraphic from "./SCD30_v1.png";
import SensorNode from "../../uiComponents/SensorNode";

const sensorConfigSCD30 = [
  {
    id: "co2-scd30",
    emoji: "🌱",
    min: 400,
    max: 2000,
    step: 1,
    initial: 400,
    type: "sensebox_scd_co2",
  },
  {
    id: "temp-scd30",
    emoji: "🌡️",
    min: 0,
    max: 50,
    step: 1,
    initial: 20,
    type: "sensebox_scd_temp",
  },
  {
    id: "humidity-scd30",
    emoji: "💧",
    min: 0,
    max: 100,
    step: 1,
    initial: 50,
    type: "sensebox_scd_humi",
  },
];

const SCD30 = ({ data }) => {
  return (
    <div style={{ position: "relative" }}>
      <SensorNode
        title="SCD30"
        sensors={sensorConfigSCD30}
        imageSrc={SensorGraphic}
      />
    </div>
  );
};

export default memo(SCD30);
