import { defineSliderReaders } from "../slider";

// TSL45315 illuminance and VEML6070 UV intensity
export default function initLightUv(interpreter, globalObject) {
  defineSliderReaders(interpreter, globalObject, {
    readIlluminance: "lux",
    readUvIntensity: "uv",
  });
}
