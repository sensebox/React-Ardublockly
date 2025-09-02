export default function initSPS30(interpreter, globalObject) {
  // Define readPM1SPS30 function
  var wrapper = function readPM1SPS30() {
    return document.getElementById("pm1-sps30-slider").value;
  };
  interpreter.setProperty(
    globalObject,
    "readPM1SPS30",
    interpreter.createNativeFunction(wrapper),
  );

  // Define readPM25SPS30 function
  var wrapper = function readPM25SPS30() {
    return document.getElementById("pm25-sps30-slider").value;
  };
  interpreter.setProperty(
    globalObject,
    "readPM25SPS30",
    interpreter.createNativeFunction(wrapper),
  );

  // Define readPM4SPS30 function
  var wrapper = function readPM4SPS30() {
    return document.getElementById("pm4-sps30-slider").value;
  };
  interpreter.setProperty(
    globalObject,
    "readPM4SPS30",
    interpreter.createNativeFunction(wrapper),
  );

  // Define readPM10SPS30 function
  var wrapper = function readPM10SPS30() {
    return document.getElementById("pm10-sps30-slider").value;
  };
  interpreter.setProperty(
    globalObject,
    "readPM10SPS30",
    interpreter.createNativeFunction(wrapper),
  );
}
