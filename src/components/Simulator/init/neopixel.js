
export default function initNeopixel(interpreter, globalObject) {
    // Define neopixel function
    var wrapper = function neopixel(r, g, b) {
     document.getElementById("board-complex_svg__circle270").style.fill =
       `rgb(${r}, ${g}, ${b})`;
   };
   interpreter.setProperty(
     globalObject,
     "neopixel",
     interpreter.createNativeFunction(wrapper),
   );
 }