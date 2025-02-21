export default function initSMT50(interpreter, globalObject) {
  // Soil temperature reading function
  const readSoilTemperature = function() {
    return document.getElementById("soil-temperature-slider")?.value || 20;
  };
  interpreter.setProperty(
    globalObject,
    "readSoilTemperature",
    interpreter.createNativeFunction(readSoilTemperature)
  );

  // Soil moisture reading function  
  const readSoilMoisture = function() {
    return document.getElementById("soil-moisture-slider")?.value || 50;
  };
  interpreter.setProperty(
    globalObject,
    "readSoilMoisture", 
    interpreter.createNativeFunction(readSoilMoisture)
  );
}