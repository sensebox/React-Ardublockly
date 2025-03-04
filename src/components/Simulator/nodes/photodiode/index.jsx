import React, { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import SensorGraphic from "./photodiode.png";
import SensorNode from "../../uiComponents/SensorNode";

const sensorConfigPhotodiode = [
  { id: "pd", emoji: "🔦", label: "Beleuchtung", min: 0, max: 10000, step: 1, initial: 2500 },
];


const Photodiode = ({ data }) => {
    return(
        <SensorNode
            title="Photodiode"
            sensors={sensorConfigPhotodiode}
            imageSrc={SensorGraphic}
            edgeId="photodiode"
        />

    )
}

export default memo(Photodiode)