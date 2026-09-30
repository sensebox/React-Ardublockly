export default function initRG15(interpreter, globalObject) {
  // Read rain amount from RG15 sensor
  var wrapper = function readRainRG15() {
    return document.getElementById("total-rainfall-rg15-slider").value;
  };
  interpreter.setProperty(
    globalObject,
    "getTotalAccumulation",
    interpreter.createNativeFunction(wrapper),
  );

  // Read status from RG15 sensor
  var wrapper = function readStatusRG15() {
    return document.getElementById("rainfall-intensity-rg15-slider").value;
  };
  interpreter.setProperty(
    globalObject,
    "readStatusRG15",
    interpreter.createNativeFunction(wrapper),
  );
}
