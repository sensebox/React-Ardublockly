export default function initSCD30(interpreter, globalObject) {

    var wrapper = function readCO2SCD30() {
      return document.getElementById("co2-scd30-slider").value;
    };
    interpreter.setProperty(
        globalObject,
        "readCO2SCD30",
        interpreter.createNativeFunction(wrapper),
        );
    // Define getTemperature function
    var wrapper = function readTemperatureSCD30() {
      return document.getElementById("temp-scd30-slider").value;
    };
    interpreter.setProperty(
      globalObject,
      "readTemperatureSCD30",
      interpreter.createNativeFunction(wrapper),
    );
  
    // Define getTemperature function
    var wrapper = function readHumiditySCD30() {
      return document.getElementById("humidity-scd30-slider").value;
    };
    interpreter.setProperty(
      globalObject,
      "readHumiditySCD30",
      interpreter.createNativeFunction(wrapper),
    );
  }