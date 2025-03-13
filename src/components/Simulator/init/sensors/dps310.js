export default function initDPS310(interpreter, globalObject) {
    // Define getTemperature function
    var wrapper = function readTemperatureDPS310() {
      return document.getElementById("temp-dps-slider").value;
    };
    interpreter.setProperty(
      globalObject,
      "readTemperatureDPS310",
      interpreter.createNativeFunction(wrapper),
    );
  
    var wrapper = function readPressureDPS310() {
      return document.getElementById("pres-slider").value;
    };
    interpreter.setProperty(
      globalObject,
      "readPressureDPS310",
      interpreter.createNativeFunction(wrapper),
    );
  }