import React, { memo } from "react";
import SensorGraphic from "./ToF-LensCover.png";
import SensorNode from "../../uiComponents/SensorNode";

const tofimager = ({ data }) => {
  const sensorConfigTOF = [
    {
      id: "dist",
      emoji: "📏",
      min: 0,
      max: 4000,
      step: 1,
      initial: 1000,
      type: "sensebox_tof_dist",
    },
  ];

  return (
    <div style={{ position: "relative" }}>
      <SensorNode
        title="TOF Imager"
        sensors={sensorConfigTOF}
        imageSrc={SensorGraphic}
      />
    </div>
  );
};

export default memo(tofimager);
