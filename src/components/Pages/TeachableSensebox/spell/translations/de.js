export const spellTranslations_de = {
  title: "Zaubersprüche Erkennen",
  description:
    "Trainiere ein Modell zur Erkennung von Zaubersprüchen mit Hilfe des Beschleunigungssensor. Zeichne mit deiner senseBox MCU Eye Muster in die Luft, um Zaubersprüche zu erstellen.",

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
    connectSenseBox: "senseBox MCU Eye verbinden (USB)",
    disconnectSenseBox: "senseBox MCU Eye trennen",
    connectBLE: "senseBox MCU Eye verbinden (Bluetooth)",
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
      helpMain: "Was ist Zauberspruch-Erkennung?",
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
      classNameExists: "Ein Zauberspruch mit diesem Namen existiert bereits",
      desirableNumberSamples:
        "Empfehlung: Mindestens 8 Aufnahmen pro Zauberspruch",
    },
  },

  network: {
    title: "Im Innern des Modells",
    tooltip: {
      helpCNN: "Was ist ein Convolutional Neural Network?",
    },
  },

  integration: {
    title: "Ausführen auf der senseBox MCU Eye",
    converting: "Kompiliere & konvertiere...",
    convertModel: "Modell komprimieren & konvertieren",
    retry: "Erneut versuchen",
    suggestions: "Vorschläge:",
    modelConvertedSuccess: "Modell erfolgreich konvertiert",
    chooseOptions: "Wähle eine der folgenden Optionen:",
    optionA: "Option A: Modell herunterladen",
    optionADescription:
      "Lade das Modell als einzelne cpp-Datei herunter zur Verwendung in der Arduino IDE oder zum späteren Hochladen in die Blockly UI.",
    downloadCppFile: "Modell herunterladen",
    optionB: "Option B: Modell in vorgefertigten Sketch integrieren",
    optionBDescription:
      "Integriere das Modell in einen vorgefertigten Sketch. Dieser zeigt dir die Zauberspruch-Vorhersage und das Vertrauen auf dem OLED-Display an. Das Kompilieren des Sketches wird einige Zeit in Anspruch nehmen. Sobald du ihn heruntergeladen hast, kannst du ihn direkt per Drag-and-Drop auf deine senseBox MCU Eye hochladen.",
    compiling: "Kompiliere...",
    compileAndDownload: "Kompilieren & Herunterladen",
    downloadBinaryAgain: "Erneut herunterladen",
    reconvertModel: "Erneut konvertieren",
    successBinaryDownloaded: "Erfolgreich heruntergeladen!",
    successBinaryDescription:
      "Dein Modell wurde kompiliert und heruntergeladen! Die Binärdatei ist bereit zum Hochladen auf deine senseBox MCU Eye per Drag-and-Drop.",
  },

  errors: {
    downloadFirmware: "Zauberspruch-Sketch herunterladen",
    connectionFailed: "Verbindung fehlgeschlagen",
    connectionFailedMessage:
      "Die Verbindung zur senseBox MCU Eye konnte nicht hergestellt werden.",
    troubleshootingFirmware:
      "Überprüfe, ob die senseBox MCU Eye den Sketch zum Streamen der Zaubersprüche ausführt.",
    deviceDisconnected: "senseBox unerwartet getrennt",
    dataTimeout: "Keinen Zauberspruch empfangen",
  },
  help: {
    help: "Hilfe",
    spellClassification: {
      title: "Zaubersprüche Erkennen",
    },
    addClass: {
      title: "Einen Zauberspruch definieren",
    },
    spellCasting: {
      title: "Zauberspruch aufnehmen",
    },
    trainModel: {
      title: "Modell trainieren",
    },
    cnn: {
      title: "Convolutional Neural Network",
    },
  },
};
