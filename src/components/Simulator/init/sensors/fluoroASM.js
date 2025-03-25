export default function initFluoroASM(interpreter, globalObject) {

    var wrapper = function readLEDState (led) {
        const readLEDState = document.getElementById(led-selector).value;
        return readLEDState;
    };
  
    interpreter.setProperty(
      globalObject,
      "readLEDState",
      interpreter.createNativeFunction(wrapper),
    );

  }