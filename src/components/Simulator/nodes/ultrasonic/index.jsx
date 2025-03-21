import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import SensorGraphic from "./ultrasonic.png"; 
import SensorNode from "../../uiComponents/SensorNode";

const UltrasonicSensor = ({ data }) => {
  const sensorConfigUltrasonic = [
    { 
      id: "distance", 
      emoji: "📏", 
      label: "Distance (cm)", 
      min: 0, 
      max: 250,
      step: 1, 
      initial: 100 
    }
  ];

  return (
    <SensorNode
      title="Ultrasonic HC-SR04"
      sensors={sensorConfigUltrasonic}
      imageSrc={SensorGraphic}
      maxWidth="150px"
    />
  );
};

export default memo(UltrasonicSensor);