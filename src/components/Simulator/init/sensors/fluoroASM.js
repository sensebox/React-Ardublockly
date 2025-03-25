export default function initFluoroASM(interpreter, globalObject) {

    var wrapper = function setLEDState (led) {
        const setLEDState = document.getElementById(led-selector).value;
        return setLEDState;
    };
  
    interpreter.setProperty(
      globalObject,
      "setLEDState",
      interpreter.createNativeFunction(wrapper),
    );

  }