import { help } from "@uiw/react-md-editor";
import OrientationClassification from "../OrientationClassification";

// src/components/Pages/TeachableSensebox/orientation/translations/de.js
export const orientationTranslations_de = {
  title: "Orientierungserkennung",
  description:
    "Trainiere dein eigenes Modell zur Erkennung von Orientierungen mit dem senseBox MCU Eye Beschleunigungssensor. Jede Aufnahme ist ein einzelner Messwert für x, y und z.",
  training: {
    title: "Trainingsdaten",
    connectSenseBox: "senseBox MCU Eye verbinden (USB)",
    disconnectSenseBox: "senseBox MCU Eye trennen",
    connectSenseBoxBLE: "senseBox MCU Eye verbinden (Bluetooth)",
    disconnectSenseBoxBLE: "Bluetooth trennen",
    connecting: "Verbinde...",
    connected: "Verbunden",
    disconnected: "Getrennt",
    samples: "Aufnahmen",
    record: "Aufnehmen",
    recordingCountdown: "Aufnahme in {seconds}s...",
    recorded: "Aufgenommen",
    addClass: "Orientierung hinzufügen",
    trainModel: "Modell trainieren",
    trainingInProgress: "Trainiere...",
    livePredictions: "Live Erkennung",
    connectForPredictions: "Bitte verbinde die senseBox MCU Eye.",
    analyzing: "Analysiere...",
    addNewClass: "Neue Orientierung hinzufügen",
    className: "Name der Orientierung",
    cancel: "Abbrechen",
    add: "Hinzufügen",
    loadDataset: "Beispieldatensatz laden",
    errorTooManyClasses:
      "Das Laden dieses Datensatzes würde das Limit von 5 Orientierungen überschreiten. Bitte entferne zuerst einige Orientierungen.",
    errorClassExists:
      'Eine Orientierung mit dem Namen "{name}" existiert bereits.',
    errorInsufficientData:
      "Unzureichende Daten für das Training. Bitte füge mindestens 2 Orientierungen mit mindestens 2 Aufnahmen hinzu.",
    errorConnection:
      "Fehler beim Verbinden mit der senseBox MCU Eye: {message}. Bitte stelle sicher, dass dein Gerät verbunden ist.",
    errorTraining: "Training fehlgeschlagen: {message}",
    testResultsTitle: "Testergebnis",
    finalAccuracy: "Genauigkeit",
    noDataYet: "Training abschließen um Ergebnisse zu sehen",
    needMoreSamples:
      "Sammle mindestens 5 Aufnahmen pro Orientierung für beste Ergebnisse.",
    liveAccelerometer: "Live Beschleunigungssensor",
    axisX: "X",
    axisY: "Y",
    axisZ: "Z",
    tooltip: {
      helpMain: "Was ist Orientierungserkennung?",
      browserCompatible:
        "Dieser Browser unterstützt die benötigten Funktionen für die Verbindung mit der senseBox MCU Eye nicht. Bitte verwende einen kompatiblen Browser wie Chrome oder Edge.",
      bluetoothNotSupported:
        "Dieser Browser unterstützt kein Web Bluetooth. Bitte verwende Chrome oder Edge.",
      helpClasses: "Hilfe zu Orientierungen",
      startConnection: "Verbinde die senseBox MCU Eye, um Aufnahmen zu starten",
      helpRecord: "Hilfe zur Aufnahme",
      moreClasses: "Füge mindestens 2 Orientierungen hinzu, um zu trainieren",
      moreSamples:
        "Füge mindestens 2 Aufnahmen pro Orientierung hinzu, um zu trainieren",
      helpAddClass: "Hilfe zum Hinzufügen von Orientierungen",
      helpDecisionTree: "Was ist ein Entscheidungsbaum?",
      helpNeuralNetwork: "Was ist ein neuronales Netz?",
      helpModelDesign: "Wie sollte ein neuronales Netz aufgebaut sein?",
      helpAccelerationSensor: "Wie nehme ich eine Orientierung auf?",
      classNameExists: "Eine Orientierung mit diesem Namen existiert bereits",
    },
  },
  neuralNetwork: {
    tabLabel: "Neuronales Netz",
    title: "Neuronales Netz",
    accuracy: "Validierungsgenauigkeit",
    training: "Trainiere…",
    inputs: "Eingabe",
    outputs: "Ergebnis",
    layers: "Schichten",
    neurons: "{count} Neuronen",
    placeholder:
      "Definiere mindestens 2 Orientierungen und sammle mindestens eine Aufnahme für jede Orientierung.",
  },
  decisionTree: {
    tabLabel: "Entscheidungsbaum",
    title: "Entscheidungsbaum",
    placeholder:
      "Definiere mindestens 2 Orientierungen und sammle mindestens eine Aufnahme für jede Orientierung.",
    internalNode: "{feature} ≤ {threshold}",
    leafNode: "{prediction}",
    samplesLabel: "{count} Aufnahmen",
    depth: "Tiefe",
    yes: "Ja",
    no: "Nein",
    samplesLabel: "{count} Aufnahmen",
  },
  errors: {
    browserNotSupported: "Browser nicht unterstützt",
    browserNotSupportedMessage:
      "Dein Browser unterstützt die Web Serial API nicht, die für die Verbindung mit der senseBox MCU Eye benötigt wird.",
    browserNotSupportedDetails:
      "Die Web Serial API wird derzeit in Chrome 89+, Edge 89+ und Opera 76+ auf Desktop-Plattformen unterstützt.",
    permissionDenied: "Zugriff verweigert",
    permissionDeniedMessage:
      "Der Zugriff auf den seriellen Port wurde verweigert. Bitte erlaube den Zugriff, um die senseBox MCU Eye zu verbinden.",
    connectionFailed: "Verbindung fehlgeschlagen",
    connectionFailedMessage:
      "Die Verbindung zur senseBox MCU Eye konnte nicht hergestellt werden.",
    connectionFailedDetails:
      "Bitte überprüfe, ob dein Gerät korrekt angeschlossen ist und der richtige Port ausgewählt wurde.",
    deviceDisconnected: "Gerät getrennt",
    deviceDisconnectedMessage: "Die senseBox MCU Eye wurde getrennt.",
    deviceDisconnectedDetails:
      "Bitte verbinde dein Gerät erneut und versuche es nochmals.",
    downloadFirmware: "Beschleunigungssensor-Sketch herunterladen",
    tryAgain: "Erneut versuchen",
    reconnect: "Erneut verbinden",
    troubleshootingUsb:
      "Stelle sicher, dass die senseBox MCU Eye per USB verbunden ist",
    troubleshootingFirmware:
      "Überprüfe, ob die senseBox MCU Eye den Sketch zum Streamen der Beschleunigungsdaten ausführt.",
    dataTimeout: "Keine Daten empfangen",
    dataTimeoutMessage:
      "Die senseBox MCU Eye scheint verbunden zu sein, sendet aber keine Daten. Bitte überprüfe, ob der richtige Sketch auf dem Gerät läuft.",
  },
  help: {
    help: "Hilfe",
    orientationClassification: {
      title: "Orientierungserkennung",
    },
    addClass: {
      title: "Orientierung hinzufügen",
    },
    neuralNetwork: {
      title: "Neuronales Netz",
    },
    decisionTree: {
      title: "Entscheidungsbaum",
    },
    modelDesign: {
      title: "Aufbau eines neuronalen Netzes",
    },
    accelerationSensor: {
      title: "Eine Orientierung aufnehmen",
    },
  },
};
