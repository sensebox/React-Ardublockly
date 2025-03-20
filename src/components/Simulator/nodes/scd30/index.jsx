import React, { memo } from "react";
import SensorGraphic from "./scd30.png";
import SensorNode from "../../uiComponents/SensorNode";



const sensorConfigSCD30 = [
    { id: "co2-scd30", emoji: "🌱", label: "CO2", min: 400, max: 2000, step: 1, initial: 400 },
    { id: "temp-scd30", emoji: "🌡️", label: "Temperatur", min: 0, max: 50, step: 1, initial: 20 },
    { id: "humidity-scd30", emoji: "💧", label: "Luftfeuchtigkeit", min: 0, max: 100, step: 1, initial: 50 },
    ];



const SCD30 = ({ data }) => {
    return(
        <SensorNode
            title="SCD30"
            sensors={sensorConfigSCD30}
            imageSrc={SensorGraphic}
        />

    )
}

export default memo(SCD30)