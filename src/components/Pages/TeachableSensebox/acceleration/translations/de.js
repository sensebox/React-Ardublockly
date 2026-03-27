// src/components/Pages/TeachableSensebox/acceleration/translations/de.js
export const accelerationTranslations_de = {
  title: "Bewegungsklassifizierung",
  description:
    "Trainiere dein eigenes Modell zur Klassifikation von Bewegungen mit dem senseBox Eye Beschleunigungssensor.",
  modelDescription:
    "Jede aufgenommene Bewegung wird durch 18 statistische Merkmale beschrieben (Mittelwert, Standardabweichung, RMS, Schiefe, Wölbung, Spektralleistung pro Achse). Ein kompaktes neuronales Netz mit zwei versteckten Schichten à 30 Neuronen lernt, die Bewegungsklassen zu unterscheiden.",
  modelVisualizer: {
    title: "Modell-Architektur",
    inputsLabel: "Eingaben (18 Merkmale)",
    outputsLabel: "Ausgaben",
    hiddenLayerLabel: "Dense {units} \u00b7 {activation}",
    noClassesYet: "Klassen hinzuf\u00fcgen, um Ausgabe-Knoten zu sehen",
    featureGroups: {
      mean: "Mittelwert",
      std: "Standardabw.",
      rms: "Effektivwert",
      skewness: "Schiefe",
      kurtosis: "W\u00f6lbung",
      spectralPower: "Spektralleistung",
    },
  },
  training: {
    title: "Modell Training",
    connectSenseBox: "senseBox Eye verbinden",
    disconnectSenseBox: "senseBox Eye trennen",
    connecting: "Verbinde...",
    connected: "Verbunden",
    disconnected: "Getrennt",
    samples: "Aufnahmen",
    record: "aufnehmen",
    recordingCountdown: "Aufnahme in {seconds}s...",
    recording: "Aufnahme l\u00e4uft...",
    addClass: "Klasse hinzuf\u00fcgen",
    trainModel: "Modell trainieren",
    trainingEpoch: "Training: Epoche {epoch}/{totalEpochs}",
    trainingInProgress: "Training l\u00e4uft...",
    livePredictions: "Live Klassifizierung",
    connectForPredictions: "Bitte verbinde die senseBox Eye.",
    analyzing: "Analysiere...",
    addNewClass: "Neue Klasse hinzuf\u00fcgen",
    className: "Klassenname",
    cancel: "Abbrechen",
    add: "Hinzuf\u00fcgen",
    errorClassExists: 'Eine Klasse mit dem Namen "{name}" existiert bereits.',
    errorInsufficientData:
      "Unzureichende Daten f\u00fcr das Training. Bitte f\u00fcge mindestens 2 Klassen mit mindestens 2 Aufnahmen hinzu.",
    errorConnection:
      "Fehler beim Verbinden mit der senseBox Eye: {message}. Bitte stelle sicher, dass dein Ger\u00e4t verbunden ist.",
    errorTraining: "Training fehlgeschlagen: {message}",
    resultsTitle: "Trainingsdetails",
    metricsChart: "Trainingsverlauf",
    testResultsTitle: "Testergebnis",
    finalAccuracy: "Genauigkeit",
    noDataYet: "Training abschlie\u00dfen um Ergebnisse zu sehen",
    needMoreSamples:
      "Sammle mindestens 10 Aufnahmen pro Klasse, um Testergebnisse zu ermitteln.",
    trainingAccuracy: "Trainings-Genauigkeit",
    validationAccuracy: "Validierungs-Genauigkeit",
    trainingLoss: "Trainings-Loss",
    validationLoss: "Validierungs-Loss",
    loss: "Loss",
    accuracy: "Genauigkeit",
    epoch: "Epoche",
    predicted: "Vorhergesagt",
    actual: "Tats\u00e4chlich",
    noTestResultsData: "Keine Konfusionsmatrix-Daten",
    liveAccelerometer: "Live Beschleunigungssensor",
    axisX: "X",
    axisY: "Y",
    axisZ: "Z",
    gestureDuration: "Aufnahmedauer: {seconds}s",
    tooltip: {
      helpMain: "Was ist Bewegungsklassifizierung?",
      browserCompatible:
        "Dieser Browser unterst\u00fctzt die ben\u00f6tigten Funktionen f\u00fcr die Verbindung mit der senseBox Eye nicht. Bitte verwende einen kompatiblen Browser wie Chrome oder Edge.",
      helpClasses: "Hilfe zu den Klassen",
      startConnection:
        "Verbinde dich mit der senseBox Eye, um mit dem Aufnehmen von Proben zu beginnen",
      helpRecord: "Hilfe zum Aufnehmen von Gesten",
      moreClasses: "F\u00fcge mindestens 2 Klassen hinzu, um zu trainieren",
      moreSamples:
        "F\u00fcge jeder Klasse mindestens 2 Aufnahmen hinzu, um zu trainieren",
      helpTraining: "Hilfe zum Modell-Training",
      helpArchitecture: "Hilfe zur Modell-Architektur",
      helpAddClass: "Hilfe zum Hinzuf\u00fcgen von Klassen",
      helpDeployModel: "Hilfe zum Ausf\u00fchren auf der senseBox Eye",
    },
  },
  integration: {
    title: "Ausf\u00fchren auf der senseBox Eye",
    converting: "Konvertiere...",
    convertModel: "Modell konvertieren",
    retry: "Erneut versuchen",
    suggestions: "Vorschl\u00e4ge:",
    modelConvertedSuccess: "Modell erfolgreich konvertiert",
    chooseOptions: "W\u00e4hle eine der folgenden Optionen:",
    optionA: "Option A: Modell herunterladen",
    optionADescription:
      "Lade das Modell als einzelne cpp-Datei herunter zur Verwendung in der Arduino IDE oder zum sp\u00e4teren Hochladen in die Blockly UI.",
    downloadCppFile: "Modell herunterladen",
    optionB: "Option B: Modell in vorgefertigten Sketch integrieren",
    optionBDescription:
      "Integriere das Modell in einen vorgefertigten Sketch, der den Beschleunigungssensor ausliest und Bewegungen klassifiziert. Sobald heruntergeladen, kann er direkt per Drag-and-Drop auf deine senseBox Eye hochgeladen werden.",
    compiling: "Kompiliere...",
    compileAndDownload: "Kompilieren & Herunterladen",
    downloadBinaryAgain: "Erneut herunterladen",
    reconvertModel: "Erneut konvertieren",
    successBinaryDownloaded: "Erfolgreich heruntergeladen!",
    successBinaryDescription:
      "Dein Modell wurde kompiliert und heruntergeladen! Die Bin\u00e4rdatei ist bereit zum Hochladen auf deine senseBox Eye per Drag-and-Drop.",
  },
  errors: {
    browserNotSupported: "Browser nicht unterst\u00fctzt",
    browserNotSupportedMessage:
      "Dein Browser unterst\u00fctzt die Web Serial API nicht, die f\u00fcr die Verbindung zur senseBox Eye erforderlich ist.",
    browserNotSupportedDetails:
      "Die Web Serial API wird derzeit in Chrome 89+, Edge 89+ und Opera 76+ auf Desktop-Plattformen unterst\u00fctzt.",
    permissionDenied: "Berechtigung verweigert",
    permissionDeniedMessage:
      "Der Zugriff auf den seriellen Port wurde verweigert. Bitte erteile die Berechtigung, um dich mit deiner senseBox Eye zu verbinden.",
    connectionFailed: "Verbindung fehlgeschlagen",
    connectionFailedMessage:
      "Die Verbindung zur senseBox Eye konnte nicht hergestellt werden.",
    connectionFailedDetails:
      "Bitte \u00fcberpr\u00fcfe, ob dein Ger\u00e4t richtig angeschlossen ist und der richtige Port ausgew\u00e4hlt wurde.",
    deviceDisconnected: "Ger\u00e4t getrennt",
    deviceDisconnectedMessage: "Die senseBox Eye wurde getrennt.",
    deviceDisconnectedDetails:
      "Bitte verbinde dein Ger\u00e4t erneut und versuche es noch einmal.",
    downloadFirmware: "Beschleunigungssensor Sketch herunterladen",
    tryAgain: "Erneut versuchen",
    reconnect: "Erneut verbinden",
    troubleshootingUsb:
      "Stelle sicher, dass die senseBox Eye per USB verbunden ist",
    troubleshootingFirmware:
      "Stelle sicher, dass auf der senseBox Eye der Sketch zum Streamen von Beschleunigungsdaten l\u00e4uft.",
    dataTimeout: "Keine Daten empfangen",
    dataTimeoutMessage:
      "Die senseBox Eye scheint verbunden zu sein, sendet aber keine Daten. Bitte \u00fcberpr\u00fcfe, ob der richtige Sketch auf dem Ger\u00e4t l\u00e4uft.",
  },
  help: {
    help: "Hilfe",
    pageTitle: {
      title: "Bewegungsklassifizierung",
    },
    connection: {
      title: "senseBox Eye verbinden",
    },
    addClass: {
      title: "Klasse hinzuf\u00fcgen",
    },
    trainModel: {
      title: "Modell trainieren",
    },
    architecture: {
      title: "Modell-Architektur",
    },
  },
};
