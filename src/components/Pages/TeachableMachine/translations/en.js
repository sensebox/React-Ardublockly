// src/components/Pages/TeachableMachine/translations/en.js
export const teachableMachineTranslations_en = {
  title: "Teachable senseBox",
  description:
    "Train your own image classification model and deploy it on your senseBox Eye.",
  training: {
    title: "Model Training",
    stopWebcam: "Stop Webcam",
    startWebcam: "Start Webcam",
    stopSenseBoxCamera: "Stop senseBox Eye Camera",
    startSenseBoxCamera: "Start senseBox Eye Camera",
    loadingCamera: "Loading camera...",
    initializingCamera: "Initializing camera...",
    samples: "samples",
    holdToCapture: "Hold to Capture",
    addClass: "Add Class",
    trainModel: "Train Model",
    trainingEpoch: "Training: epoch {epoch}/{totalEpochs}",
    trainingInProgress: "Training in progress...",
    livePredictions: "Live Classification",
    startCameraForPredictions: "Please start the camera.",
    analyzing: "Analyzing...",
    addNewClass: "Add New Class",
    className: "Class Name",
    cancel: "Cancel",
    add: "Add",
    errorClassExists: 'A class with the name "{name}" already exists.',
    errorInsufficientData:
      "Insufficient data for training. Please add at least 2 classes with at least 2 samples each.",
    errorCameraAccess:
      "Error accessing camera: {message}. Please make sure you have granted camera permissions.",
    errorCameraSwitch: "Error switching camera: {message}",
    errorTraining: "Training failed: {message}",
    resultsTitle: "Training Details",
    metricsChart: "Training Progress",
    testResultsTitle: "Test",
    finalAccuracy: "Accuracy",
    noDataYet: "Complete training to see results",
    needMoreImages: "Collect at least 10 images per class to see test results.",
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
    tooltip: {
      helpMain: "What is Teachable senseBox?",
      browserCompatible:
        "This browser does not support the required features for connecting to the senseBox Eye. Please use a compatible browser like Chrome or Edge.",
      helpClasses: "Help with classes",
      startCamera: "Start the camera to capture images",
      helpCamera: "Help with the camera",
      moreClasses: "Add at least 2 classes to train",
      moreSamples: "Add at least 2 samples per class to train",
      helpTraining: "Help with model training",
      helpTrainingProgress: "Help for training progress",
      helpTestResults: "Help for test results",
      helpDeployModel: "Help for deploying the model",
    },
  },
  integration: {
    title: "Deploy on your senseBox Eye",
    converting: "Compressing & Converting...",
    convertModel: "Compress & Convert Model",
    retry: "Retry",
    suggestions: "Suggestions:",
    modelConvertedSuccess: "Model Successfully Converted",
    chooseOptions: "Choose one of the following options:",
    optionA: "Option A: Download Model",
    optionADescription:
      "Download the model as a single cpp file for use in Arduino IDE or to upload to Blockly UI later.",
    downloadCppFile: "Download Model",
    optionB: "Option B: Integrate Model into prebuilt sketch",
    optionBDescription:
      "Integrate the model into a prebuilt sketch. This sketch will display the camera image and the prediction on the OLED display. Compiling the sketch will take some time. Once downloaded, you can upload it directly to your senseBox Eye via drag-and-drop.",
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
      "Your browser does not support the Web Serial API required for senseBox Eye camera connection.",
    browserNotSupportedDetails:
      "The Web Serial API is currently supported in Chrome 89+, Edge 89+, and Opera 76+ on desktop platforms.",
    permissionDenied: "Permission Denied",
    permissionDeniedMessage:
      "Serial port access was denied. Please grant permission to connect to your senseBox Eye camera.",
    permissionDeniedDetails:
      "You may need to check your browser settings or try connecting again.",
    connectionFailed: "Connection Failed",
    connectionFailedMessage:
      "Connection to senseBox Eye could not be established.",
    connectionFailedDetails:
      "Please check that your device is properly connected and the correct port is selected. You can download and flash the camera capture firmware to your device.",
    deviceDisconnected: "Device Disconnected",
    deviceDisconnectedMessage: "The senseBox Eye camera was disconnected.",
    deviceDisconnectedDetails: "Please reconnect your device and try again.",
    frameTimeout: "Frame Timeout",
    frameTimeoutMessage:
      "No frames received from the senseBox Eye camera within the expected time.",
    frameTimeoutDetails:
      "The device may be busy or experiencing communication issues. The system will continue waiting for frames.",
    frameCorrupted: "Corrupted Frame",
    frameCorruptedMessage:
      "Received a corrupted frame from the senseBox Eye camera.",
    frameCorruptedDetails:
      "This can happen due to transmission errors. The system will continue processing subsequent frames.",
    frameDecodingError: "Frame Decoding Error",
    frameDecodingErrorMessage:
      "Failed to decode frame data from the senseBox Eye camera.",
    frameDecodingErrorDetails:
      "The frame format may be invalid or corrupted. The system will continue processing subsequent frames.",
    communicationError: "Communication Error",
    communicationErrorMessage:
      "An error occurred while reading data from the senseBox Eye camera.",
    communicationErrorDetails:
      "The connection may have been interrupted. Please try reconnecting.",
    reconnecting: "Reconnecting",
    reconnectingMessage:
      "Attempting to reconnect to the senseBox Eye camera...",
    reconnectingDetails:
      "Please wait, or click the button below to select a port manually.",
    unknownError: "Unknown Error",
    unknownErrorMessage:
      "An unexpected error occurred with the senseBox Eye camera.",
    unknownErrorDetails: "No additional details available.",
    connected: "Connected",
    connecting: "Connecting...",
    error: "Error",
    disconnected: "Disconnected",
    showDetails: "Show Details",
    hideDetails: "Hide Details",
    troubleshooting: "Troubleshooting:",
    troubleshootingUsb: "Ensure the senseBox Eye is connected via USB",
    troubleshootingPort: "Check that the correct serial port is selected",
    troubleshootingFirmware:
      "Verify the senseBox Eye is running the firmware to stream camera images. You can download it with the button below.",
    troubleshootingReconnect: "Try unplugging and reconnecting the device",
    supportedBrowsers: "Supported Browsers:",
    supportedBrowsersNote:
      "Note: Web Serial API is not supported on mobile browsers or Firefox/Safari.",
    howToGrantPermission: "How to grant permission:",
    permissionStep1: "Click the lock icon in your browser's address bar",
    permissionStep2: 'Find "Serial ports" in the permissions list',
    permissionStep3: 'Change the setting to "Allow"',
    permissionStep4: "Refresh the page and try connecting again",
    downloadFirmware: "Download Camera Sketch",
    compilingFirmware: "Compiling...",
    tryAgain: "Try Again",
    reconnect: "Reconnect",
    serialCameraStatus: "Serial Camera Status:",
    waitingForFrames:
      "Waiting for frames from senseBox Eye camera... If this persists, check your device connection.",
  },
  help: {
    pageTitle: {
      title: "Teachable senseBox",
    },
    webcam: {
      title: "Camera",
    },
    addClass: {
      title: "Add Class",
    },
    trainModel: {
      title: "Train Model",
    },
    trainingProgress: {
      title: "Training Progress",
    },
    testResults: {
      title: "Test Results",
    },
    deployModel: {
      title: "Deploy Model",
    },
  },
};
