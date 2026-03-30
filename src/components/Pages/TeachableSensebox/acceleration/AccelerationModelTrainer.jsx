import React, { useState, useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { getAccelerationTranslations } from "./translations";
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
  Tooltip,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  FiberManualRecord as RecordIcon,
  Speed as SensorIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import useAccelerometerSource from "./hooks/useAccelerometerSource";
import AccelerometerService from "./AccelerometerService";
import useAccelerationModelTraining from "./hooks/useAccelerationModelTraining";
import useAccelerationModelPrediction from "./hooks/useAccelerationModelPrediction";
import HelpButton from "../HelpButton";
import FloatingAccelerometerGraph from "./FloatingAccelerometerGraph";
import SerialCameraErrorHandler, {
  ErrorTypes,
  ConnectionStatus,
} from "../SerialCameraErrorHandler";
import { downloadAccelerometerFirmware } from "../utils/firmwareDownload";
import PrebuiltDatasetSelector from "./PrebuiltDatasetSelector";
import { loadSelectedClasses } from "../../../../data/acceleration-datasets";

// ─── SampleThumbnail ─────────────────────────────────────────────────────────
// A small square canvas showing the X/Y/Z graph of a recorded gesture sample.

const THUMB_SIZE = 56;
const THUMB_COLORS = { x: "#e53935", y: "#43a047", z: "#1e88e5" };

const SampleThumbnail = ({ sample, onDelete }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const readings = sample.readings;
    if (!readings || readings.length < 2) return;

    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, W, H);

    let minVal = Infinity;
    let maxVal = -Infinity;
    for (const s of readings) {
      minVal = Math.min(minVal, s.x, s.y, s.z);
      maxVal = Math.max(maxVal, s.x, s.y, s.z);
    }
    const range = maxVal - minVal || 1;
    const pad = range * 0.08;
    const lo = minVal - pad;
    const hi = maxVal + pad;
    const toY = (v) => H - ((v - lo) / (hi - lo)) * H;
    const n = readings.length;

    for (const axis of ["x", "y", "z"]) {
      ctx.strokeStyle = THUMB_COLORS[axis];
      ctx.lineWidth = 1;
      ctx.beginPath();
      readings.forEach((s, i) => {
        const px = (i / (n - 1)) * W;
        const py = toY(s[axis]);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
    }
  }, [sample]);

  return (
    <Box
      sx={{
        position: "relative",
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        borderRadius: 1,
        overflow: "hidden",
        flexShrink: 0,
        cursor: "default",
        "&:hover .delete-overlay": { opacity: 1 },
      }}
      title={new Date(sample.recordedAt).toLocaleTimeString()}
    >
      <canvas
        ref={canvasRef}
        width={THUMB_SIZE}
        height={THUMB_SIZE}
        style={{ display: "block", width: THUMB_SIZE, height: THUMB_SIZE }}
      />
      {/* Delete overlay on hover */}
      <Box
        className="delete-overlay"
        onClick={() => onDelete(sample.id)}
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.55)",
          opacity: 0,
          transition: "opacity 0.15s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <DeleteIcon sx={{ color: "white", fontSize: 18 }} />
      </Box>
    </Box>
  );
};

// ─── InlineAccelerometerGraph ─────────────────────────────────────────────────
// A static canvas graph rendered inline for desktop layout, reusing the same
// canvas drawing logic as FloatingAccelerometerGraph.

const INLINE_WIDTH = 480;
const INLINE_HEIGHT = 120;
const INLINE_HISTORY = 120;
const AXIS_COLORS_INLINE = { x: "#e53935", y: "#43a047", z: "#1e88e5" };

