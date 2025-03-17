// path: src/components/Simulator/init/index.js
// Ergänzt
import initDisplay from "./display";
import initDom from "./dom";
import initLogAndAlert from "./log";
import initNeopixel from "./neopixel";
import initHDC1080 from "./sensors/hdc1080";
import initLightUv from "./sensors/lightUv";
import initPd from "./sensors/photodiode";
import initTime from "./time";
import initFluoroASM from "./sensors/fluoroASM";
import initSPS30 from "./sensors/sps30";

export default function initSimulator(interpreter, globalObject) {
  initDom(interpreter, globalObject);
  initLogAndAlert(interpreter, globalObject);
  initTime(interpreter, globalObject);
  initDisplay(interpreter, globalObject);
  initHDC1080(interpreter, globalObject);
  initLightUv(interpreter, globalObject);
  initNeopixel(interpreter, globalObject);
<<<<<<< Updated upstream
  initPd(interpreter, globalObject);
}
=======
  initFluoroASM(interpreter, globalObject);
  initSPS30(interpreter, globalObject);
}
>>>>>>> Stashed changes
