import React, { memo } from "react";
import SensorGraphic from "./dps310.png";
import SensorNode from "../../uiComponents/SensorNode";


const sensorConfigDPS310 = [
  { id: "temp-dps", emoji: "🌡️", label: "Temperature", min: -40, max: 85, step: 0.1, initial: 25 },
  { id: "pres", emoji: "🧭", label: "Pressure", min: 260, max: 1260, step: 1, initial: 1013 },
  { id: "alt", emoji: "🏔️", label: "Altitude", min: -100, max: 10000, step: 1, initial: 0 },
];

const DPS310 = ({ data }) => {
  return (
  <SensorNode 
    title="DPS310"
    sensors={sensorConfigDPS310}
    imageSrc={SensorGraphic}
    maxWidth="64%"
/>
  );
};

export default memo(DPS310);
