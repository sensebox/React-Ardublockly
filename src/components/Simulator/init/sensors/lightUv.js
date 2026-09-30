export default function initLightUv(interpreter, globalObject) {
    // Define getTemperature function
    var wrapper = function getIlluminance() {
      return document.getElementById("lux-slider").value;
    };
    interpreter.setProperty(
      globalObject,
      "readIlluminance",
      interpreter.createNativeFunction(wrapper),
    );
  
    // Define getTemperature function
    var wrapper = function getUV() {
      return document.getElementById("uv-slider").value;
    };
    interpreter.setProperty(
      globalObject,
      "readUvIntensity",
      interpreter.createNativeFunction(wrapper),
    );
  }