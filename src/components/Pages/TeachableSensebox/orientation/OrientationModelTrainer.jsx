import React, { useState, useCallback, useEffect, useRef, memo } from "react";
import { useSelector } from "react-redux";
import { getOrientationTranslations } from "./translations";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
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
import useOrientationSource from "./hooks/useOrientationSource";
import useOrientationModelTraining from "./hooks/useOrientationModelTraining";
import useOrientationModelPrediction from "./hooks/useOrientationModelPrediction";
import HelpButton from "../HelpButton";
import SerialCameraErrorHandler, {
  ErrorTypes,
  ConnectionStatus,
} from "../SerialCameraErrorHandler";
import { downloadAccelerometerFirmware } from "../utils/firmwareDownload";

// ─── Axis colours (shared with the graph) ─────────────────────────────────────

const AXIS_COLORS = { x: "#e53935", y: "#43a047", z: "#1e88e5" };

// ─── SampleChip ───────────────────────────────────────────────────────────────
// Displays a single x/y/z snapshot as a row of coloured chips.
// Memoized: only re-renders when the sample value or onDelete changes.

const SampleChip = memo(({ sample, onDelete }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 0.5,
      flexWrap: "nowrap",
      "&:hover .delete-btn": { opacity: 1 },
    }}
  >
    {["x", "y", "z"].map((axis) => (
      <Chip
        key={axis}
        size="small"
        label={`${axis.toUpperCase()}: ${sample[axis].toFixed(2)}`}
        sx={{
          bgcolor: AXIS_COLORS[axis],
          color: "white",
          fontFamily: "monospace",
          fontSize: "0.7rem",
          height: 22,
        }}
      />
    ))}
    <IconButton
      className="delete-btn"
      size="small"
      onClick={() => onDelete(sample.id)}
      sx={{
        opacity: 0,
        transition: "opacity 0.15s",
        p: 0.25,
        ml: 0.25,
      }}
    >
      <DeleteIcon sx={{ fontSize: 14 }} />
    </IconButton>
  </Box>
));

// ─── ClassCardItem ────────────────────────────────────────────────────────────
// Memoized per-class card. Its props never include latestSample, so it does
// not re-render on sensor ticks — only when class data or recording state changes.

const ClassCardItem = memo(
  ({
    cls,
    isEditing,
    editingClassName,
    isRecording,
    countdown,
    isConnected,
    dataTimeoutError,
    recordingInProgress,
    onStartRecording,
    onDeleteClass,
    onStartEditingClass,
    onSaveClassRename,
    onCancelEditingClass,
    onRemoveSample,
    onEditNameChange,
    t,
  }) => {
    // Stable per-card callbacks so SampleChip children are also stable
    const handleRecord = useCallback(
      () => onStartRecording(cls.id),
      [cls.id, onStartRecording],
    );
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
        sx={{ minWidth: 220, flex: "1 1 220px", maxWidth: 360 }}
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
                autoFocus
              />
              <Button size="small" onClick={onSaveClassRename}>
                OK
              </Button>
              <Button size="small" onClick={onCancelEditingClass}>
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
                onClick={handleStartEdit}
              >
                {cls.name}
              </Typography>
              <IconButton size="small" onClick={handleDelete}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}

          <Typography variant="caption" color="text.secondary">
            {cls.samples.length} {t.training.samples}
          </Typography>

          {/* Sample chips */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              mt: 1,
              mb: 1,
            }}
          >
            {cls.samples.map((sample) => (
              <SampleChip
                key={sample.id}
                sample={sample}
                onDelete={handleRemoveSample}
              />
            ))}
          </Box>

          {/* Recording state */}
          {isRecording && countdown !== null && countdown > 0 && (
            <Typography variant="body2" color="primary">
              {t.training.recordingCountdown.replace("{seconds}", countdown)}
            </Typography>
          )}
          {isRecording && countdown === 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="error" sx={{ mb: 0.5 }}>
                {t.training.recorded}
              </Typography>
              <LinearProgress color="primary" />
            </Box>
          )}
        </CardContent>

        <CardActions sx={{ gap: 0.5, p: 1 }}>
          <Tooltip
            title={!isConnected ? t.training.tooltip.startConnection : ""}
            arrow
          >
            <span style={{ flex: 1 }}>
              <Button
                variant="contained"
                color="error"
                size="small"
                fullWidth
                startIcon={<RecordIcon />}
                onClick={handleRecord}
                disabled={
                  !isConnected || dataTimeoutError || recordingInProgress
                }
              >
                {t.training.record}
              </Button>
            </span>
          </Tooltip>
        </CardActions>
      </Card>
    );
  },
);

// ─── InlineGraph ──────────────────────────────────────────────────────────────
// Scrolling canvas graph for the desktop layout.

const INLINE_WIDTH = 480;
const INLINE_HEIGHT = 120;
const INLINE_HISTORY = 120;

