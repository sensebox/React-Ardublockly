import { help } from "@uiw/react-md-editor";

export const spellTranslations_en = {
  title: "Spell Classification",
  description:
    "Train a model to recognize spells using senseBox acceleration data. Draw patterns in the air with your senseBox to cast spells.",

  training: {
    title: "Training",
    samples: "samples",
    addClass: "Add Spell",
    addNewClass: "Add New Spell",
    className: "Spell Name",
    cancel: "Cancel",
    add: "Add",

    // Connection
    connecting: "Connecting...",
    connectSenseBox: "connect senseBox Eye (serial)",
    disconnectSenseBox: "disconnect senseBox Eye (serial)",
    connectBLE: "connect senseBox Eye (Bluetooth)",
    downloadFirmware: "Download Spell-Sketch",

    // Recording
    startRecording: "Start Recording",
    stopRecording: "Stop Recording",

    // Status
    waitingForSpell: "Waiting for spell...",
    drawing: "Casting...",
    spellComplete: "Spell complete!",

    // Predictions
    livePrediction: "Live Prediction",
    analyzing: "Analyzing spell...",

    // Training progress
    trainingInProgress: "Training in progress...",
    trainingEpoch: "Training: epoch {epoch}/{totalEpochs}",
    trainModel: "Train Model",

    // Results
    resultsTitle: "Training Results",
    metricsChart: "Training Progress",
    testResultsTitle: "Test Results",
    finalAccuracy: "Accuracy",
    needMoreSpells:
      "Collect at least 10 recordings per spell to see detailed test results.",

    // Errors
    errorClassExists: 'A spell with the name "{name}" already exists.',
    errorInsufficientData:
      "Insufficient data for training. Please add at least 2 spells with at least 2 recordings each.",
    errorTraining: "Training failed: {message}",
    errorTooManyClasses: "Maximum of 5 spell classes allowed.",

    tooltip: {
      helpMain: "What is spell classification?",
      helpConnection: "How to connect your senseBox",
      helpClasses: "How to define a spell",
      helpTraining: "How training works",
      moreClasses: "Add at least 2 spells to train",
      moreSamples: "Add at least 2 recordings per spell to train",
      browserCompatible:
        "This browser does not support the required features for connecting to the senseBox. Please use Chrome or Edge.",
      startConnection: "Connect your senseBox first to record spells",
      classNameExists: "A spell with this name already exists",
    },
  },

  network: {
    title: "Inside of the Model",
    tooltip: {
      helpCNN: "What is a convolutional neural network?",
    },
  },

  errors: {
    downloadFirmware: "Download Spell-Sketch",
    connectionFailed: "Connection Failed",
    connectionFailedMessage:
      "Connection to senseBox Eye could not be established.",
    troubleshootingFirmware:
      "Check if the senseBox Eye is running the sketch for streaming spells.",
    deviceDisconnected: "senseBox disconnected unexpectedly",
    dataTimeout: "No spell data received",
  },

  help: {
    help: "Help",
    spellClassification: {
      title: "Spell Classification",
    },
    addClass: {
      title: "Defining a Spell",
    },
    spellCasting: {
      title: "Recording a Spell",
    },
    trainModel: {
      title: "Model Training",
    },
    cnn: {
      title: "Convolutional Neural Network",
    },
  },
};
