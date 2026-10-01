import { defineSliderReaders } from "../slider";

// SPS30 particulate matter
export default function initSPS30(interpreter, globalObject) {
  defineSliderReaders(interpreter, globalObject, {
    readPM1SPS30: "pm1-sps30",
    readPM25SPS30: "pm25-sps30",
    readPM4SPS30: "pm4-sps30",
    readPM10SPS30: "pm10-sps30",
  });
}
