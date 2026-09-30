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

  var wrapper = function readAltitudeDPS310() {
    return document.getElementById("alt-slider").value;
  };
  interpreter.setProperty(
    globalObject,
    "readAltitudeDPS310",
    interpreter.createNativeFunction(wrapper),
  );
}
