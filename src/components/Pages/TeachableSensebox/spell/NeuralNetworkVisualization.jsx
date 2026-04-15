import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  memo,
} from "react";
import * as tf from "@tensorflow/tfjs";
import {
  Box,
  Typography,
  Paper,
  Tooltip,
  useTheme,
  alpha,
  Chip,
  Stack,
} from "@mui/material";
import { renderStrokeToImage } from "./hooks/useSpellModelTraining";

// ─── Constants ────────────────────────────────────────────────────────────────
const STROKE_IMAGE_SIZE = 32;
const CELL_SIZE = 6; // Base size for activation cells
const LAYER_GAP = 40; // Vertical gap between layers
const MATRIX_GAP = 4; // Gap between filter matrices in conv layers

// ─── Color mapping for activation values ──────────────────────────────────────
// Inferno-like palette: black(0) → dark-purple → orange → bright-yellow(1)
// Critically: 0 maps to near-black, NOT blue, so dead/inactive neurons are
// clearly dark and easily distinguished from weakly-active neurons.
function activationToColor(value, minVal = 0, maxVal = 1) {
  const range = maxVal - minVal;
  // Flat / dead filter — return near-black so it reads as "inactive"
  if (range < 1e-7) return "rgb(8, 4, 18)";

  const n = Math.max(0, Math.min(1, (value - minVal) / range));

  let r, g, b;
  if (n < 0.25) {
    const t = n / 0.25;
    r = Math.round(t * 110); // 0   → 110
    g = 0;
    b = Math.round(t * 100); // 0   → 100
  } else if (n < 0.5) {
    const t = (n - 0.25) / 0.25;
    r = Math.round(110 + t * 145); // 110 → 255
    g = Math.round(t * 55); // 0   → 55
    b = Math.round(100 - t * 40); // 100 → 60
  } else if (n < 0.75) {
    const t = (n - 0.5) / 0.25;
    r = 255;
    g = Math.round(55 + t * 140); // 55  → 195
    b = Math.round(60 - t * 60); // 60  → 0
  } else {
    const t = (n - 0.75) / 0.25;
    r = 255;
    g = Math.round(195 + t * 60); // 195 → 255
    b = 0;
  }

  return `rgb(${r}, ${g}, ${b})`;
}

// ─── Sample Preview Mini Canvas ───────────────────────────────────────────────
const SamplePreviewMini = memo(({ pixelData, strokePoints, size = 24 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");

    const data =
      pixelData || (strokePoints ? renderStrokeToImage(strokePoints) : null);
    if (!data) {
      ctx.fillStyle = "#333";
      ctx.fillRect(0, 0, STROKE_IMAGE_SIZE, STROKE_IMAGE_SIZE);
      return;
    }

    const imageData = new ImageData(
      new Uint8ClampedArray(data),
      STROKE_IMAGE_SIZE,
      STROKE_IMAGE_SIZE,
    );
    ctx.putImageData(imageData, 0, 0);
  }, [pixelData, strokePoints]);

  return (
    <canvas
      ref={canvasRef}
      width={STROKE_IMAGE_SIZE}
      height={STROKE_IMAGE_SIZE}
      style={{
        width: size,
        height: size,
        borderRadius: 2,
        imageRendering: "pixelated",
      }}
    />
  );
});

