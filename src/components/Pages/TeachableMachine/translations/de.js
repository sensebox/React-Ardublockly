// src/components/Pages/TeachableMachine/translations/de.js
export const teachableMachineTranslations_de = {
  title: "Teachable senseBox",
  description:
    "Trainiere dein eigenes Modell zur Klassizierung von Bildern und lade es auf die senseBox Eye.",
  training: {
    title: "Modell Training",
    stopWebcam: "Webcam stoppen",
    startWebcam: "Webcam starten",
    stopSenseBoxCamera: "senseBox Eye Kamera stoppen",
    startSenseBoxCamera: "senseBox Eye Kamera starten",
    loadingCamera: "Lade Kamera...",
    initializingCamera: "Initialisiere Kamera...",
    samples: "Bilder",
    holdToCapture: "Halten zum Aufnehmen",
    addClass: "Klasse hinzufügen",
    trainModel: "Modell trainieren",
    trainingEpoch: "Training: Epoche {epoch}/{totalEpochs}",
    trainingInProgress: "Training läuft...",
    livePredictions: "Live Klassifizierung",
    startCameraForPredictions: "Bitte starte die Kamera.",
    analyzing: "Analysiere...",
    addNewClass: "Neue Klasse hinzufügen",
    className: "Klassenname",
    cancel: "Abbrechen",
    add: "Hinzufügen",
    errorClassExists: 'Eine Klasse mit dem Namen "{name}" existiert bereits.',
    errorInsufficientData:
      "Unzureichende Daten für das Training. Bitte füge mindestens 2 Klassen mit mindestens 2 Bildern hinzu.",
    errorCameraAccess:
      "Fehler beim Zugriff auf die Kamera: {message}. Bitte stelle sicher, dass du die Kamera-Berechtigungen erteilt hast.",
    errorCameraSwitch: "Fehler beim Wechseln der Kamera: {message}",
    errorTraining: "Training fehlgeschlagen: {message}",
    resultsTitle: "Trainingsdetails",
    metricsChart: "Trainingsverlauf",
    testResultsTitle: "Testergebnis",
    finalAccuracy: "Genauigkeit",
    noDataYet: "Training abschließen um Ergebnisse zu sehen",
    needMoreImages:
      "Sammle mindestens 10 Bilder pro Klasse, um Testergebnisse zu ermitteln.",
    trainingAccuracy: "Trainings-Genauigkeit",
    validationAccuracy: "Validierungs-Genauigkeit",
    trainingLoss: "Trainings-Loss",
    validationLoss: "Validierungs-Loss",
    loss: "Loss",
    accuracy: "Genauigkeit",
    epoch: "Epoche",
    predicted: "Vorhergesagt",
    actual: "Tatsächlich",
    noTestResultsData: "Keine Konfusionsmatrix-Daten",
    tooltipActual: "Tatsächlich",
    tooltipPredicted: "Vorhergesagt",
    tooltipCount: "Anzahl",
  },
  integration: {
    title: "Ausführen auf der senseBox Eye",
    description:
      "Um dein trainiertes Modell auf der senseBox Eye auszuführen muss es erst in ein Arduino-kompatibles Format konvertiert werden. Nach der Konvertierung kannst du das Modell als cpp-Datei herunterladen, um es in Blockly oder der Arduino IDE zu nutzen. Alternativ kannst du es in einen vorgefertigten Sketch einfügen, kompilieren lassen und die fertige .bin-Datei auf die senseBox Eye kopieren.",
    converting: "Konvertiere...",
    convertModel: "Modell konvertieren",
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
      "Integriere das Modell in einen vorgefertigten Sketch. Dieser zeigt dir das Kamerabild und die Vorhersage auf dem OLED-Display an. Das Kompilieren des Sketches wird einige Zeit in Anspruch nehmen. Sobald du ihn heruntergeladen hast, kannst du ihn direkt per Drag-and-Drop auf deine senseBox Eye hochladen.",
    compiling: "Kompiliere...",
    compileAndDownload: "Kompilieren & Herunterladen",
    downloadBinaryAgain: "Erneut herunterladen",
    reconvertModel: "Erneut konvertieren",
    successBinaryDownloaded: "Erfolgreich heruntergeladen!",
    successBinaryDescription:
      "Dein Modell wurde kompiliert und heruntergeladen! Die Binärdatei ist bereit zum Hochladen auf deine senseBox Eye per Drag-and-Drop.",
  },
  errors: {
    browserNotSupported: "Browser nicht unterstützt",
    browserNotSupportedMessage:
      "Dein Browser unterstützt die Web Serial API nicht, die für die Verbindung zur senseBox Eye Kamera erforderlich ist.",
    browserNotSupportedDetails:
      "Die Web Serial API wird derzeit in Chrome 89+, Edge 89+ und Opera 76+ auf Desktop-Plattformen unterstützt.",
    permissionDenied: "Berechtigung verweigert",
    permissionDeniedMessage:
      "Der Zugriff auf den seriellen Port wurde verweigert. Bitte erteile die Berechtigung, um dich mit deiner senseBox Eye Kamera zu verbinden.",
    permissionDeniedDetails:
      "Du musst möglicherweise deine Browser-Einstellungen überprüfen oder erneut versuchen, dich zu verbinden.",
    connectionFailed: "Verbindung fehlgeschlagen",
    connectionFailedMessage:
      "Die Verbindung zur senseBox Eye konnte nicht hergestellt werden.",
    connectionFailedDetails:
      "Bitte überprüfe, ob dein Gerät richtig angeschlossen ist und der richtige Port ausgewählt wurde. Du kannst den benötigten Sketch herunterladen und per Drag-and-Drop auf deine senseBox Eye kopieren.",
    deviceDisconnected: "Gerät getrennt",
    deviceDisconnectedMessage: "Die senseBox Eye Kamera wurde getrennt.",
    deviceDisconnectedDetails:
      "Bitte verbinde dein Gerät erneut und versuche es noch einmal.",
    frameTimeout: "Frame-Timeout",
    frameTimeoutMessage:
      "Innerhalb der erwarteten Zeit wurden keine Frames von der senseBox Eye Kamera empfangen.",
    frameTimeoutDetails:
      "Das Gerät ist möglicherweise beschäftigt oder hat Kommunikationsprobleme. Das System wartet weiter auf Frames.",
    frameCorrupted: "Beschädigter Frame",
    frameCorruptedMessage:
      "Ein beschädigter Frame wurde von der senseBox Eye Kamera empfangen.",
    frameCorruptedDetails:
      "Dies kann aufgrund von Übertragungsfehlern auftreten. Das System verarbeitet weiterhin nachfolgende Frames.",
    frameDecodingError: "Frame-Dekodierungsfehler",
    frameDecodingErrorMessage:
      "Fehler beim Dekodieren der Frame-Daten von der senseBox Eye Kamera.",
    frameDecodingErrorDetails:
      "Das Frame-Format ist möglicherweise ungültig oder beschädigt. Das System verarbeitet weiterhin nachfolgende Frames.",
    communicationError: "Kommunikationsfehler",
    communicationErrorMessage:
      "Beim Lesen von Daten von der senseBox Eye Kamera ist ein Fehler aufgetreten.",
    communicationErrorDetails:
      "Die Verbindung wurde möglicherweise unterbrochen. Bitte versuche, dich erneut zu verbinden.",
    reconnecting: "Verbinde erneut",
    reconnectingMessage:
      "Versuche, erneut mit der senseBox Eye Kamera zu verbinden...",
    reconnectingDetails:
      "Bitte warte oder klicke auf die Schaltfläche unten, um einen Port manuell auszuwählen.",
    unknownError: "Unbekannter Fehler",
    unknownErrorMessage:
      "Ein unerwarteter Fehler ist mit der senseBox Eye Kamera aufgetreten.",
    unknownErrorDetails: "Keine weiteren Details verfügbar.",
    connected: "Verbunden",
    connecting: "Verbinde...",
    error: "Fehler",
    disconnected: "Getrennt",
    showDetails: "Details anzeigen",
    hideDetails: "Details ausblenden",
    troubleshooting: "Fehlerbehebung:",
    troubleshootingUsb:
      "Stelle sicher, dass die senseBox Eye per USB verbunden ist",
    troubleshootingPort:
      "Überprüfe, ob der richtige serielle Port ausgewählt wurde",
    troubleshootingFirmware:
      "Stelle sicher, dass auf der senseBox Eye der Sketch zum Streamen von Kamerabildern läuft. Du kannst ihn mit dem Button unten herunterladen.",
    troubleshootingReconnect:
      "Versuche, das Gerät aus- und wieder einzustecken",
    supportedBrowsers: "Unterstützte Browser:",
    supportedBrowsersNote:
      "Hinweis: Die Web Serial API wird auf mobilen Browsern oder in Firefox/Safari nicht unterstützt.",
    howToGrantPermission: "So erteilst du die Berechtigung:",
    permissionStep1:
      "Klicke auf das Schloss-Symbol in der Adressleiste deines Browsers",
    permissionStep2: 'Finde "Serielle Ports" in der Berechtigungsliste',
    permissionStep3: 'Ändere die Einstellung auf "Zulassen"',
    permissionStep4:
      "Aktualisiere die Seite und versuche erneut, dich zu verbinden",
    downloadFirmware: "Sketch herunterladen",
    compilingFirmware: "Kompiliere...",
    tryAgain: "Erneut versuchen",
    reconnect: "Erneut verbinden",
    downloadChrome: "Chrome herunterladen",
    serialCameraStatus: "Serieller Kamera-Status:",
    waitingForFrames:
      "Warte auf Frames von der senseBox Eye Kamera... Falls dies andauert, überprüfe die Geräteverbindung.",
  },
};
