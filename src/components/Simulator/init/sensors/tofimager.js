export default function initTOFImager(interpreter, globalObject) {
  // Define distance reading function
  var wrapper = function readDistance() {
    return document.getElementById("dist-slider").value;
  };
  interpreter.setProperty(
    globalObject,
    "readDistance",
    interpreter.createNativeFunction(wrapper),
  );
}
