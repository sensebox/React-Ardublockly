import React, { useState, useCallback, useEffect, useRef, memo } from "react";
import { useSelector } from "react-redux";
import { getSpellTranslations } from "./translations";
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
  Tooltip,
  CircularProgress,
  Chip,
  useTheme,
  useMediaQuery,
  Paper,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  FiberManualRecord as RecordIcon,
  Speed as SensorIcon,
  Download as DownloadIcon,
  Bluetooth as BluetoothIcon,
} from "@mui/icons-material";
import useSpellSource from "./hooks/useSpellSource";
import useSpellBLESource, { StrokeState } from "./hooks/useSpellBLESource";
import useSpellModelTraining, {
  renderStrokeToImage,
} from "./hooks/useSpellModelTraining";
import useSpellModelPrediction from "./hooks/useSpellModelPrediction";
import NeuralNetworkVisualization from "./NeuralNetworkVisualization";
import HelpButton, { useHelpBlink } from "../HelpButton";
import SerialErrorHandler, {
  ErrorTypes,
  ConnectionStatus,
} from "../SerialErrorHandler";
import TrainingResultsSection from "../image/TrainingResultsSection";
import { downloadSpellFirmware } from "../utils/firmwareDownload";

// ─── Dimensions for stroke visualization ─────────────────────────────────────
const STROKE_CANVAS_SIZE = 320;

// ─── StrokeMiniPreview ───────────────────────────────────────────────────────
// Small preview of a stored spell sample — rendered at 32×32 matching training
const MINI_SIZE = 80;
const MINI_RENDER_SIZE = 32;

const StrokeMiniPreview = memo(({ strokePoints, onDelete }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const S = MINI_RENDER_SIZE;
    const halfSize = S / 2;

    // Black background — identical to training
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, S, S);

    if (!strokePoints || strokePoints.length === 0) return;

    const n = strokePoints.length;

    if (n === 1) {
      const px = halfSize + strokePoints[0].x * halfSize;
      const py = halfSize - strokePoints[0].y * halfSize;
      ctx.fillStyle = "rgb(128,128,128)";
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // RGB temporal gradient — identical to renderStrokeToImage in training
    for (let i = 1; i < n; i++) {
      const t = n > 2 ? (i - 1) / (n - 2) : 0;
      const r = Math.round(255 * (1 - t));
      const b = Math.round(255 * t);
      const { x: x0, y: y0 } = strokePoints[i - 1];
      const { x: x1, y: y1 } = strokePoints[i];
      ctx.strokeStyle = `rgb(${r},128,${b})`;
      ctx.beginPath();
      ctx.moveTo(halfSize + x0 * halfSize, halfSize - y0 * halfSize);
      ctx.lineTo(halfSize + x1 * halfSize, halfSize - y1 * halfSize);
      ctx.stroke();
    }
  }, [strokePoints]);

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-block",
        border: 1,
        borderColor: "grey.600",
        borderRadius: 1,
        overflow: "hidden",
        "&:hover .delete-btn": { opacity: 1 },
      }}
    >
      <canvas
        ref={canvasRef}
        width={MINI_RENDER_SIZE}
        height={MINI_RENDER_SIZE}
        style={{
          display: "block",
          width: MINI_SIZE,
          height: MINI_SIZE,
          imageRendering: "pixelated",
        }}
      />
      <IconButton
        className="delete-btn"
        size="small"
        onClick={onDelete}
        sx={{
          position: "absolute",
          top: 2,
          right: 2,
          opacity: 0,
          transition: "opacity 0.15s",
          bgcolor: "rgba(0,0,0,0.6)",
          color: "white",
          p: 0.25,
          "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
        }}
      >
        <DeleteIcon sx={{ fontSize: 14 }} />
      </IconButton>
    </Box>
  );
});

