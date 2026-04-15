// src/components/Pages/TeachableSensebox/acceleration/translations/en.js
export const accelerationTranslations_en = {
  title: "Gesture Classification",
  description:
    "Train a model to recognize magic wand gestures using senseBox acceleration data. Draw patterns in the air with your senseBox to create gesture classes.",

  training: {
    title: "Gesture Training",
    samples: "samples",
    addClass: "Add Gesture Class",
    addNewClass: "Add New Class",
    className: "Class Name",
    cancel: "Cancel",
    add: "Add",

    // Connection
    connecting: "Connecting...",
    connectSenseBox: "connect senseBox Eye (serial)",
    disconnectSenseBox: "disconnect senseBox Eye (serial)",
    connectBLE: "connect senseBox Eye (Bluetooth)",
    downloadFirmware: "Download Gesture-Sketch",

    // Recording
    startRecording: "Start Recording",
    stopRecording: "Stop Recording",

    // Status
    waitingForGesture: "Waiting for gesture...",
    drawing: "Drawing...",
    gestureComplete: "Gesture complete!",

    // Predictions
    livePrediction: "Live Prediction",
    analyzing: "Analyzing gesture...",

    // Training progress
    trainingInProgress: "Training in progress...",
    trainingEpoch: "Training: epoch {epoch}/{totalEpochs}",
    trainModel: "Train Model",

    // Results
    resultsTitle: "Training Results",
    metricsChart: "Training Progress",
    testResultsTitle: "Test Results",
    finalAccuracy: "Accuracy",
    needMoreGestures:
      "Collect at least 10 gestures per class to see detailed test results.",

    // Errors
    errorClassExists: 'A class with the name "{name}" already exists.',
    errorInsufficientData:
      "Insufficient data for training. Please add at least 2 classes with at least 2 gesture samples each.",
    errorTraining: "Training failed: {message}",
    errorTooManyClasses: "Maximum of 5 gesture classes allowed.",

    tooltip: {
      helpMain: "What is gesture classification?",
      helpConnection: "How to connect your senseBox",
      helpClasses: "About gesture classes",
      helpTraining: "How training works",
      moreClasses: "Add at least 2 classes to train",
      moreSamples: "Add at least 2 samples per class to train",
      browserCompatible:
        "This browser does not support the required features for connecting to the senseBox. Please use Chrome or Edge.",
      startConnection: "Connect your senseBox first to record gestures",
    },
  },

  errors: {
    downloadFirmware: "Download Magic Wand Firmware",
    connectionFailed: "Failed to connect to senseBox",
    deviceDisconnected: "senseBox disconnected unexpectedly",
    dataTimeout: "No gesture data received - check your senseBox firmware",
  },
};
