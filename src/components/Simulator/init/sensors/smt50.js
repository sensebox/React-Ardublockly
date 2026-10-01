import { defineSliderReaders } from "../slider";

// SMT50 soil temperature and moisture
export default function initSMT50(interpreter, globalObject) {
  defineSliderReaders(interpreter, globalObject, {
    readSoilTemperature: "soiltemp",
    readSoilMoisture: "soilmoisture",
  });
}
