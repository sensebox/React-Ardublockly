// src/components/Pages/TeachableSensebox/orientation/translations/de.js
export const orientationTranslations_de = {
  title: "Orientierungsklassifizierung",
  description:
    "Trainiere dein eigenes Modell zur Erkennung von Orientierungen mit dem senseBox Eye Beschleunigungssensor. Jede Aufnahme ist ein einzelner Messwert für x, y und z.",
  modelVisualizer: {
    title: "Entscheidungsbaum",
    placeholder:
      "Trainiere ein Modell, um den Entscheidungsbaum hier zu sehen.",
    placeholderSub:
      "Nach dem Training wird der Entscheidungsbaum als schreibgeschütztes Diagramm angezeigt.",
    internalNode: "{feature} ≤ {threshold}",
    leafNode: "{prediction}",
    samplesLabel: "{count} Aufnahmen",
    depth: "Tiefe",
  },
  training: {
    title: "Trainingsdaten",
    connectSenseBox: "senseBox Eye verbinden",
    disconnectSenseBox: "senseBox Eye trennen",
    connecting: "Verbinde...",
    connected: "Verbunden",
    disconnected: "Getrennt",
    samples: "Aufnahmen",
    record: "Aufnehmen",
    recordingCountdown: "Aufnahme in {seconds}s...",
    recorded: "Aufgenommen",
    addClass: "Klasse hinzufügen",
    trainModel: "Modell trainieren",
    trainingInProgress: "Trainiere...",
    livePredictions: "Live Klassifizierung",
    connectForPredictions: "Bitte verbinde die senseBox Eye.",
    analyzing: "Analysiere...",
    addNewClass: "Neue Klasse hinzufügen",
    className: "Klassenname",
    cancel: "Abbrechen",
    add: "Hinzufügen",
    errorClassExists: 'Eine Klasse mit dem Namen "{name}" existiert bereits.',
    errorInsufficientData:
      "Unzureichende Daten für das Training. Bitte füge mindestens 2 Klassen mit mindestens 2 Aufnahmen hinzu.",
    errorConnection:
      "Fehler beim Verbinden mit der senseBox Eye: {message}. Bitte stelle sicher, dass dein Gerät verbunden ist.",
    errorTraining: "Training fehlgeschlagen: {message}",
    testResultsTitle: "Testergebnis",
    finalAccuracy: "Genauigkeit",
    noDataYet: "Training abschließen um Ergebnisse zu sehen",
    needMoreSamples:
      "Sammle mindestens 5 Aufnahmen pro Klasse für beste Ergebnisse.",
    liveAccelerometer: "Live Beschleunigungssensor",
    axisX: "X",
    axisY: "Y",
    axisZ: "Z",
    tooltip: {
      helpMain: "Was ist Orientierungsklassifizierung?",
      browserCompatible:
        "Dieser Browser unterstützt die benötigten Funktionen für die Verbindung mit der senseBox Eye nicht. Bitte verwende einen kompatiblen Browser wie Chrome oder Edge.",
      helpClasses: "Hilfe zu Klassen",
      startConnection: "Verbinde die senseBox Eye, um Aufnahmen zu starten",
      helpRecord: "Hilfe zur Aufnahme",
      moreClasses: "Füge mindestens 2 Klassen hinzu, um zu trainieren",
      moreSamples:
        "Füge mindestens 2 Aufnahmen pro Klasse hinzu, um zu trainieren",
      helpTraining: "Hilfe zum Modelltraining",
      helpAddClass: "Hilfe zum Hinzufügen von Klassen",
      helpDecisionTree: "Hilfe zum Entscheidungsbaum",
    },
  },
  errors: {
    browserNotSupported: "Browser nicht unterstützt",
    browserNotSupportedMessage:
      "Dein Browser unterstützt die Web Serial API nicht, die für die Verbindung mit der senseBox Eye benötigt wird.",
    browserNotSupportedDetails:
      "Die Web Serial API wird derzeit in Chrome 89+, Edge 89+ und Opera 76+ auf Desktop-Plattformen unterstützt.",
    permissionDenied: "Zugriff verweigert",
    permissionDeniedMessage:
      "Der Zugriff auf den seriellen Port wurde verweigert. Bitte erlaube den Zugriff, um die senseBox Eye zu verbinden.",
    connectionFailed: "Verbindung fehlgeschlagen",
    connectionFailedMessage:
      "Die Verbindung zur senseBox Eye konnte nicht hergestellt werden.",
    connectionFailedDetails:
      "Bitte überprüfe, ob dein Gerät korrekt angeschlossen ist und der richtige Port ausgewählt wurde.",
    deviceDisconnected: "Gerät getrennt",
    deviceDisconnectedMessage: "Die senseBox Eye wurde getrennt.",
    deviceDisconnectedDetails:
      "Bitte verbinde dein Gerät erneut und versuche es nochmals.",
    downloadFirmware: "Beschleunigungssensor-Sketch herunterladen",
    tryAgain: "Erneut versuchen",
    reconnect: "Erneut verbinden",
    troubleshootingUsb:
      "Stelle sicher, dass die senseBox Eye per USB verbunden ist",
    troubleshootingFirmware:
      "Überprüfe, ob die senseBox Eye die Firmware zum Streamen der Beschleunigungsdaten ausführt.",
    dataTimeout: "Keine Daten empfangen",
    dataTimeoutMessage:
      "Die senseBox Eye scheint verbunden zu sein, sendet aber keine Daten. Bitte überprüfe, ob die richtige Firmware auf dem Gerät läuft.",
  },
  help: {
    help: "Hilfe",
    pageTitle: {
      title: "Orientierungsklassifizierung",
    },
    connection: {
      title: "senseBox Eye verbinden",
    },
    addClass: {
      title: "Klasse hinzufügen",
    },
    recordSample: {
      title: "Aufnahme",
    },
    trainModel: {
      title: "Modell trainieren",
    },
    decisionTree: {
      title: "Entscheidungsbaum",
    },
  },
};
