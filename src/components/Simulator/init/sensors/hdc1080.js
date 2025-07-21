export default function initHDC1080(interpreter, globalObject) {
    // Define getTemperature function
    var wrapper = function readTemperature() {
      return document.getElementById("temp-slider").value;
    };
    interpreter.setProperty(
      globalObject,
      "readTemperature",
      interpreter.createNativeFunction(wrapper),
    );
  
    // Define getTemperature function
    var wrapper = function readHumidity() {
      return document.getElementById("humidity-slider").value;
    };
    interpreter.setProperty(
      globalObject,
      "readHumidity",
      interpreter.createNativeFunction(wrapper),
    );
  }