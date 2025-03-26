export default function initFluoroASM(interpreter, globalObject) {

    const toggledColors = {
      led1: "#FF3333",
      led2: "#33FF33",
      led3: "#3399FF",
      led4: "#FFFF66",
    };

    var wrapper = function toggleLED (led, on) {
      const ledElement = document.getElementById(`fluoro_led${led}`);
      if (on === "HIGH") {
        ledElement.style.fill = toggledColors[`led${led}`];
      }
      else {
        ledElement.style.fill = "black"
        
      }
      return;
    };
  
    interpreter.setProperty(
      globalObject,
      "toggleLED",
      interpreter.createNativeFunction(wrapper),
    );

  }