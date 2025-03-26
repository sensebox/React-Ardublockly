export default function initButton(interpreter, globalObject) {
    // Define getTemperature function
    var wrapper = function isPressed() {
        const button = document.getElementById("mcu_switch_button");
        const isPressed = button.ariaPressed
        return isPressed;
    };
    interpreter.setProperty(
      globalObject,
      "isPressed",
      interpreter.createNativeFunction(wrapper),
    );
    
  }