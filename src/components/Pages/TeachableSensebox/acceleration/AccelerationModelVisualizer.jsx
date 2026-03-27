import React, { useRef, useState, useLayoutEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";

// ─── Constants ────────────────────────────────────────────────────────────────

/** Number of representative node circles shown per hidden layer. */
const MAX_VISIBLE_NODES = 7;

/** Diameter of each node circle in pixels. */
const NODE_SIZE = 14;

/**
 * Height (px) of the "Hidden Layers [− N +]" banner + the downward bracket.
 * The Inputs and Outputs columns get an identical empty spacer so that all
 * per-column titles ("Inputs", "x neurons", "Outputs") land on one line.
 */
const GROUP_HEADER_H = 52;

/** Class accent colors — kept in sync with the class-card palette. */
const CLASS_COLORS = ["#e53935", "#43a047", "#1e88e5", "#fb8c00", "#8e24aa"];

/**
 * Feature group definitions.
 * Order matches the feature vector produced by accelerationFeatures.js:
 *   [mean_x, mean_y, mean_z, std_x, std_y, std_z, rms_x, ...]
 */
export const DEFAULT_FEATURE_GROUPS = [
  { key: "mean", label: "Mean", color: "#42a5f5" },
  { key: "std", label: "Std Dev", color: "#66bb6a" },
  { key: "rms", label: "RMS", color: "#ffa726" },
  { key: "skewness", label: "Skewness", color: "#ab47bc" },
  { key: "kurtosis", label: "Kurtosis", color: "#ef5350" },
  { key: "spectralPower", label: "Spectral Power", color: "#26c6da" },
];

/**
 * Default dense-NN architecture config.
 * Export this so the training hook can import it to stay in sync.
 */
export const DEFAULT_MODEL_CONFIG = {
  hiddenLayers: [
    { units: 8, activation: "relu" },
    { units: 8, activation: "relu" },
  ],
};

/** All feature group keys active by default. */
export const DEFAULT_ACTIVE_GROUP_KEYS = DEFAULT_FEATURE_GROUPS.map(
  (g) => g.key,
);

// ─── useDiagramConnections ────────────────────────────────────────────────────

/**
 * Measures DOM element positions and returns an array of bezier-curve
 * descriptors for the SVG connection overlay.
 *
 * @param {React.RefObject} containerRef - The outer diagram container
 * @param {Array<{current: HTMLElement|null}>} inputGroupRefs - one per feature group
 * @param {Array<Array<{current: HTMLElement|null}>>} layerNodeRefs - [layer][node]
 * @param {Array<{current: HTMLElement|null}>} outputNodeRefs - one per class
 * @param {Array} featureGroups
 * @param {Array} hiddenLayers
 * @param {string[]} classNames
 */
function useDiagramConnections(
  containerRef,
  inputGroupRefs,
  layerNodeRefs,
  outputNodeRefs,
  featureGroups,
  hiddenLayers,
  classNames,
  activeGroupKeys,
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
        top: r.top - containerRect.top,
        bottom: r.bottom - containerRect.top,
      };
    };

    const activeSet = activeGroupKeys ? new Set(activeGroupKeys) : null;
    const newConnections = [];

    // ── Input → Hidden Layer 1 ────────────────────────────────────────────
    // Each active input group fans out to every visible node in layer 1.
    const layer1Refs = layerNodeRefs[0];
    if (layer1Refs && inputGroupRefs.length > 0) {
      const layer1Positions = layer1Refs
        .map((r) => toLocal(r.current))
        .filter(Boolean);
      if (layer1Positions.length > 0) {
        featureGroups.forEach((group, gi) => {
          if (activeSet && !activeSet.has(group.key)) return;
          const src = toLocal(inputGroupRefs[gi]?.current);
          if (!src) return;
          layer1Positions.forEach((dst) => {
            const midX = (src.right + dst.left) / 2;
            newConnections.push({
              x1: src.right,
              y1: src.cy,
              x2: dst.left,
              y2: dst.cy,
              cx1: midX,
              cy1: src.cy,
              cx2: midX,
              cy2: dst.cy,
              color: group.color,
              strokeWidth: 0.7,
              opacity: 0.3,
            });
          });
        });
      }
    }

    // ── Hidden Layer i → Hidden Layer i+1 ────────────────────────────────
    // All-to-all between visible node circles (7×7 = 49 thin grey lines).
    for (let li = 0; li < hiddenLayers.length - 1; li++) {
      const srcRefs = layerNodeRefs[li];
      const dstRefs = layerNodeRefs[li + 1];
      if (!srcRefs || !dstRefs) continue;

      srcRefs.forEach((srcRef) => {
        const src = toLocal(srcRef.current);
        if (!src) return;
        dstRefs.forEach((dstRef) => {
          const dst = toLocal(dstRef.current);
          if (!dst) return;
          const midX = (src.right + dst.left) / 2;
          newConnections.push({
            x1: src.right,
            y1: src.cy,
            x2: dst.left,
            y2: dst.cy,
            cx1: midX,
            cy1: src.cy,
            cx2: midX,
            cy2: dst.cy,
            color: "#888",
            strokeWidth: 0.6,
            opacity: 0.18,
          });
        });
      });
    }

    // ── Last Hidden Layer → Output ────────────────────────────────────────
    // Every visible node in the last layer connects to every output class chip.
    const lastLayerRefs = layerNodeRefs[layerNodeRefs.length - 1];
    if (lastLayerRefs && outputNodeRefs.length > 0) {
      const lastPositions = lastLayerRefs
        .map((r) => toLocal(r.current))
        .filter(Boolean);
      if (lastPositions.length > 0) {
        lastPositions.forEach((src) => {
          outputNodeRefs.forEach((outRef, oi) => {
            const dst = toLocal(outRef?.current);
            if (!dst) return;
            const midX = (src.right + dst.left) / 2;
            newConnections.push({
              x1: src.right,
              y1: src.cy,
              x2: dst.left,
              y2: dst.cy,
              cx1: midX,
              cy1: src.cy,
              cx2: midX,
              cy2: dst.cy,
              color: CLASS_COLORS[oi % CLASS_COLORS.length],
              strokeWidth: 0.7,
              opacity: 0.3,
            });
          });
        });
      }
    }

    setConnections(newConnections);
  }, [
    containerRef,
    inputGroupRefs,
    layerNodeRefs,
    outputNodeRefs,
    featureGroups,
    hiddenLayers,
    classNames,
    activeGroupKeys,
  ]);

  useLayoutEffect(() => {
    recalculate();
    const observer = new ResizeObserver(recalculate);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [recalculate]);

  return connections;
}

