export default function initUltrasonic(interpreter, globalObject) {
  var wrapper = function readUltrasonicDistance() {
    const port = document.getElementById("port").value;
    const trigger = document.getElementById("ultrasonic_trigger").value;
    const echo = document.getElementById("ultrasonic_echo").value;
    const distance = document.getElementById("distance").value;
    
    return {
      distance: Number(distance),
      port: port,
      trigger: trigger,
      echo: echo
    };
  };
  
  interpreter.setProperty(
    globalObject,
    "readUltrasonicDistance",
    interpreter.createNativeFunction(wrapper)
  );
}