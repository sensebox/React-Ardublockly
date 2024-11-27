export default function initTime(interpreter, globalObject) {
  // Define 'delay(number)' function.
  var wrapper = function (ms, next) {
    window.setTimeout(function () {
      next();
    }, ms);
  };
  interpreter.setProperty(
    globalObject,
    "delay",
    interpreter.createAsyncFunction(wrapper),
  );
}
