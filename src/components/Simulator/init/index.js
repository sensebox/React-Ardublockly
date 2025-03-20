
import initDisplay from "./display";
import initDom from "./dom";
import initLogAndAlert from "./log";
import initNeopixel from "./neopixel";
import initDPS310 from "./sensors/dps310";
import initHDC1080 from "./sensors/hdc1080";
import initLightUv from "./sensors/lightUv";
import initPd from "./sensors/photodiode";
import initTime from "./time";

export default function initSimulator(interpreter, globalObject) {
  initDom(interpreter, globalObject);
  initLogAndAlert(interpreter, globalObject);
  initTime(interpreter, globalObject);
  initDisplay(interpreter, globalObject);
  initHDC1080(interpreter, globalObject);
  initLightUv(interpreter, globalObject);
  initNeopixel(interpreter, globalObject);
  initPd(interpreter, globalObject);
  initDPS310(interpreter, globalObject);
}