export default function initPd(interpreter, globalObject) {
    // Define getTemperature function
    var wrapper = function getPd() {
     // return document.getElementById("pd-slider").value;
    };

    interpreter.setProperty(
      globalObject,
      "readPhotodiode",
      interpreter.createNativeFunction(wrapper),
    );
  }