import React, { useState, useCallback, useEffect, useRef, memo } from "react";
import { useSelector } from "react-redux";
import { getOrientationTranslations } from "./translations";
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
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  FiberManualRecord as RecordIcon,
  Speed as SensorIcon,
  Download as DownloadIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Bluetooth as BluetoothIcon,
} from "@mui/icons-material";
import { ORIENTATION_DATASETS } from "../../../../data/orientation-datasets";
import useOrientationSource from "./hooks/useOrientationSource";
import useOrientationBLESource from "./hooks/useOrientationBLESource";
import useOrientationModelTraining from "./hooks/useOrientationModelTraining";
import HelpButton from "../HelpButton";
import SerialCameraErrorHandler, {
  ErrorTypes,
  ConnectionStatus,
} from "../SerialCameraErrorHandler";
import { downloadAccelerometerFirmware } from "../utils/firmwareDownload";

// ─── Axis colours (shared with the graph) ─────────────────────────────────────

const AXIS_COLORS = { x: "#e53935", y: "#43a047", z: "#1e88e5" };

// ─── SampleMiniChart ─────────────────────────────────────────────────────────
// Tiny horizontal bar chart for a single x/y/z sample.
// Bars go left (negative) / right (positive) of centre, range -10…10.

const MINI_W = 120;
const MINI_H = 36;

const SampleMiniChart = memo(({ sample, onDelete }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const axes = ["x", "y", "z"];
    const sectionH = H / axes.length;
    const barH = sectionH * 0.55;
    const zeroX = W / 2;

    // faint centre line
    ctx.strokeStyle = "rgba(128,128,128,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(zeroX, 0);
    ctx.lineTo(zeroX, H);
    ctx.stroke();

    for (let i = 0; i < axes.length; i++) {
      const axis = axes[i];
      const clamped = Math.max(-10, Math.min(10, sample[axis]));
      const barLen = (Math.abs(clamped) / 10) * (W / 2);
      const barY = i * sectionH + (sectionH - barH) / 2;
      const barX = clamped >= 0 ? zeroX : zeroX - barLen;
      ctx.fillStyle = AXIS_COLORS[axis];
      ctx.fillRect(barX, barY, Math.max(barLen, 1), barH);
    }
  }, [sample]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.75,
        border: 1,
        borderColor: "grey.400",
        borderRadius: 1,
        px: 0.5,
        py: 0.25,
        bgcolor: "background.paper",
        boxShadow: 0,
        "&:hover .delete-btn": { opacity: 1 },
      }}
    >
      <canvas
        ref={canvasRef}
        width={MINI_W}
        height={MINI_H}
        style={{
          display: "block",
          width: MINI_W,
          height: MINI_H,
          flexShrink: 0,
        }}
      />
      {/* Numeric values */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {["x", "y", "z"].map((axis) => (
          <Typography
            key={axis}
            variant="caption"
            sx={{
              fontFamily: "monospace",
              fontSize: "0.62rem",
              lineHeight: 1.35,
              color: AXIS_COLORS[axis],
            }}
          >
            {axis.toUpperCase()}: {sample[axis].toFixed(1)}
          </Typography>
        ))}
      </Box>
      <IconButton
        className="delete-btn"
        size="small"
        onClick={() => onDelete(sample.id)}
        sx={{
          opacity: 0,
          transition: "opacity 0.15s",
          p: 0.25,
          ml: "auto",
        }}
      >
        <DeleteIcon sx={{ fontSize: 13 }} />
      </IconButton>
    </Box>
  );
});

// ─── ClassCardItem ────────────────────────────────────────────────────────────
// Memoized per-class card. Its props never include latestSample, so it does
// not re-render on sensor ticks — only when class data or recording state changes.

