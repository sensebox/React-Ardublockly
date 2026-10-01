import { defineSliderReaders } from "../slider";

// SDS011 particulate matter
export default function initSDS011(interpreter, globalObject) {
  defineSliderReaders(interpreter, globalObject, {
    readPM10SDS011: "pm10-sds011",
    readPM25SDS011: "pm25-sds011",
  });
}