// ─── Input Spell Display ────────────────────────────────────────────────────
const InputSpellDisplay = memo(({ pixelData, size = 96 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !pixelData) return;
    const ctx = canvasRef.current.getContext("2d");
    const imageData = new ImageData(
      new Uint8ClampedArray(pixelData),
      STROKE_IMAGE_SIZE,
      STROKE_IMAGE_SIZE,
    );
    ctx.putImageData(imageData, 0, 0);
  }, [pixelData]);

  return (
    <Box sx={{ textAlign: "center", mb: 2 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        mb={0.5}
      >
        Input Spell (32×32)
      </Typography>
      <Box
        sx={{
          display: "inline-block",
          border: "2px solid",
          borderColor: "grey.400",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <canvas
          ref={canvasRef}
          width={STROKE_IMAGE_SIZE}
          height={STROKE_IMAGE_SIZE}
          style={{
            display: "block",
            width: size,
            height: size,
            imageRendering: "pixelated",
          }}
        />
      </Box>
    </Box>
  );
});

// ─── Activation Cell ──────────────────────────────────────────────────────────
const ActivationCell = memo(
  ({
    value,
    minVal,
    maxVal,
    cellSize,
    layerIndex,
    filterIndex,
    rowIndex,
    colIndex,
    onHover,
    onLeave,
    isHighlighted,
    cellRef,
  }) => {
    const elementRef = useRef(null);

    const handleMouseEnter = useCallback(
      (e) => {
        const rect = e.target.getBoundingClientRect();
        onHover?.({
          layerIndex,
          filterIndex,
          rowIndex,
          colIndex,
          value,
          rect, // Pass the element's position
        });
      },
      [layerIndex, filterIndex, rowIndex, colIndex, value, onHover],
    );

    const color = activationToColor(value, minVal, maxVal);

    // Register cell ref for connection drawing
    useEffect(() => {
      if (cellRef) {
        cellRef.current = elementRef.current;
      }
    }, [cellRef]);

    return (
      <div
        ref={elementRef}
        data-layer={layerIndex}
        data-filter={filterIndex}
        data-row={rowIndex}
        data-col={colIndex}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={onLeave}
        style={{
          width: cellSize,
          height: cellSize,
          backgroundColor: color,
          border: isHighlighted ? "1px solid rgba(255,255,255,0.9)" : "none",
          boxShadow: isHighlighted
            ? "0 0 6px rgba(255,255,255,0.8), inset 0 0 2px rgba(255,255,255,0.5)"
            : "none",
          cursor: "pointer",
          transition: "box-shadow 0.1s, border 0.1s",
        }}
        title={`Value: ${value.toFixed(4)}`}
      />
    );
  },
);

// ─── Conv Layer Visualization ─────────────────────────────────────────────────
const ConvLayerVisualization = memo(
  ({
    activations,
    layerName,
    layerIndex,
    layerConfig,
    onCellHover,
    onCellLeave,
    highlightedCells,
    containerRef,
    numColumns = 1,
  }) => {
    const theme = useTheme();
    const layerRef = useRef(null);

    // activations shape: [height, width, filters] as array
    const height = activations?.length ?? 0;
    const width = activations?.[0]?.length ?? 0;
    const numFilters = activations?.[0]?.[0]?.length ?? 0;

    // Compute per-filter min/max so every filter uses the full color range
    // (global normalization makes lightly-activated filters look solid blue)
    const filterStats = useMemo(() => {
      if (!activations || numFilters === 0) return [];
      const stats = [];
      for (let f = 0; f < numFilters; f++) {
        let minVal = Infinity,
          maxVal = -Infinity;
        for (let h = 0; h < height; h++) {
          for (let w = 0; w < width; w++) {
            const val = activations[h][w][f];
            if (val < minVal) minVal = val;
            if (val > maxVal) maxVal = val;
          }
        }
        // Dead filter: keep range at 0 — activationToColor detects range<1e-7
        // and returns near-black, making dead filters visually obvious.
        const safeMin = isFinite(minVal) ? minVal : 0;
        const safeMax = isFinite(maxVal) ? maxVal : 0;
        stats.push({ minVal: safeMin, maxVal: safeMax });
      }
      return stats;
    }, [activations, height, width, numFilters]);

    // Enhanced hover handler that includes layer config
    const handleCellHover = useCallback(
      (cellInfo) => {
        onCellHover?.({
          ...cellInfo,
          layerConfig,
          prevLayerSize: layerConfig?.prevLayerSize,
        });
      },
      [onCellHover, layerConfig],
    );

    if (!activations || activations.length === 0) return null;

    // Adaptive cell size based on layer size
    const cellSize = Math.max(3, Math.min(CELL_SIZE, 64 / height));

    // Limit filters shown for larger layers
    const maxFiltersToShow = Math.min(numFilters, 32);

    return (
      <Box
        ref={layerRef}
        sx={{
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          alignSelf: "center",
        }}
        data-layer-index={layerIndex}
      >
        <Box
          sx={{
            display: "inline-grid",
            gridTemplateColumns: `repeat(${numColumns}, max-content)`,
            gap: `${MATRIX_GAP}px`,
            p: 1,
            bgcolor: alpha(theme.palette.grey[500], 0.4),
            borderRadius: 1,
          }}
        >
          {Array.from({ length: maxFiltersToShow }, (_, filterIdx) => {
            const { minVal, maxVal } = filterStats[filterIdx];
            return (
              <Tooltip
                key={filterIdx}
                title={`Filter ${filterIdx + 1}`}
                placement="top"
                arrow
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${width}, ${cellSize}px)`,
                    gridTemplateRows: `repeat(${height}, ${cellSize}px)`,
                    gap: 0,
                    border: "1px solid",
                    borderColor: "grey.600",
                    borderRadius: 0.5,
                    overflow: "hidden",
                  }}
                >
                  {Array.from({ length: height }, (_, h) =>
                    Array.from({ length: width }, (_, w) => {
                      const isHighlighted = highlightedCells?.some(
                        (c) =>
                          c.layerIndex === layerIndex &&
                          (c.filterIndex === filterIdx ||
                            c.filterIndex === "all") &&
                          c.rowIndex === h &&
                          c.colIndex === w,
                      );
                      return (
                        <ActivationCell
                          key={`${h}-${w}`}
                          value={activations[h][w][filterIdx]}
                          minVal={minVal}
                          maxVal={maxVal}
                          cellSize={cellSize}
                          layerIndex={layerIndex}
                          filterIndex={filterIdx}
                          rowIndex={h}
                          colIndex={w}
                          onHover={handleCellHover}
                          onLeave={onCellLeave}
                          isHighlighted={isHighlighted}
                        />
                      );
                    }),
                  )}
                </Box>
              </Tooltip>
            );
          })}
          {numFilters > maxFiltersToShow && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ alignSelf: "center" }}
            >
              +{numFilters - maxFiltersToShow} more
            </Typography>
          )}
        </Box>
      </Box>
    );
  },
);

// ─── Output Layer Prediction Visualization ──────────────────────────────────
const OutputLayerVisualization = memo(
  ({ activations, layerIndex, classNames, onCellHover, onCellLeave }) => {
    const theme = useTheme();

    if (!activations || activations.length === 0) return null;

    const numClasses = activations.length;
    const predictedIdx = activations.indexOf(Math.max(...activations));
    const predictedName =
      classNames?.[predictedIdx] ?? `Class ${predictedIdx + 1}`;
    const predictedColor = activationToColor(activations[predictedIdx], 0, 1);

    return (
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          bgcolor: alpha(theme.palette.grey[500], 0.4),
          borderRadius: 1,
          p: 1,
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          display: "flex",
          alignItems: "center",
          alignSelf: "center",
        }}
      >
        {Array.from({ length: numClasses }, (_, idx) => {
          const value = activations[idx];
          const pct = (value * 100).toFixed(1);
          const name = classNames?.[idx] ?? `Class ${idx + 1}`;
          const color = activationToColor(value, 0, 1);
          const isPredicted = idx === predictedIdx;

          return (
            <Box
              key={idx}
              onMouseEnter={() =>
                onCellHover?.({ layerIndex, neuronIndex: idx, value })
              }
              onMouseLeave={onCellLeave}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.25,
                px: 0.75,
                py: 0.5,
                borderRadius: 1,
                border: "1px solid",
                borderColor: isPredicted
                  ? "rgba(255,255,255,0.4)"
                  : "transparent",
                bgcolor: isPredicted
                  ? alpha(theme.palette.grey[100], 0.06)
                  : "transparent",
                transition: "all 0.2s",
                minWidth: 0,
                width: 60,
              }}
            >
              {/* Activation square */}
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: 0.5,
                  flexShrink: 0,
                  bgcolor: color,
                  border: isPredicted
                    ? "1px solid rgba(255,255,255,0.9)"
                    : "1px solid rgba(255,255,255,0.2)",
                  boxShadow: isPredicted
                    ? "0 0 6px rgba(255,255,255,0.8)"
                    : "none",
                }}
              />
              {/* Class name */}
              <Typography
                variant="caption"
                sx={{
                  width: "100%",
                  fontWeight: isPredicted ? "bold" : "normal",
                  color: isPredicted ? "text.primary" : "text.secondary",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                  fontSize: "0.6rem",
                }}
              >
                {name}
              </Typography>
              {/* Percentage */}
              <Typography
                variant="caption"
                sx={{
                  fontWeight: isPredicted ? "bold" : "normal",
                  color: isPredicted ? "text.primary" : "text.secondary",
                  fontSize: "0.6rem",
                }}
              >
                {pct}%
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  },
);

// ─── Dense Layer Visualization ────────────────────────────────────────────────
const DenseLayerVisualization = memo(
  ({
    activations,
    layerName,
    layerIndex,
    classNames,
    onCellHover,
    onCellLeave,
    highlightedCells,
    isOutput = false,
  }) => {
    const theme = useTheme();

    if (!activations || activations.length === 0) return null;

    const numNeurons = activations.length;

    // Calculate min/max for normalization
    let minVal = isOutput ? 0 : Math.min(...activations);
    let maxVal = isOutput ? 1 : Math.max(...activations);

    // Cell size - larger for output layer
    const cellSize = isOutput
      ? 24
      : Math.max(8, Math.min(16, 400 / numNeurons));
    const maxNeuronsToShow = Math.min(numNeurons, 64);

    return (
      <Box
        sx={{
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          alignSelf: "center",
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            gap: isOutput ? "8px" : "2px",
            justifyContent: "flex-start",
            p: 1,
            bgcolor: alpha(theme.palette.grey[500], 0.4),
            borderRadius: 1,
          }}
        >
          {Array.from({ length: maxNeuronsToShow }, (_, idx) => {
            const isHighlighted = highlightedCells?.some(
              (c) => c.layerIndex === layerIndex && c.neuronIndex === idx,
            );
            const value = activations[idx];
            const color = activationToColor(value, minVal, maxVal);
            const label =
              isOutput && classNames?.[idx] ? classNames[idx] : null;

            return (
              <Tooltip
                key={idx}
                title={
                  label
                    ? `${label}: ${(value * 100).toFixed(1)}%`
                    : `Neuron ${idx + 1}: ${value.toFixed(4)}`
                }
                placement="top"
                arrow
              >
                <Box
                  onMouseEnter={() =>
                    onCellHover?.({ layerIndex, neuronIndex: idx, value })
                  }
                  onMouseLeave={onCellLeave}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      width: cellSize,
                      height: cellSize,
                      bgcolor: color,
                      borderRadius: isOutput ? "50%" : 0.5,
                      border: isHighlighted ? "2px solid #fff" : "1px solid",
                      borderColor: isHighlighted ? "#fff" : "grey.600",
                      boxShadow: isHighlighted
                        ? "0 0 8px rgba(255,255,255,0.8)"
                        : "none",
                      cursor: "pointer",
                      transition: "all 0.1s",
                    }}
                  />
                  {isOutput && label && (
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.65rem",
                        maxWidth: 60,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {label}
                    </Typography>
                  )}
                </Box>
              </Tooltip>
            );
          })}
          {numNeurons > maxNeuronsToShow && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ alignSelf: "center" }}
            >
              +{numNeurons - maxNeuronsToShow} more
            </Typography>
          )}
        </Box>
      </Box>
    );
  },
);

// ─── Receptive Field Calculator ───────────────────────────────────────────────
// Calculate which cells in the previous layer a conv cell is connected to
function getReceptiveField(layerConfig, rowIndex, colIndex) {
  const kernelSize = layerConfig.kernel_size || [3, 3];
  const strides = layerConfig.strides || [1, 1];
  const padding = layerConfig.padding || "same";

  const [kH, kW] = kernelSize;
  const [sH, sW] = strides;

  // With "same" padding, the receptive field center is at (row * stride, col * stride)
  const centerRow = rowIndex * sH;
  const centerCol = colIndex * sW;

  // Calculate the bounds of the receptive field
  const halfKH = Math.floor(kH / 2);
  const halfKW = Math.floor(kW / 2);

  const cells = [];
  for (let dh = -halfKH; dh <= halfKH; dh++) {
    for (let dw = -halfKW; dw <= halfKW; dw++) {
      cells.push({
        row: centerRow + dh,
        col: centerCol + dw,
      });
    }
  }

  return cells;
}

// ─── Main Neural Network Visualization Component ──────────────────────────────
const NeuralNetworkVisualization = ({
  trainedModel,
  strokePoints,
  samplePixelData,
  classNames,
  classes, // Array of {name, samples: [{strokePoints, pixelData}]}
}) => {
  const theme = useTheme();
  const containerRef = useRef(null);
  const [layerActivations, setLayerActivations] = useState(null);
  const [layerMeta, setLayerMeta] = useState([]); // [{name, className, config}]
  const [hoveredCell, setHoveredCell] = useState(null);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [selectedSample, setSelectedSample] = useState(null);
  const intermediateModelsRef = useRef(null);

  // Get pixel data from selected sample, stroke points, or provided data
  const pixelData = useMemo(() => {
    if (selectedSample?.pixelData) return selectedSample.pixelData;
    if (selectedSample?.strokePoints)
      return renderStrokeToImage(selectedSample.strokePoints);
    if (samplePixelData) return samplePixelData;
    if (strokePoints && strokePoints.length > 0) {
      return renderStrokeToImage(strokePoints);
    }
    return null;
  }, [strokePoints, samplePixelData, selectedSample]);

  // Extract activations when pixel data changes — run a single forward pass and
  // capture each layer output by temporarily wrapping the sequential model into
  // a multi-output functional model.  We use getOutputAt(-1) which always refers
  // to the most-recently-added inbound node, avoiding the "multiple inbound
  // nodes" error that occurs when layers were first used in the base model and
  // then re-added to the sequential model.
  useEffect(() => {
    if (!pixelData || !trainedModel?.model) {
      setLayerActivations(null);
      return;
    }

    let multiOutputModel = null;

    const extractActivations = async () => {
      const model = trainedModel.model;

      // Collect per-layer output tensors using the last inbound node so that
      // layers that were re-used from the base model don't error out.
      const outputTensors = [];
      const layerMeta = [];

      for (const layer of model.layers) {
        const className = layer.getClassName();
        if (className === "InputLayer") continue;
        try {
          // inboundNodes.length > 1 means the layer was also used in another
          // graph (the original base model).  getOutputAt(lastNode) resolves
          // the ambiguity; for single-node layers getOutputAt(0) is fine.
          const nodeCount = layer.inboundNodes?.length ?? 1;
          const nodeIdx = nodeCount - 1;
          const outputTensor = layer.getOutputAt(nodeIdx);
          outputTensors.push(outputTensor);
          layerMeta.push({
            name: layer.name,
            className,
            config: layer.getConfig?.() || {},
          });
        } catch (e) {
          console.warn(`Skipping layer ${layer.name}:`, e.message);
        }
      }

      if (outputTensors.length === 0) return;

      try {
        // Build one functional model that outputs everything at once.
        multiOutputModel = tf.model({
          inputs: model.inputs,
          outputs: outputTensors,
        });

        const inputTensor = tf.tidy(() => {
          const imageData = new ImageData(
            new Uint8ClampedArray(pixelData),
            STROKE_IMAGE_SIZE,
            STROKE_IMAGE_SIZE,
          );
          return tf.browser.fromPixels(imageData, 3).div(255.0).expandDims(0);
        });

        // predict() returns an array when there are multiple outputs
        const outputs = multiOutputModel.predict(inputTensor);
        inputTensor.dispose();

        const outputArray = Array.isArray(outputs) ? outputs : [outputs];
        const activations = {};

        for (let i = 0; i < layerMeta.length; i++) {
          const { name, className } = layerMeta[i];
          const data = await outputArray[i].array();
          outputArray[i].dispose();
          // Remove batch dimension
          activations[name] = { data: data[0], className };
        }

        // Store metadata so the render knows configs
        intermediateModelsRef.current = layerMeta;
        setLayerMeta(layerMeta);
        setLayerActivations(activations);
      } catch (e) {
        console.error("Error extracting activations:", e);
      }
    };

    extractActivations();

    return () => {
      // multiOutputModel shares tensors with the main model, do not dispose weights
      multiOutputModel = null;
    };
  }, [pixelData, trainedModel]);

  // Handle cell hover - highlight receptive field in previous layer
  const handleCellHover = useCallback((cellInfo) => {
    setHoveredCell(cellInfo);

    const highlighted = [cellInfo];

    // If this is a conv layer cell, calculate receptive field in previous layer
    if (cellInfo.layerConfig && cellInfo.rowIndex !== undefined) {
      const receptiveField = getReceptiveField(
        cellInfo.layerConfig,
        cellInfo.rowIndex,
        cellInfo.colIndex,
      );

      const prevLayerIndex = cellInfo.layerIndex - 1;
      receptiveField.forEach(({ row, col }) => {
        if (row >= 0 && col >= 0) {
          highlighted.push({
            layerIndex: prevLayerIndex,
            rowIndex: row,
            colIndex: col,
            filterIndex: "all",
          });
        }
      });
    }

    setHighlightedCells(highlighted);
  }, []);

  const handleCellLeave = useCallback(() => {
    setHoveredCell(null);
    setHighlightedCells([]);
  }, []);

  // Build layer visualization elements
  const layerElements = useMemo(() => {
    if (!layerActivations || layerMeta.length === 0) return null;

    const elements = [];
    let layerIndex = 0;

    // Process layers in the order they appear in layerMeta (model order)
    const layerOrder = layerMeta
      .map((m) => m.name)
      .filter((n) => n in layerActivations);

    // Build a map of layer configs for receptive field calculation
    const layerConfigs = {};
    layerMeta.forEach((layer, idx) => {
      layerConfigs[layer.name] = {
        ...layer.config,
        prevLayerSize: idx > 0 ? layerMeta[idx - 1].config : null,
      };
    });

    const lastLayerName = layerOrder[layerOrder.length - 1];
    let convLayerCount = 0;

    for (const layerName of layerOrder) {
      const { data, className } = layerActivations[layerName];
      const config = layerConfigs[layerName];
      const isLastLayer = layerName === lastLayerName;

      if (elements.length > 0) {
        elements.push(
          <Box
            key={`arrow-${layerIndex}`}
            sx={{
              display: "flex",
              alignItems: "center",
              alignSelf: "center",
              px: 0.5,
            }}
          >
            <Typography color="text.secondary" sx={{ fontSize: "1.2rem" }}>
              →
            </Typography>
          </Box>,
        );
      }

      if (className === "Conv2D") {
        const convIdx = convLayerCount++;
        elements.push(
          <ConvLayerVisualization
            key={layerName}
            activations={data}
            layerName={layerName.replace(/_/g, " ")}
            layerIndex={layerIndex}
            layerConfig={config}
            onCellHover={handleCellHover}
            onCellLeave={handleCellLeave}
            highlightedCells={highlightedCells}
            containerRef={containerRef}
            numColumns={convIdx >= 1 ? 2 : 1}
          />,
        );
      } else if (
        className === "GlobalAveragePooling2D" ||
        className === "Flatten"
      ) {
        // 1D array after pooling
        const flatData = Array.isArray(data[0]) ? data.flat(Infinity) : data;
        elements.push(
          <DenseLayerVisualization
            key={layerName}
            activations={flatData}
            layerName={layerName.replace(/_/g, " ")}
            layerIndex={layerIndex}
            onCellHover={handleCellHover}
            onCellLeave={handleCellLeave}
            highlightedCells={highlightedCells}
          />,
        );
      } else if (className === "Dense") {
        if (isLastLayer) {
          elements.push(
            <OutputLayerVisualization
              key={layerName}
              activations={data}
              layerIndex={layerIndex}
              classNames={classNames}
              onCellHover={handleCellHover}
              onCellLeave={handleCellLeave}
            />,
          );
        } else {
          elements.push(
            <DenseLayerVisualization
              key={layerName}
              activations={data}
              layerName={layerName.replace(/_/g, " ")}
              layerIndex={layerIndex}
              onCellHover={handleCellHover}
              onCellLeave={handleCellLeave}
              highlightedCells={highlightedCells}
            />,
          );
        }
      } else if (className === "Softmax") {
        elements.push(
          <OutputLayerVisualization
            key={layerName}
            activations={data}
            layerIndex={layerIndex}
            classNames={classNames}
            onCellHover={handleCellHover}
            onCellLeave={handleCellLeave}
          />,
        );
      }

      layerIndex++;
    }

    return elements;
  }, [
    layerActivations,
    layerMeta,
    classNames,
    highlightedCells,
    handleCellHover,
    handleCellLeave,
  ]);

  if (!trainedModel?.model) {
    return null;
  }

  return (
    <Paper
      ref={containerRef}
      elevation={2}
      sx={{
        p: 2,
        mt: 2,
        position: "relative",
        borderRadius: 2,
      }}
    >
      {!pixelData ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body2" color="grey.500">
            Draw a spell to visualize network activations
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          {layerElements}

          {/* Hover info panel */}
          {hoveredCell && (
            <Paper
              elevation={4}
              sx={{
                position: "fixed",
                bottom: 16,
                right: 16,
                p: 1.5,
                bgcolor: "grey.800",
                color: "white",
                zIndex: 1000,
                minWidth: 180,
                maxWidth: 250,
              }}
            >
              <Typography
                variant="caption"
                display="block"
                fontWeight="bold"
                mb={0.5}
              >
                Cell Details
              </Typography>
              <Typography variant="caption" display="block">
                <strong>Activation:</strong> {hoveredCell.value?.toFixed(6)}
              </Typography>
              {hoveredCell.filterIndex !== undefined && (
                <Typography variant="caption" display="block">
                  <strong>Filter:</strong> {hoveredCell.filterIndex + 1}
                </Typography>
              )}
              {hoveredCell.rowIndex !== undefined && (
                <Typography variant="caption" display="block">
                  <strong>Position:</strong> ({hoveredCell.rowIndex},{" "}
                  {hoveredCell.colIndex})
                </Typography>
              )}
              {hoveredCell.neuronIndex !== undefined && (
                <Typography variant="caption" display="block">
                  <strong>Neuron:</strong> {hoveredCell.neuronIndex + 1}
                </Typography>
              )}
              {hoveredCell.layerConfig && (
                <>
                  <Typography
                    variant="caption"
                    display="block"
                    color="grey.400"
                    mt={0.5}
                  >
                    Kernel:{" "}
                    {hoveredCell.layerConfig.kernel_size?.join("×") || "3×3"}
                  </Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    color="grey.400"
                  >
                    Stride:{" "}
                    {hoveredCell.layerConfig.strides?.join("×") || "1×1"}
                  </Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    color="primary.light"
                    fontStyle="italic"
                    mt={0.5}
                  >
                    Highlighted cells show receptive field
                  </Typography>
                </>
              )}
            </Paper>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default memo(NeuralNetworkVisualization);
