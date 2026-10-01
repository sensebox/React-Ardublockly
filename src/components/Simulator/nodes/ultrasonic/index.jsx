import React, { memo } from "react";
import SensorGraphic from "./hc-sr04.png";
import SensorNode from "../../uiComponents/SensorNode";

const UltrasonicSensor = ({ data }) => {
  const sensorConfigUltrasonic = [
    {
      id: "distance",
      emoji: "📏",
      min: 0,
      max: 250,
      step: 1,
      initial: 100,
      type: "sensebox_ultrasonic_distance",
    },
  ];

  return (
    <div style={{ position: "relative" }}>
      <SensorNode
        title="Ultrasonic HC-SR04"
        sensors={sensorConfigUltrasonic}
        imageSrc={SensorGraphic}
      />
    </div>
  );
};

export default memo(UltrasonicSensor);
