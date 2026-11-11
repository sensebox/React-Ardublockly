import React, { memo } from "react";
import SensorGraphic from "./SMT50_v2.png";
import SensorNode from "../../uiComponents/SensorNode";

const SMT50 = ({ data }) => {
  const sensorConfigSMT50 = [
    {
      id: "soiltemp",
      emoji: "🌡️",
      min: -20,
      max: 60,
      step: 0.5,
      initial: 20,
      type: "sensebox_smt50_temp",
    },
    {
      id: "soilmoisture",
      emoji: "💧",
      min: 0,
      max: 100,
      step: 1,
      initial: 50,
      type: "sensebox_smt50_moisture",
    },
  ];

  return (
    <div style={{ position: "relative" }}>
      <SensorNode
        title="SMT50"
        sensors={sensorConfigSMT50}
        imageSrc={SensorGraphic}
      />
    </div>
  );
};

export default memo(SMT50);
