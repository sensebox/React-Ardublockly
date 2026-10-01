import { defineSliderReaders } from "../slider";

// DPS310 pressure, temperature and altitude
export default function initDPS310(interpreter, globalObject) {
  defineSliderReaders(interpreter, globalObject, {
    readTemperatureDPS310: "temp-dps",
    readPressureDPS310: "pres",
    readAltitudeDPS310: "alt",
  });
}
