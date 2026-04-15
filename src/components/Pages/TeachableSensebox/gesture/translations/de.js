// src/components/Pages/TeachableSensebox/acceleration/translations/de.js
export const accelerationTranslations_de = {
  title: "Gesture Klassifizierung",
  description:
    "Trainiere ein Modell zur Erkennung von Zauberstab-Gesten mit senseBox-Beschleunigungsdaten. Zeichne Muster in die Luft mit deiner senseBox, um Gesten-Klassen zu erstellen.",

  training: {
    title: "Gesten-Training",
    samples: "Aufnahmen",
    addClass: "Gesten-Klasse hinzufügen",
    addNewClass: "Neue Klasse hinzufügen",
    className: "Klassenname",
    cancel: "Abbrechen",
    add: "Hinzufügen",

    // Connection
    connecting: "Verbinde...",
    connectSenseBox: "senseBox Eye verbinden (seriell)",
    disconnectSenseBox: "senseBox Eye trennen",
    connectBLE: "senseBox Eye verbinden (Bluetooth)",
    downloadFirmware: "Gesten-Sketch herunterladen",

    // Recording
    startRecording: "Aufnahme starten",
    stopRecording: "Aufnahme stoppen",

    // Status
    waitingForGesture: "Warte auf Geste...",
    drawing: "Zeichne...",
    gestureComplete: "Geste fertig!",

    // Predictions
    livePrediction: "Live-Vorhersage",
    analyzing: "Analysiere Geste...",

    // Training progress
    trainingInProgress: "Training läuft...",
    trainingEpoch: "Training: Epoche {epoch}/{totalEpochs}",
    trainModel: "Modell trainieren",

    // Results
    resultsTitle: "Trainingsergebnisse",
    metricsChart: "Trainingsfortschritt",
    testResultsTitle: "Testergebnisse",
    finalAccuracy: "Genauigkeit",
    needMoreGestures:
      "Sammle mindestens 10 Gesten pro Klasse, um detaillierte Testergebnisse zu sehen.",

    // Errors
    errorClassExists: 'Eine Klasse mit dem Namen "{name}" existiert bereits.',
    errorInsufficientData:
      "Unzureichende Daten für das Training. Bitte füge mindestens 2 Klassen mit jeweils mindestens 2 Gesten-Aufnahmen hinzu.",
    errorTraining: "Training fehlgeschlagen: {message}",
    errorTooManyClasses: "Maximal 5 Gesten-Klassen erlaubt.",

    tooltip: {
      helpMain: "Was ist Gesten-Klassifizierung?",
      helpConnection: "Wie verbinde ich meine senseBox?",
      helpClasses: "Über Gesten-Klassen",
      helpTraining: "Wie funktioniert das Training?",
      moreClasses: "Füge mindestens 2 Klassen hinzu, um zu trainieren",
      moreSamples:
        "Füge jeder Klasse mindestens 2 Aufnahmen hinzu, um zu trainieren",
      browserCompatible:
        "Dieser Browser unterstützt die erforderlichen Funktionen nicht. Bitte verwende Chrome oder Edge.",
      startConnection:
        "Verbinde zuerst deine senseBox, um Gesten aufzuzeichnen",
    },
  },

  errors: {
    downloadFirmware: "Magic Wand Firmware herunterladen",
    connectionFailed: "Verbindung zur senseBox fehlgeschlagen",
    deviceDisconnected: "senseBox unerwartet getrennt",
    dataTimeout:
      "Keine Gestendaten empfangen - überprüfe deine senseBox-Firmware",
  },
};