const ClassCardItem = memo(
  ({
    cls,
    isEditing,
    editingClassName,
    isRecording,
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
              <IconButton size="small" onClick={handleDelete}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}

          <Typography variant="caption" color="text.secondary">
            {cls.samples.length} {t.training.samples}
          </Typography>

          {/* Sample mini-charts — scrollable area */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              mt: 1,
              mb: 1,
              maxHeight: 130,
              overflowY: "auto",
              pr: 0.5,
            }}
          >
            {cls.samples.map((sample) => (
              <SampleMiniChart
                key={sample.id}
                sample={sample}
                onDelete={handleRemoveSample}
              />
            ))}
          </Box>

          {/* Recording state */}
          {isRecording && (
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
// Live horizontal bar chart for the desktop layout.
// X-axis is fixed at -10 … 10; values outside that range are clamped visually.
// Axis labels and numeric values sit at fixed positions on the left / right.

const INLINE_WIDTH = 480;
const INLINE_HEIGHT = 160;

const InlineGraph = ({ latestSample, label }) => {
  const canvasRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    // mLeft: space for axis letter + value label on the left of zero
    // mRight: space for value label on the right of zero
    const mLeft = 52,
      mRight = 52,
      mTop = 10,
      mBottom = 10;
    const drawW = W - mLeft - mRight;
    const drawH = H - mTop - mBottom;
    const zeroX = mLeft + drawW / 2; // pixel position of value 0

    const axes = ["x", "y", "z"];
    const sectionH = drawH / axes.length;
    const barH = sectionH * 0.55;

    const textColor = theme.palette.text.secondary;
    const dividerColor = theme.palette.divider;

    // Clear — transparent so page background shows through
    ctx.clearRect(0, 0, W, H);

    // ── Vertical grid lines at -10…10 ───────────────────────────────────────
    ctx.lineWidth = 1;
    for (const [val, gridLabel] of [
      [-10, "-10"],
      [-8, "-8"],
      [-6, "-6"],
      [-4, "-4"],
      [-2, "-2"],
      [0, "0"],
      [2, "2"],
      [4, "4"],
      [6, "6"],
      [8, "8"],
      [10, "10"],
    ]) {
      const x = zeroX + (val / 10) * (drawW / 2);
      const isMajor = val === 0 || Math.abs(val) === 10;
      ctx.strokeStyle = isMajor ? textColor : dividerColor;
      ctx.globalAlpha = isMajor ? 0.4 : 0.18;
      ctx.beginPath();
      ctx.moveTo(x, mTop);
      ctx.lineTo(x, H - mBottom);
      ctx.stroke();
      ctx.globalAlpha = 1;

      ctx.fillStyle = textColor;
      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      ctx.fillText(gridLabel, x, H - 1);
    }

    // ── Bars ─────────────────────────────────────────────────────────────────
    for (let i = 0; i < axes.length; i++) {
      const axis = axes[i];
      const rawVal = latestSample ? latestSample[axis] : 0;
      const clamped = Math.max(-10, Math.min(10, rawVal));
      const barLen = (Math.abs(clamped) / 10) * (drawW / 2);
      const barY = mTop + i * sectionH + (sectionH - barH) / 2;
      const barX = clamped >= 0 ? zeroX : zeroX - barLen;

      if (latestSample) {
        ctx.fillStyle = AXIS_COLORS[axis];
        ctx.fillRect(barX, barY, Math.max(barLen, 1), barH);
      }

      const barCenterY = barY + barH / 2 + 5; // +5 for text baseline alignment

      // Axis letter — fixed on the far left
      ctx.font = "bold 16px monospace";
      ctx.textAlign = "right";
      ctx.fillStyle = AXIS_COLORS[axis];
      ctx.fillText(axis.toUpperCase(), mLeft - 8, barCenterY);

      // Numeric value — fixed on the far right
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "left";
      ctx.fillStyle = latestSample ? AXIS_COLORS[axis] : textColor;
      ctx.fillText(
        latestSample ? rawVal.toFixed(1) : "–",
        W - mRight + 6,
        barCenterY,
      );
    }
  }, [latestSample, theme]);

  return (
    <Box sx={{ display: "inline-block" }}>
      {label && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 0.5 }}
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
  onLatestSample,
}) => {
  const [newClassName, setNewClassName] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingClassId, setEditingClassId] = useState(null);
  const [editingClassName, setEditingClassName] = useState("");
  const [recordingClassId, setRecordingClassId] = useState(null);
  const [datasetMenuAnchor, setDatasetMenuAnchor] = useState(null);

  const language = useSelector((s) => s.general.language);
  const t = getOrientationTranslations();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isDownloading, setIsDownloading] = useState(false);

  const serialSource = useOrientationSource();
  const bleSource = useOrientationBLESource();

  // Derive active source — Serial takes priority if both somehow connected
  const activeSource = serialSource.isConnected ? serialSource : bleSource;
  const isConnected = serialSource.isConnected || bleSource.isConnected;
  const isConnecting = serialSource.isConnecting || bleSource.isConnecting;
  const latestSample = activeSource.latestSample;
  const dataTimeoutError = activeSource.dataTimeoutError;
  const sensorError = activeSource.error;

  const { trainModel: executeTraining } = useOrientationModelTraining();

  useEffect(() => {
    if (!onLatestSample) return;
    onLatestSample(isConnected ? latestSample : null);
  }, [latestSample, isConnected, onLatestSample]);

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

  const loadDataset = useCallback(
    (dataset) => {
      const now = Date.now();
      const newClasses = dataset.data.classes.filter(
        (cls) =>
          !classes.some(
            (existing) =>
              existing.name.toLowerCase() === cls.labelDE?.toLowerCase() ||
              existing.name.toLowerCase() === cls.id?.toLowerCase(),
          ),
      );
      if (classes.length + newClasses.length > 5) {
        onTrainingError(t.training.errorTooManyClasses);
        return;
      }
      onClassesChange((prev) => {
        const updated = prev.map((existing) => {
          const match = dataset.data.classes.find(
            (cls) =>
              existing.name.toLowerCase() === cls.labelDE?.toLowerCase() ||
              existing.name.toLowerCase() === cls.id?.toLowerCase(),
          );
          if (!match) return existing;
          return {
            ...existing,
            samples: match.readings.map((reading, j) => ({
              id: now + j,
              x: reading.x,
              y: reading.y,
              z: reading.z,
              recordedAt: now,
            })),
          };
        });
        const added = newClasses.map((cls, i) => ({
          id: now + 100000 + i,
          name: cls.labelDE ?? cls.id,
          samples: cls.readings.map((reading, j) => ({
            id: now + i * 10000 + j,
            x: reading.x,
            y: reading.y,
            z: reading.z,
            recordedAt: now,
          })),
        }));
        return [...updated, ...added];
      });
    },
    [classes, onClassesChange, onTrainingError, t],
  );

  // ─── Single-snapshot recording ─────────────────────────────────────────────

  const startRecording = useCallback(
    async (classId) => {
      if (!isConnected || recordingClassId !== null) return;

      setRecordingClassId(classId);

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
    },
    [isConnected, recordingClassId, onClassesChange],
  );

  // Keep a ref to the latest sample so the recording closure can read it
  const latestSampleRef = useRef(latestSample);
  useEffect(() => {
    latestSampleRef.current = latestSample;
  }, [latestSample]);

  // ─── Auto-training ─────────────────────────────────────────────────────────
  // Re-train whenever classes change, as long as there are ≥2 classes
  // and every class has at least 1 sample.

  const canAutoTrain =
    classes.length >= 2 && classes.every((cls) => cls.samples.length >= 1);

  useEffect(() => {
    if (!canAutoTrain) return;
    executeTraining(classes, onTrainingStart, onTrainingError, (modelInfo) => {
      onModelTrained(modelInfo);
    });
    // classes is the only trigger; other callbacks are stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classes]);

  // ─── Render ────────────────────────────────────────────────────────────────

  const canAddClass = classes.length < 5;

  return (
    <Box>
      <Grid container spacing={3}>
        {/* ── Left column: connection controls + live graph ─────────── */}
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              position: { md: "sticky" },
              top: { md: 16 },
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
              <Tooltip
                title={
                  !serialSource.isSupported
                    ? t.training.tooltip.browserCompatible
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
                        : serialSource.connect
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
                      ? t.training.connecting
                      : serialSource.isConnected
                        ? t.training.disconnectSenseBox
                        : t.training.connectSenseBox}
                  </Button>

                  <HelpButton
                    onClick={() =>
                      onOpenHelp && onOpenHelp("accelerationSensor")
                    }
                    tooltip={t.training?.tooltip?.helpAccelerationSensor}
                  />
                </span>
              </Tooltip>

              {/* BLE connect button */}
              <Tooltip
                title={
                  !bleSource.isSupported
                    ? t.training.tooltip.bluetoothNotSupported
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
                        : bleSource.connect
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
                      ? t.training.connecting
                      : bleSource.isConnected
                        ? t.training.disconnectSenseBoxBLE
                        : t.training.connectSenseBoxBLE}
                  </Button>
                </span>
              </Tooltip>

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
                {t.errors.downloadFirmware}
              </Button>
            </Box>

            {/* Serial connection error */}
            {((isConnected && dataTimeoutError) ||
              (!isConnected && sensorError)) && (
              <Box sx={{ mb: 3 }}>
                <SerialCameraErrorHandler
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
                    downloadFirmwareFn: downloadAccelerometerFirmware,
                  }}
                />
              </Box>
            )}

            {/* Live sensor graph (desktop only, when connected) */}
            {isConnected && !dataTimeoutError && !isMobile && (
              <Box sx={{ mt: 1 }}>
                <InlineGraph
                  latestSample={latestSample}
                  label={t.training.liveAccelerometer}
                />
              </Box>
            )}
          </Box>
        </Grid>

        {/* ── Right column: dataset loader + class cards ────────────── */}
        <Grid item xs={12} md={7}>
          {/* Class cards */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {classes.map((cls) => (
              <ClassCardItem
                key={cls.id}
                cls={cls}
                isEditing={editingClassId === cls.id}
                editingClassName={editingClassName}
                isRecording={recordingClassId === cls.id}
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
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowAddDialog(true)}
                  disabled={disabled}
                >
                  {t.training.addClass}
                </Button>
                {ORIENTATION_DATASETS.length > 0 && (
                  <Box>
                    <Button
                      variant="outlined"
                      size="small"
                      endIcon={<ArrowDropDownIcon />}
                      onClick={(e) => setDatasetMenuAnchor(e.currentTarget)}
                    >
                      {t.training.loadDataset}
                    </Button>
                    <Menu
                      anchorEl={datasetMenuAnchor}
                      open={Boolean(datasetMenuAnchor)}
                      onClose={() => setDatasetMenuAnchor(null)}
                    >
                      {ORIENTATION_DATASETS.map((dataset) => {
                        const locale =
                          window.localStorage.getItem("locale") || "de_DE";
                        const lang = locale.split("_")[0];
                        const label =
                          lang === "en" ? dataset.labelEn : dataset.labelDe;
                        return (
                          <MenuItem
                            key={dataset.id}
                            onClick={() => {
                              loadDataset(dataset);
                              setDatasetMenuAnchor(null);
                            }}
                          >
                            {label}
                          </MenuItem>
                        );
                      })}
                    </Menu>
                  </Box>
                )}
                <HelpButton
                  onClick={() => onOpenHelp && onOpenHelp("addClass")}
                  tooltip={t.training.tooltip.helpClasses}
                />
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Add Class Dialog */}
      <Dialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t.training.addNewClass}</DialogTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addClass();
          }}
        >
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label={t.training.className}
              fullWidth
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={() => setShowAddDialog(false)}>
              {t.training.cancel}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!newClassName.trim()}
            >
              {t.training.add}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default OrientationModelTrainer;
