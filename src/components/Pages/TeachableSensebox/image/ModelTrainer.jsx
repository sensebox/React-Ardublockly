import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useSelector } from "react-redux";
import { getImageTranslations } from "./translations";
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
  Switch,
  FormControlLabel,
  Collapse,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  PhotoCamera as CameraIcon,
  Download as DownloadIcon,
  MoreVert as MoreVertIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
  ArrowBackIos as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIcon,
} from "@mui/icons-material";
import useCameraSource from "./hooks/useCameraSource";
import SerialErrorHandler, {
  ConnectionStatus,
  ErrorTypes,
} from "../SerialErrorHandler";
import SerialCameraService from "./SerialCameraService";
import FloatingCameraPreview from "./FloatingCameraPreview";
import TrainingResultsSection from "./TrainingResultsSection";
import HelpButton, { useHelpBlink } from "../HelpButton";
import Lightbox from "./Lightbox";
import ExpandedClassDialog from "./ExpandedClassDialog";
import useModelTraining from "./hooks/useModelTraining";
import { DEFAULT_TRAINING_SETTINGS } from "./hooks/useModelTraining";
import useModelPrediction from "./hooks/useModelPrediction";
import { downloadCameraFirmware } from "../utils/firmwareDownload";

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

  // Expanded class state
  const [expandedClassId, setExpandedClassId] = useState(null);

  // Camera state
  const previewContainerRef = useRef(null);
  const sampleScrollRefs = useRef({});

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

  // Lightbox state for viewing images fullscreen
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Training settings state
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [trainingSettings, setTrainingSettings] = useState(
    DEFAULT_TRAINING_SETTINGS,
  );

  const language = useSelector((s) => s.general.language);
  const t = getImageTranslations();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isWideScreen = useMediaQuery(theme.breakpoints.up("lg"));

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
    pauseFrameTimeoutMonitor,
    resumeFrameTimeoutMonitor,
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

  const trainedClassesSnapshotRef = useRef(null);

  const getClassesSnapshot = useCallback(
    (cls) =>
      JSON.stringify(
        cls.map((c) => ({ id: c.id, name: c.name, count: c.samples.length })),
      ),
    [],
  );

  const isDataStale = useMemo(() => {
    if (!trainedModel || trainedClassesSnapshotRef.current === null)
      return false;
    return getClassesSnapshot(classes) !== trainedClassesSnapshotRef.current;
  }, [classes, trainedModel, getClassesSnapshot]);

  const {
    isBlinking: webcamBlinking,
    trigger: triggerWebcam,
    markSeen: markWebcamSeen,
  } = useHelpBlink("image/webcam");
  const {
    isBlinking: addClassBlinking,
    trigger: triggerAddClass,
    markSeen: markAddClassSeen,
  } = useHelpBlink("image/addClass");
  const {
    isBlinking: trainModelBlinking,
    trigger: triggerTrainModel,
    markSeen: markTrainModelSeen,
  } = useHelpBlink("image/trainModel");
  const {
    isBlinking: settingsBlinking,
    trigger: triggerSettings,
    markSeen: markSettingsSeen,
  } = useHelpBlink("image/trainingSettings");

  useEffect(() => {
    if (serialError) triggerWebcam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialError]);

  const dialogWasOpenRef = useRef(false);
  useEffect(() => {
    if (showAddDialog) {
      dialogWasOpenRef.current = true;
    } else if (dialogWasOpenRef.current) {
      dialogWasOpenRef.current = false;
      triggerAddClass();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAddDialog]);

  const firstEpochTriggeredRef = useRef(false);
  useEffect(() => {
    if (isTraining) {
      firstEpochTriggeredRef.current = false;
    }
  }, [isTraining]);
  useEffect(() => {
    if (
      isTraining &&
      trainingProgress.batch >= 1 &&
      !firstEpochTriggeredRef.current
    ) {
      firstEpochTriggeredRef.current = true;
      triggerTrainModel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainingProgress.batch]);

  useEffect(() => {
    if (showSettingsPanel) triggerSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSettingsPanel]);

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
    if (newClassName.trim() && classes.length < 4) {
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
          setClasses((prev) => {
            const newClasses = prev.map((cls) =>
              cls.id === classId
                ? {
                    ...cls,
                    samples: [
                      ...cls.samples,
                      { id: Date.now() + Math.random(), url: imageUrl },
                    ],
                  }
                : cls,
            );
            requestAnimationFrame(() => {
              const el = sampleScrollRefs.current[classId];
              if (el) el.scrollTop = el.scrollHeight;
            });
            return newClasses;
          });
        }
      } catch (error) {
        console.error("Error capturing image:", error);
      }
    },
    [isCameraActive, captureFrame],
  );

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

  const openLightbox = useCallback(
    (src, e) => {
      // Only open lightbox on wide screens (like HelpButton behavior)
      if (!isWideScreen) return;
      if (e && e.stopPropagation) e.stopPropagation();
      // determine index in flattened samples list
      setLightboxOpen(true);
      setLightboxSrc(src);
      // index will be set in effect when flatSamples is available
    },
    [isWideScreen],
  );

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setLightboxSrc(null);
    setLightboxIndex(0);
  }, []);

  // flattened list of sample urls (stable order: classes then samples)
  const flatSamples = useMemo(() => {
    return classes.flatMap((c) => c.samples.map((s) => s.url));
  }, [classes]);

  // when opening lightbox set the index based on current src
  useEffect(() => {
    if (lightboxOpen && lightboxSrc) {
      const idx = flatSamples.indexOf(lightboxSrc);
      setLightboxIndex(idx >= 0 ? idx : 0);
    }
  }, [lightboxOpen, lightboxSrc, flatSamples]);

  // update lightboxSrc when index changes
  useEffect(() => {
    if (lightboxOpen) {
      if (flatSamples.length === 0) {
        // nothing left, close
        closeLightbox();
        return;
      }
      const idx = Math.max(0, Math.min(lightboxIndex, flatSamples.length - 1));
      setLightboxIndex(idx);
      setLightboxSrc(flatSamples[idx]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIndex, flatSamples, lightboxOpen]);

  const showPrev = useCallback(() => {
    if (!flatSamples || flatSamples.length === 0) return;
    setLightboxIndex(
      (prev) => (prev - 1 + flatSamples.length) % flatSamples.length,
    );
  }, [flatSamples]);

  const showNext = useCallback(() => {
    if (!flatSamples || flatSamples.length === 0) return;
    setLightboxIndex((prev) => (prev + 1) % flatSamples.length);
  }, [flatSamples]);

  // keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") showPrev();
      else if (e.key === "ArrowRight") showNext();
      else if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, showPrev, showNext, closeLightbox]);

  const removeCurrentLightboxImage = useCallback(() => {
    if (!lightboxSrc) return;
    // find the class and sample id
    let found = false;
    let foundClassId = null;
    let foundSampleId = null;
    for (const c of classes) {
      const s = c.samples.find((samp) => samp.url === lightboxSrc);
      if (s) {
        found = true;
        foundClassId = c.id;
        foundSampleId = s.id;
        break;
      }
    }
    if (!found) return;

    const idx = flatSamples.indexOf(lightboxSrc);
    // perform removal
    removeSample(foundClassId, foundSampleId);

    // decide what to show next
    if (flatSamples.length <= 1) {
      // last image -> close
      closeLightbox();
      return;
    }
    // if deleting last item, show previous one, else keep same index
    const nextIndex = idx >= flatSamples.length - 1 ? idx - 1 : idx;
    setLightboxIndex(Math.max(0, nextIndex));
  }, [lightboxSrc, classes, flatSamples, removeSample, closeLightbox]);

  const trainModel = useCallback(async () => {
    if (classes.length < 2 || classes.some((cls) => cls.samples.length < 2)) {
      onTrainingError(t.training.errorInsufficientData);
      return;
    }

    // Track if this training has enough samples for test results
    const hasEnoughSamples = classes.every((cls) => cls.samples.length >= 10);
    setTrainedWithEnoughSamples(hasEnoughSamples);

    pauseFrameTimeoutMonitor();
    try {
      await executeTraining(
        classes,
        onTrainingStart,
        onTrainingError,
        onModelTrained,
        trainingSettings,
      );
      trainedClassesSnapshotRef.current = getClassesSnapshot(classes);
    } finally {
      resumeFrameTimeoutMonitor();
    }
  }, [
    classes,
    onTrainingStart,
    onTrainingError,
    onModelTrained,
    executeTraining,
    trainingSettings,
    getClassesSnapshot,
    t,
    pauseFrameTimeoutMonitor,
    resumeFrameTimeoutMonitor,
  ]);

  const resetSettings = useCallback(() => {
    setTrainingSettings(DEFAULT_TRAINING_SETTINGS);
  }, []);

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
                onClick={async () => {
                  if (sourceType === "webcam" && isCameraActive) {
                    stopCamera();
                  } else {
                    if (isCameraActive) stopCamera();
                    await selectSource("webcam");
                    await startCamera();
                    triggerWebcam();
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
                onClick={() => {
                  markWebcamSeen();
                  onOpenHelp && onOpenHelp("image/webcam");
                }}
                isBlinking={webcamBlinking}
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
                    onClick={async () => {
                      if (sourceType === "serial" && isCameraActive) {
                        stopCamera();
                      } else {
                        if (isCameraActive) stopCamera();
                        await selectSource("serial");
                        await startCamera();
                        triggerWebcam();
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
                <SerialErrorHandler
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

                    {isDataStale && (
                      <Box
                        sx={{
                          mt: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: "warning.main",
                        }}
                      >
                        <WarningIcon fontSize="small" />
                        <Typography variant="caption">
                          {t.training.dataChangedWarning}
                        </Typography>
                      </Box>
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
                <Card
                  onClick={(e) => {
                    if (!isWideScreen) return;
                    if (
                      !e.target.closest("button") &&
                      !e.target.closest("input") &&
                      !e.target.closest(".MuiTypography-root") &&
                      !e.target.closest("img")
                    ) {
                      setExpandedClassId(cls.id);
                    }
                  }}
                  sx={{ cursor: "pointer", "&:hover": { boxShadow: 4 } }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      {editingClassId === cls.id &&
                      expandedClassId !== cls.id ? (
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
                        <Tooltip
                          title={t.training.tooltip.desirableNumberSamples}
                          arrow
                        >
                          <Chip
                            label={`${cls.samples.length} ${t.training.samples}`}
                            size="small"
                            color={
                              cls.samples.length >= 100
                                ? "success"
                                : cls.samples.length >= 10
                                  ? "warning"
                                  : cls.samples.length > 0
                                    ? "error"
                                    : "default"
                            }
                          />
                        </Tooltip>
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
                      ref={(el) => {
                        sampleScrollRefs.current[cls.id] = el;
                      }}
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
                        marginBottom: 0,
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
                            onClick={(e) => openLightbox(sample.url, e)}
                            style={{
                              width: 60,
                              height: 60,
                              objectFit: "cover",
                              borderRadius: 4,
                              cursor: "pointer",
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
                          variant="contained"
                          size="medium"
                          startIcon={<CameraIcon />}
                          onClick={() => {
                            captureImage(cls.id);
                          }}
                          disabled={!isCameraActive || disabled}
                        >
                          {t.training.captureImage}
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
            {classes.length < 4 && (
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
                  onClick={() => {
                    markAddClassSeen();
                    onOpenHelp && onOpenHelp("image/addClass");
                  }}
                  isBlinking={addClassBlinking}
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
                    onClick={() => {
                      trainModel();
                    }}
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

              <Tooltip title={t.training.tooltip.trainingSettings} arrow>
                <IconButton
                  onClick={() => setShowSettingsPanel((prev) => !prev)}
                  disabled={disabled || isTraining}
                  size="small"
                  color={showSettingsPanel ? "primary" : "default"}
                >
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>

              <HelpButton
                onClick={() => {
                  markTrainModelSeen();
                  onOpenHelp && onOpenHelp("image/trainModel");
                }}
                isBlinking={trainModelBlinking}
                tooltip={t.training.tooltip.helpTraining}
              />
            </Box>

            <Collapse in={showSettingsPanel} sx={{ width: "100%" }}>
              <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {t.training.settings?.title || "Training Settings"}
                  </Typography>
                  <HelpButton
                    onClick={() => {
                      markSettingsSeen();
                      onOpenHelp && onOpenHelp("image/trainingSettings");
                    }}
                    isBlinking={settingsBlinking}
                    tooltip={t.training.tooltip.helpTrainingSettings}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  <TextField
                    label={t.training.settings?.epochs || "Max Epochs"}
                    type="number"
                    size="small"
                    value={trainingSettings.epochs}
                    onChange={(e) => {
                      const value = Math.max(
                        1,
                        Math.min(200, parseInt(e.target.value) || 1),
                      );
                      setTrainingSettings((prev) => ({
                        ...prev,
                        epochs: value,
                      }));
                    }}
                    inputProps={{ min: 1, max: 200 }}
                    sx={{ flex: 1, minWidth: 100 }}
                  />
                  <TextField
                    label={t.training.settings?.learningRate || "Learning Rate"}
                    type="number"
                    size="small"
                    value={trainingSettings.learningRate}
                    onChange={(e) => {
                      const value = Math.max(
                        0.000001,
                        Math.min(0.1, parseFloat(e.target.value) || 0.0001),
                      );
                      setTrainingSettings((prev) => ({
                        ...prev,
                        learningRate: value,
                      }));
                    }}
                    inputProps={{ min: 0.000001, max: 0.1, step: 0.0001 }}
                    sx={{ flex: 1, minWidth: 120 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={trainingSettings.earlyStopping}
                        onChange={(e) =>
                          setTrainingSettings((prev) => ({
                            ...prev,
                            earlyStopping: e.target.checked,
                          }))
                        }
                        size="small"
                      />
                    }
                    label={
                      t.training.settings?.earlyStopping || "Early Stopping"
                    }
                    sx={{ flex: "none" }}
                  />
                  <Button
                    size="small"
                    onClick={resetSettings}
                    color="secondary"
                    sx={{ flex: "none" }}
                  >
                    {t.training.settings?.reset || "Reset"}
                  </Button>
                </Box>
              </Paper>
            </Collapse>
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

      <ExpandedClassDialog
        open={expandedClassId !== null}
        cls={classes.find((c) => c.id === expandedClassId)}
        onClose={() => setExpandedClassId(null)}
        editingClassId={editingClassId}
        editingClassName={editingClassName}
        onStartEditing={startEditingClass}
        onSaveRename={saveClassRename}
        onCancelEditing={cancelEditingClass}
        sampleScrollRefs={sampleScrollRefs}
        openLightbox={openLightbox}
        removeSample={removeSample}
        disabled={disabled}
        t={t}
      />

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
          <Tooltip
            title={
              classes.some(
                (cls) =>
                  cls.name.toLowerCase() === newClassName.trim().toLowerCase(),
              )
                ? t.training.tooltip.classNameExists
                : ""
            }
            arrow
            disableHoverListener={
              !classes.some(
                (cls) =>
                  cls.name.toLowerCase() === newClassName.trim().toLowerCase(),
              )
            }
          >
            <span>
              <Button
                onClick={addClass}
                variant="contained"
                disabled={
                  !newClassName.trim() ||
                  classes.some(
                    (cls) =>
                      cls.name.toLowerCase() ===
                      newClassName.trim().toLowerCase(),
                  )
                }
              >
                {t.training.add}
              </Button>
            </span>
          </Tooltip>
        </DialogActions>
      </Dialog>

      <Lightbox
        open={lightboxOpen}
        src={lightboxSrc}
        flatSamples={flatSamples}
        onClose={closeLightbox}
        onPrev={showPrev}
        onNext={showNext}
        onDelete={removeCurrentLightboxImage}
      />
    </Box>
  );
};

export default ModelTrainer;