// ─── ClassCardItem ────────────────────────────────────────────────────────────
const ClassCardItem = memo(
  ({
    cls,
    isEditing,
    editingClassName,
    isConnected,
    dataTimeoutError,
    isRecording,
    recordingInProgress,
    onToggleRecording,
    onDeleteClass,
    onStartEditingClass,
    onSaveClassRename,
    onCancelEditingClass,
    onRemoveSample,
    onEditNameChange,
    t,
  }) => {
    const scrollRef = useRef(null);
    useEffect(() => {
      if (scrollRef.current)
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [cls.samples.length]);

    const handleRecord = useCallback([cls.id, onToggleRecording]);
    const handleDelete = useCallback(
      () => onDeleteClass(cls.id),
      [cls.id, onDeleteClass],
    );
    const handleStartEdit = useCallback(
      () => onStartEditingClass(cls.id, cls.name),
      [cls.id, cls.name, onStartEditingClass],
    );
    const handleRemoveSample = useCallback(
      (sampleId) => onRemoveSample(cls.id, sampleId),
      [cls.id, onRemoveSample],
    );

    return (
      <Card
        variant="outlined"
        sx={{
          minWidth: 220,
          flex: "1 1 220px",
          maxWidth: 360,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent>
          {isEditing ? (
            <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
              <TextField
                size="small"
                value={editingClassName}
                onChange={(e) => onEditNameChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSaveClassRename();
                  if (e.key === "Escape") onCancelEditingClass();
                }}
                onBlur={onSaveClassRename}
                autoFocus
                fullWidth
              />
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
                onClick={handleStartEdit}
              >
                {cls.name}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Tooltip
                  title={t.training.tooltip.desirableNumberSamples}
                  arrow
                >
                  <Chip
                    label={`${cls.samples.length} ${t.training?.samples || "samples"}`}
                    size="small"
                    color={
                      cls.samples.length >= 8
                        ? "success"
                        : cls.samples.length >= 3
                          ? "warning"
                          : cls.samples.length > 0
                            ? "error"
                            : "default"
                    }
                  />
                </Tooltip>
                <IconButton size="small" onClick={handleDelete}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          )}

          {/* Sample preview grid */}
          <Box
            ref={scrollRef}
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignContent: "flex-start",
              gap: 0.5,
              mt: 1,
              mb: 1,
              height: 180,
              overflowY: "auto",
              p: 1,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              bgcolor: "grey.50",
            }}
          >
            {cls.samples.map((sample) => (
              <StrokeMiniPreview
                key={sample.id}
                strokePoints={sample.strokePoints}
                onDelete={() => handleRemoveSample(sample.id)}
              />
            ))}
          </Box>
        </CardContent>

        <CardActions sx={{ gap: 0.5, p: 1 }}>
          <Tooltip
            title={
              !isConnected
                ? t.training?.tooltip?.startConnection ||
                  "Connect senseBox first"
                : ""
            }
            arrow
          >
            <span style={{ flex: 1 }}>
              <Button
                variant="contained"
                color={isRecording ? "secondary" : "error"}
                size="small"
                fullWidth
                startIcon={<RecordIcon />}
                onClick={handleRecord}
                disabled={!isConnected || dataTimeoutError}
              >
                {isRecording
                  ? t.training?.stopRecording || "Stop Recording"
                  : t.training?.startRecording || "Start Recording"}
              </Button>
            </span>
          </Tooltip>
        </CardActions>
      </Card>
    );
  },
);

// ─── LiveStrokeCanvas ─────────────────────────────────────────────────────────
// Live preview rendered at 32×32 (matching the training image exactly), scaled
// up via CSS so the user sees precisely what the model is fed.
const LIVE_RENDER_SIZE = 32;

