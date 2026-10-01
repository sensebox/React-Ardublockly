import { defineSliderReaders } from "../slider";

// Accelerometer on the MCU-S2
export default function initAccelerometer(interpreter, globalObject) {
  defineSliderReaders(interpreter, globalObject, {
    readAccelerationX: "x",
    readAccelerationY: "y",
    readAccelerationZ: "z",
    readTemperatureAccelerometer: "temp-accel",
  });
}
