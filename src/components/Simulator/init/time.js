export default function initTime(interpreter, globalObject) {
  // Define 'delay(number)' function.
  const wrapper = function (ms, next) {
    window.setTimeout(function () {
      next();
      // The runtime does not tick while the program waits.
      interpreter.onResume?.();
    }, ms);
  };
  interpreter.setProperty(
    globalObject,
    "delay",
    interpreter.createAsyncFunction(wrapper),
  );
}