const LiveStrokeCanvas = memo(
  ({ latestStroke, size = STROKE_CANVAS_SIZE, receptiveField }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const S = LIVE_RENDER_SIZE;
      const halfSize = S / 2;

      // Black background — identical to training
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, S, S);

      if (!latestStroke || latestStroke.strokePoints?.length === 0) {
        return;
      }

      const { strokePoints } = latestStroke;
      const n = strokePoints.length;

      if (n === 1) {
        const px = halfSize + strokePoints[0].x * halfSize;
        const py = halfSize - strokePoints[0].y * halfSize;
        ctx.fillStyle = "rgb(128,128,128)";
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
        return;
      }

      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // RGB temporal gradient — same as renderStrokeToImage in training:
      //   R = 255 at start → 0 at end  ("where it began")
      //   G = 128 throughout            (constant visibility)
      //   B = 0   at start → 255 at end ("where it ended")
      for (let i = 1; i < n; i++) {
        const t = n > 2 ? (i - 1) / (n - 2) : 0;
        const r = Math.round(255 * (1 - t));
        const b = Math.round(255 * t);
        const { x: x0, y: y0 } = strokePoints[i - 1];
        const { x: x1, y: y1 } = strokePoints[i];
        ctx.strokeStyle = `rgb(${r},128,${b})`;
        ctx.beginPath();
        ctx.moveTo(halfSize + x0 * halfSize, halfSize - y0 * halfSize);
        ctx.lineTo(halfSize + x1 * halfSize, halfSize - y1 * halfSize);
        ctx.stroke();
      }
    }, [latestStroke]);

    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Paper
          elevation={2}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            border: "2px solid",
            borderColor:
              latestStroke?.state === StrokeState.DRAWING
                ? "warning.main"
                : latestStroke?.state === StrokeState.DONE
                  ? "success.main"
                  : "grey.700",
          }}
        >
          {/* Wrapper for canvas layering */}
          <Box sx={{ position: "relative", width: size, height: size }}>
            <canvas
              ref={canvasRef}
              width={LIVE_RENDER_SIZE}
              height={LIVE_RENDER_SIZE}
              style={{
                display: "block",
                width: size,
                height: size,
                imageRendering: "pixelated",
              }}
            />
            {/* Overlay div for receptive field highlight — CSS outline + grid */}
            {receptiveField &&
              (() => {
                const scale = size / LIVE_RENDER_SIZE;
                const { minRow, maxRow, minCol, maxCol } = receptiveField;
                return (
                  <div
                    style={{
                      position: "absolute",
                      left: minCol * scale,
                      top: minRow * scale,
                      width: (maxCol - minCol + 1) * scale,
                      height: (maxRow - minRow + 1) * scale,
                      outline: "1px solid rgba(255,255,255,0.9)",
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)",
                      backgroundSize: `${scale}px ${scale}px`,
                      pointerEvents: "none",
                      boxSizing: "border-box",
                    }}
                  />
                );
              })()}
          </Box>
        </Paper>
      </Box>
    );
  },
);

