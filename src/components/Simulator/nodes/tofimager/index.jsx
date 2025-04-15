import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import SensorGraphic from "./ToF-LensCover v1.png";
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
      
    />
  );
};

export default memo(tofimager);