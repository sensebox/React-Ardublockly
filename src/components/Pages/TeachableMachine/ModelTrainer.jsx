import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  PhotoCamera as CameraIcon,
  Train as TrainIcon,
} from "@mui/icons-material";
import * as tf from "@tensorflow/tfjs";
import useCameraSource from "./useCameraSource";
import SerialCameraErrorHandler, {
  ConnectionStatus,
  ErrorTypes,
} from "./SerialCameraErrorHandler";
import SerialCameraService from "./SerialCameraService";

const ModelTrainer = ({
  onModelTrained,
  onTrainingStart,
  onTrainingError,
  isTraining,
  disabled,
}) => {
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingClassId, setEditingClassId] = useState(null);
  const [editingClassName, setEditingClassName] = useState("");
  const previewContainerRef = useRef(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [serialError, setSerialError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(
    ConnectionStatus.DISCONNECTED,
  );
  const [browserCompatible, setBrowserCompatible] = useState(true);

  // Prediction state
  const [trainedModel, setTrainedModel] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const predictionIntervalRef = useRef(null);
  const {
    sourceType,
    selectSource,
    startCamera: startCameraSource,
    stopCamera: stopCameraSource,
    captureFrame,
    getPreviewElement,
    isActive: isCameraActive,
    error: cameraError,
  } = useCameraSource();

  // Check browser compatibility on mount
  useEffect(() => {
    const isCompatible = SerialCameraService.isSupported();
    setBrowserCompatible(isCompatible);
    if (!isCompatible && sourceType === "serial") {
      setSerialError({
        type: ErrorTypes.UNSUPPORTED_BROWSER,
        message: "Web Serial API is not supported in this browser",
      });
    }
  }, [sourceType]);

  const startCamera = useCallback(async () => {
    try {
      setVideoLoading(true);
      setSerialError(null);

      if (sourceType === "serial") {
        setConnectionStatus(ConnectionStatus.CONNECTING);
      }

      await startCameraSource();
      setVideoLoading(false);
      if (sourceType === "serial") {
        setConnectionStatus(ConnectionStatus.CONNECTED);
      }
      const previewElement = getPreviewElement();
      if (previewElement && previewContainerRef.current) {
        previewContainerRef.current.innerHTML = "";
        previewContainerRef.current.appendChild(previewElement);
      }
    } catch (error) {
      console.error("Camera error:", error);
      setVideoLoading(false);

      // Handle serial camera errors differently
      if (sourceType === "serial") {
        setConnectionStatus(ConnectionStatus.ERROR);
        setSerialError({
          type: error.type || ErrorTypes.CONNECTION_FAILED,
          message: error.message,
        });
      } else {
        onTrainingError(
          `Error accessing camera: ${error.message}. Please make sure you have granted camera permissions.`,
        );
      }
    }
  }, [startCameraSource, onTrainingError, getPreviewElement, sourceType]);

  const stopCamera = useCallback(async () => {
    try {
      await stopCameraSource();
      setVideoLoading(false);
      if (sourceType === "serial") {
        setConnectionStatus(ConnectionStatus.DISCONNECTED);
        // Don't clear serialError here - let it persist so user can download firmware
      }
      if (previewContainerRef.current) {
        previewContainerRef.current.innerHTML = "";
      }
    } catch (error) {
      console.error("Error stopping camera:", error);
    }
  }, [stopCameraSource, sourceType]);

  useEffect(() => {
    if (cameraError) {
      if (sourceType === "serial") {
        const warningTypes = [
          ErrorTypes.FRAME_TIMEOUT,
          ErrorTypes.FRAME_CORRUPTED,
          ErrorTypes.INVALID_FORMAT,
          ErrorTypes.DECODING_ERROR,
        ];
        const isWarning =
          cameraError.type && warningTypes.includes(cameraError.type);

        setConnectionStatus(
          isWarning ? ConnectionStatus.CONNECTED : ConnectionStatus.ERROR,
        );
        setSerialError({
          type: cameraError.type || ErrorTypes.CONNECTION_FAILED,
          message: cameraError.message,
        });
      } else {
        onTrainingError(`Camera error: ${cameraError.message}`);
      }
    }
  }, [cameraError, onTrainingError, sourceType]);
  const handleReconnect = useCallback(async () => {
    setSerialError(null);
    await startCamera();
  }, [startCamera]);
  const handleDismissError = useCallback(() => {
    setSerialError(null);
    if (connectionStatus === ConnectionStatus.ERROR) {
      setConnectionStatus(ConnectionStatus.DISCONNECTED);
    }
  }, [connectionStatus]);

  const addClass = useCallback(() => {
    if (newClassName.trim() && classes.length < 3) {
      const trimmedName = newClassName.trim();
      const nameExists = classes.some(
        (cls) => cls.name.toLowerCase() === trimmedName.toLowerCase(),
      );
      if (nameExists) {
        onTrainingError(
          `A class with the name "${trimmedName}" already exists.`,
        );
        return;
      }
      const newClass = {
        id: Date.now(),
        name: trimmedName,
        samples: [],
      };
      setClasses((prev) => [...prev, newClass]);
      setNewClassName("");
      setShowAddDialog(false);
    }
  }, [newClassName, classes, onTrainingError]);

  const deleteClass = useCallback((classId) => {
    setClasses((prev) => prev.filter((cls) => cls.id !== classId));
  }, []);

  const startEditingClass = useCallback((classId, currentName) => {
    setEditingClassId(classId);
    setEditingClassName(currentName);
  }, []);

  const saveClassRename = useCallback(() => {
    if (editingClassName.trim() && editingClassId) {
      const trimmedName = editingClassName.trim();
      const nameExists = classes.some(
        (cls) =>
          cls.id !== editingClassId &&
          cls.name.toLowerCase() === trimmedName.toLowerCase(),
      );
      if (nameExists) {
        onTrainingError(
          `A class with the name "${trimmedName}" already exists.`,
        );
        return;
      }
      setClasses((prev) =>
        prev.map((cls) =>
          cls.id === editingClassId ? { ...cls, name: trimmedName } : cls,
        ),
      );
      setEditingClassId(null);
      setEditingClassName("");
    }
  }, [editingClassName, editingClassId, classes, onTrainingError]);

  const cancelEditingClass = useCallback(() => {
    setEditingClassId(null);
    setEditingClassName("");
  }, []);

  const captureImage = useCallback(
    async (classId) => {
      if (!isCameraActive) {
        return;
      }

      try {
        // Capture frame using the camera source
        const blob = await captureFrame();

        if (blob) {
          const imageUrl = URL.createObjectURL(blob);
          setClasses((prev) =>
            prev.map((cls) =>
              cls.id === classId
                ? {
                    ...cls,
                    samples: [
                      ...cls.samples,
                      { id: Date.now() + Math.random(), url: imageUrl, blob },
                    ],
                  }
                : cls,
            ),
          );
        }
      } catch (error) {
        console.error("Error capturing image:", error);
      }
    },
    [isCameraActive, captureFrame],
  );

  const startCapturing = useCallback(
    (classId) => {
      captureImage(classId);
      const intervalId = setInterval(() => {
        captureImage(classId);
      }, 100); // Capture every 100ms while holding (10 fps)
      return intervalId;
    },
    [captureImage],
  );

  const stopCapturing = useCallback((intervalId) => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  }, []);
  useEffect(() => {
    return () => {
      if (isCameraActive) {
        stopCamera();
      }
    };
  }, [isCameraActive, stopCamera]);

  const removeSample = useCallback((classId, sampleId) => {
    setClasses((prev) =>
      prev.map((cls) =>
        cls.id === classId
          ? {
              ...cls,
              samples: cls.samples.filter((sample) => sample.id !== sampleId),
            }
          : cls,
      ),
    );
  }, []);

  const trainModel = useCallback(async () => {
    if (classes.length < 2 || classes.some((cls) => cls.samples.length === 0)) {
      onTrainingError(
        "Insufficient data for training. Please add at least 2 classes with at least one sample each.",
      );
      return;
    }

    onTrainingStart();

    try {
      // Load custom base model that accepts 96x96 grayscale images
      const baseModel = await tf.loadLayersModel(
        "https://raw.githubusercontent.com/PaulaScharf/teachable_machine_base_model/refs/heads/main/model.json",
      );
      const featureExtractor = tf.sequential();
      const numLayersToInclude = baseModel.layers.length - 1;
      for (let i = 0; i < numLayersToInclude; i++) {
        const layer = baseModel.layers[i];
        featureExtractor.add(layer);
      }
      featureExtractor.layers.forEach((layer) => {
        layer.trainable = false;
      });
      const examples = Array(classes.length)
        .fill(null)
        .map(() => []);

      for (let classIndex = 0; classIndex < classes.length; classIndex++) {
        const cls = classes[classIndex];
        for (const sample of cls.samples) {
          const img = new Image();
          img.src = sample.url;
          await new Promise((resolve) => {
            img.onload = resolve;
          });

          const activation = tf.tidy(() => {
            const tensor = tf.browser
              .fromPixels(img)
              .resizeBilinear([96, 96])
              .mean(-1)
              .expandDims(-1)
              .div(255.0)
              .expandDims(0);

            const extracted = featureExtractor.predict(tensor);
            return new Float32Array(extracted.dataSync());
          });

          examples[classIndex].push(activation);
        }
      }

      // Calculate class weights to balance loss by sample count
      // Classes with fewer samples get higher weights
      const totalSamples = examples.reduce((sum, cls) => sum + cls.length, 0);
      const classWeights = {};
      examples.forEach((classExamples, classIndex) => {
        const numSamplesInClass = classExamples.length;
        // Weight inversely proportional to number of samples
        classWeights[classIndex] =
          totalSamples / (classes.length * numSamplesInClass);
      });

      // Prepare training and validation datasets
      const VALIDATION_FRACTION = 0.15;
      let trainDataset = [];
      let validationDataset = [];

      for (let i = 0; i < examples.length; i++) {
        const y = new Array(classes.length).fill(0);
        y[i] = 1;

        const classLength = examples[i].length;
        const numValidation = Math.ceil(VALIDATION_FRACTION * classLength);
        const numTrain = classLength - numValidation;

        const classTrain = examples[i]
          .slice(0, numTrain)
          .map((dataArray) => ({ data: dataArray, label: y }));

        const classValidation = examples[i]
          .slice(numTrain)
          .map((dataArray) => ({ data: dataArray, label: y }));

        trainDataset = trainDataset.concat(classTrain);
        validationDataset = validationDataset.concat(classValidation);
      }

      const trainTfDataset = tf.data.zip({
        xs: tf.data.array(trainDataset.map((sample) => sample.data)),
        ys: tf.data.array(trainDataset.map((sample) => sample.label)),
      });

      const validationTfDataset = tf.data.zip({
        xs: tf.data.array(validationDataset.map((sample) => sample.data)),
        ys: tf.data.array(validationDataset.map((sample) => sample.label)),
      });

      const featureDimension = examples[0][0].length;

      // Create training model as Sequential with dropout for regularization
      const trainingModel = tf.sequential({
        layers: [
          tf.layers.dense({
            inputShape: [featureDimension],
            units: 100,
            activation: "relu",
            kernelInitializer: "varianceScaling",
            useBias: true,
            kernelRegularizer: tf.regularizers.l2({ l2: 0.01 }),
          }),
          tf.layers.dropout({
            rate: 0.5,
          }),
          tf.layers.dense({
            kernelInitializer: "varianceScaling",
            useBias: false,
            activation: "softmax",
            units: classes.length,
          }),
        ],
      });

      const optimizer = tf.train.adam(0.0001);
      trainingModel.compile({
        optimizer,
        loss: "categoricalCrossentropy",
        metrics: ["accuracy"],
      });

      const batchSize = 16;
      const trainDataBatched = trainTfDataset.shuffle(100).batch(batchSize);
      const validationDataBatched = validationTfDataset.batch(batchSize);

      // Early stopping to prevent overfitting
      let bestValLoss = Infinity;
      let patienceCounter = 0;
      const patience = 5;

      await trainingModel.fitDataset(trainDataBatched, {
        epochs: 30, // Reduced from 50 to prevent overfitting
        validationData: validationDataBatched,
        classWeight: classWeights, // Apply class weights to balance loss
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log(
              `Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}, val_loss = ${logs.val_loss.toFixed(4)}, val_acc = ${logs.val_acc.toFixed(4)}`,
            );

            // Early stopping logic
            if (logs.val_loss < bestValLoss) {
              bestValLoss = logs.val_loss;
              patienceCounter = 0;
            } else {
              patienceCounter++;
              if (patienceCounter >= patience) {
                console.log(`Early stopping at epoch ${epoch + 1}`);
                trainingModel.stopTraining = true;
              }
            }
          },
        },
      });
      const combinedModel = tf.sequential();
      combinedModel.add(featureExtractor);
      combinedModel.add(trainingModel);

      const modelData = {
        model: combinedModel,
        featureExtractor,
        trainingModel,
        inputShape: [96, 96, 1],
        classes: classes.map((cls) => ({ id: cls.id, name: cls.name })),
        representativeSamples: classes.flatMap((cls) =>
          cls.samples
            .slice(0, Math.min(10, cls.samples.length))
            .map((s) => s.url),
        ),
      };

      optimizer.dispose();
      setTrainedModel(modelData);
      onModelTrained(modelData);
    } catch (error) {
      console.error("Training error:", error);
      onTrainingError(`Training failed: ${error.message}`);
    }
  }, [classes, onModelTrained, onTrainingStart, onTrainingError]);
  const makePrediction = useCallback(async () => {
    if (
      !trainedModel ||
      !trainedModel.featureExtractor ||
      !trainedModel.trainingModel
    )
      return;

    const previewElement = getPreviewElement();
    if (!previewElement) return;
    if (previewElement.tagName === "VIDEO") {
      if (previewElement.readyState < 2 || previewElement.paused) {
        return;
      }
    } else if (previewElement.tagName === "IMG") {
      if (!previewElement.complete || !previewElement.naturalWidth) {
        return;
      }
    }

    try {
      // Make prediction using feature extractor + training model
      const prediction = await tf.tidy(() => {
        // Capture the preview element and convert to grayscale 96x96x1
        const tensor = tf.browser
          .fromPixels(previewElement)
          .resizeBilinear([96, 96])
          .mean(-1) // Convert to grayscale by averaging RGB channels
          .expandDims(-1) // Add channel dimension: [96, 96] -> [96, 96, 1]
          .div(255.0) // Normalize to [0, 1] range
          .expandDims(0); // Add batch dimension: [96, 96, 1] -> [1, 96, 96, 1]

        // Extract features then classify
        const features = trainedModel.featureExtractor.predict(tensor);
        return trainedModel.trainingModel.predict(features);
      });

      const predictionData = await prediction.data();
      prediction.dispose();

      // Convert to class probabilities
      const classResults = trainedModel.classes.map((cls, index) => ({
        className: cls.name,
        confidence: predictionData[index],
      }));
      const maxConfidence = Math.max(...classResults.map((r) => r.confidence));

      setPredictions(
        classResults.map((r) => ({
          ...r,
          isTopPrediction: r.confidence === maxConfidence,
        })),
      );
    } catch (error) {
      console.error("Prediction error:", error);
    }
  }, [trainedModel, getPreviewElement]);

  // Automatically start/stop predictions based on camera and model availability
  useEffect(() => {
    if (trainedModel && isCameraActive) {
      if (predictionIntervalRef.current) {
        clearInterval(predictionIntervalRef.current);
      }

      setPredictions([]);
      predictionIntervalRef.current = setInterval(async () => {
        await makePrediction();
      }, 500);
    } else {
      // Stop predictions if camera is stopped or no model
      if (predictionIntervalRef.current) {
        clearInterval(predictionIntervalRef.current);
        predictionIntervalRef.current = null;
      }
      setPredictions([]);
    }
    return () => {
      if (predictionIntervalRef.current) {
        clearInterval(predictionIntervalRef.current);
        predictionIntervalRef.current = null;
      }
    };
  }, [trainedModel, isCameraActive, makePrediction]);

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Left Column: Camera */}
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              position: { md: "sticky" },
              top: { md: 16 },
              alignSelf: "flex-start",
            }}
          >
            <Box
              sx={{
                mb: 2,
                display: "flex",
                gap: 2,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {/* Webcam Button */}
              <Button
                variant={
                  sourceType === "webcam" && isCameraActive
                    ? "contained"
                    : "outlined"
                }
                startIcon={<CameraIcon />}
                onClick={() => {
                  if (sourceType === "webcam" && isCameraActive) {
                    stopCamera();
                  } else {
                    if (isCameraActive) {
                      stopCamera();
                    }
                    selectSource("webcam");
                    setTimeout(() => startCamera(), 100);
                  }
                }}
                disabled={disabled}
                color={
                  sourceType === "webcam" && isCameraActive
                    ? "secondary"
                    : "primary"
                }
              >
                {sourceType === "webcam" && isCameraActive
                  ? "Stop Webcam"
                  : "Start Webcam"}
              </Button>

              {/* Serial Button */}
              <Button
                variant={
                  sourceType === "serial" && isCameraActive
                    ? "contained"
                    : "outlined"
                }
                startIcon={<CameraIcon />}
                onClick={() => {
                  if (sourceType === "serial" && isCameraActive) {
                    stopCamera();
                  } else {
                    if (isCameraActive) {
                      stopCamera();
                    }
                    selectSource("serial");
                    setTimeout(() => startCamera(), 100);
                  }
                }}
                disabled={disabled || !browserCompatible}
                color={
                  sourceType === "serial" && isCameraActive
                    ? "secondary"
                    : "primary"
                }
              >
                {sourceType === "serial" && isCameraActive
                  ? "Stop senseBox Eye Camera"
                  : "Start senseBox Eye Camera"}
              </Button>
            </Box>

            {/* Serial Camera Error Handler */}
            {sourceType === "serial" && serialError && (
              <Box sx={{ mb: 3 }}>
                <SerialCameraErrorHandler
                  error={serialError}
                  connectionStatus={connectionStatus}
                  onRetry={handleReconnect}
                  onReconnect={handleReconnect}
                  onDismiss={handleDismissError}
                  showStatus={false}
                />
              </Box>
            )}

            {(isCameraActive || videoLoading) && (
              <Box
                sx={{
                  mb: 3,
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {videoLoading && (
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Loading camera...
                  </Typography>
                )}
                <Box
                  ref={previewContainerRef}
                  sx={{
                    width: "100%",
                    maxWidth: "400px",
                    aspectRatio: "1 / 1",
                    border: "2px solid #ccc",
                    borderRadius: "8px",
                    backgroundColor: "#000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    "& video, & img": {
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    },
                  }}
                >
                  {videoLoading && (
                    <Typography color="text.secondary" sx={{ color: "white" }}>
                      Initializing camera...
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </Grid>

        {/* Right Column: Classes */}
        <Grid item xs={12} md={7}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {classes.map((cls) => (
              <Grid item xs={12} key={cls.id}>
                <Card>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      {editingClassId === cls.id ? (
                        <TextField
                          autoFocus
                          size="small"
                          value={editingClassName}
                          onChange={(e) => setEditingClassName(e.target.value)}
                          onBlur={saveClassRename}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              saveClassRename();
                            } else if (e.key === "Escape") {
                              cancelEditingClass();
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Escape") {
                              cancelEditingClass();
                            }
                          }}
                          sx={{ flex: 1, mr: 1 }}
                        />
                      ) : (
                        <Typography
                          variant="h6"
                          onClick={() => startEditingClass(cls.id, cls.name)}
                          sx={{
                            cursor: "pointer",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            "&:hover": {
                              backgroundColor: "action.hover",
                            },
                          }}
                        >
                          {cls.name}
                        </Typography>
                      )}
                      <Box>
                        <Chip
                          label={`${cls.samples.length} samples`}
                          size="small"
                          color={cls.samples.length > 0 ? "success" : "default"}
                        />
                        <IconButton
                          size="small"
                          onClick={() => deleteClass(cls.id)}
                          disabled={disabled}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        mb: 2,
                        height: 100,
                        minHeight: 100,
                        overflowY: "auto",
                        p: 1,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                        bgcolor: "grey.50",
                      }}
                    >
                      {cls.samples.map((sample) => (
                        <Box
                          key={sample.id}
                          sx={{ position: "relative", height: "fit-content" }}
                        >
                          <img
                            src={sample.url}
                            alt={`Sample for ${cls.name}`}
                            style={{
                              width: 60,
                              height: 60,
                              objectFit: "cover",
                              borderRadius: 4,
                            }}
                          />
                          <IconButton
                            size="small"
                            sx={{
                              position: "absolute",
                              top: -8,
                              right: -8,
                              bgcolor: "background.paper",
                              "&:hover": {
                                bgcolor: "error.light",
                                color: "white",
                              },
                            }}
                            onClick={() => removeSample(cls.id, sample.id)}
                            disabled={disabled}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>

                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<CameraIcon />}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        const intervalId = startCapturing(cls.id);
                        e.currentTarget.dataset.intervalId = intervalId;
                      }}
                      onMouseUp={(e) => {
                        e.preventDefault();
                        stopCapturing(
                          parseInt(e.currentTarget.dataset.intervalId),
                        );
                      }}
                      onMouseLeave={(e) => {
                        e.preventDefault();
                        if (e.currentTarget.dataset.intervalId) {
                          stopCapturing(
                            parseInt(e.currentTarget.dataset.intervalId),
                          );
                        }
                      }}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        const intervalId = startCapturing(cls.id);
                        e.currentTarget.dataset.intervalId = intervalId;
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        stopCapturing(
                          parseInt(e.currentTarget.dataset.intervalId),
                        );
                      }}
                      disabled={!isCameraActive || disabled}
                    >
                      Hold to Capture
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Add Class + Train Model Buttons - Below Classes */}
          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            {classes.length < 3 && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowAddDialog(true)}
                disabled={disabled}
              >
                Add Class
              </Button>
            )}
            <Button
              variant="contained"
              size="large"
              startIcon={<TrainIcon />}
              onClick={trainModel}
              disabled={
                disabled ||
                classes.length < 2 ||
                classes.some((cls) => cls.samples.length === 0)
              }
            >
              Train Model
            </Button>
          </Box>
        </Grid>
      </Grid>

      {isTraining && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            Training in progress...
          </Typography>
          <LinearProgress />
        </Box>
      )}

      {/* Predictions Section - Show after training */}
      {trainedModel && (
        <>
          <Divider sx={{ my: 4 }} />

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Live Predictions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {isCameraActive
                ? "Real-time predictions from your trained model."
                : "Start the camera to see predictions."}
            </Typography>

            {predictions.length > 0 && (
              <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                <Typography variant="subtitle2" gutterBottom>
                  Live Predictions
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {predictions.map((pred, index) => (
                    <Card
                      key={index}
                      variant={pred.isTopPrediction ? "elevation" : "outlined"}
                      sx={{
                        bgcolor: pred.isTopPrediction
                          ? "primary.light"
                          : "background.paper",
                        color: pred.isTopPrediction
                          ? "primary.contrastText"
                          : "text.primary",
                      }}
                    >
                      <CardContent
                        sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="body1"
                            fontWeight={
                              pred.isTopPrediction ? "bold" : "normal"
                            }
                          >
                            {pred.className}
                          </Typography>
                          <Typography variant="body2">
                            {(pred.confidence * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={pred.confidence * 100}
                          sx={{
                            mt: 1,
                            bgcolor: pred.isTopPrediction
                              ? "rgba(255,255,255,0.3)"
                              : "grey.300",
                            "& .MuiLinearProgress-bar": {
                              bgcolor: pred.isTopPrediction
                                ? "white"
                                : "primary.main",
                            },
                          }}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Paper>
            )}

            {isCameraActive && predictions.length === 0 && (
              <Paper
                sx={{
                  p: 3,
                  textAlign: "center",
                  border: "2px dashed #ccc",
                  bgcolor: "grey.50",
                }}
              >
                <Typography color="text.secondary">Analyzing...</Typography>
              </Paper>
            )}
          </Box>
        </>
      )}

      {/* Add Class Dialog */}
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)}>
        <DialogTitle>Add New Class</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Class Name"
            fullWidth
            variant="outlined"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addClass()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>Cancel</Button>
          <Button onClick={addClass} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ModelTrainer;
