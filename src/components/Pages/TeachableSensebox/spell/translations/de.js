export const accelerationTranslations_de = {
  title: "Zauberspruch Klassifizierung",
  description:
    "Trainiere ein Modell zur Erkennung von Zaubersprüchen mit Daten vom Beschleunigungssensor. Zeichne mit deiner senseBox Eye Muster in die Luft, um Zaubersprüche zu erstellen.",

  training: {
    title: "Training",
    samples: "Aufnahmen",
    addClass: "Zauberspruch hinzufügen",
    addNewClass: "Neuen Zauberspruch hinzufügen",
    className: "Zauberspruchname",
    cancel: "Abbrechen",
    add: "Hinzufügen",

    // Connection
    connecting: "Verbinde...",
    connectSenseBox: "senseBox Eye verbinden (seriell)",
    disconnectSenseBox: "senseBox Eye trennen",
    connectBLE: "senseBox Eye verbinden (Bluetooth)",
    downloadFirmware: "Zauberspruch-Sketch herunterladen",

    // Recording
    startRecording: "Aufnahme starten",
    stopRecording: "Aufnahme stoppen",

    // Status
    waitingForSpell: "Warte auf Zauberspruch...",
    drawing: "Zeichne...",
    spellComplete: "Zauberspruch fertig!",

    // Predictions
    livePrediction: "Live-Vorhersage",
    analyzing: "Analysiere Zauberspruch...",

    // Training progress
    trainingInProgress: "Training läuft...",
    trainingEpoch: "Training: Epoche {epoch}/{totalEpochs}",
    trainModel: "Modell trainieren",

    // Results
    resultsTitle: "Trainingsergebnisse",
    metricsChart: "Trainingsfortschritt",
    testResultsTitle: "Testergebnisse",
    finalAccuracy: "Genauigkeit",
    needMoreSpells:
      "Sammle mindestens 10 Zaubersprüche pro Klasse, um detaillierte Testergebnisse zu sehen.",

    // Errors
    errorClassExists: 'Eine Klasse mit dem Namen "{name}" existiert bereits.',
    errorInsufficientData:
      "Unzureichende Daten für das Training. Bitte füge mindestens 2 Zaubersprüche mit jeweils mindestens 2 Aufnahmen hinzu.",
    errorTraining: "Training fehlgeschlagen: {message}",
    errorTooManyClasses: "Maximal 5 Zaubersprüche erlaubt.",

    tooltip: {
      helpMain: "Was ist Gesten-Klassifizierung?",
      helpConnection: "Wie verbinde ich meine senseBox?",
      helpClasses: "Über Zaubersprüche",
      helpTraining: "Wie funktioniert das Training?",
      moreClasses: "Füge mindestens 2 Zaubersprüche hinzu, um zu trainieren",
      moreSamples:
        "Füge jedem Zauberspruch mindestens 2 Aufnahmen hinzu, um zu trainieren",
      browserCompatible:
        "Dieser Browser unterstützt die erforderlichen Funktionen nicht. Bitte verwende Chrome oder Edge.",
      startConnection:
        "Verbinde zuerst deine senseBox, um Zaubersprüche aufzuzeichnen",
    },
  },

  errors: {
    downloadFirmware: "Zauberspruch-Sketch herunterladen",
    connectionFailed: "Verbindung zur senseBox fehlgeschlagen",
    deviceDisconnected: "senseBox unerwartet getrennt",
    dataTimeout:
      "Keinen Zauberspruch empfangen - überprüfe deine senseBox-Firmware",
  },
};
