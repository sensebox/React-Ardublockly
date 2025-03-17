// path: src/components/Simulator/init/sensors/sps30.js
export default function initSPS30(interpreter, globalObject) {
  // Funktion zum Initialisieren des SPS30-Sensors
  var wrapper = function initSPS30() {
    console.log("SPS30 sensor initialized");

    // Erstellen der Slider für verschiedene Partikelgrößen
    createParticleSliders();
  };

  // Funktion zum Setzen des Auto-Clean-Intervalls
  var wrapperCleanInterval = function setSPS30CleanInterval(days) {
    console.log(`SPS30 auto-clean interval set to ${days} days`);
  };

  // Funktion zum Setzen des Messintervalls
  var wrapperMeasureInterval = function setSPS30MeasureInterval(interval) {
    console.log(`SPS30 measurement interval set to ${interval} seconds`);
  };

  // Funktion zum Starten einer manuellen Reinigung
  var wrapperClean = function startSPS30Cleaning() {
    console.log("SPS30 manual cleaning started");
  };

  // Funktion zum Abrufen des SPS30-Werts
  var wrapperReadValue = function readSPS30Value(valueType) {
    // Hier simulieren wir die Sensordaten basierend auf dem Wert aus einem Slider
    const sliderId = `sps30-${valueType}-slider`;
    const slider = document.getElementById(sliderId);
    if (slider) {
      return slider.value;
    } else {
      return 0; // Standardwert, falls kein Slider vorhanden ist
    }
  };

  // Hilfsfunktion zum Erstellen der Slider für verschiedene Partikelgrößen
  function createParticleSliders() {
    const particleSizes = ["1p0", "2p5", "4p0", "10p0"];
    const particleNames = ["PM1.0", "PM2.5", "PM4.0", "PM10.0"];
    const maxValues = [50, 100, 150, 200]; // Maximale Werte für die verschiedenen Partikelgrößen

    // Container für die Slider im DOM finden oder erstellen
    let container = document.getElementById("sps30-sliders-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "sps30-sliders-container";
      container.style.padding = "10px";
      container.style.backgroundColor = "#f0f0f0";
      container.style.borderRadius = "5px";
      container.style.marginTop = "10px";

      // Überschrift hinzufügen
      const heading = document.createElement("h3");
      heading.textContent = "SPS30 Feinstaub-Simulator";
      container.appendChild(heading);

      // Container zum DOM hinzufügen
      const simulatorContainer =
        document.getElementById("simulator-controls") || document.body;
      simulatorContainer.appendChild(container);
    }

    // Slider für jede Partikelgröße erstellen
    particleSizes.forEach((size, index) => {
      const sliderId = `sps30-${size}-slider`;

      // Prüfen, ob der Slider bereits existiert
      if (!document.getElementById(sliderId)) {
        const sliderContainer = document.createElement("div");
        sliderContainer.style.margin = "10px 0";

        // Label für den Slider
        const label = document.createElement("label");
        label.htmlFor = sliderId;
        label.textContent = `${particleNames[index]} (µg/m³): `;
        sliderContainer.appendChild(label);

        // Wertanzeige
        const valueDisplay = document.createElement("span");
        valueDisplay.id = `${sliderId}-value`;
        valueDisplay.textContent = "0";
        sliderContainer.appendChild(valueDisplay);

        // Slider erstellen
        const slider = document.createElement("input");
        slider.type = "range";
        slider.id = sliderId;
        slider.min = "0";
        slider.max = maxValues[index].toString();
        slider.value = "0";
        slider.style.width = "100%";
        slider.addEventListener("input", function () {
          valueDisplay.textContent = this.value;
        });

        sliderContainer.appendChild(document.createElement("br"));
        sliderContainer.appendChild(slider);

        // Zum Container hinzufügen
        container.appendChild(sliderContainer);
      }
    });
  }

  // Setze die Funktionen in den Interpreter
  interpreter.setProperty(
    globalObject,
    "initSPS30",
    interpreter.createNativeFunction(wrapper),
  );

  interpreter.setProperty(
    globalObject,
    "setSPS30CleanInterval",
    interpreter.createNativeFunction(wrapperCleanInterval),
  );

  interpreter.setProperty(
    globalObject,
    "setSPS30MeasureInterval",
    interpreter.createNativeFunction(wrapperMeasureInterval),
  );

  interpreter.setProperty(
    globalObject,
    "startSPS30Cleaning",
    interpreter.createNativeFunction(wrapperClean),
  );

  interpreter.setProperty(
    globalObject,
    "readSPS30Value",
    interpreter.createNativeFunction(wrapperReadValue),
  );
}
