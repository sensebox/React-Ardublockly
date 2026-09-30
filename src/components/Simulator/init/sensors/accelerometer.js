export default function initAccelerometer(interpreter, globalObject, config) {
  // config = { x: 'accel-x-slider', y: 'accel-y-slider', z: 'accel-z-slider' }

  var readAccelX = function () {
    return document.getElementById("x-slider").value;
  };
  interpreter.setProperty(
    globalObject,
    "accelerationX()",
    interpreter.createNativeFunction(readAccelX),
  );

  var readAccelY = function () {
    return document.getElementById("y-slider").value;
  };
  interpreter.setProperty(
    globalObject,
    "accelerationY()",
    interpreter.createNativeFunction(readAccelY),
  );

  var readAccelZ = function () {
    return document.getElementById("z-slider").value;
  };
  interpreter.setProperty(
    globalObject,
    "accelerationZ();",
    interpreter.createNativeFunction(readAccelZ),
  );
}
