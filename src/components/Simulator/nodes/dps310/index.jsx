import React, { memo } from "react";
import SensorGraphic from "./dps310.png";
import SensorNode from "../../uiComponents/SensorNode";
const sensorConfigDPS310 = [
  {
    id: "temp-dps",
    emoji: "🌡️",
    min: -40,
    max: 85,
    step: 0.1,
    initial: 20,
    type: "sensebox_dps310_temp",
  },
  {
    id: "pres",
    emoji: "🧭",
    min: 260,
    max: 1260,
    step: 1,
    initial: 1013,
    type: "sensebox_dps310_pressure",
  },
  {
    id: "alt",
    emoji: "🏔️",
    min: -100,
    max: 10000,
    step: 1,
    initial: 0,
    type: "sensebox_dps310_altitude",
  },
];

const DPS310 = ({ data }) => {
  return (
    <div style={{ position: "relative" }}>
      <SensorNode
        title="DPS310"
        sensors={sensorConfigDPS310}
        imageSrc={SensorGraphic}
      />
    </div>
  );
};

export default memo(DPS310);
