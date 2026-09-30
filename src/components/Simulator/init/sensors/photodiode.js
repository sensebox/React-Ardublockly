import { defineSliderReaders } from "../slider";

// Photodiode on the MCU-S2
export default function initPd(interpreter, globalObject) {
  defineSliderReaders(interpreter, globalObject, {
    readPhotodiode: "pd",
  });
}
