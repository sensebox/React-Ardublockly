import React, { useMemo, useRef, useState, useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import * as d3 from "d3";
import { getOrientationTranslations } from "./translations";

// ─── Constants ────────────────────────────────────────────────────────────────

/** Pixels between tree levels (horizontal, left-to-right) */
const LEVEL_WIDTH = 200;

/** Vertical separation between sibling nodes */
const NODE_SEP = 70;

/** Dimensions of each node box */
const NODE_W = 140;
const NODE_H = 50;
const NODE_R = 8; // border-radius

/** Colours per class index (matches the class-card palette) */
const CLASS_COLORS = ["#e53935", "#43a047", "#1e88e5", "#fb8c00", "#8e24aa"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

// ─── NodeBox ──────────────────────────────────────────────────────────────────

const NodeBox = ({ node, classNames, x, y }) => {
  const theme = useTheme();
  const [hovered, setHovered] = useState(false);

  if (node.data.isLeaf) {
    const classIdx = classNames.indexOf(node.data.prediction);
    const color =
      CLASS_COLORS[Math.max(0, classIdx)] ?? theme.palette.primary.main;
    const total = node.data.samplesCount;

    return (
      <g
        transform={`translate(${x}, ${y})`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ cursor: "default" }}
      >
        <rect
          x={-NODE_W / 2}
          y={-NODE_H / 2}
          width={NODE_W}
          height={NODE_H}
          rx={NODE_R}
          ry={NODE_R}
          fill={color}
          stroke={hovered ? "#fff" : "none"}
          strokeWidth={hovered ? 2 : 0}
          opacity={0.9}
        />
        <text
          textAnchor="middle"
          fill="white"
          fontWeight="bold"
          fontSize={13}
          dy={total > 0 ? -6 : 5}
        >
          {node.data.prediction}
        </text>
        {total > 0 && (
          <text
            textAnchor="middle"
            fill="rgba(255,255,255,0.8)"
            fontSize={10}
            dy={10}
          >
            {total} samples
          </text>
        )}
      </g>
    );
  }

  // Internal node
  const label = `${node.data.feature} ≤ ${node.data.threshold.toFixed(3)}`;
  const total = node.data.samplesCount;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: "default" }}
    >
      <rect
        x={-NODE_W / 2}
        y={-NODE_H / 2}
        width={NODE_W}
        height={NODE_H}
        rx={NODE_R}
        ry={NODE_R}
        fill={hovered ? theme.palette.grey[200] : theme.palette.grey[100]}
        stroke={theme.palette.divider}
        strokeWidth={1.5}
      />
      <text
        textAnchor="middle"
        fill={theme.palette.text.primary}
        fontWeight="600"
        fontSize={13}
        dy={total > 0 ? -6 : 5}
        fontFamily="monospace"
      >
        {label}
      </text>
      {total > 0 && (
        <text
          textAnchor="middle"
          fill={theme.palette.text.secondary}
          fontSize={10}
          dy={10}
        >
          {total} samples
        </text>
      )}
      {/* yes / no branch labels (to the right, for horizontal layout) */}
      <text
        x={NODE_W / 2 + 6}
        y={-6}
        fill={theme.palette.text.disabled}
        fontSize={9}
      >
        yes
      </text>
      <text
        x={NODE_W / 2 + 6}
        y={14}
        fill={theme.palette.text.disabled}
        fontSize={9}
      >
        no
      </text>
    </g>
  );
};

// ─── Edge ─────────────────────────────────────────────────────────────────────

const Edge = ({ source, target, theme }) => {
  const linkGen = d3
    .linkHorizontal()
    .x((d) => d.x)
    .y((d) => d.y);

  const path = linkGen({
    source: { x: source.x + NODE_W / 2, y: source.y },
    target: { x: target.x - NODE_W / 2, y: target.y },
  });

  return (
    <path
      d={path}
      fill="none"
      stroke={theme.palette.divider}
      strokeWidth={1.5}
    />
  );
};

// ─── OrientationDecisionTreeVisualizer ───────────────────────────────────────

const OrientationDecisionTreeVisualizer = ({ trainedModel }) => {
  const theme = useTheme();
  const t = getOrientationTranslations();
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(600);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const { nodes, edges, svgWidth, svgHeight } = useMemo(() => {
    if (!trainedModel?.tree) {
      return { nodes: [], edges: [], svgWidth: 0, svgHeight: 0 };
    }

    const hierarchy = d3.hierarchy(trainedModel.tree, (node) =>
      node.isLeaf ? null : [node.left, node.right],
    );

    const treeLayout = d3
      .tree()
      // nodeSize([x-spread, y-spread]) in d3 coords:
      //   x-spread (NODE_SEP) becomes screen-y (vertical sibling separation)
      //   y-spread (LEVEL_WIDTH) becomes screen-x (horizontal level distance)
      .nodeSize([NODE_SEP, LEVEL_WIDTH])
      .separation((a, b) => (a.parent === b.parent ? 1 : 1.2));

    treeLayout(hierarchy);

    const descendants = hierarchy.descendants();

    // For horizontal layout: d3's y (depth) → screen x, d3's x (sibling) → screen y
    const siblingPositions = descendants.map((d) => d.x);
    const minSib = Math.min(...siblingPositions);
    const maxSib = Math.max(...siblingPositions);
    const treeHeight = maxSib - minSib + NODE_H + 40;
    const offsetY = -minSib + NODE_H / 2 + 20;

    const maxDepth = Math.max(...descendants.map((d) => d.depth));
    const treeWidth = (maxDepth + 1) * LEVEL_WIDTH + NODE_W + 40;

    const nodeElements = descendants.map((d) => ({
      id: d.data,
      node: d,
      x: d.y + NODE_W / 2 + 20, // depth → screen x
      y: d.x + offsetY, // sibling position → screen y
    }));

    const edgeElements = hierarchy.links().map((link) => ({
      source: {
        x: link.source.y + NODE_W / 2 + 20,
        y: link.source.x + offsetY,
      },
      target: {
        x: link.target.y + NODE_W / 2 + 20,
        y: link.target.x + offsetY,
      },
    }));

    return {
      nodes: nodeElements,
      edges: edgeElements,
      svgWidth: Math.max(treeWidth, containerWidth),
      svgHeight: treeHeight,
    };
  }, [trainedModel, containerWidth]);

  if (!trainedModel) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 6,
          bgcolor: "grey.50",
          borderRadius: 2,
          border: "2px dashed",
          borderColor: "grey.300",
          gap: 1,
        }}
      >
        <AccountTreeIcon sx={{ fontSize: 48, color: "grey.400" }} />
        <Typography variant="body1" color="text.secondary" textAlign="center">
          {t.modelVisualizer.placeholder}
        </Typography>
        <Typography variant="body2" color="text.disabled" textAlign="center">
          {t.modelVisualizer.placeholderSub}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        overflowX: "auto",
        overflowY: "auto",
        borderRadius: 1,
        bgcolor: "background.paper",
      }}
    >
      <svg
        width={svgWidth}
        height={svgHeight}
        style={{ display: "block", minWidth: svgWidth }}
      >
        <g>
          {edges.map((edge, i) => (
            <Edge
              key={i}
              source={edge.source}
              target={edge.target}
              theme={theme}
            />
          ))}
          {nodes.map((item, i) => (
            <NodeBox
              key={i}
              node={item.node}
              classNames={trainedModel.classes ?? []}
              x={item.x}
              y={item.y}
            />
          ))}
        </g>
      </svg>
    </Box>
  );
};

export default OrientationDecisionTreeVisualizer;
