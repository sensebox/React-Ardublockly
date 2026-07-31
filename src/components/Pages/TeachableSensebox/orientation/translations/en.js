import { help } from "@uiw/react-md-editor";

// src/components/Pages/TeachableSensebox/orientation/translations/en.js
export const orientationTranslations_en = {
  title: "Orientation Recognition",
  description:
    "Train your own orientation recognition model using the senseBox MCU Eye accelerometer. Each sample is a single snapshot of x, y, z values.",
  training: {
    title: "Training Data",
    connectSenseBox: "Connect senseBox MCU Eye (USB)",
    disconnectSenseBox: "Disconnect senseBox MCU Eye",
    connectSenseBoxBLE: "Connect senseBox MCU Eye (Bluetooth)",
    disconnectSenseBoxBLE: "Disconnect Bluetooth",
    connecting: "Connecting...",
    connected: "Connected",
    disconnected: "Disconnected",
    samples: "samples",
    record: "Record",
    recordingCountdown: "Recording in {seconds}s...",
    recorded: "Recorded",
    addClass: "Add Orientation",
    trainModel: "Train Model",
    trainingInProgress: "Training...",
    livePredictions: "Live Recognition",
    connectForPredictions: "Please connect the senseBox MCU Eye.",
    analyzing: "Analyzing...",
    addNewClass: "Add New Orientation",
    className: "Orientation Name",
    cancel: "Cancel",
    add: "Add",
    loadDataset: "Load Example Dataset",
    errorTooManyClasses:
      "Loading this dataset would exceed the limit of 5 orientations. Please remove some orientations first.",
    errorClassExists: 'An orientation with the name "{name}" already exists.',
    errorInsufficientData:
      "Insufficient data for training. Please add at least 2 orientations with at least 2 samples each.",
    errorConnection:
      "Error connecting to senseBox MCU Eye: {message}. Please make sure your device is connected.",
    errorTraining: "Training failed: {message}",
    testResultsTitle: "Test",
    finalAccuracy: "Accuracy",
    noDataYet: "Complete training to see results",
    needMoreSamples:
      "Collect at least 5 samples per orientation for best results.",
    liveAccelerometer: "Live Accelerometer",
    axisX: "X",
    axisY: "Y",
    axisZ: "Z",
    tooltip: {
      helpMain: "What is Orientation Recognition?",
      browserCompatible:
        "This browser does not support the required features for connecting to the senseBox MCU Eye. Please use a compatible browser like Chrome or Edge.",
      bluetoothNotSupported:
        "This browser does not support Web Bluetooth. Please use Chrome or Edge.",
      helpClasses: "Help with orientations",
      startConnection:
        "Connect to the senseBox MCU Eye to start recording samples",
      helpRecord: "Help with recording samples",
      moreClasses: "Add at least 2 orientations to train",
      moreSamples: "Add at least 2 samples per orientation to train",
      helpAddClass: "Help with adding orientations",
      helpDecisionTree: "What is a decision tree?",
      helpNeuralNetwork: "What is a neural network?",
      helpModelDesign: "How is a neural network structured?",
      helpAccelerationSensor: "How do I record an orientation?",
      classNameExists: "An orientation with this name already exists",
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
      "Define at least 2 orientations and collect at least one sample for each orientation.",
  },
  decisionTree: {
    tabLabel: "Decision Tree",
    title: "Decision Tree",
    placeholder:
      "Define at least 2 orientations and collect at least one sample for each orientation.",
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
      "Your browser does not support the Web Serial API required for senseBox MCU Eye connection.",
    browserNotSupportedDetails:
      "The Web Serial API is currently supported in Chrome 89+, Edge 89+, and Opera 76+ on desktop platforms.",
    permissionDenied: "Permission Denied",
    permissionDeniedMessage:
      "Serial port access was denied. Please grant permission to connect to your senseBox MCU Eye.",
    connectionFailed: "Connection Failed",
    connectionFailedMessage:
      "Connection to senseBox MCU Eye could not be established.",
    connectionFailedDetails:
      "Please check that your device is properly connected and the correct port is selected.",
    deviceDisconnected: "Device Disconnected",
    deviceDisconnectedMessage: "The senseBox MCU Eye was disconnected.",
    deviceDisconnectedDetails: "Please reconnect your device and try again.",
    downloadFirmware: "Download Accelerometer Sketch",
    tryAgain: "Try Again",
    reconnect: "Reconnect",
    troubleshootingUsb: "Ensure the senseBox MCU Eye is connected via USB",
    troubleshootingFirmware:
      "Verify the senseBox MCU Eye is running the sketch to stream accelerometer data.",
    dataTimeout: "No Data Received",
    dataTimeoutMessage:
      "The senseBox MCU Eye appears to be connected but is not sending any data. Please verify that the correct sketch is running on the device.",
  },
  help: {
    help: "Help",
    orientationClassification: {
      title: "Orientation Recognition",
    },
    addClass: {
      title: "Add Orientation",
    },
    decisionTree: {
      title: "Decision Tree",
    },
    neuralNetwork: {
      title: "Neural Network",
    },
    modelDesign: {
      title: "Structure of a Neural Network",
    },
    accelerationSensor: {
      title: "Recording an orientation",
    },
  },
};
