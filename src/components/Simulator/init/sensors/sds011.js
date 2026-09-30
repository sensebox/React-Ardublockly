export default function initSDS011(interpreter, globalObject) {
  // Define readPM10SDS011 function
  var wrapper = function readPM10SDS011() {
    return document.getElementById("pm10-sds011-slider").value;
  };
  interpreter.setProperty(
    globalObject,
    "readPM10SDS011",
    interpreter.createNativeFunction(wrapper),
  );

  // Define readPM25SDS011 function
  var wrapper = function readPM25SDS011() {
    return document.getElementById("pm25-sds011-slider").value;
  };
  interpreter.setProperty(
    globalObject,
    "readPM25SDS011",
    interpreter.createNativeFunction(wrapper),
  );
}
