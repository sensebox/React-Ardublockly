import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import SensorGraphic from "./Wassertemperatur Sensor v2.png";
import SensorNode from "../../uiComponents/SensorNode";

const WaterTemp = ({ data }) => {
  const sensorConfigWaterTemp = [
    { 
      id: "watertemp", 
      emoji: "🌡️", 
      label: "Water Temperature (°C)", 
      min: 0, 
      max: 50, 
      step: 0.5, 
      initial: 20 
    }
  ];

  return (
    <SensorNode
      title="DS18B20" 
      sensors={sensorConfigWaterTemp}
      imageSrc={SensorGraphic}
      
    />
  );
};

export default memo(WaterTemp);