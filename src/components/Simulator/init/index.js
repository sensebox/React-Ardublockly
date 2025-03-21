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
import initFluoroASM from "./sensors/fluoroASM";
import initSPS30 from "./sensors/sps30";
import initWaterTemp from "./sensors/waterTemp";
import initPhotodiode from "./sensors/photodiode";
import initUltrasonic from "./sensors/ultrasonic";
import initTOFImager from "./sensors/tofimager";
import initSMT50 from "./sensors/smt50";

export default function initSimulator(interpreter, globalObject) {
  initDom(interpreter, globalObject);
  initLogAndAlert(interpreter, globalObject);
  initTime(interpreter, globalObject);
  initDisplay(interpreter, globalObject);
  initHDC1080(interpreter, globalObject);
  initLightUv(interpreter, globalObject);
  initNeopixel(interpreter, globalObject);
  initWaterTemp(interpreter, globalObject);
  initPd(interpreter, globalObject);
  initFluoroASM(interpreter, globalObject);
  initSPS30(interpreter, globalObject);
  initPhotodiode(interpreter, globalObject);
  initUltrasonic(interpreter, globalObject);
  initTOFImager(interpreter, globalObject);
  initBME680(interpreter, globalObject);
  initSMT50(interpreter, globalObject);
  initSCD30(interpreter, globalObject);
  initDPS310(interpreter, globalObject);
}
