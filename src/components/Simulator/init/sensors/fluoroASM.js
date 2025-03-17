// path: src/components/Simulator/init/sensors/fluoroASM.js
// Erstellt
export default function initFluoroASM(interpreter, globalObject) {
  // Funktion zum Abrufen des Quanten-Sensorwerts mit Modus
  var wrapper = function readQuantumValue(mode) {
    let baseValue = parseFloat(document.getElementById("quantum-slider").value);

    // Unterschiedliche Modi simulieren
    switch (mode) {
      case "HIGH_PRECISION":
        return baseValue * 1.05; // +5% Genauigkeit
      case "FAST":
        return baseValue * 0.95; // -5% Genauigkeit
      default:
        return baseValue; // Standardmodus
    }
  };

  interpreter.setProperty(
    globalObject,
    "readQuantumValue",
    interpreter.createNativeFunction(wrapper),
  );

  // Funktion zur Simulation von Quantenrauschen mit Empfindlichkeit
  var wrapper = function simulateQuantumNoise(sensitivity) {
    let noise = (Math.random() - 0.5) * 2; // Zufallswert zwischen -1 und 1
    return noise * sensitivity; // Skaliert mit Empfindlichkeit
  };

  interpreter.setProperty(
    globalObject,
    "simulateQuantumNoise",
    interpreter.createNativeFunction(wrapper),
  );

  // Funktion zur Initialisierung des FluoroASM-Sensors
  var wrapper = function initFluoroASM() {
    console.log("FluoroASM-Sensor initialisiert");
    // Im Simulator können wir hier zusätzliche Initialisierungslogik hinzufügen

    // Slider erstellen, falls er noch nicht existiert
    if (!document.getElementById("quantum-slider")) {
      const sliderContainer = document.createElement("div");
      sliderContainer.id = "quantum-slider-container";
      sliderContainer.style.marginTop = "10px";

      const label = document.createElement("label");
      label.htmlFor = "quantum-slider";
      label.textContent = "Quantum Value: ";

      const slider = document.createElement("input");
      slider.type = "range";
      slider.id = "quantum-slider";
      slider.min = "0";
      slider.max = "100";
      slider.value = "50";

      const valueDisplay = document.createElement("span");
      valueDisplay.id = "quantum-value";
      valueDisplay.textContent = slider.value;

      slider.addEventListener("input", function () {
        valueDisplay.textContent = this.value;
      });

      sliderContainer.appendChild(label);
      sliderContainer.appendChild(slider);
      sliderContainer.appendChild(valueDisplay);

      // Füge den Slider zum Simulator-UI hinzu
      const simContainer = document.querySelector(".simulator-container");
      if (simContainer) {
        simContainer.appendChild(sliderContainer);
      } else {
        // Fallback, falls .simulator-container nicht gefunden wird
        document.body.appendChild(sliderContainer);
      }
    }

    return true; // Erfolgreiche Initialisierung
  };

  interpreter.setProperty(
    globalObject,
    "initFluoroASM",
    interpreter.createNativeFunction(wrapper),
  );

  // Funktion zum Lesen des FluoroASM-Sensors über I2C
  var wrapper = function readFluoroASM_I2C() {
    // I2C-Adresse: 0x50
    console.log("Reading FluoroASM over I2C (address 0x50)");

    // Simuliere I2C-Kommunikation und 2-Byte-Lesevorgang
    const rawValue = Math.floor(Math.random() * 65535); // 16-bit integer (0-65535)

    // Konvertiere zu Float und skaliere auf sinnvollen Bereich
    return rawValue / 100.0;
  };

  interpreter.setProperty(
    globalObject,
    "readFluoroASM_I2C",
    interpreter.createNativeFunction(wrapper),
  );

  // Initialisierung der LED-Funktionen für den FluoroASM-Sensor
  var wrapper = function initLEDs() {
    console.log("LEDs des FluoroASM-Sensors initialisiert");
    return true;
  };

  interpreter.setProperty(
    globalObject,
    "initLEDs",
    interpreter.createNativeFunction(wrapper),
  );

  // LED-Steuerungsfunktionen
  var wrapper = function setLEDState(led, state) {
    console.log(`LED ${led} set to ${state}`);
    // Hier können wir den visuellen Zustand der LEDs im Simulator ändern
    return true;
  };

  interpreter.setProperty(
    globalObject,
    "setLEDState",
    interpreter.createNativeFunction(wrapper),
  );

  var wrapper = function playLEDSequence(delay) {
    console.log(`Playing LED sequence with delay ${delay}ms`);
    return true;
  };

  interpreter.setProperty(
    globalObject,
    "playLEDSequence",
    interpreter.createNativeFunction(wrapper),
  );

  var wrapper = function fadeLEDs(maxBrightness) {
    console.log(`Fading LEDs with max brightness ${maxBrightness}`);
    return true;
  };

  interpreter.setProperty(
    globalObject,
    "fadeLEDs",
    interpreter.createNativeFunction(wrapper),
  );
}
