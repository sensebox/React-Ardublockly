export default function initButton(interpreter, globalObject) {
    // Define getTemperature function
    var wrapper = function isPressed() {
        const button = document.getElementById("mcu_switch_button");
        const isPressed = button.getAttribute("aria-pressed");
        const isPressedBool = isPressed === "true";
        return isPressedBool;
    };

    interpreter.setProperty(
        globalObject,
        "isPressed",
        interpreter.createNativeFunction(wrapper),
      );

    var wrapper = function wasPressed() {
        const button = document.getElementById("mcu_switch_button");
        const wasPressed = button.getAttribute("data-was-pressed");
        const wasPressedBool = wasPressed === "true";   
        button.setAttribute("data-was-pressed", "false");
        return wasPressedBool;
    };

    interpreter.setProperty(
        globalObject,
        "wasPressed",
        interpreter.createNativeFunction(wrapper),
      );
      
    
  }