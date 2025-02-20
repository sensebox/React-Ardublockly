export default function initLightUv(interpreter, globalObject) {
    // Define getTemperature function
    var wrapper = function getIlluminance() {
      return document.getElementById("lux-slider").value;
    };
    interpreter.setProperty(
      globalObject,
      "Lightsensor_getIlluminance",
      interpreter.createNativeFunction(wrapper),
    );
  
    // Define getTemperature function
    var wrapper = function getUV() {
      return document.getElementById("humidity-slider").value;
    };
    interpreter.setProperty(
      globalObject,
      "getUV",
      interpreter.createNativeFunction(wrapper),
    );
  }