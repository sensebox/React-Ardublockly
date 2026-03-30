import { Architecture } from "@mui/icons-material";

// src/components/Pages/TeachableSensebox/acceleration/translations/en.js
export const accelerationTranslations_en = {
  title: "Motion Classification",
  description:
    "Train your own motion recognition model using the senseBox Eye accelerometer.",
  modelDescription:
    "Each recorded sample is described by 18 statistical features (mean, standard deviation, RMS, skewness, kurtosis, spectral power per axis). A compact dense neural network with two hidden layers of 30 neurons each learns to distinguish your motion classes.",
  modelVisualizer: {
    title: "Model Architecture",
    inputsLabel: "Inputs (18 features)",
    outputsLabel: "Outputs",
    hiddenLayerLabel: "Dense {units} \u00b7 {activation}",
    noClassesYet: "Add classes to see output nodes",
    featureGroups: {
      mean: "Mean",
      std: "Std Dev",
      rms: "RMS",
      skewness: "Skewness",
      kurtosis: "Kurtosis",
      spectralPower: "Spectral Power",
    },
  },
  training: {
    title: "Model Training",
    connectSenseBox: "Connect senseBox Eye",
    disconnectSenseBox: "Disconnect senseBox Eye",
    connecting: "Connecting...",
    connected: "Connected",
    disconnected: "Disconnected",
    samples: "samples",
    record: "record 1",
    recordBulk: "10",
    recordingCountdown: "Recording in {seconds}s...",
    recording: "Recording...",
    recordingBulk: "Recording {current}/{total}...",
    addClass: "Add Class",
    trainModel: "Train Model",
    trainingEpoch: "Training: epoch {epoch}/{totalEpochs}",
    trainingInProgress: "Training in progress...",
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
    resultsTitle: "Training Details",
    metricsChart: "Training Progress",
    testResultsTitle: "Test",
    finalAccuracy: "Accuracy",
    noDataYet: "Complete training to see results",
    needMoreSamples:
      "Collect at least 10 samples per class to see test results.",
    trainingAccuracy: "Training Accuracy",
    validationAccuracy: "Validation Accuracy",
    trainingLoss: "Training Loss",
    validationLoss: "Validation Loss",
    loss: "Loss",
    accuracy: "Accuracy",
    epoch: "Epoch",
    predicted: "Predicted",
    actual: "Actual",
    noTestResultsData: "No confusion matrix data",
    liveAccelerometer: "Live Accelerometer",
    axisX: "X",
    axisY: "Y",
    axisZ: "Z",
    gestureDuration: "Recording duration: {seconds}s",
    tabPrebuilt: "Pre-built Datasets",
    tabCustom: "Record Your Own",
    tooltip: {
      helpMain: "What is Motion Classification?",
      browserCompatible:
        "This browser does not support the required features for connecting to the senseBox Eye. Please use a compatible browser like Chrome or Edge.",
      helpClasses: "Help with classes",
      startConnection: "Connect to the senseBox Eye to start recording samples",
      helpRecord: "Help with recording gestures",
      moreClasses: "Add at least 2 classes to train",
      moreSamples: "Add at least 2 samples per class to train",
      helpTraining: "Help with model training",
      helpArchitecture: "Help with model architecture",
      helpAddClass: "Help with adding classes",
      helpDeployModel: "Help for deploying the model",
    },
  },
  integration: {
    title: "Deploy on your senseBox Eye",
    converting: "Converting...",
    convertModel: "Convert Model",
    retry: "Retry",
    suggestions: "Suggestions:",
    modelConvertedSuccess: "Model Successfully Converted",
    chooseOptions: "Choose one of the following options:",
    optionA: "Option A: Download Model",
    optionADescription:
      "Download the model as a single cpp file for use in Arduino IDE or to upload to the Blockly UI later.",
    downloadCppFile: "Download Model",
    optionB: "Option B: Integrate Model into prebuilt sketch",
    optionBDescription:
      "Integrate the model into a prebuilt sketch that reads the accelerometer and classifies motion. Once downloaded, upload it directly to your senseBox Eye via drag-and-drop.",
    compiling: "Compiling...",
    compileAndDownload: "Compile & Download",
    downloadBinaryAgain: "Download Again",
    reconvertModel: "Reconvert",
    successBinaryDownloaded: "Successfully Downloaded!",
    successBinaryDescription:
      "Your model has been compiled and downloaded! The binary file is ready to upload to your senseBox Eye via drag-and-drop.",
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
      title: "Motion Classification",
    },
    connection: {
      title: "Connect senseBox Eye",
    },
    addClass: {
      title: "Add Class",
    },
    recordGesture: {
      title: "Record Gesture",
    },
    trainModel: {
      title: "Train Model",
    },
    architecture: {
      title: "Model Architecture",
    },
  },
  prebuiltDatasets: {
    title: "Pre-built Datasets",
    selectAll: "Select All",
    deselectAll: "Deselect All",
    selected: "selected",
    minClassesWarning: "Select at least 2 classes to train a model.",
    loadAndTrain: "Load Classes & Train",
    samples: "samples",
  },
};
