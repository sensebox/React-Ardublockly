export default function initWaterTemp(interpreter, globalObject) {
  // Define getWaterTemperature function
  var wrapper = function readWaterTemperature() {
    return document.getElementById("watertemp-slider").value;
  };
  interpreter.setProperty(
    globalObject,
    "readWaterTemperature",
    interpreter.createNativeFunction(wrapper),
  );
}