// ─── SpellModelTrainer ──────────────────────────────────────────────────────
const SpellModelTrainer = ({
  classes,
  onClassesChange,
  onModelTrained,
  onTrainingStart,
  onTrainingError,
  isTraining,
  disabled,
  onOpenHelp,
  trainedModel,
}) => {
  const [newClassName, setNewClassName] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingClassId, setEditingClassId] = useState(null);
  const [editingClassName, setEditingClassName] = useState("");
  const [recordingClassId, setRecordingClassId] = useState(null);
  // Receptive field overlay for the live stroke canvas (set by NeuralNetworkVisualization hover)
  const [receptiveField, setReceptiveField] = useState(null);

  const language = useSelector((s) => s.general.language);
  const t = getSpellTranslations();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isDownloading, setIsDownloading] = useState(false);

  const serialSource = useSpellSource();
  const bleSource = useSpellBLESource();

  // Derive active source — Serial takes priority if both somehow connected
  const activeSource = serialSource.isConnected ? serialSource : bleSource;
  const isConnected = serialSource.isConnected || bleSource.isConnected;
  const isConnecting = serialSource.isConnecting || bleSource.isConnecting;
  const latestStroke = activeSource.latestStroke;
  const dataTimeoutError = activeSource.dataTimeoutError;
  const sensorError = activeSource.error;

  const handleDownloadFirmware = async () => {
    setIsDownloading(true);
    const result = await downloadSpellFirmware();
    if (!result.success) {
      alert(`Failed to download firmware: ${result.error}`);
    }
    setIsDownloading(false);
  };

  const {
    trainModel: executeTraining,
    trainingProgress,
    trainingMetrics,
    testResults,
    finalAccuracy,
  } = useSpellModelTraining();

  const { predictions, predictStroke } = useSpellModelPrediction(
    trainedModel,
    latestStroke,
    isConnected,
  );

  // ─── Help blink hooks ──────────────────────────────────────────────────
  const {
    isBlinking: spellCastingBlinking,
    trigger: triggerSpellCasting,
    markSeen: markSpellCastingSeen,
  } = useHelpBlink("spell/spellCasting");

  const {
    isBlinking: addClassBlinking,
    trigger: triggerAddClass,
    markSeen: markAddClassSeen,
  } = useHelpBlink("spell/addClass");

  const {
    isBlinking: trainModelBlinking,
    trigger: triggerTrainModel,
    markSeen: markTrainModelSeen,
  } = useHelpBlink("spell/trainModel");

  const {
    isBlinking: cnnBlinking,
    trigger: triggerCnn,
    markSeen: markCnnSeen,
  } = useHelpBlink("spell/cnn");

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
      trainingProgress.epoch >= 1 &&
      !firstEpochTriggeredRef.current
    ) {
      firstEpochTriggeredRef.current = true;
      triggerTrainModel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainingProgress.epoch]);

  useEffect(() => {
    if (trainedModel) {
      triggerCnn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainedModel]);

  // ─── Auto-capture completed spells ──────────────────────────────────────
  // When a stroke is completed, add it to the currently recording class
  const previousStrokeRef = useRef(null);

  useEffect(() => {
    if (!latestStroke || !latestStroke.isCompleted) return;

    // Avoid processing the same stroke twice
    if (
      previousStrokeRef.current &&
      previousStrokeRef.current.timestamp === latestStroke.timestamp
    ) {
      return;
    }
    previousStrokeRef.current = latestStroke;

    // If we're recording to a specific class, add this stroke
    if (recordingClassId !== null && latestStroke.strokePoints?.length > 0) {
      onClassesChange((prev) =>
        prev.map((cls) =>
          cls.id === recordingClassId
            ? {
                ...cls,
                samples: [
                  ...cls.samples,
                  {
                    id: Date.now() + Math.random(),
                    strokePoints: [...latestStroke.strokePoints],
                    pixelData: renderStrokeToImage(latestStroke.strokePoints),
                    timestamp: latestStroke.timestamp,
                  },
                ],
              }
            : cls,
        ),
      );
    }
  }, [latestStroke, recordingClassId, onClassesChange]);

  // ─── Class management ──────────────────────────────────────────────────────
  const addClass = useCallback(() => {
    if (newClassName.trim() && classes.length < 5) {
      const trimmedName = newClassName.trim();
      const nameExists = classes.some(
        (cls) => cls.name.toLowerCase() === trimmedName.toLowerCase(),
      );
      if (nameExists) {
        onTrainingError(
          (
            t.training?.errorClassExists || 'Class "{name}" already exists'
          ).replace("{name}", trimmedName),
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
      if (recordingClassId === classId) {
        setRecordingClassId(null);
      }
      onClassesChange((prev) => prev.filter((cls) => cls.id !== classId));
    },
    [onClassesChange, recordingClassId],
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
          (
            t.training?.errorClassExists || 'Class "{name}" already exists'
          ).replace("{name}", trimmedName),
        );
        setEditingClassId(null);
        setEditingClassName("");
        return;
      }
      onClassesChange((prev) =>
        prev.map((cls) =>
          cls.id === editingClassId ? { ...cls, name: trimmedName } : cls,
        ),
      );
      setEditingClassId(null);
      setEditingClassName("");
    } else {
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

  // ─── Recording toggle ──────────────────────────────────────────────────────
  const toggleRecording = useCallback((classId) => {
    setRecordingClassId((prev) => (prev === classId ? null : classId));
  }, []);

  // ─── Manual training ────────────────────────────────────────────────────────
  const canTrain =
    classes.length >= 2 && classes.every((cls) => cls.samples.length >= 2);

  const handleTrainModel = useCallback(async () => {
    if (!canTrain) return;
    await executeTraining(
      classes,
      onTrainingStart,
      onTrainingError,
      (modelInfo) => {
        onModelTrained(modelInfo);
      },
    );
  }, [
    canTrain,
    classes,
    executeTraining,
    onTrainingStart,
    onTrainingError,
    onModelTrained,
  ]);

  // ─── Render ────────────────────────────────────────────────────────────────
  const canAddClass = classes.length < 5;

  return (
    <Box>
      <Grid container spacing={3}>
        {/* ── Left column: connection controls + live visualization ─────────── */}
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              position: { md: "sticky" },
              top: { md: "30%" },
              alignSelf: "flex-start",
            }}
          >
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
              {/* Serial connect button */}
              {!bleSource.isConnected && !bleSource.isConnecting && (
                <Tooltip
                  title={
                    !serialSource.isSupported
                      ? t.training?.tooltip?.browserCompatible ||
                        "Browser not compatible"
                      : ""
                  }
                  arrow
                  disableHoverListener={serialSource.isSupported}
                >
                  <span>
                    <Button
                      variant="contained"
                      startIcon={
                        serialSource.isConnecting ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : (
                          <SensorIcon />
                        )
                      }
                      onClick={
                        serialSource.isConnected
                          ? serialSource.disconnect
                          : async () => {
                              await serialSource.connect();
                              triggerSpellCasting();
                            }
                      }
                      disabled={
                        disabled ||
                        serialSource.isConnecting ||
                        !serialSource.isSupported ||
                        bleSource.isConnected ||
                        bleSource.isConnecting
                      }
                      color={serialSource.isConnected ? "secondary" : "primary"}
                    >
                      {serialSource.isConnecting
                        ? t.training?.connecting || "Connecting..."
                        : serialSource.isConnected
                          ? t.training?.disconnectSenseBox ||
                            "Disconnect Serial"
                          : t.training?.connectSenseBox || "Connect Serial"}
                    </Button>
                  </span>
                </Tooltip>
              )}

              {/* BLE connect button */}
              {!serialSource.isConnected && !serialSource.isConnecting && (
                <Tooltip
                  title={
                    !bleSource.isSupported
                      ? t.training?.tooltip?.browserCompatible ||
                        "Browser not compatible"
                      : ""
                  }
                  arrow
                  disableHoverListener={bleSource.isSupported}
                >
                  <span>
                    <Button
                      variant="contained"
                      startIcon={
                        bleSource.isConnecting ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : (
                          <BluetoothIcon />
                        )
                      }
                      onClick={
                        bleSource.isConnected
                          ? bleSource.disconnect
                          : async () => {
                              await bleSource.connect();
                              triggerSpellCasting();
                            }
                      }
                      disabled={
                        disabled ||
                        bleSource.isConnecting ||
                        !bleSource.isSupported ||
                        serialSource.isConnected ||
                        serialSource.isConnecting
                      }
                      color={bleSource.isConnected ? "secondary" : "primary"}
                    >
                      {bleSource.isConnecting
                        ? t.training?.connecting || "Connecting..."
                        : bleSource.isConnected
                          ? t.training?.disconnectSenseBox || "Disconnect BLE"
                          : t.training?.connectBLE || "Connect BLE"}
                    </Button>
                  </span>
                </Tooltip>
              )}

              {onOpenHelp && (
                <HelpButton
                  onClick={() => {
                    markSpellCastingSeen();
                    onOpenHelp("spellCasting");
                  }}
                  isBlinking={spellCastingBlinking}
                  tooltip={
                    t.training?.tooltip?.helpConnection || "Connection help"
                  }
                />
              )}

              {!bleSource.isConnected &&
                !bleSource.isConnecting &&
                !serialSource.isConnected &&
                !serialSource.isConnecting && (
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
                    disabled={
                      isDownloading ||
                      disabled ||
                      (!serialSource.isSupported && !bleSource.isSupported)
                    }
                  >
                    {t.training?.downloadFirmware}
                  </Button>
                )}
            </Box>

            {/* Error display */}
            {((isConnected && dataTimeoutError) ||
              (!isConnected && sensorError)) && (
              <Box sx={{ mb: 3 }}>
                <SerialErrorHandler
                  error={
                    !isConnected && sensorError
                      ? {
                          type:
                            sensorError.type || ErrorTypes.CONNECTION_FAILED,
                          message: sensorError.message,
                        }
                      : {
                          type: ErrorTypes.CONNECTION_FAILED,
                          message: t.errors.dataTimeoutMessage,
                        }
                  }
                  connectionStatus={ConnectionStatus.CONNECTED}
                  onRetry={async () => {
                    await activeSource.disconnect();
                    await activeSource.connect();
                  }}
                  onDismiss={() => activeSource.disconnect()}
                  showStatus={false}
                  overrides={{
                    errorTitle: t.errors.connectionFailed,
                    errorMessage: t.errors.connectionFailedMessage,
                    troubleshootingFirmware: t.errors.troubleshootingFirmware,
                    downloadFirmwareLabel: t.errors.downloadFirmware,
                    downloadFirmwareFn: downloadSpellFirmware,
                  }}
                />
              </Box>
            )}
            {/* Live stroke visualization */}
            {isConnected && !dataTimeoutError && (
              <Box sx={{ mb: 3 }}>
                <LiveStrokeCanvas
                  latestStroke={latestStroke}
                  receptiveField={receptiveField}
                />
              </Box>
            )}
          </Box>
        </Grid>

        {/* ── Right column: classes ─────────────────────────────────────────── */}
        <Grid item xs={12} md={7}>
          {/* Class cards */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
            {classes.map((cls) => (
              <ClassCardItem
                key={cls.id}
                cls={cls}
                isEditing={editingClassId === cls.id}
                editingClassName={editingClassName}
                isConnected={isConnected}
                dataTimeoutError={dataTimeoutError}
                isRecording={recordingClassId === cls.id}
                recordingInProgress={recordingClassId !== null}
                onToggleRecording={toggleRecording}
                onDeleteClass={deleteClass}
                onStartEditingClass={startEditingClass}
                onSaveClassRename={saveClassRename}
                onCancelEditingClass={cancelEditingClass}
                onRemoveSample={removeSample}
                onEditNameChange={setEditingClassName}
                t={t}
              />
            ))}
          </Box>

          {/* Add class + train model buttons */}
          <Box
            sx={{
              mb: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            {canAddClass && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowAddDialog(true)}
                  disabled={disabled}
                >
                  {t.training?.addClass || "Add Class"}
                </Button>
                <HelpButton
                  onClick={() => {
                    markAddClassSeen();
                    onOpenHelp && onOpenHelp("addClass");
                  }}
                  isBlinking={addClassBlinking}
                  tooltip={
                    t.training?.tooltip?.helpClasses || "About spell classes"
                  }
                />
              </Box>
            )}
            <Divider sx={{ width: "100%", my: 1 }} />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Tooltip
                title={
                  classes.length < 2
                    ? t.training?.tooltip?.moreClasses ||
                      "Add at least 2 classes to train"
                    : classes.some((cls) => cls.samples.length < 2)
                      ? t.training?.tooltip?.moreSamples ||
                        "Add at least 2 samples per class to train"
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
                    onClick={handleTrainModel}
                    disabled={
                      disabled ||
                      classes.length < 2 ||
                      classes.some((cls) => cls.samples.length < 2)
                    }
                  >
                    {t.training?.trainModel || "Train Model"}
                  </Button>
                </span>
              </Tooltip>
              <HelpButton
                onClick={() => {
                  markTrainModelSeen();
                  onOpenHelp && onOpenHelp("trainModel");
                }}
                isBlinking={trainModelBlinking}
                tooltip={
                  t.training?.tooltip?.helpTraining || "How training works"
                }
              />
            </Box>
          </Box>

          {/* Training progress */}
          {isTraining && (
            <Box sx={{ my: 4 }}>
              <Typography variant="body2" gutterBottom>
                {trainingProgress.totalEpochs > 0
                  ? (
                      t.training?.trainingEpoch ||
                      "Training: epoch {epoch}/{totalEpochs}"
                    )
                      .replace("{epoch}", trainingProgress.epoch)
                      .replace("{totalEpochs}", trainingProgress.totalEpochs)
                  : t.training?.trainingInProgress || "Training in progress..."}
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
                        (trainingProgress.epoch /
                          trainingProgress.totalEpochs) *
                          100,
                      )
                    : 0
                }
              />
            </Box>
          )}

          {/* Training results for debugging */}
          {/* {trainedModel && (
            <TrainingResultsSection
              trainingMetrics={trainingMetrics}
              testResults={testResults}
              finalAccuracy={finalAccuracy}
              classes={classes}
              trainedWithEnoughSamples={classes.every(
                (cls) => cls.samples.length >= 10,
              )}
              onOpenHelp={onOpenHelp}
            />
          )} */}

          {/* Neural Network Visualization */}
          {trainedModel && (
            <NeuralNetworkVisualization
              trainedModel={trainedModel}
              strokePoints={latestStroke?.strokePoints}
              classNames={classes.map((cls) => cls.name)}
              onOpenHelp={onOpenHelp}
              onReceptiveField={setReceptiveField}
              isBlinking={cnnBlinking}
              markSeen={markCnnSeen}
            />
          )}
        </Grid>
      </Grid>

      {/* Add Class Dialog */}
      <Dialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t.training?.addNewClass || "Add New Class"}</DialogTitle>
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
    </Box>
  );
};

export default SpellModelTrainer;
