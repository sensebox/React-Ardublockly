// random(max) or random(min, max) like on the Arduino: min <= value < max
export default function initRandom(interpreter, globalObject) {
  interpreter.setProperty(
    globalObject,
    "random",
    interpreter.createNativeFunction((a, b) => {
      const [min, max] = b === undefined ? [0, a] : [a, b];
      return Math.floor(Math.random() * (max - min)) + min;
    }),
  );
}