const InlineGraph = ({ latestSample, label }) => {
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
      ctx.strokeStyle = AXIS_COLORS[axis];
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
    const latest = history[history.length - 1];
    let ly = 14;
    for (const axis of ["x", "y", "z"]) {
      ctx.fillStyle = AXIS_COLORS[axis];
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

// ─── Constants ────────────────────────────────────────────────────────────────

const RECORDING_COUNTDOWN_STEPS = 2; // seconds

// ─── OrientationModelTrainer ──────────────────────────────────────────────────

const OrientationModelTrainer = ({
  classes,
  onClassesChange,
  onModelTrained,
  onTrainingStart,
  onTrainingError,
  isTraining,
  disabled,
  onOpenHelp,
}) => {
  const [newClassName, setNewClassName] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingClassId, setEditingClassId] = useState(null);
  const [editingClassName, setEditingClassName] = useState("");
  const [recordingClassId, setRecordingClassId] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const countdownRef = useRef(null);

  const language = useSelector((s) => s.general.language);
  const t = getOrientationTranslations();
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
    isSupported,
  } = useOrientationSource();

  const { trainModel: executeTraining } = useOrientationModelTraining();

  const [localTrainedModel, setLocalTrainedModel] = useState(null);
  const { predictions: livePredictions } = useOrientationModelPrediction(
    localTrainedModel,
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

  // ─── Class management ──────────────────────────────────────────────────────

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

  // ─── Single-snapshot recording ─────────────────────────────────────────────

  const startRecording = useCallback(
    async (classId) => {
      if (!isConnected || recordingClassId !== null) return;

      setRecordingClassId(classId);
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

      setCountdown(0);

      // Capture the current latestSample at this moment
      // (latestSample is a ref-like value via closure — use a ref to get current)
      const sample = latestSampleRef.current;
      if (sample) {
        onClassesChange((prev) =>
          prev.map((cls) =>
            cls.id === classId
              ? {
                  ...cls,
                  samples: [
                    ...cls.samples,
                    {
                      id: Date.now() + Math.random(),
                      x: sample.x,
                      y: sample.y,
                      z: sample.z,
                      recordedAt: Date.now(),
                    },
                  ],
                }
              : cls,
          ),
        );
      }

      setRecordingClassId(null);
      setCountdown(null);
    },
    [isConnected, recordingClassId, onClassesChange],
  );

  // Keep a ref to the latest sample so the recording closure can read it
  const latestSampleRef = useRef(latestSample);
  useEffect(() => {
    latestSampleRef.current = latestSample;
  }, [latestSample]);

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // ─── Auto-training ─────────────────────────────────────────────────────────
  // Re-train whenever classes change, as long as there are ≥2 classes
  // and every class has at least 1 sample.

  const canAutoTrain =
    classes.length >= 2 && classes.every((cls) => cls.samples.length >= 1);

  useEffect(() => {
    if (!canAutoTrain) return;
    executeTraining(classes, onTrainingStart, onTrainingError, (modelInfo) => {
      setLocalTrainedModel(modelInfo);
      onModelTrained(modelInfo);
    });
    // classes is the only trigger; other callbacks are stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classes]);

  // ─── Render ────────────────────────────────────────────────────────────────

  const canAddClass = classes.length < 5;

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

      {/* Serial connection error */}
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
          <InlineGraph
            latestSample={latestSample}
            label={t.training.liveAccelerometer}
          />
          {localTrainedModel && (
            <Box sx={{ flex: 1, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                {t.training.livePredictions}
              </Typography>
              {livePredictions.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  {t.training.analyzing}
                </Typography>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {livePredictions.map((pred) => (
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

      {/* Mobile: live predictions below graph */}
      {isConnected && !dataTimeoutError && isMobile && localTrainedModel && (
        <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            {t.training.livePredictions}
          </Typography>
          {livePredictions.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {t.training.analyzing}
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {livePredictions.map((pred) => (
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

      {/* Class cards */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {classes.map((cls) => (
          <ClassCardItem
            key={cls.id}
            cls={cls}
            isEditing={editingClassId === cls.id}
            editingClassName={editingClassName}
            isRecording={recordingClassId === cls.id}
            countdown={countdown}
            isConnected={isConnected}
            dataTimeoutError={dataTimeoutError}
            recordingInProgress={recordingClassId !== null}
            onStartRecording={startRecording}
            onDeleteClass={deleteClass}
            onStartEditingClass={startEditingClass}
            onSaveClassRename={saveClassRename}
            onCancelEditingClass={cancelEditingClass}
            onRemoveSample={removeSample}
            onEditNameChange={setEditingClassName}
            t={t}
          />
        ))}

        {/* Add Class card */}
        {canAddClass && (
          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <Card
              variant="outlined"
              sx={{
                minWidth: 220,
                flex: "1 1 220px",
                maxWidth: 360,
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

      {/* Training progress */}
      {isTraining && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {t.training.trainingInProgress}
          </Typography>
          <LinearProgress sx={{ mt: 1 }} />
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

export default OrientationModelTrainer;
