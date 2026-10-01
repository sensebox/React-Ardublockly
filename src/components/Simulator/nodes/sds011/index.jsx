import React, { memo } from "react";
import SensorGraphic from "./sds011.png";
import SensorNode from "../../uiComponents/SensorNode";

const sensorConfigSDS011 = [
  {
    id: "pm10-sds011",
    emoji: "🌫️",
    min: 0,
    max: 500,
    step: 1,
    initial: 0,
    type: "sensebox_sds_pm10",
  },
  {
    id: "pm25-sds011",
    emoji: "🌁",
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
    </div>
  );
};

export default memo(SDS011);
