import { defineSliderReaders } from "../slider";

// DS18B20 water temperature
export default function initWaterTemp(interpreter, globalObject) {
  defineSliderReaders(interpreter, globalObject, {
    readWaterTemperature: "watertemp",
  });
}
