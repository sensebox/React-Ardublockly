export default function initLogAndAlert(interpreter, globalObject) {
  // Define 'alert()' function
  const alertWrapper = (text) => window.alert(text || "");
  interpreter.setProperty(
    globalObject,
    "alert",
    interpreter.createNativeFunction(alertWrapper),
  );

  // Define 'console.log()' function
  const logWrapper = (text) => console.log(text);
  interpreter.setProperty(
    globalObject,
    "log",
    interpreter.createNativeFunction(logWrapper),
  );
}
