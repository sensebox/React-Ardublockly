// compileTask.js
const client = require("./grpcClient");

function compileSketch(sketchPath, fqbn, callback) {
  const compileRequest = {
    instance: { id: 1 }, // Beispiel: passe den Wert an, wenn nötig
    fqbn: fqbn, // z. B. "arduino:avr:uno"
    sketch_path: sketchPath,
    verbose: true, // Falls du detailliertere Ausgaben möchtest
  };

  // Starte den gRPC-Aufruf; Compile liefert einen Stream zurück.
  const call = client.Compile(compileRequest);

  call.on("data", (response) => {
    if (response.progress && response.progress.percent !== undefined) {
      console.log("Progress:", response.progress.percent, "%");
      callback(null, { progress: response.progress.percent });
    }
  });

  call.on("end", () => {
    console.log("Compilation complete");
    callback(null, { progress: 100, done: true });
  });

  call.on("error", (err) => {
    console.error("Compilation error:", err);
    callback(err);
  });
}

module.exports = compileSketch;
