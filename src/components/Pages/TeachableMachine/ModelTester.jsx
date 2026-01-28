import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  LinearProgress,
  Card,
  CardContent,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { PlayArrow as PlayIcon, Stop as StopIcon } from "@mui/icons-material";
import * as tf from "@tensorflow/tfjs";
import useCameraSource from "./useCameraSource";
import SerialCameraErrorHandler, {
  ConnectionStatus,
  ErrorTypes,
} from "./SerialCameraErrorHandler";
import SerialCameraService from "./SerialCameraService";

const ModelTester = ({
  model,
  onCameraStart,
  onCameraStop,
  shouldStopCamera,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const videoContainerRef = useRef(null);
  const intervalRef = useRef(null);
  const cameraActiveRef = useRef(false);
  const [serialError, setSerialError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(
    ConnectionStatus.DISCONNECTED,
  );
  const [browserCompatible, setBrowserCompatible] = useState(true);

  // Use the camera source hook (MUST be called before any code that uses sourceType)
  const {
    sourceType,
    selectSource,
    startCamera: startCameraSource,
    stopCamera: stopCameraSource,
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

  useEffect(() => {
    cameraActiveRef.current = isCameraActive;
  }, [isCameraActive]);

  const makePrediction = useCallback(async () => {
    if (!videoContainerRef.current || !model.model || !model.featureExtractor)
      return;

    const previewElement = getPreviewElement();
    if (!previewElement) return;

    // Check if element is ready
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
      // Extract features and make prediction
      const prediction = await tf.tidy(() => {
        const tensor = tf.browser
          .fromPixels(previewElement)
          .resizeBilinear([224, 224])
          .div(127.5)
          .sub(1.0)
          .expandDims(0);

        const features = model.featureExtractor
          .predict(tensor)
          .flatten()
          .expandDims(0);
        return model.model.predict(features);
      });

      const predictionData = await prediction.data();
      prediction.dispose();

      // Convert to class probabilities (keep original order)
      const classResults = model.classes.map((cls, index) => ({
        className: cls.name,
        confidence: predictionData[index],
      }));

      // Find the highest confidence for highlighting
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
  }, [model, getPreviewElement]);

  const startTesting = useCallback(async () => {
    try {
      console.log("[ModelTester] Starting testing, sourceType:", sourceType);

      // Claim ownership first so parent sets activeCamera to tester (avoids stop from trainer)
      onCameraStart();

      // Now mark running
      setIsRunning(true);
      setSerialError(null);

      // Update connection status for serial camera
      if (sourceType === "serial") {
        setConnectionStatus(ConnectionStatus.CONNECTING);
      }

      // Start the camera source
      console.log("[ModelTester] Starting camera source...");
      await startCameraSource();
      console.log(
        "[ModelTester] Camera source started, isCameraActive:",
        isCameraActive,
      );
      cameraActiveRef.current = true;

      // Update connection status for serial camera
      if (sourceType === "serial") {
        setConnectionStatus(ConnectionStatus.CONNECTED);
      }

      // Wait a bit for the preview element to be ready
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Get and display the preview element
      const previewElement = getPreviewElement();
      console.log(
        "[ModelTester] Preview element:",
        previewElement,
        "tagName:",
        previewElement?.tagName,
        "src:",
        previewElement?.src,
      );

      if (!previewElement) {
        console.error(
          "[ModelTester] Preview element is null after camera start",
        );
        throw new Error("Failed to get preview element from camera source");
      }

      if (!videoContainerRef.current) {
        console.error("[ModelTester] Video container ref is null");
        throw new Error("Video container is not available");
      }

      console.log("[ModelTester] Appending preview element to container");
      // Clear existing content
      videoContainerRef.current.innerHTML = "";
      // Add the preview element
      videoContainerRef.current.appendChild(previewElement);

      // For video elements, ensure they're playing
      if (previewElement.tagName === "VIDEO") {
        try {
          await previewElement.play();
          console.log("[ModelTester] Video playing");
        } catch (error) {
          console.error("Error playing video:", error);
        }
      }

      // For image elements (serial camera), add a loading indicator
      if (previewElement.tagName === "IMG") {
        if (!previewElement.src) {
          console.log(
            "[ModelTester] Waiting for first frame from serial camera...",
          );
        } else {
          console.log(
            "[ModelTester] Image element has src:",
            previewElement.src,
          );
        }
      }

      // Start prediction loop
      intervalRef.current = setInterval(async () => {
        if (model.model && cameraActiveRef.current) {
          await makePrediction();
        }
      }, 500);
    } catch (error) {
      console.error("Error starting camera:", error);
      setIsRunning(false);

      // Release ownership if start fails
      onCameraStop();

      // Handle serial camera errors differently
      if (sourceType === "serial") {
        setConnectionStatus(ConnectionStatus.ERROR);
        setSerialError({
          type: error.type || ErrorTypes.CONNECTION_FAILED,
          message: error.message,
        });
      }
    }
  }, [
    model,
    makePrediction,
    onCameraStart,
    startCameraSource,
    getPreviewElement,
    isCameraActive,
    sourceType,
  ]);

  const stopTesting = useCallback(async () => {
    // Stop the camera source
    await stopCameraSource();

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Clear video container
    if (videoContainerRef.current) {
      videoContainerRef.current.innerHTML = "";
    }

    setIsRunning(false);
    setPredictions([]);
    onCameraStop();

    // Update connection status for serial camera
    if (sourceType === "serial") {
      setConnectionStatus(ConnectionStatus.DISCONNECTED);
      setSerialError(null);
    }
  }, [stopCameraSource, onCameraStop, sourceType]);

  // Stop camera when shouldStopCamera becomes true
  useEffect(() => {
    if (shouldStopCamera && isRunning) {
      stopTesting();
    }
  }, [shouldStopCamera, isRunning, stopTesting]);

  // Handle camera errors
  useEffect(() => {
    if (cameraError) {
      console.error("Camera error:", cameraError);
      if (sourceType === "serial") {
        setConnectionStatus(ConnectionStatus.ERROR);
        setSerialError({
          type: cameraError.type || ErrorTypes.CONNECTION_FAILED,
          message: cameraError.message,
        });
      }
    }
  }, [cameraError, sourceType]);

  // Handle reconnection for serial camera
  const handleReconnect = useCallback(async () => {
    setSerialError(null);
    await startTesting();
  }, [startTesting]);

  // Handle error dismissal
  const handleDismissError = useCallback(() => {
    setSerialError(null);
    if (connectionStatus === ConnectionStatus.ERROR) {
      setConnectionStatus(ConnectionStatus.DISCONNECTED);
    }
  }, [connectionStatus]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (isCameraActive) {
        stopCameraSource();
      }
    };
  }, [isCameraActive, stopCameraSource]);

  return (
    <Box>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Test your trained model with the camera.
      </Typography>

      {/* Camera Source Selection */}
      <Box sx={{ mb: 3 }}>
        <FormControl component="fieldset" disabled={isRunning}>
          <FormLabel component="legend">Camera Source</FormLabel>
          <RadioGroup
            row
            value={sourceType}
            onChange={(e) => {
              selectSource(e.target.value);
              setSerialError(null);
              setConnectionStatus(ConnectionStatus.DISCONNECTED);
            }}
          >
            <FormControlLabel
              value="webcam"
              control={<Radio />}
              label="Webcam"
            />
            <FormControlLabel
              value="serial"
              control={<Radio />}
              label="ESP32 Serial Camera"
              disabled={!browserCompatible}
            />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Serial Camera Error Handler */}
      {sourceType === "serial" && (
        <SerialCameraErrorHandler
          error={serialError}
          connectionStatus={connectionStatus}
          onRetry={handleReconnect}
          onReconnect={handleReconnect}
          onDismiss={handleDismissError}
          showStatus={true}
        />
      )}

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        {!isRunning ? (
          <Button
            variant="contained"
            startIcon={<PlayIcon />}
            onClick={startTesting}
            disabled={sourceType === "serial" && !browserCompatible}
          >
            Start Testing
          </Button>
        ) : (
          <Button
            variant="outlined"
            startIcon={<StopIcon />}
            onClick={stopTesting}
          >
            Stop Testing
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Video Feed */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              Video Feed
            </Typography>
            {isRunning ? (
              <Box
                ref={videoContainerRef}
                sx={{
                  width: "100%",
                  maxWidth: 320,
                  height: 240,
                  mx: "auto",
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
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 300,
                  height: 200,
                  bgcolor: "grey.200",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px dashed #ccc",
                  borderRadius: 2,
                  mx: "auto",
                }}
              >
                <Typography color="text.secondary">
                  No video available
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Predictions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Predictions
            </Typography>

            {predictions.length > 0 ? (
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
                    <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="body1"
                          fontWeight={pred.isTopPrediction ? "bold" : "normal"}
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
            ) : (
              <Box
                sx={{
                  height: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px dashed #ccc",
                  borderRadius: 2,
                  bgcolor: "grey.50",
                }}
              >
                <Typography color="text.secondary">
                  {isRunning ? "Analyzing..." : "No predictions available"}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ModelTester;
