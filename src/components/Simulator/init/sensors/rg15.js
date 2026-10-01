import { defineSliderReaders } from "../slider";

// RG15 rain gauge
export default function initRG15(interpreter, globalObject) {
  defineSliderReaders(interpreter, globalObject, {
    getTotalAccumulation: "total-rainfall-rg15",
    getRainfallIntensity: "rainfall-intensity-rg15",
  });
}
