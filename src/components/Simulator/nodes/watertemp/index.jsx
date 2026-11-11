import React, { memo } from "react";
import SensorGraphic from "./WassertemperaturSensor.png";
import SensorNode from "../../uiComponents/SensorNode";

const WaterTemp = ({ data }) => {
  const sensorConfigWaterTemp = [
    {
      id: "watertemp",
      emoji: "🌡️",
      min: 0,
      max: 50,
      step: 0.5,
      initial: 20,
      type: "sensebox_watertemp_temp",
    },
  ];

  return (
    <div style={{ position: "relative" }}>
      <SensorNode
        title="DS18B20"
        sensors={sensorConfigWaterTemp}
        imageSrc={SensorGraphic}
      />
    </div>
  );
};

export default memo(WaterTemp);
