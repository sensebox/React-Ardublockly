import React, { memo } from "react";
import SensorGraphic from "./senseBox-HDC1080_v4.png";
import SensorNode from "../../uiComponents/SensorNode";

const HDC1080 = ({ data }) => {
  const sensorConfigTempHumidity = [
    {
      id: "temp",
      emoji: "🌡️",
      min: -20,
      max: 50,
      step: 0.5,
      initial: 20,
      type: "senseBox_hdc1080_temp",
    },
    {
      id: "humidity",
      emoji: "💧",
      min: 0,
      max: 100,
      step: 1,
      initial: 50,
      type: "senseBox_hdc1080_humidity",
    },
  ];

  return (
    <div style={{ position: "relative" }}>
      <SensorNode
        title="HDC1080"
        sensors={sensorConfigTempHumidity}
        imageSrc={SensorGraphic}
      />
    </div>
  );
};

export default memo(HDC1080);
