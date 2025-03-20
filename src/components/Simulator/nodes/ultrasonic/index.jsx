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
    },
    {
      id: "port",
      label: "Port",
      type: "select",
      options: ["A", "B", "C"],
      initial: "A"
    },
    {
      id: "ultrasonic_trigger",
      label: "Trigger Pin",
      type: "select", 
      options: ["IO2", "IO3", "IO4", "IO5", "IO6", "IO7"], // Updated pin options
      initial: "IO2"
    },
    {
      id: "ultrasonic_echo",
      label: "Echo Pin",
      type: "select",
      options: ["IO2", "IO3", "IO4", "IO5", "IO6", "IO7"], // Updated pin options 
      initial: "IO3"
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