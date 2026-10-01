import { defineSliderReaders } from "../slider";

// HC-SR04 ultrasonic distance in cm
export default function initUltrasonic(interpreter, globalObject) {
  defineSliderReaders(interpreter, globalObject, {
    readUltrasonicDistance: "distance",
  });
}
