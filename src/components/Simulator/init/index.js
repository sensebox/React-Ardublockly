import initDisplay from "./display";
import initDom from "./dom";
import initLogAndAlert from "./log";
import initNeopixel from "./neopixel";
import initHDC1080 from "./sensors/hdc1080";
import initLightUv from "./sensors/lightUv";
import initSMT50 from "./sensors/smt50"; // Add this import
import initTime from "./time";

export default function initSimulator(interpreter, globalObject) {
  initDom(interpreter, globalObject);
  initLogAndAlert(interpreter, globalObject);
  initTime(interpreter, globalObject);
  initDisplay(interpreter, globalObject);
  initHDC1080(interpreter, globalObject);
  initLightUv(interpreter, globalObject);
  initSMT50(interpreter, globalObject); // Add this line
  initNeopixel(interpreter, globalObject);
}