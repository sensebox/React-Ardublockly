// src/components/Pages/TeachableSensebox/orientation/translations/en.js
export const orientationTranslations_en = {
  title: "Orientation Classification",
  description:
    "Train your own orientation recognition model using the senseBox Eye accelerometer. Each sample is a single snapshot of x, y, z values.",
  training: {
    title: "Training Data",
    connectSenseBox: "Connect senseBox Eye",
    disconnectSenseBox: "Disconnect senseBox Eye",
    connecting: "Connecting...",
    connected: "Connected",
    disconnected: "Disconnected",
    samples: "samples",
    record: "Record",
    recordingCountdown: "Recording in {seconds}s...",
    recorded: "Recorded",
    addClass: "Add Class",
    trainModel: "Train Model",
    trainingInProgress: "Training...",
    livePredictions: "Live Classification",
    connectForPredictions: "Please connect the senseBox Eye.",
    analyzing: "Analyzing...",
    addNewClass: "Add New Class",
    className: "Class Name",
    cancel: "Cancel",
    add: "Add",
    errorClassExists: 'A class with the name "{name}" already exists.',
    errorInsufficientData:
      "Insufficient data for training. Please add at least 2 classes with at least 2 samples each.",
    errorConnection:
      "Error connecting to senseBox Eye: {message}. Please make sure your device is connected.",
    errorTraining: "Training failed: {message}",
    testResultsTitle: "Test",
    finalAccuracy: "Accuracy",
    noDataYet: "Complete training to see results",
    needMoreSamples: "Collect at least 5 samples per class for best results.",
    liveAccelerometer: "Live Accelerometer",
    axisX: "X",
    axisY: "Y",
    axisZ: "Z",
    tooltip: {
      helpMain: "What is Orientation Classification?",
      browserCompatible:
        "This browser does not support the required features for connecting to the senseBox Eye. Please use a compatible browser like Chrome or Edge.",
      helpClasses: "Help with classes",
      startConnection: "Connect to the senseBox Eye to start recording samples",
      helpRecord: "Help with recording samples",
      moreClasses: "Add at least 2 classes to train",
      moreSamples: "Add at least 2 samples per class to train",
      helpTraining: "Help with model training",
      helpAddClass: "Help with adding classes",
      helpDecisionTree: "What is a decision tree?",
      helpNeuralNetwork: "What is a neural network?",
      helpModelDesign: "How is a neural network structured?",
    },
  },
  neuralNetwork: {
    tabLabel: "Neural Network",
    title: "Neural Network",
    accuracy: "Validation Accuracy",
    training: "Training…",
    inputs: "Inputs",
    outputs: "Outputs",
    layers: "Layers",
    neurons: "{count} Neurons",
    placeholder:
      "Define at least 2 classes and collect at least one sample for each class.",
  },
  decisionTree: {
    tabLabel: "Decision Tree",
    title: "Decision Tree",
    placeholder:
      "Define at least 2 classes and collect at least one sample for each class.",
    internalNode: "{feature} ≤ {threshold}",
    leafNode: "{prediction}",
    samplesLabel: "{count} samples",
    depth: "Depth",
    yes: "Yes",
    no: "No",
    samplesLabel: "{count} samples",
  },
  errors: {
    browserNotSupported: "Browser Not Supported",
    browserNotSupportedMessage:
      "Your browser does not support the Web Serial API required for senseBox Eye connection.",
    browserNotSupportedDetails:
      "The Web Serial API is currently supported in Chrome 89+, Edge 89+, and Opera 76+ on desktop platforms.",
    permissionDenied: "Permission Denied",
    permissionDeniedMessage:
      "Serial port access was denied. Please grant permission to connect to your senseBox Eye.",
    connectionFailed: "Connection Failed",
    connectionFailedMessage:
      "Connection to senseBox Eye could not be established.",
    connectionFailedDetails:
      "Please check that your device is properly connected and the correct port is selected.",
    deviceDisconnected: "Device Disconnected",
    deviceDisconnectedMessage: "The senseBox Eye was disconnected.",
    deviceDisconnectedDetails: "Please reconnect your device and try again.",
    downloadFirmware: "Download Accelerometer Sketch",
    tryAgain: "Try Again",
    reconnect: "Reconnect",
    troubleshootingUsb: "Ensure the senseBox Eye is connected via USB",
    troubleshootingFirmware:
      "Verify the senseBox Eye is running the firmware to stream accelerometer data.",
    dataTimeout: "No Data Received",
    dataTimeoutMessage:
      "The senseBox Eye appears to be connected but is not sending any data. Please verify that the correct firmware is running on the device.",
  },
  help: {
    help: "Help",
    pageTitle: {
      title: "Orientation Classification",
    },
    connection: {
      title: "Connect senseBox Eye",
    },
    addClass: {
      title: "Add Class",
    },
    recordSample: {
      title: "Record Sample",
    },
    trainModel: {
      title: "Train Model",
    },
    decisionTree: {
      title: "Decision Tree",
    },
    modelDesign: {
      title: "Structure of a Neural Network",
    },
  },
};
