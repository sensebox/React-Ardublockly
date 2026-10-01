import { defineSliderReaders } from "../slider";

// ToF imager distance. The bitmap mode is not simulated.
export default function initTOFImager(interpreter, globalObject) {
  defineSliderReaders(interpreter, globalObject, {
    readDistance: "dist",
  });
}
