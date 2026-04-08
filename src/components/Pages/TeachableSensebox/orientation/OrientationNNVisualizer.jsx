import React, {
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
  useMemo,
} from "react";
import * as tf from "@tensorflow/tfjs";
import {
  Box,
  Typography,
  LinearProgress,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { getOrientationTranslations } from "./translations";
import HelpButton from "../HelpButton";

// ─── Constants ─────────────────────────────────────────────────────────────────

const NODE_SIZE = 25;
const GROUP_HEADER_H = 52;

/** Axis colours matching the sensor graphs. */
const AXIS_COLORS = { x: "#e53935", y: "#43a047", z: "#1e88e5" };
const INPUT_NODES = [
  { key: "x", label: "X", color: AXIS_COLORS.x },
  { key: "y", label: "Y", color: AXIS_COLORS.y },
  { key: "z", label: "Z", color: AXIS_COLORS.z },
];

/** Grey used for all connections and hidden neurons. */
const CONN_GREY = "#9e9e9e";
const OUTPUT_GREEN = "#43a047";
const OUTPUT_GREY = "#9e9e9e";
const HOVER_YELLOW = "#f9a825";

/**
 * Default dense-NN architecture: 2 hidden layers × 2 neurons each.
 */
export const DEFAULT_NN_CONFIG = {
  hiddenLayers: [{ units: 2, activation: "relu" }],
};

// ─── Weight-visualization helpers ─────────────────────────────────────────────

function maxAbsInMatrix(matrix) {
  let max = 0;
  for (const row of matrix) {
    for (const v of row) {
      const a = Math.abs(v);
      if (a > max) max = a;
    }
  }
  return max || 1;
}

function weightToStrokeProps(norm) {
  const abs = Math.min(1, Math.abs(norm));
  return {
    color: CONN_GREY,
    strokeWidth: 0.5 + 3.5 * abs,
    opacity: Math.max(0.08, 0.12 + 0.78 * abs),
    strokeDasharray: "4,3",
  };
}

/** Like weightToStrokeProps but with higher minimum visibility for output connections. */
function weightToOutputStrokeProps(norm) {
  const abs = Math.min(1, Math.abs(norm));
  return {
    color: CONN_GREY,
    strokeWidth: 0.8 + 2.7 * abs,
    opacity: Math.max(0.35, 0.35 + 0.55 * abs),
    strokeDasharray: "4,3",
  };
}

// ─── useDiagramConnections ────────────────────────────────────────────────────

function useDiagramConnections(
  containerRef,
  inputNodeRefs, // [{current}] × 3 (x, y, z)
  layerNodeRefs, // [[{current}]] — [layer][neuron]
  outputNodeRefs, // [{current}] × numClasses
  hiddenLayers,
  classNames,
  extractedWeights,
  neuronNames, // [["n1","n2",...]] per layer
) {
  const [connections, setConnections] = useState([]);

  const recalculate = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();

    const toLocal = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        cx: r.left + r.width / 2 - containerRect.left,
        cy: r.top + r.height / 2 - containerRect.top,
        right: r.right - containerRect.left,
        left: r.left - containerRect.left,
      };
    };

    const newConnections = [];
    const hasWeights = Boolean(extractedWeights?.kernels?.length);

    // ── Input (x,y,z) → Hidden Layer 1 ───────────────────────────────────
    const layer1Refs = layerNodeRefs[0];
    if (layer1Refs) {
      const layer1Pos = layer1Refs
        .map((r) => toLocal(r.current))
        .filter(Boolean);
      const kernel0 = hasWeights ? extractedWeights.kernels[0] : null;
      const maxAbs0 = kernel0 ? maxAbsInMatrix(kernel0) : 1;

      INPUT_NODES.forEach((node, ii) => {
        const src = toLocal(inputNodeRefs[ii]?.current);
        if (!src) return;
        layer1Pos.forEach((dst, nj) => {
          const midX = (src.right + dst.left) / 2;
          let strokeProps, rawWeight;
          if (kernel0) {
            const w = kernel0[ii]?.[nj] ?? 0;
            rawWeight = w;
            strokeProps = weightToStrokeProps(w / maxAbs0);
          } else {
            rawWeight = null;
            strokeProps = {
              color: CONN_GREY,
              strokeWidth: 2,
              opacity: 0.3,
              strokeDasharray: "4,3",
            };
          }
          newConnections.push({
            x1: src.right,
            y1: src.cy,
            x2: dst.left,
            y2: dst.cy,
            cx1: midX,
            cy1: src.cy,
            cx2: midX,
            cy2: dst.cy,
            ...strokeProps,
            targetType: "hidden",
            targetLayerIdx: 0,
            targetNeuronIdx: nj,
            rawWeight,
            sourceLabel: INPUT_NODES[ii].label,
          });
        });
      });
    }

    // ── Hidden Layer i → Hidden Layer i+1 ─────────────────────────────────
    for (let li = 0; li < hiddenLayers.length - 1; li++) {
      const srcRefs = layerNodeRefs[li];
      const dstRefs = layerNodeRefs[li + 1];
      if (!srcRefs || !dstRefs) continue;
      const kernelHH = hasWeights ? extractedWeights.kernels[li + 1] : null;
      const maxAbsHH = kernelHH ? maxAbsInMatrix(kernelHH) : 1;

      srcRefs.forEach((srcRef, ni) => {
        const src = toLocal(srcRef.current);
        if (!src) return;
        dstRefs.forEach((dstRef, nj) => {
          const dst = toLocal(dstRef.current);
          if (!dst) return;
          const midX = (src.right + dst.left) / 2;
          let strokeProps, rawWeight;
          if (kernelHH) {
            const w = kernelHH[ni]?.[nj] ?? 0;
            rawWeight = w;
            strokeProps = weightToStrokeProps(w / maxAbsHH);
          } else {
            rawWeight = null;
            strokeProps = {
              color: CONN_GREY,
              strokeWidth: 1.5,
              opacity: 0.25,
              strokeDasharray: "4,3",
            };
          }
          newConnections.push({
            x1: src.right,
            y1: src.cy,
            x2: dst.left,
            y2: dst.cy,
            cx1: midX,
            cy1: src.cy,
            cx2: midX,
            cy2: dst.cy,
            ...strokeProps,
            targetType: "hidden",
            targetLayerIdx: li + 1,
            targetNeuronIdx: nj,
            rawWeight,
            sourceLabel: neuronNames[li]?.[ni] ?? "n?",
          });
        });
      });
    }

    // ── 0 hidden layers: direct input → outputs ───────────────────────────
    if (hiddenLayers.length === 0 && outputNodeRefs.length > 0) {
      const kernelDirect = hasWeights ? extractedWeights.kernels[0] : null;
      const maxAbsDirect = kernelDirect ? maxAbsInMatrix(kernelDirect) : 1;
      INPUT_NODES.forEach((node, ii) => {
        const src = toLocal(inputNodeRefs[ii]?.current);
        if (!src) return;
        outputNodeRefs.forEach((outRef, oi) => {
          const dst = toLocal(outRef?.current);
          if (!dst) return;
          const midX = (src.right + dst.left) / 2;
          let strokeProps, rawWeight;
          if (kernelDirect) {
            const w = kernelDirect[ii]?.[oi] ?? 0;
            rawWeight = w;
            strokeProps = weightToOutputStrokeProps(w / maxAbsDirect);
          } else {
            rawWeight = null;
            strokeProps = {
              color: CONN_GREY,
              strokeWidth: 1.5,
              opacity: 0.45,
              strokeDasharray: "4,3",
            };
          }
          newConnections.push({
            x1: src.right,
            y1: src.cy,
            x2: dst.left,
            y2: dst.cy,
            cx1: midX,
            cy1: src.cy,
            cx2: midX,
            cy2: dst.cy,
            ...strokeProps,
            targetType: "output",
            targetLayerIdx: -1,
            targetNeuronIdx: oi,
            rawWeight,
            sourceLabel: INPUT_NODES[ii].label,
          });
        });
      });
    }

    // ── Last Hidden Layer → Outputs ────────────────────────────────────────
    const lastLayerRefs = layerNodeRefs[layerNodeRefs.length - 1];
    if (lastLayerRefs && outputNodeRefs.length > 0) {
      const lastPos = lastLayerRefs
        .map((r) => toLocal(r.current))
        .filter(Boolean);
      const kernelOut = hasWeights
        ? extractedWeights.kernels[hiddenLayers.length]
        : null;
      const maxAbsOut = kernelOut ? maxAbsInMatrix(kernelOut) : 1;

      lastPos.forEach((src, ni) => {
        outputNodeRefs.forEach((outRef, oi) => {
          const dst = toLocal(outRef?.current);
          if (!dst) return;
          const midX = (src.right + dst.left) / 2;
          let strokeProps, rawWeight;
          if (kernelOut) {
            const w = kernelOut[ni]?.[oi] ?? 0;
            rawWeight = w;
            strokeProps = weightToOutputStrokeProps(w / maxAbsOut);
          } else {
            rawWeight = null;
            strokeProps = {
              color: CONN_GREY,
              strokeWidth: 1.5,
              opacity: 0.45,
              strokeDasharray: "4,3",
            };
          }
          newConnections.push({
            x1: src.right,
            y1: src.cy,
            x2: dst.left,
            y2: dst.cy,
            cx1: midX,
            cy1: src.cy,
            cx2: midX,
            cy2: dst.cy,
            ...strokeProps,
            targetType: "output",
            targetLayerIdx: -1,
            targetNeuronIdx: oi,
            rawWeight,
            sourceLabel: neuronNames[hiddenLayers.length - 1]?.[ni] ?? "n?",
          });
        });
      });
    }

    setConnections(newConnections);
  }, [
    containerRef,
    inputNodeRefs,
    layerNodeRefs,
    outputNodeRefs,
    hiddenLayers,
    classNames,
    extractedWeights,
    neuronNames,
  ]);

  useLayoutEffect(() => {
    recalculate();
    const observer = new ResizeObserver(recalculate);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [recalculate]);

  return connections;
}

