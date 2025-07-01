export default function initSMT50(interpreter, globalObject) {
    // Define soil temperature reading function
    var wrapper = function readSoilTemperature() {
      return document.getElementById("soiltemp-slider").value;
    };
    interpreter.setProperty(
      globalObject,
      "readSoilTemperature",
      interpreter.createNativeFunction(wrapper)
    );
  
    // Define soil moisture reading function
    var wrapper = function readSoilMoisture() {
      return document.getElementById("soilmoisture-slider").value;
    };
    interpreter.setProperty(
      globalObject,
      "readSoilMoisture", 
      interpreter.createNativeFunction(wrapper)
    );
  }