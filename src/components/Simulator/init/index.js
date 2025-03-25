import initDisplay from "./display";
import initDom from "./dom";
import initLogAndAlert from "./log";
import initNeopixel from "./neopixel";
import initBME680 from "./sensors/bme680";
import initDPS310 from "./sensors/dps310";
import initHDC1080 from "./sensors/hdc1080";
import initLightUv from "./sensors/lightUv";
import initPd from "./sensors/photodiode";
import initSCD30 from "./sensors/scd30";
import initTime from "./time";
import initUltrasonic from "./sensors/ultrasonic";
import initTOFImager from "./sensors/tofimager";
import initSMT50 from "./sensors/smt50";
import initFluoroASM from "./sensors/fluoroASM";

export default function initSimulator(interpreter, globalObject) {
  initDom(interpreter, globalObject);
  initLogAndAlert(interpreter, globalObject);
  initTime(interpreter, globalObject);
  initDisplay(interpreter, globalObject);
  initHDC1080(interpreter, globalObject);
  initLightUv(interpreter, globalObject);
  initNeopixel(interpreter, globalObject);
  initPd(interpreter, globalObject);
  initUltrasonic(interpreter, globalObject);
  initTOFImager(interpreter, globalObject);
  initBME680(interpreter, globalObject);
  initSMT50(interpreter, globalObject);
  initSCD30(interpreter, globalObject);
  initDPS310(interpreter, globalObject);
  initFluoroASM(interpreter, globalObject);
  
}