// ─── OrientationNNVisualizer ──────────────────────────────────────────────────

/**
 * Visual representation of the orientation dense classification network.
 *
 * Left  → 3 input nodes (X, Y, Z)
 * Middle → hidden layer columns (+/- layers and neurons)
 * Right  → output class chips
 *
 * @param {{
 *   classNames: string[],
 *   nnConfig: object,
 *   onNNConfigChange: (config: object) => void,
 *   trainedModel: object|null,
 * }} props
 */
const OrientationNNVisualizer = ({
  classNames = [],
  nnConfig = DEFAULT_NN_CONFIG,
  onNNConfigChange,
  trainedModel = null,
  latestSample = null,
  onOpenHelp,
}) => {
  const t = getOrientationTranslations();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const containerRef = useRef(null);

  const { hiddenLayers } = nnConfig;

  // ── Extract trained weights ──────────────────────────────────────────────
  const extractedWeights = useMemo(() => {
    if (!trainedModel?.model) return null;
    try {
      const tfModel = trainedModel.model;
      const kernels = [];
      const biases = [];
      for (const layer of tfModel.layers) {
        const ws = layer.getWeights();
        if (ws.length >= 2) {
          kernels.push(ws[0].arraySync()); // [inSize, outSize]
          biases.push(ws[1].arraySync()); // [outSize]
        }
      }
      return { kernels, biases };
    } catch {
      return null;
    }
  }, [trainedModel]);

  const layerActivations = useMemo(() => {
    if (!trainedModel?.model || !latestSample) return null;
    try {
      const tfModel = trainedModel.model;
      const allTensors = [];
      const input = tf.tensor2d([
        [latestSample.x, latestSample.y, latestSample.z],
      ]);
      allTensors.push(input);
      const activations = [];
      let current = input;
      for (const layer of tfModel.layers) {
        if (layer.getWeights().length >= 2) {
          const output = layer.apply(current);
          allTensors.push(output);
          activations.push(output.arraySync()[0]);
          current = output;
        }
      }
      tf.dispose(allTensors);
      // Exclude the last (output/softmax) layer — only hidden activations
      return activations.slice(0, -1);
    } catch {
      return null;
    }
  }, [trainedModel, latestSample]);

  // ── Live output prediction (which class is most likely right now) ─────────
  const liveProbs = useMemo(() => {
    if (!trainedModel?.model || !latestSample) return null;
    try {
      const input = tf.tensor2d([
        [latestSample.x, latestSample.y, latestSample.z],
      ]);
      const pred = trainedModel.model.predict(input);
      const probs = pred.arraySync()[0];
      tf.dispose([input, pred]);
      return probs;
    } catch {
      return null;
    }
  }, [trainedModel, latestSample]);

  const winnerIdx = useMemo(() => {
    if (!liveProbs) return -1;
    let best = 0;
    for (let i = 1; i < liveProbs.length; i++) {
      if (liveProbs[i] > liveProbs[best]) best = i;
    }
    return best;
  }, [liveProbs]);

  // ── Hover state for neuron/output inspection ────────────────────────────
  const [hoveredNode, setHoveredNode] = useState(null);
  // null | { type: "hidden", layerIdx, neuronIdx } | { type: "output", neuronIdx }

  // ── Neuron variable names (n1, n2, … globally sequential) ───────────────
  const neuronNames = useMemo(() => {
    const names = [];
    let counter = 1;
    for (const layer of hiddenLayers) {
      const layerNames = [];
      for (let ni = 0; ni < layer.units; ni++) {
        layerNames.push(`n${counter++}`);
      }
      names.push(layerNames);
    }
    return names;
  }, [hiddenLayers]);

  // ── Tooltip content builder ──────────────────────────────────────────────
  const buildTooltipContent = (type, layerIdx, neuronIdx) => {
    let varName, kernelIdx, activation, bias, sourceLabels;
    if (type === "hidden") {
      varName = neuronNames[layerIdx]?.[neuronIdx] ?? "n?";
      kernelIdx = layerIdx;
      activation = hiddenLayers[layerIdx]?.activation ?? "relu";
      bias = extractedWeights?.biases?.[layerIdx]?.[neuronIdx];
      sourceLabels =
        layerIdx === 0
          ? INPUT_NODES.map((n) => n.label)
          : (neuronNames[layerIdx - 1] ?? []);
    } else {
      varName = classNames?.[neuronIdx] ?? `out_${neuronIdx + 1}`;
      kernelIdx = hiddenLayers.length;
      activation = "softmax";
      bias = extractedWeights?.biases?.[hiddenLayers.length]?.[neuronIdx];
      sourceLabels =
        hiddenLayers.length === 0
          ? INPUT_NODES.map((n) => n.label)
          : (neuronNames[hiddenLayers.length - 1] ?? []);
    }
    if (!extractedWeights) {
      return (
        <Box sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>
          <strong>{varName}</strong> — train the model to see weights
        </Box>
      );
    }
    const kernel = extractedWeights.kernels[kernelIdx];
    if (!kernel) return <Box sx={{ fontFamily: "monospace" }}>{varName}</Box>;
    const terms = sourceLabels.map((label, srcIdx) => {
      const w = kernel[srcIdx]?.[neuronIdx] ?? 0;
      return `  ${w >= 0 ? "+" : ""}${w.toFixed(3)} × ${label}`;
    });
    const biasLine =
      bias !== undefined
        ? `  ${bias >= 0 ? "+" : ""}${bias.toFixed(3)}  [bias]`
        : "";
    const lines = [
      `${varName} = ${activation}(`,
      ...terms,
      ...(biasLine ? [biasLine] : []),
      ")",
    ];
    return (
      <Box
        sx={{ fontFamily: "monospace", fontSize: "0.72rem", whiteSpace: "pre" }}
      >
        {lines.join("\n")}
      </Box>
    );
  };

  // ── Highlight helper ─────────────────────────────────────────────────────
  const isConnectionHighlighted = (c) => {
    if (!hoveredNode) return false;
    if (hoveredNode.type === "hidden") {
      return (
        c.targetType === "hidden" &&
        c.targetLayerIdx === hoveredNode.layerIdx &&
        c.targetNeuronIdx === hoveredNode.neuronIdx
      );
    }
    return (
      c.targetType === "output" && c.targetNeuronIdx === hoveredNode.neuronIdx
    );
  };

  // ── Architecture controls ────────────────────────────────────────────────
  const addLayer = useCallback(() => {
    if (!onNNConfigChange || hiddenLayers.length >= 3) return;
    onNNConfigChange({
      ...nnConfig,
      hiddenLayers: [...hiddenLayers, { units: 2, activation: "relu" }],
    });
  }, [hiddenLayers, nnConfig, onNNConfigChange]);

  const removeLayer = useCallback(() => {
    if (!onNNConfigChange || hiddenLayers.length <= 0) return;
    onNNConfigChange({
      ...nnConfig,
      hiddenLayers: hiddenLayers.slice(0, -1),
    });
  }, [hiddenLayers, nnConfig, onNNConfigChange]);

  const changeNeurons = useCallback(
    (layerIndex, delta) => {
      if (!onNNConfigChange) return;
      const newUnits = Math.max(
        1,
        Math.min(8, hiddenLayers[layerIndex].units + delta),
      );
      const newLayers = hiddenLayers.map((l, i) =>
        i === layerIndex ? { ...l, units: newUnits } : l,
      );
      onNNConfigChange({ ...nnConfig, hiddenLayers: newLayers });
    },
    [hiddenLayers, nnConfig, onNNConfigChange],
  );

  // ── Stable ref arrays ────────────────────────────────────────────────────
  // Input node refs (x, y, z) — always 3
  const inputNodeRefsContainer = useRef(
    INPUT_NODES.map(() => ({ current: null })),
  );
  const inputNodeRefs = inputNodeRefsContainer.current;

  // Hidden layer node refs
  const neuronCounts = hiddenLayers.map((l) => l.units);
  const neuronKeyRef = useRef("");
  const neuronKey = neuronCounts.join(",");
  const layerNodeRefsContainer = useRef([]);
  if (
    neuronKeyRef.current !== neuronKey ||
    layerNodeRefsContainer.current.length !== hiddenLayers.length
  ) {
    neuronKeyRef.current = neuronKey;
    layerNodeRefsContainer.current = neuronCounts.map((count) =>
      Array.from({ length: count }, () => ({ current: null })),
    );
  }
  const layerNodeRefs = layerNodeRefsContainer.current;

  // Output node refs
  const outputNodeRefsContainer = useRef([]);
  if (outputNodeRefsContainer.current.length !== classNames.length) {
    outputNodeRefsContainer.current = classNames.map(() => ({ current: null }));
  }
  const outputNodeRefs = outputNodeRefsContainer.current;

  const connections = useDiagramConnections(
    containerRef,
    inputNodeRefs,
    layerNodeRefs,
    outputNodeRefs,
    hiddenLayers,
    classNames,
    extractedWeights,
    neuronNames,
  );

  // ── Mobile fallback ──────────────────────────────────────────────────────
  if (isMobile) {
    const layerSummary = hiddenLayers
      .map((l) => `Dense(${l.units})`)
      .join(" → ");
    return (
      <Box
        sx={{
          fontFamily: "monospace",
          fontSize: 13,
          color: "text.secondary",
          py: 1,
        }}
      >
        X, Y, Z → {layerSummary} → {classNames.length || "?"} outputs
      </Box>
    );
  }

  // ── Full diagram ─────────────────────────────────────────────────────────
  return (
    <Box
      ref={containerRef}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 0,
        overflowX: "auto",
        py: 2,
        minHeight: 200,
      }}
    >
      {/* SVG bezier overlay */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          overflow: "visible",
        }}
      >
        {connections.map((c, i) => {
          const highlighted = isConnectionHighlighted(c);
          return (
            <path
              key={i}
              d={`M ${c.x1} ${c.y1} C ${c.cx1} ${c.cy1}, ${c.cx2} ${c.cy2}, ${c.x2} ${c.y2}`}
              stroke={highlighted ? HOVER_YELLOW : c.color}
              strokeWidth={highlighted ? 2.5 : c.strokeWidth}
              strokeOpacity={highlighted ? 1 : c.opacity}
              strokeDasharray={highlighted ? "none" : c.strokeDasharray}
              fill="none"
            />
          );
        })}
        {/* Weight labels on highlighted connections */}
        {hoveredNode &&
          connections.map((c, i) => {
            if (!isConnectionHighlighted(c) || c.rawWeight === null)
              return null;
            const labelX = c.x1 + 16;
            const labelY = c.y1 - 8;
            return (
              <text
                key={`wl-${i}`}
                x={labelX}
                y={labelY}
                textAnchor="middle"
                fontSize="9"
                fill={HOVER_YELLOW}
                fontFamily="monospace"
                fontWeight="bold"
              >
                {c.rawWeight >= 0 ? "+" : ""}
                {c.rawWeight.toFixed(2)}
              </text>
            );
          })}
      </svg>

      {/* ── Column 1: Inputs (X, Y, Z) ───────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.75,
          minWidth: 80,
          zIndex: 1,
        }}
      >
        <Box sx={{ height: GROUP_HEADER_H, flexShrink: 0 }} />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 0.25,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {t.neuralNetwork.inputs}
        </Typography>

        {INPUT_NODES.map((node, ii) => (
          <Box
            key={node.key}
            ref={(el) => {
              inputNodeRefs[ii].current = el;
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              px: 0.5,
              py: 0.25,
            }}
          >
            <Box
              sx={{
                width: NODE_SIZE,
                height: NODE_SIZE,
                borderRadius: "50%",
                border: `2px solid ${node.color}`,
                bgcolor: node.color + "22",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  color: node.color,
                  lineHeight: 1,
                }}
              >
                {node.label}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Spacer */}
      <Box sx={{ flex: 1, minWidth: 40 }} />

      {/* ── Hidden Layers section ─────────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          zIndex: 1,
        }}
      >
        {/* Group header with Layers +/- control */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: GROUP_HEADER_H,
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flex: 1,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 600 }}
            >
              {t.neuralNetwork.layers}:
            </Typography>
            <IconButton
              size="small"
              onClick={removeLayer}
              disabled={hiddenLayers.length <= 0}
              sx={{ p: 0.25 }}
            >
              <RemoveIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <Typography
              variant="body2"
              sx={{ minWidth: 16, textAlign: "center", fontWeight: 700 }}
            >
              {hiddenLayers.length}
            </Typography>
            <IconButton
              size="small"
              onClick={addLayer}
              disabled={hiddenLayers.length >= 3}
              sx={{ p: 0.25 }}
            >
              <AddIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
          {/* Downward bracket */}
          <Box
            sx={{
              width: "100%",
              height: 10,
              flexShrink: 0,
              borderTop: "1.5px solid",
              borderLeft: "1.5px solid",
              borderRight: "1.5px solid",
              borderColor: "divider",
              borderRadius: "4px 4px 0 0",
            }}
          />
        </Box>

        {/* Per-layer columns */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          {hiddenLayers.map((layer, li) => {
            const count = layer.units;
            return (
              <React.Fragment key={li}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  {/* Neuron count controls */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.25,
                      mb: 0.25,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => changeNeurons(li, -1)}
                      disabled={layer.units <= 1}
                      sx={{ p: 0.25 }}
                    >
                      <RemoveIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        minWidth: 70,
                        textAlign: "center",
                      }}
                    >
                      {t.neuralNetwork.neurons.replace("{count}", layer.units)}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => changeNeurons(li, 1)}
                      disabled={layer.units >= 8}
                      sx={{ p: 0.25 }}
                    >
                      <AddIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>

                  {/* Neuron circles */}
                  {Array.from({ length: count }).map((_, ni) => {
                    const activation = layerActivations?.[li]?.[ni];
                    const hasLiveActivation =
                      activation !== undefined && activation !== null;
                    // tanh squashes relu output [0,∞) → [0,1); 0=white, high=black
                    const norm = hasLiveActivation
                      ? Math.tanh(activation)
                      : null;
                    const greyVal =
                      norm !== null ? Math.round(255 * (1 - norm)) : null;
                    const neuronBg =
                      greyVal !== null
                        ? `rgb(${greyVal},${greyVal},${greyVal})`
                        : "#bdbdbd";
                    const label = neuronNames[li]?.[ni] ?? "";
                    const isHovered =
                      hoveredNode?.type === "hidden" &&
                      hoveredNode?.layerIdx === li &&
                      hoveredNode?.neuronIdx === ni;
                    const neuronTextColor = isHovered
                      ? HOVER_YELLOW
                      : greyVal !== null && greyVal < 128
                        ? "#ffffff"
                        : "#424242";
                    return (
                      <Tooltip
                        key={ni}
                        title={buildTooltipContent("hidden", li, ni)}
                        placement="top"
                        arrow
                      >
                        <Box
                          ref={(el) => {
                            if (layerNodeRefs[li])
                              layerNodeRefs[li][ni].current = el;
                          }}
                          onMouseEnter={() =>
                            setHoveredNode({
                              type: "hidden",
                              layerIdx: li,
                              neuronIdx: ni,
                            })
                          }
                          onMouseLeave={() => setHoveredNode(null)}
                          sx={{
                            width: NODE_SIZE,
                            height: NODE_SIZE,
                            borderRadius: "50%",
                            border: `2px solid ${isHovered ? HOVER_YELLOW : CONN_GREY}`,
                            bgcolor: neuronBg,
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition:
                              "background-color 0.4s ease, border-color 0.2s ease",
                            cursor: "pointer",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: "0.52rem",
                              fontWeight: 700,
                              color: neuronTextColor,
                              lineHeight: 1,
                              userSelect: "none",
                              transition: "color 0.2s ease",
                            }}
                          >
                            {label}
                          </Typography>
                        </Box>
                      </Tooltip>
                    );
                  })}
                </Box>

                {/* Spacer between adjacent layers */}
                {li < hiddenLayers.length - 1 && (
                  <Box sx={{ width: 40, flexShrink: 0 }} />
                )}
              </React.Fragment>
            );
          })}
        </Box>
      </Box>
      <Box sx={{ mt: 4 }}>
        <HelpButton
          onClick={() => onOpenHelp && onOpenHelp("modelDesign")}
          tooltip={t.training.tooltip.helpAddClass}
        />
      </Box>

      {/* Spacer */}
      <Box sx={{ flex: 1, minWidth: 40 }} />

      {/* ── Output Column ─────────────────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 0.75,
          zIndex: 1,
        }}
      >
        <Box sx={{ height: GROUP_HEADER_H, flexShrink: 0 }} />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 0.25,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {t.neuralNetwork.outputs}
        </Typography>

        {classNames.length === 0 ? (
          <Typography
            variant="body2"
            color="text.disabled"
            sx={{ fontStyle: "italic", width: "180px" }}
          >
            {t.neuralNetwork.placeholder}
          </Typography>
        ) : (
          classNames.map((name, oi) => {
            const isWinner = winnerIdx === oi;
            const isOutputHovered =
              hoveredNode?.type === "output" && hoveredNode?.neuronIdx === oi;
            const nodeColor = isOutputHovered
              ? HOVER_YELLOW
              : isWinner
                ? OUTPUT_GREEN
                : OUTPUT_GREY;
            const prob = liveProbs?.[oi] ?? null;
            return (
              <Tooltip
                key={name}
                title={buildTooltipContent("output", -1, oi)}
                placement="right"
                arrow
              >
                <Box
                  ref={(el) => {
                    outputNodeRefs[oi].current = el;
                  }}
                  onMouseEnter={() =>
                    setHoveredNode({ type: "output", neuronIdx: oi })
                  }
                  onMouseLeave={() => setHoveredNode(null)}
                  sx={{
                    minWidth: 160,
                    px: 1,
                    py: 0.75,
                    borderRadius: 1,
                    bgcolor: isWinner ? OUTPUT_GREEN + "18" : "grey.100",
                    border: `1px solid ${
                      isWinner ? OUTPUT_GREEN + "55" : "transparent"
                    }`,
                    transition:
                      "background-color 0.3s ease, border-color 0.3s ease",
                    boxShadow: isOutputHovered
                      ? `0 0 0 2px ${nodeColor}44`
                      : undefined,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
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
                      variant="caption"
                      fontWeight={isWinner ? "bold" : "normal"}
                      sx={{
                        color: nodeColor,
                        fontSize: "0.8rem",
                        transition: "color 0.3s ease",
                      }}
                    >
                      {name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: nodeColor,
                        fontSize: "0.75rem",
                        ml: 1,
                        transition: "color 0.3s ease",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {prob !== null ? `${(prob * 100).toFixed(0)}%` : "—"}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={prob !== null ? prob * 100 : 0}
                    sx={{
                      height: 5,
                      borderRadius: 1,
                      bgcolor: nodeColor + "22",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: nodeColor,
                        transition:
                          "background-color 0.3s ease, transform 0.4s ease",
                      },
                    }}
                  />
                </Box>
              </Tooltip>
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default OrientationNNVisualizer;
