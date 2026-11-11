import { defineSliderReaders } from "../slider";

// HDC1080 temperature and humidity
export default function initHDC1080(interpreter, globalObject) {
  defineSliderReaders(interpreter, globalObject, {
    readTemperature: "temp",
    readHumidity: "humidity",
  });
}