const InlineAccelerometerGraph = ({ latestSample, label }) => {
  const canvasRef = useRef(null);
  const historyRef = useRef([]);

  useEffect(() => {
    if (!latestSample) return;
    historyRef.current.push(latestSample);
    if (historyRef.current.length > INLINE_HISTORY) historyRef.current.shift();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const history = historyRef.current;
    const W = canvas.width;
    const H = canvas.height;

    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, H / 2);
    ctx.lineTo(W, H / 2);
    ctx.stroke();

    if (history.length < 2) return;

    let minVal = Infinity;
    let maxVal = -Infinity;
    for (const s of history) {
      minVal = Math.min(minVal, s.x, s.y, s.z);
      maxVal = Math.max(maxVal, s.x, s.y, s.z);
    }
    const range = maxVal - minVal || 1;
    const pad = range * 0.1;
    const lo = minVal - pad;
    const hi = maxVal + pad;
    const toY = (v) => H - ((v - lo) / (hi - lo)) * H;

    for (const axis of ["x", "y", "z"]) {
      ctx.strokeStyle = AXIS_COLORS_INLINE[axis];
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      history.forEach((s, i) => {
        const px = (i / (INLINE_HISTORY - 1)) * W;
        const py = toY(s[axis]);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
    }

    // Legend
    let ly = 14;
    for (const axis of ["x", "y", "z"]) {
      const latest = history[history.length - 1];
      ctx.fillStyle = AXIS_COLORS_INLINE[axis];
      ctx.font = "bold 10px monospace";
      ctx.fillText(`${axis.toUpperCase()} ${latest[axis].toFixed(2)}`, 6, ly);
      ly += 14;
    }
  }, [latestSample]);

  return (
    <Box
      sx={{
        borderRadius: 1,
        overflow: "hidden",
        bgcolor: "#111",
        display: "inline-block",
      }}
    >
      {label && (
        <Typography
          variant="caption"
          sx={{
            color: "grey.400",
            px: 1,
            py: 0.5,
            display: "block",
            bgcolor: "grey.900",
          }}
        >
          {label}
        </Typography>
      )}
      <canvas
        ref={canvasRef}
        width={INLINE_WIDTH}
        height={INLINE_HEIGHT}
        style={{ display: "block", width: "100%", height: INLINE_HEIGHT }}
      />
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const GESTURE_DURATION_MS = 2000;
const RECORDING_COUNTDOWN_STEPS = 2; // seconds before recording starts

const AccelerationModelTrainer = ({
  classes,
  onClassesChange,
  onModelTrained,
  onTrainingStart,
  onTrainingError,
  isTraining,
  disabled,
  onOpenHelp,
  modelConfig,
  activeGroupKeys,
}) => {
  const [newClassName, setNewClassName] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingClassId, setEditingClassId] = useState(null);
  const [editingClassName, setEditingClassName] = useState("");
  const [recordingClassId, setRecordingClassId] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [bulkProgress, setBulkProgress] = useState(null);
  const [trainedWithEnoughSamples, setTrainedWithEnoughSamples] =
    useState(false);
  const countdownRef = useRef(null);
  const [isFloatingGraphCollapsed, setIsFloatingGraphCollapsed] =
    useState(false);
  const [trainingTab, setTrainingTab] = useState(0);
  const [prebuiltSelections, setPrebuiltSelections] = useState([]);

  const language = useSelector((s) => s.general.language);
  const t = getAccelerationTranslations();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isDownloading, setIsDownloading] = useState(false);

  const {
    isConnected,
    isConnecting,
    error: sensorError,
    latestSample,
    dataTimeoutError,
    connect,
    disconnect,
    recordGesture,
    isSupported,
  } = useAccelerometerSource();

  const {
    trainModel: executeTraining,
    trainingProgress,
    trainingMetrics,
    testResults,
    finalAccuracy,
    trainedModel,
  } = useAccelerationModelTraining();

  const { predictions } = useAccelerationModelPrediction(
    trainedModel,
    latestSample,
    isConnected,
  );

  const handleDownloadFirmware = async () => {
    setIsDownloading(true);
    const result = await downloadAccelerometerFirmware();
    if (!result.success) {
      alert(`Failed to download firmware: ${result.error}`);
    }
    setIsDownloading(false);
  };

  // ─── Class management ────────────────────────────────────────────────────

  const addClass = useCallback(() => {
    if (newClassName.trim() && classes.length < 5) {
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
      onClassesChange((prev) => [
        ...prev,
        { id: Date.now(), name: trimmedName, samples: [] },
      ]);
      setNewClassName("");
      setShowAddDialog(false);
    }
  }, [newClassName, classes, onClassesChange, onTrainingError, t]);

  const deleteClass = useCallback(
    (classId) => {
      onClassesChange((prev) => prev.filter((cls) => cls.id !== classId));
    },
    [onClassesChange],
  );

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
      onClassesChange((prev) =>
        prev.map((cls) =>
          cls.id === editingClassId ? { ...cls, name: trimmedName } : cls,
        ),
      );
      setEditingClassId(null);
      setEditingClassName("");
    }
  }, [
    editingClassName,
    editingClassId,
    classes,
    onClassesChange,
    onTrainingError,
    t,
  ]);

  const cancelEditingClass = useCallback(() => {
    setEditingClassId(null);
    setEditingClassName("");
  }, []);

  const removeSample = useCallback(
    (classId, sampleId) => {
      onClassesChange((prev) =>
        prev.map((cls) =>
          cls.id === classId
            ? { ...cls, samples: cls.samples.filter((s) => s.id !== sampleId) }
            : cls,
        ),
      );
    },
    [onClassesChange],
  );

  // ─── Prebuilt dataset loading ────────────────────────────────────────────

  const buildPrebuiltClasses = useCallback((selections) => {
    const language = (window.localStorage.getItem("locale") || "de_DE").split(
      "_",
    )[0];
    return loadSelectedClasses(selections).map((cls) => ({
      id: cls.id,
      name:
        typeof cls.name === "object"
          ? cls.name[language] || cls.name.en
          : cls.name,
      samples: cls.samples,
      isPrebuilt: true,
    }));
  }, []);

  // ─── Gesture recording ───────────────────────────────────────────────────

  const startRecording = useCallback(
    async (classId) => {
      if (!isConnected || recordingClassId !== null) return;

      setRecordingClassId(classId);
      setCountdown(RECORDING_COUNTDOWN_STEPS);

      // Countdown
      let remaining = RECORDING_COUNTDOWN_STEPS;
      await new Promise((resolve) => {
        countdownRef.current = setInterval(() => {
          remaining -= 1;
          setCountdown(remaining);
          if (remaining <= 0) {
            clearInterval(countdownRef.current);
            resolve();
          }
        }, 1000);
      });

      setCountdown(0); // recording
      try {
        const readings = await recordGesture(GESTURE_DURATION_MS);
        if (readings.length > 0) {
          onClassesChange((prev) =>
            prev.map((cls) =>
              cls.id === classId
                ? {
                    ...cls,
                    samples: [
                      ...cls.samples,
                      {
                        id: Date.now() + Math.random(),
                        readings,
                        recordedAt: Date.now(),
                      },
                    ],
                  }
                : cls,
            ),
          );
        }
      } catch (err) {
        console.error("Error recording gesture:", err);
      } finally {
        setRecordingClassId(null);
        setCountdown(null);
      }
    },
    [isConnected, recordingClassId, recordGesture, onClassesChange],
  );

  const startBulkRecording = useCallback(
    async (classId, count = 10) => {
      if (!isConnected || recordingClassId !== null) return;

      setRecordingClassId(classId);
      setBulkProgress({ current: 0, total: count });
      setCountdown(RECORDING_COUNTDOWN_STEPS);

      let remaining = RECORDING_COUNTDOWN_STEPS;
      await new Promise((resolve) => {
        countdownRef.current = setInterval(() => {
          remaining -= 1;
          setCountdown(remaining);
          if (remaining <= 0) {
            clearInterval(countdownRef.current);
            resolve();
          }
        }, 1000);
      });

      for (let i = 0; i < count; i++) {
        setBulkProgress({ current: i + 1, total: count });
        setCountdown(0);
        try {
          const readings = await recordGesture(GESTURE_DURATION_MS);
          if (readings.length > 0) {
            onClassesChange((prev) =>
              prev.map((cls) =>
                cls.id === classId
                  ? {
                      ...cls,
                      samples: [
                        ...cls.samples,
                        {
                          id: Date.now() + Math.random(),
                          readings,
                          recordedAt: Date.now(),
                        },
                      ],
                    }
                  : cls,
              ),
            );
          }
        } catch (err) {
          console.error("Error recording gesture in bulk:", err);
          break;
        }
      }

      setRecordingClassId(null);
      setCountdown(null);
      setBulkProgress(null);
    },
    [isConnected, recordingClassId, recordGesture, onClassesChange],
  );

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // ─── Training ────────────────────────────────────────────────────────────

  const trainModel = useCallback(async () => {
    let classesToTrain = classes;

    if (trainingTab === 0) {
      // Load prebuilt classes at train-time
      classesToTrain = buildPrebuiltClasses(prebuiltSelections);
      if (classesToTrain.length < 2) {
        onTrainingError(t.training.errorInsufficientData);
        return;
      }
      // Sync into parent state so the rest of the UI reflects the loaded classes
      onClassesChange(classesToTrain);
    } else {
      if (classes.length < 2 || classes.some((cls) => cls.samples.length < 2)) {
        onTrainingError(t.training.errorInsufficientData);
        return;
      }
    }

    const hasEnoughSamples = classesToTrain.every(
      (cls) => cls.samples.length >= 10,
    );
    setTrainedWithEnoughSamples(hasEnoughSamples);

    await executeTraining(
      classesToTrain,
      onTrainingStart,
      onTrainingError,
      onModelTrained,
      modelConfig,
      activeGroupKeys,
    );
  }, [
    classes,
    trainingTab,
    prebuiltSelections,
    buildPrebuiltClasses,
    onClassesChange,
    onTrainingStart,
    onTrainingError,
    onModelTrained,
    executeTraining,
    modelConfig,
    activeGroupKeys,
    t,
  ]);

  // ─── Render ───────────────────────────────────────────────────────────────

  const canAddClass = classes.length < 5;
  const canTrain =
    trainingTab === 0
      ? prebuiltSelections.length >= 2
      : classes.length >= 2 && classes.every((cls) => cls.samples.length >= 2);

  return (
    <Box>
      {/* Connection Controls */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          gap: 1,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Tooltip
          title={!isSupported ? t.training.tooltip.browserCompatible : ""}
          arrow
          disableHoverListener={isSupported}
        >
          <span>
            <Button
              variant="contained"
              startIcon={
                isConnecting ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <SensorIcon />
                )
              }
              onClick={isConnected ? disconnect : connect}
              disabled={disabled || isConnecting || !isSupported}
              color={isConnected ? "secondary" : "primary"}
            >
              {isConnecting
                ? t.training.connecting
                : isConnected
                  ? t.training.disconnectSenseBox
                  : t.training.connectSenseBox}
            </Button>
          </span>
        </Tooltip>

        {!isConnected && !dataTimeoutError && !sensorError && isSupported && (
          <Button
            variant="outlined"
            startIcon={
              isDownloading ? <CircularProgress size={16} /> : <DownloadIcon />
            }
            onClick={handleDownloadFirmware}
            disabled={isDownloading || disabled || !isSupported}
          >
            {t.errors.downloadFirmware}
          </Button>
        )}
      </Box>

      {/* serial connection error */}
      {((isConnected && dataTimeoutError) || (!isConnected && sensorError)) && (
        <Box sx={{ mb: 3 }}>
          <SerialCameraErrorHandler
            error={
              !isConnected && sensorError
                ? {
                    type: sensorError.type || ErrorTypes.CONNECTION_FAILED,
                    message: sensorError.message,
                  }
                : {
                    type: ErrorTypes.CONNECTION_FAILED,
                    message: t.errors.dataTimeoutMessage,
                  }
            }
            connectionStatus={ConnectionStatus.CONNECTED}
            onRetry={async () => {
              await disconnect();
              await connect();
            }}
            onDismiss={() => disconnect()}
            showStatus={false}
            overrides={{
              errorTitle: t.errors.connectionFailed,
              errorMessage: t.errors.connectionFailedMessage,
              troubleshootingFirmware: t.errors.troubleshootingFirmware,
              downloadFirmwareLabel: t.errors.downloadFirmware,
              downloadFirmwareFn: downloadAccelerometerFirmware,
            }}
          />
        </Box>
      )}

      {/* Floating graph — mobile (always) and desktop when connected */}
      {isConnected && !dataTimeoutError && isMobile && (
        <FloatingAccelerometerGraph
          latestSample={latestSample}
          isCollapsed={isFloatingGraphCollapsed}
          onToggleCollapse={() => setIsFloatingGraphCollapsed((v) => !v)}
          predictions={predictions}
          trainedModel={trainedModel}
        />
      )}

      {/* Desktop: inline graph + live predictions side by side */}
      {isConnected && !dataTimeoutError && !isMobile && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            mb: 3,
            alignItems: "flex-start",
          }}
        >
          <InlineAccelerometerGraph
            latestSample={latestSample}
            label={t.training.liveAccelerometer}
          />
          {trainedModel && (
            <Box sx={{ flex: 1, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                {t.training.livePredictions}
              </Typography>
              {predictions.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  {t.training.analyzing}
                </Typography>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {predictions.map((pred, index) => (
                    <Box
                      key={pred.className}
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        bgcolor: pred.isTopPrediction
                          ? "primary.light"
                          : "background.paper",
                        color: pred.isTopPrediction
                          ? "primary.contrastText"
                          : "text.primary",
                        border: pred.isTopPrediction ? "none" : "1px solid",
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
                          fontWeight={pred.isTopPrediction ? "bold" : "normal"}
                        >
                          {pred.className}
                        </Typography>
                        <Typography variant="body2">
                          {(pred.probability * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={pred.probability * 100}
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
              )}
            </Box>
          )}
        </Box>
      )}

      {/* ─── Training Tabs ───────────────────────────────────────────────── */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 3 }}>
        <Tabs value={trainingTab} onChange={(_, v) => setTrainingTab(v)}>
          <Tab label={t.training.tabPrebuilt || "Pre-built Datasets"} />
          <Tab label={t.training.tabCustom || "Record Your Own"} />
        </Tabs>
      </Box>

      {/* Tab 0: Pre-built Datasets */}
      {trainingTab === 0 && (
        <Box sx={{ pt: 2 }}>
          <PrebuiltDatasetSelector
            onSelectionsChange={setPrebuiltSelections}
            disabled={disabled || isTraining}
          />
        </Box>
      )}

      {/* Tab 1: Record Your Own */}
      {trainingTab === 1 && (
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", pt: 2 }}>
          {classes.map((cls) => {
            const isRecording = recordingClassId === cls.id;
            return (
              <Card
                key={cls.id}
                variant="outlined"
                sx={{ minWidth: 200, flex: "1 1 200px", maxWidth: 320 }}
              >
                <CardContent>
                  {editingClassId === cls.id ? (
                    <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                      <TextField
                        size="small"
                        value={editingClassName}
                        onChange={(e) => setEditingClassName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveClassRename();
                          if (e.key === "Escape") cancelEditingClass();
                        }}
                        autoFocus
                      />
                      <Button size="small" onClick={saveClassRename}>
                        OK
                      </Button>
                      <Button size="small" onClick={cancelEditingClass}>
                        {t.training.cancel}
                      </Button>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ cursor: "pointer", fontWeight: "medium" }}
                        onClick={() => startEditingClass(cls.id, cls.name)}
                      >
                        {cls.name}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => deleteClass(cls.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}

                  {/* Sample thumbnails */}
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.75,
                      mt: 1,
                      mb: 1,
                    }}
                  >
                    {cls.samples.map((sample) => (
                      <SampleThumbnail
                        key={sample.id}
                        sample={sample}
                        onDelete={(id) => removeSample(cls.id, id)}
                      />
                    ))}
                  </Box>

                  {/* Recording state */}
                  {isRecording && countdown !== null && countdown > 0 && (
                    <Typography variant="body2" color="primary">
                      {t.training.recordingCountdown.replace(
                        "{seconds}",
                        countdown,
                      )}
                    </Typography>
                  )}
                  {isRecording && countdown === 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography
                        variant="body2"
                        color="error"
                        sx={{ mb: 0.5 }}
                      >
                        {bulkProgress
                          ? t.training.recordingBulk
                              .replace("{current}", bulkProgress.current)
                              .replace("{total}", bulkProgress.total)
                          : t.training.recording}
                      </Typography>
                      <LinearProgress
                        color="error"
                        variant={bulkProgress ? "determinate" : "indeterminate"}
                        value={
                          bulkProgress
                            ? (bulkProgress.current / bulkProgress.total) * 100
                            : undefined
                        }
                      />
                    </Box>
                  )}
                </CardContent>
                <CardActions sx={{ gap: 0.5, p: 1 }}>
                  <Tooltip
                    title={
                      !isConnected ? t.training.tooltip.startConnection : ""
                    }
                    arrow
                  >
                    <span style={{ flex: 1 }}>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        fullWidth
                        startIcon={<RecordIcon />}
                        onClick={() => startRecording(cls.id)}
                        disabled={
                          !isConnected ||
                          dataTimeoutError ||
                          recordingClassId !== null
                        }
                      >
                        {t.training.record}
                      </Button>
                    </span>
                  </Tooltip>
                  <Tooltip
                    title={
                      !isConnected ? t.training.tooltip.startConnection : ""
                    }
                    arrow
                  >
                    <span>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => startBulkRecording(cls.id, 10)}
                        disabled={
                          !isConnected ||
                          dataTimeoutError ||
                          recordingClassId !== null
                        }
                        sx={{ minWidth: 0, px: 1.5 }}
                      >
                        {t.training.recordBulk}
                      </Button>
                    </span>
                  </Tooltip>
                </CardActions>
              </Card>
            );
          })}

          {/* Add Class button */}
          {canAddClass && (
            <Box sx={{ display: "flex", alignItems: "flex-start" }}>
              <Card
                variant="outlined"
                sx={{
                  minWidth: 200,
                  flex: "1 1 200px",
                  maxWidth: 320,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  border: "2px dashed",
                  borderColor: "grey.400",
                  "&:hover": { borderColor: "primary.main" },
                }}
                onClick={() => setShowAddDialog(true)}
              >
                <Box sx={{ textAlign: "center", p: 3 }}>
                  <AddIcon sx={{ fontSize: 32, color: "grey.500" }} />
                  <Typography variant="body2" color="text.secondary">
                    {t.training.addClass}
                  </Typography>
                </Box>
              </Card>

              <HelpButton
                onClick={() => onOpenHelp && onOpenHelp("addClass")}
                tooltip={t.training.tooltip.helpAddClass}
              />
            </Box>
          )}
        </Box>
      )}

      {/* Train button */}
      <Box sx={{ mt: 3, display: "flex", gap: 1, alignItems: "center" }}>
        <Tooltip
          title={
            !canTrain
              ? classes.length < 2
                ? t.training.tooltip.moreClasses
                : t.training.tooltip.moreSamples
              : ""
          }
          arrow
        >
          <span>
            <Button
              variant="contained"
              onClick={trainModel}
              disabled={!canTrain || isTraining}
              size="large"
            >
              {isTraining
                ? t.training.trainingInProgress
                : t.training.trainModel}
            </Button>
          </span>
        </Tooltip>
        <HelpButton
          onClick={() => onOpenHelp && onOpenHelp("trainModel")}
          tooltip={t.training.tooltip.helpTraining}
        />
      </Box>

      {/* Training progress */}
      {isTraining && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {t.training.trainingEpoch
              .replace("{epoch}", trainingProgress.epoch)
              .replace("{totalEpochs}", trainingProgress.totalEpochs)}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={
              trainingProgress.totalEpochs
                ? (trainingProgress.epoch / trainingProgress.totalEpochs) * 100
                : 0
            }
            sx={{ mt: 1 }}
          />
        </Box>
      )}

      {/* Final accuracy after training */}
      {!isTraining && finalAccuracy !== null && finalAccuracy !== undefined && (
        <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {t.training.testResultsTitle}:
          </Typography>
          <Chip
            label={`${t.training.finalAccuracy}: ${(finalAccuracy * 100).toFixed(1)}%`}
            color={
              finalAccuracy >= 0.8
                ? "success"
                : finalAccuracy >= 0.6
                  ? "warning"
                  : "error"
            }
            size="small"
          />
        </Box>
      )}

      {/* Add Class Dialog */}
      <Dialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t.training.addNewClass}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t.training.className}
            fullWidth
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addClass();
              if (e.key === "Escape") setShowAddDialog(false);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddDialog(false)}>
            {t.training.cancel}
          </Button>
          <Button
            onClick={addClass}
            variant="contained"
            disabled={!newClassName.trim()}
          >
            {t.training.add}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccelerationModelTrainer;
