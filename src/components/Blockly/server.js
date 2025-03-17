const express = require("express");
const compileSketch = require("./compileTask");
const app = express();

// SSE-Route: Clients abonnieren den Fortschritt
app.get("/compile-progress", (req, res) => {
  const sketchPath = req.query.sketchPath; // Übergib den Pfad als Query-Parameter
  const fqbn = req.query.fqbn; // und den Board-FQBN

  // Setze SSE-spezifische Header
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Funktion, um Fortschrittsdaten zu senden
  const sendProgress = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  compileSketch(sketchPath, fqbn, (err, progressData) => {
    if (err) {
      sendProgress({ error: err.message });
      res.end();
    } else {
      sendProgress(progressData);
      if (progressData.done) {
        res.end();
      }
    }
  });
});

app.listen(3001, () => {
  console.log("Server listening on port 3001");
});
