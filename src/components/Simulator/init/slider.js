/**
 * Current value of a sensor slider in the simulator.
 * @param {string} id Slider id without the "-slider" suffix, see SensorNode.
 * @return {number}
 */
export function readSlider(id) {
  const slider = document.getElementById(`${id}-slider`);
  return slider ? Number(slider.value) : 0;
}

/**
 * Register interpreter functions that return the value of a slider,
 * e.g. { readTemperature: "temp" } defines readTemperature().
 * @param {!Interpreter} interpreter
 * @param {!Object} globalObject
 * @param {!Object<string, string>} readers Function name -> slider id.
 */
export function defineSliderReaders(interpreter, globalObject, readers) {
  Object.entries(readers).forEach(([name, sliderId]) => {
    interpreter.setProperty(
      globalObject,
      name,
      interpreter.createNativeFunction(() => readSlider(sliderId)),
    );
  });
}
