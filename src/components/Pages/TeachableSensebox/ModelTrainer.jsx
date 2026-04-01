import React, { useState, useRef, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { getTeachableSenseboxTranslations } from "./translations";
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
  useTheme,
  useMediaQuery,
  Divider,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  PhotoCamera as CameraIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import useCameraSource from "./hooks/useCameraSource";
import SerialCameraErrorHandler, {
  ConnectionStatus,
  ErrorTypes,
} from "./SerialCameraErrorHandler";
import SerialCameraService from "./SerialCameraService";
import FloatingCameraPreview from "./FloatingCameraPreview";
import TrainingResultsSection from "./TrainingResultsSection";
import HelpButton from "./HelpButton";
import useModelTraining from "./hooks/useModelTraining";
import useModelPrediction from "./hooks/useModelPrediction";
import { downloadCameraFirmware } from "./utils/firmwareDownload";

const ModelTrainer = ({
  onModelTrained,
  onTrainingStart,
  onTrainingError,
  isTraining,
  disabled,
  onOpenHelp,
}) => {
  // Class management state
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingClassId, setEditingClassId] = useState(null);
  const [editingClassName, setEditingClassName] = useState("");

  // Camera state
  const previewContainerRef = useRef(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [serialError, setSerialError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(
    ConnectionStatus.DISCONNECTED,
  );
  const [browserCompatible, setBrowserCompatible] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isFloatingPreviewCollapsed, setIsFloatingPreviewCollapsed] =
    useState(false);
  const [trainedWithEnoughSamples, setTrainedWithEnoughSamples] =
    useState(false);

  const language = useSelector((s) => s.general.language);
  const t = getTeachableSenseboxTranslations();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const {
    sourceType,
    selectSource,
    startCamera: startCameraSource,
    stopCamera: stopCameraSource,
    captureFrame,
    getPreviewElement,
    switchCamera,
    isActive: isCameraActive,
    error: cameraError,
  } = useCameraSource();

  const {
    trainModel: executeTraining,
    trainingProgress,
    trainingMetrics,
    testResults,
    finalAccuracy,
    trainedModel,
  } = useModelTraining();

  const { predictions } = useModelPrediction(
    trainedModel,
    getPreviewElement,
    isCameraActive,
  );

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

      if (sourceType === "serial") {
        setConnectionStatus(ConnectionStatus.ERROR);
        setSerialError({
          type: error.type || ErrorTypes.CONNECTION_FAILED,
          message: error.message,
        });
      } else {
        onTrainingError(
          t.training.errorCameraAccess.replace("{message}", error.message),
        );
      }
    }
  }, [startCameraSource, onTrainingError, getPreviewElement, sourceType, t]);

  const stopCamera = useCallback(async () => {
    try {
      await stopCameraSource();
      setVideoLoading(false);
      if (sourceType === "serial") {
        setConnectionStatus(ConnectionStatus.DISCONNECTED);
      }
      if (previewContainerRef.current) {
        previewContainerRef.current.innerHTML = "";
      }
    } catch (error) {
      console.error("Error stopping camera:", error);
    }
  }, [stopCameraSource, sourceType]);

  const handleSwitchCamera = useCallback(async () => {
    try {
      await switchCamera();
      const previewElement = getPreviewElement();
      if (previewElement && previewContainerRef.current) {
        previewContainerRef.current.innerHTML = "";
        previewContainerRef.current.appendChild(previewElement);
      }
    } catch (error) {
      console.error("Error switching camera:", error);
      onTrainingError(
        t.training.errorCameraSwitch.replace("{message}", error.message),
      );
    }
  }, [switchCamera, getPreviewElement, onTrainingError, t]);

  useEffect(() => {
    if (cameraError) {
      if (sourceType === "serial") {
        if (cameraError.type === "CONNECTION_RESTORED") {
          setSerialError(null);
          setConnectionStatus(ConnectionStatus.CONNECTED);
          return;
        }

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

  const handleDownloadFirmware = async () => {
    setIsDownloading(true);
    const result = await downloadCameraFirmware();
    if (!result.success) {
      alert(`Failed to download firmware: ${result.error}`);
    }
    setIsDownloading(false);
  };

  const addClass = useCallback(() => {
    if (newClassName.trim() && classes.length < 3) {
      const trimmedName = newClassName.trim();
      const nameExists = classes.some(
        (cls) => cls.name.toLowerCase() === trimmedName.toLowerCase(),
      );
      if (nameExists) {
        onTrainingError(
          t.training.errorClassExists.replace("{name}", trimmedName),
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
  }, [newClassName, classes, onTrainingError, t]);

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
          t.training.errorClassExists.replace("{name}", trimmedName),
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
  }, [editingClassName, editingClassId, classes, onTrainingError, t]);

  const cancelEditingClass = useCallback(() => {
    setEditingClassId(null);
    setEditingClassName("");
  }, []);

  const captureImage = useCallback(
    async (classId) => {
      if (!isCameraActive) return;

      try {
        const imageUrl = await captureFrame();
        if (imageUrl) {
          setClasses((prev) =>
            prev.map((cls) =>
              cls.id === classId
                ? {
                    ...cls,
                    samples: [
                      ...cls.samples,
                      { id: Date.now() + Math.random(), url: imageUrl },
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
      const intervalId = setInterval(() => captureImage(classId), 100);
      return intervalId;
    },
    [captureImage],
  );

  const stopCapturing = useCallback((intervalId) => {
    if (intervalId) clearInterval(intervalId);
  }, []);

  useEffect(() => {
    return () => {
      if (isCameraActive) stopCamera();
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
    if (classes.length < 2 || classes.some((cls) => cls.samples.length < 2)) {
      onTrainingError(t.training.errorInsufficientData);
      return;
    }

    // Track if this training has enough samples for test results
    const hasEnoughSamples = classes.every((cls) => cls.samples.length >= 10);
    setTrainedWithEnoughSamples(hasEnoughSamples);

    await executeTraining(
      classes,
      onTrainingStart,
      onTrainingError,
      onModelTrained,
    );
  }, [
    classes,
    onTrainingStart,
    onTrainingError,
    onModelTrained,
    executeTraining,
    t,
  ]);

  return (
    <Box>
      <Grid container spacing={3}>
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
                gap: 1,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                startIcon={<CameraIcon />}
                onClick={() => {
                  if (sourceType === "webcam" && isCameraActive) {
                    stopCamera();
                  } else {
                    if (isCameraActive) stopCamera();
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
                  ? t.training.stopWebcam
                  : t.training.startWebcam}
              </Button>

              <HelpButton
                onClick={() => onOpenHelp && onOpenHelp("webcam")}
                tooltip={t.training.tooltip.helpCamera}
              />

              <Tooltip
                title={
                  !browserCompatible ? t.training.tooltip.browserCompatible : ""
                }
                arrow
                disableHoverListener={!(disabled || !browserCompatible)}
              >
                <span>
                  <Button
                    variant="contained"
                    startIcon={<CameraIcon />}
                    onClick={() => {
                      if (sourceType === "serial" && isCameraActive) {
                        stopCamera();
                      } else {
                        if (isCameraActive) stopCamera();
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
                      ? t.training.stopSenseBoxCamera
                      : t.training.startSenseBoxCamera}
                  </Button>
                </span>
              </Tooltip>

              {!isCameraActive && !serialError && browserCompatible && (
                <Button
                  variant="outlined"
                  startIcon={
                    isDownloading ? (
                      <CircularProgress size={16} />
                    ) : (
                      <DownloadIcon />
                    )
                  }
                  onClick={handleDownloadFirmware}
                  disabled={isDownloading || disabled || !browserCompatible}
                >
                  {t.errors.downloadFirmware}
                </Button>
              )}
            </Box>

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

            {(isCameraActive || videoLoading) && !isMobile && (
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
                    {t.training.loadingCamera}
                  </Typography>
                )}
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "400px",
                    aspectRatio: "1 / 1",
                  }}
                >
                  <Box
                    ref={previewContainerRef}
                    sx={{
                      width: "100%",
                      height: "100%",
                      border: "2px solid #ccc",
                      borderRadius: "8px",
                      backgroundColor: "#000",
                      overflow: "hidden",
                      "& video, & img, & canvas": {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        imageRendering: "pixelated",
                      },
                    }}
                  />
                  {videoLoading && (
                    <Typography
                      color="text.secondary"
                      sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        pointerEvents: "none",
                      }}
                    >
                      {t.training.initializingCamera}
                    </Typography>
                  )}
                </Box>

                {trainedModel && (
                  <Box sx={{ mt: 2, width: "100%", maxWidth: "400px" }}>
                    {predictions.length > 0 && (
                      <Paper sx={{ p: 1.5, bgcolor: "grey.50" }}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          {predictions.map((pred, index) => (
                            <Box
                              key={index}
                              sx={{
                                p: 1,
                                borderRadius: 1,
                                bgcolor: pred.isTopPrediction
                                  ? "primary.light"
                                  : "background.paper",
                                color: pred.isTopPrediction
                                  ? "primary.contrastText"
                                  : "text.primary",
                                border: pred.isTopPrediction
                                  ? "none"
                                  : "1px solid",
                                borderColor: "divider",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  mb: 0.5,
                                }}
                              >
                                <Typography
                                  variant="subtitle1"
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
                                  height: 4,
                                  borderRadius: 2,
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
                            </Box>
                          ))}
                        </Box>
                      </Paper>
                    )}

                    {isCameraActive && predictions.length === 0 && (
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: "center",
                          border: "1px dashed #ccc",
                          bgcolor: "grey.50",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {t.training.analyzing}
                        </Typography>
                      </Paper>
                    )}
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Grid>

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
                            if (e.key === "Enter") saveClassRename();
                            else if (e.key === "Escape") cancelEditingClass();
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Escape") cancelEditingClass();
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
                            "&:hover": { backgroundColor: "action.hover" },
                          }}
                        >
                          {cls.name}
                        </Typography>
                      )}
                      <Box>
                        <Chip
                          label={`${cls.samples.length} ${t.training.samples}`}
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
                    <Tooltip
                      title={
                        !isCameraActive ? t.training.tooltip.startCamera : ""
                      }
                      arrow
                      disableHoverListener={!(disabled || !isCameraActive)}
                    >
                      <span>
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
                          {t.training.holdToCapture}
                        </Button>
                      </span>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box
            sx={{
              mb: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            {classes.length < 3 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowAddDialog(true)}
                  disabled={disabled}
                >
                  {t.training.addClass}
                </Button>
                <HelpButton
                  onClick={() => onOpenHelp && onOpenHelp("addClass")}
                  tooltip={t.training.tooltip.helpClasses}
                />
              </Box>
            )}
            <Divider sx={{ width: "100%", my: 1 }} />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Tooltip
                title={
                  classes.length < 2
                    ? t.training.tooltip.moreClasses
                    : classes.some((cls) => cls.samples.length < 2)
                      ? t.training.tooltip.moreSamples
                      : ""
                }
                arrow
                disableHoverListener={
                  !(
                    disabled ||
                    classes.length < 2 ||
                    classes.some((cls) => cls.samples.length < 2)
                  )
                }
              >
                <span>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={trainModel}
                    disabled={
                      disabled ||
                      classes.length < 2 ||
                      classes.some((cls) => cls.samples.length < 2)
                    }
                  >
                    {t.training.trainModel}
                  </Button>
                </span>
              </Tooltip>

              <HelpButton
                onClick={() => onOpenHelp && onOpenHelp("trainModel")}
                tooltip={t.training.tooltip.helpTraining}
              />
            </Box>
          </Box>

          {isTraining && (
            <Box sx={{ my: 4 }}>
              <Typography variant="body2" gutterBottom>
                {trainingProgress.totalEpochs > 0
                  ? t.training.trainingEpoch
                      .replace("{epoch}", trainingProgress.epoch)
                      .replace("{totalEpochs}", trainingProgress.totalEpochs)
                  : t.training.trainingInProgress}
              </Typography>
              <LinearProgress
                variant={
                  trainingProgress.totalEpochs > 0
                    ? "determinate"
                    : "indeterminate"
                }
                value={
                  trainingProgress.totalEpochs > 0
                    ? Math.min(
                        100,
                        ((trainingProgress.epoch - 1) /
                          trainingProgress.totalEpochs) *
                          100 +
                          (trainingProgress.batch /
                            Math.max(1, trainingProgress.totalBatches)) *
                            (100 / trainingProgress.totalEpochs),
                      )
                    : 0
                }
              />
            </Box>
          )}

          <TrainingResultsSection
            trainingMetrics={trainingMetrics}
            testResults={testResults}
            classNames={classes.map((cls) => cls.name)}
            finalAccuracy={finalAccuracy}
            isTraining={isTraining}
            hasEnoughSamples={trainedWithEnoughSamples}
            onOpenHelp={onOpenHelp}
            translations={{
              title: t.training.resultsTitle || "Training Results",
              metricsChart: t.training.metricsChart || "Training Progress",
              testResults: t.training.testResultsTitle || "Confusion Matrix",
              finalAccuracy: t.training.finalAccuracy || "Final Accuracy",
              trainingInProgress: t.training.trainingInProgress,
              noDataYet:
                t.training.noDataYet || "Complete training to see results",
              needMoreImages: t.training.needMoreImages,
            }}
          />
        </Grid>
      </Grid>

      {(isCameraActive || videoLoading) && isMobile && (
        <FloatingCameraPreview
          previewContainerRef={previewContainerRef}
          isCollapsed={isFloatingPreviewCollapsed}
          onToggleCollapse={() =>
            setIsFloatingPreviewCollapsed(!isFloatingPreviewCollapsed)
          }
          videoLoading={videoLoading}
          onSwitchCamera={
            sourceType === "webcam" ? handleSwitchCamera : undefined
          }
          predictions={predictions}
          trainedModel={trainedModel}
        />
      )}

      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)}>
        <DialogTitle>{t.training.addNewClass}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t.training.className}
            fullWidth
            variant="outlined"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addClass()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>
            {t.training.cancel}
          </Button>
          <Button onClick={addClass} variant="contained">
            {t.training.add}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ModelTrainer;
