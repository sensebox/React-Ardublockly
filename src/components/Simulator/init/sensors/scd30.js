import { defineSliderReaders } from "../slider";

// SCD30 CO2, temperature and humidity
export default function initSCD30(interpreter, globalObject) {
  defineSliderReaders(interpreter, globalObject, {
    readCO2SCD30: "co2-scd30",
    readTemperatureSCD30: "temp-scd30",
    readHumiditySCD30: "humidity-scd30",
  });
}
