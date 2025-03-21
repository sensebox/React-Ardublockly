import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import SensorGraphic from "./tofimager.png";
import SensorNode from "../../uiComponents/SensorNode";

const tofimager = ({ data }) => {
  const sensorConfigTOF = [
    { 
      id: "dist", 
      emoji: "📏", 
      label: "Distance (mm)", 
      min: 0, 
      max: 4000, 
      step: 1, 
      initial: 1000 
    }
  ];

  return (
    <SensorNode
      title="TOF Imager"
      sensors={sensorConfigTOF}
      imageSrc={SensorGraphic}
      maxWidth="150px"
    />
  );
};

export default memo(tofimager);