// ─── AccelerationModelVisualizer ─────────────────────────────────────────────

/**
 * Visual representation of the dense classification network.
 *
 * Left  → feature input groups (18 inputs, toggleable)
 * Middle → hidden layer columns (nodes + label chip, add/remove layers, +/- neurons)
 * Right  → output class chips
 *
 * @param {{
 *   classNames: string[],
 *   modelConfig: object,
 *   featureGroups: object[],
 *   activeGroupKeys: string[],
 *   onModelConfigChange: (config: object) => void,
 *   onActiveGroupsChange: (keys: string[]) => void
 * }} props
 */
const AccelerationModelVisualizer = ({
  classNames = [],
  modelConfig = DEFAULT_MODEL_CONFIG,
  featureGroups = DEFAULT_FEATURE_GROUPS,
  activeGroupKeys = DEFAULT_ACTIVE_GROUP_KEYS,
  onModelConfigChange,
  onActiveGroupsChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const containerRef = useRef(null);

  const { hiddenLayers } = modelConfig;

  // ── Callbacks for architecture changes ─────────────────────────────────

  const toggleGroup = useCallback(
    (key) => {
      if (!onActiveGroupsChange) return;
      const isActive = activeGroupKeys.includes(key);
      if (isActive && activeGroupKeys.length === 1) return; // keep at least 1 active
      const next = isActive
        ? activeGroupKeys.filter((k) => k !== key)
        : [...activeGroupKeys, key];
      onActiveGroupsChange(next);
    },
    [activeGroupKeys, onActiveGroupsChange],
  );

  const addLayer = useCallback(() => {
    if (!onModelConfigChange || hiddenLayers.length >= 5) return;
    onModelConfigChange({
      ...modelConfig,
      hiddenLayers: [...hiddenLayers, { units: 8, activation: "relu" }],
    });
  }, [hiddenLayers, modelConfig, onModelConfigChange]);

  const removeLayer = useCallback(() => {
    if (!onModelConfigChange || hiddenLayers.length <= 1) return;
    onModelConfigChange({
      ...modelConfig,
      hiddenLayers: hiddenLayers.slice(0, -1),
    });
  }, [hiddenLayers, modelConfig, onModelConfigChange]);

  const changeNeurons = useCallback(
    (layerIndex, delta) => {
      if (!onModelConfigChange) return;
      const newUnits = Math.max(
        1,
        Math.min(15, hiddenLayers[layerIndex].units + delta),
      );
      const newLayers = hiddenLayers.map((l, i) =>
        i === layerIndex ? { ...l, units: newUnits } : l,
      );
      onModelConfigChange({ ...modelConfig, hiddenLayers: newLayers });
    },
    [hiddenLayers, modelConfig, onModelConfigChange],
  );

  // ── Stable ref arrays (avoids calling useRef inside loops) ─────────────
  // Each ref holder is a plain object { current: null } stored in a
  // stable useRef container so the identity never changes between renders.

  const inputGroupRefsContainer = useRef([]);
  if (inputGroupRefsContainer.current.length !== featureGroups.length) {
    inputGroupRefsContainer.current = featureGroups.map(() => ({
      current: null,
    }));
  }
  const inputGroupRefs = inputGroupRefsContainer.current;

  // Each layer shows all neurons (no MAX_VISIBLE_NODES limit)
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

  const outputNodeRefsContainer = useRef([]);
  if (outputNodeRefsContainer.current.length !== classNames.length) {
    outputNodeRefsContainer.current = classNames.map(() => ({ current: null }));
  }
  const outputNodeRefs = outputNodeRefsContainer.current;

  const connections = useDiagramConnections(
    containerRef,
    inputGroupRefs,
    layerNodeRefs,
    outputNodeRefs,
    featureGroups,
    hiddenLayers,
    classNames,
    activeGroupKeys,
  );

  // ── Mobile fallback ─────────────────────────────────────────────────────
  if (isMobile) {
    const layerSummary = hiddenLayers
      .map((l) => `Dense(${l.units})`)
      .join(" → ");
    const activeCount = activeGroupKeys.length * 3;
    return (
      <Box
        sx={{
          fontFamily: "monospace",
          fontSize: 13,
          color: "text.secondary",
          py: 1,
        }}
      >
        {activeCount} inputs → {layerSummary} → {classNames.length || "?"}{" "}
        outputs
      </Box>
    );
  }

  // ── Full diagram ────────────────────────────────────────────────────────
  const activeInputCount = activeGroupKeys.length * 3;
  const activeSet = new Set(activeGroupKeys);

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
        minHeight: 240,
      }}
    >
      {/* ── SVG bezier overlay ───────────────────────────────────────── */}
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
        {connections.map((c, i) => (
          <path
            key={i}
            d={`M ${c.x1} ${c.y1} C ${c.cx1} ${c.cy1}, ${c.cx2} ${c.cy2}, ${c.x2} ${c.y2}`}
            stroke={c.color}
            strokeWidth={c.strokeWidth}
            strokeOpacity={c.opacity}
            fill="none"
          />
        ))}
      </svg>

      {/* ── Column 1: Feature Inputs ─────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.75,
          minWidth: 170,
          zIndex: 1,
        }}
      >
        {/* Spacer aligning this title with the per-layer neuron titles */}
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
          Inputs
        </Typography>

        {featureGroups.map((group, gi) => {
          const isActive = activeSet.has(group.key);
          return (
            <Box
              key={group.key}
              ref={(el) => {
                inputGroupRefs[gi].current = el;
              }}
              onClick={() => toggleGroup(group.key)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                cursor: "pointer",
                opacity: isActive ? 1 : 0.35,
                borderRadius: 1,
                px: 0.5,
                py: 0.25,
                transition: "opacity 0.2s, background 0.15s",
                "&:hover": {
                  bgcolor: isActive ? group.color + "18" : "action.hover",
                },
              }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: group.color,
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  minWidth: 100,
                  color: isActive ? "text.primary" : "text.disabled",
                  textDecoration: isActive ? "none" : "line-through",
                }}
              >
                {group.label}
              </Typography>
              {["x", "y", "z"].map((axis) => (
                <Chip
                  key={axis}
                  label={axis}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: 12,
                    bgcolor: isActive
                      ? group.color + "22"
                      : "action.disabledBackground",
                    color: isActive ? group.color : "text.disabled",
                    border: `1px solid ${isActive ? group.color + "55" : "transparent"}`,
                    "& .MuiChip-label": { px: 0.75 },
                  }}
                />
              ))}
            </Box>
          );
        })}
      </Box>

      {/* Spacer */}
      <Box sx={{ flex: 1, minWidth: 40 }} />

      {/* ── Hidden Layers section ────────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          zIndex: 1,
        }}
      >
        {/* Group header: banner + downward bracket */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: GROUP_HEADER_H,
            flexShrink: 0,
          }}
        >
          {/* Centered "Hidden Layers: [− N +]" row */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 600 }}
            >
              Layers:
            </Typography>
            <IconButton
              size="small"
              onClick={removeLayer}
              disabled={hiddenLayers.length <= 1}
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
              disabled={hiddenLayers.length >= 5}
              sx={{ p: 0.25 }}
            >
              <AddIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
          {/* Downward bracket: top + left + right borders, open at bottom */}
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
                  {/* Neuron count controls — same line as Inputs / Outputs titles */}
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
                      {layer.units} neurons
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => changeNeurons(li, 1)}
                      disabled={layer.units >= 15}
                      sx={{ p: 0.25 }}
                    >
                      <AddIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>

                  {/* All node circles */}
                  {Array.from({ length: count }).map((_, ni) => (
                    <Box
                      key={ni}
                      ref={(el) => {
                        if (layerNodeRefs[li])
                          layerNodeRefs[li][ni].current = el;
                      }}
                      sx={{
                        width: NODE_SIZE,
                        height: NODE_SIZE,
                        borderRadius: "50%",
                        border: `2px solid ${theme.palette.primary.main}`,
                        bgcolor: "background.paper",
                        flexShrink: 0,
                      }}
                    />
                  ))}
                </Box>

                {/* Fixed spacer between adjacent layers */}
                {li < hiddenLayers.length - 1 && (
                  <Box sx={{ width: 40, flexShrink: 0 }} />
                )}
              </React.Fragment>
            );
          })}
        </Box>
      </Box>

      {/* Spacer */}
      <Box sx={{ flex: 1, minWidth: 40 }} />

      {/* ── Output Column ────────────────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 0.75,
          zIndex: 1,
        }}
      >
        {/* Spacer aligning this title with the per-layer neuron titles */}
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
          Outputs
        </Typography>

        {classNames.length === 0 ? (
          <Typography
            variant="body2"
            color="text.disabled"
            sx={{ fontStyle: "italic" }}
          >
            Add classes…
          </Typography>
        ) : (
          classNames.map((name, oi) => (
            <Chip
              key={name}
              ref={(el) => {
                outputNodeRefs[oi].current = el;
              }}
              label={name}
              size="small"
              sx={{
                bgcolor: CLASS_COLORS[oi % CLASS_COLORS.length] + "22",
                color: CLASS_COLORS[oi % CLASS_COLORS.length],
                border: `1px solid ${CLASS_COLORS[oi % CLASS_COLORS.length]}55`,
                fontWeight: 600,
              }}
            />
          ))
        )}
      </Box>
    </Box>
  );
};

export default AccelerationModelVisualizer;
