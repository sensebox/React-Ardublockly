import React, { useMemo, useRef, useState, useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
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

/** Seconds of delay added per depth level for the appear animation */
const ANIM_DELAY = 0.2;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Truncate a string to `max` characters, appending "…" if needed */
const truncate = (text, max = 20) =>
  text && text.length > max ? text.slice(0, max - 1) + "\u2026" : text;

// ─── NodeBox ──────────────────────────────────────────────────────────────────

const NodeBox = ({ node, classNames, x, y, activePathSet, t }) => {
  const theme = useTheme();
  const [hovered, setHovered] = useState(false);

  const isOnPath = activePathSet != null && activePathSet.has(node.data);

  if (node.data.isLeaf) {
    let color;
    color = isOnPath ? "#43a047" : "#686868";
    const total = node.data.samplesCount;

    return (
      <g
        transform={`translate(${x}, ${y})`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ cursor: "default" }}
      >
        <title>{t.decisionTree.samplesLabel.replace("{count}", total)}</title>
        <ellipse
          cx={0}
          cy={0}
          rx={NODE_W / 2}
          ry={NODE_H / 2}
          fill={color}
          stroke={isOnPath ? "#2e7d32" : hovered ? "#fff" : "none"}
          strokeWidth={isOnPath ? 2.5 : hovered ? 2 : 0}
          opacity={isOnPath ? 1 : 0.55}
        />
        <text
          textAnchor="middle"
          fill="white"
          fontWeight="bold"
          fontSize={13}
          dy={5}
        >
          {truncate(node.data.prediction)}
        </text>
      </g>
    );
  }

  // Internal node
  const label = `${node.data.feature} ≤ ${node.data.threshold.toFixed(1)}`;
  const total = node.data.samplesCount;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: "default" }}
    >
      <title>{t.decisionTree.samplesLabel.replace("{count}", total)}</title>
      <rect
        x={-NODE_W / 2}
        y={-NODE_H / 2}
        width={NODE_W}
        height={NODE_H}
        rx={NODE_R}
        ry={NODE_R}
        fill={
          isOnPath
            ? hovered
              ? "#a5d6a7"
              : "#c8e6c9"
            : hovered
              ? theme.palette.grey[300]
              : theme.palette.grey[200]
        }
        stroke={isOnPath ? "#43a047" : theme.palette.divider}
        strokeWidth={isOnPath ? 2 : 1.5}
      />
      <text
        textAnchor="middle"
        fill={theme.palette.text.primary}
        fontWeight="600"
        fontSize={13}
        dy={5}
        fontFamily="monospace"
      >
        {label}
      </text>
      {/* yes / no branch labels (to the right, for horizontal layout) */}
      <text
        x={NODE_W / 2 + 4}
        y={-13}
        fill={theme.palette.text.disabled}
        fontSize={9}
      >
        {t.decisionTree.yes}
      </text>
      <text
        x={NODE_W / 2 + 4}
        y={21}
        fill={theme.palette.text.disabled}
        fontSize={9}
      >
        {t.decisionTree.no}
      </text>
    </g>
  );
};

// ─── Edge ─────────────────────────────────────────────────────────────────────

const Edge = ({ source, target, theme, isOnPath }) => {
  const sx = source.x + NODE_W / 2;
  const sy = source.y;
  const tx = target.x - NODE_W / 2;
  const ty = target.y;
  const mx = (sx + tx) / 2;
  const path = `M ${sx} ${sy} C ${mx} ${sy}, ${mx} ${ty}, ${tx} ${ty}`;

  return (
    <path
      d={path}
      fill="none"
      stroke={isOnPath ? "#43a047" : theme.palette.divider}
      strokeWidth={isOnPath ? 2.5 : 1.5}
    />
  );
};

// ─── OrientationDecisionTreeVisualizer ───────────────────────────────────────

const OrientationDecisionTreeVisualizer = ({ trainedModel, latestSample }) => {
  const theme = useTheme();
  const t = getOrientationTranslations();
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(600);

  // Increment animKey every time a NEW model is produced so the SVG subtree
  // remounts and all depth-delayed CSS animations replay from scratch.
  const prevModelRef = useRef(trainedModel);
  const [animKey, setAnimKey] = useState(1);
  useEffect(() => {
    if (trainedModel !== prevModelRef.current) {
      prevModelRef.current = trainedModel;
      setAnimKey((k) => k + 1);
    }
  }, [trainedModel]);

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

  const activePathSet = useMemo(() => {
    if (!trainedModel?.tree || !latestSample) return null;
    const path = new Set();
    let current = trainedModel.tree;
    while (current) {
      path.add(current);
      if (current.isLeaf) break;
      current =
        latestSample[current.feature] <= current.threshold
          ? current.left
          : current.right;
    }
    return path;
  }, [trainedModel, latestSample]);

  const { nodes, edges, svgWidth, svgHeight } = useMemo(() => {
    if (!trainedModel?.tree) {
      return { nodes: [], edges: [], svgWidth: 0, svgHeight: 0 };
    }

    // Build a wrapped node tree with depth/parent info
    function buildNode(data, depth = 0, parent = null) {
      const node = { data, depth, parent, children: [] };
      if (!data.isLeaf) {
        node.children = [
          buildNode(data.left, depth + 1, node),
          buildNode(data.right, depth + 1, node),
        ];
      }
      return node;
    }

    const root = buildNode(trainedModel.tree);

    // Assign vertical positions via leaf-index traversal
    let leafIndex = 0;
    function assignLayoutY(node) {
      if (node.children.length === 0) {
        node.layoutY = leafIndex * NODE_SEP;
        leafIndex++;
      } else {
        node.children.forEach(assignLayoutY);
        node.layoutY =
          (node.children[0].layoutY +
            node.children[node.children.length - 1].layoutY) /
          2;
      }
    }
    assignLayoutY(root);

    function getDescendants(node) {
      return [node, ...node.children.flatMap(getDescendants)];
    }
    function getLinks(node) {
      return node.children.flatMap((child) => [
        { source: node, target: child },
        ...getLinks(child),
      ]);
    }

    const descendants = getDescendants(root);
    const links = getLinks(root);

    const siblingPositions = descendants.map((d) => d.layoutY);
    const minSib = Math.min(...siblingPositions);
    const maxSib = Math.max(...siblingPositions);
    const treeHeight = maxSib - minSib + NODE_H + 40;
    const offsetY = -minSib + NODE_H / 2 + 20;

    const maxDepth = Math.max(...descendants.map((d) => d.depth));
    const treeWidth = (maxDepth + 1) * LEVEL_WIDTH;

    const nodeElements = descendants.map((d) => ({
      id: d.data,
      node: d,
      x: d.depth * LEVEL_WIDTH + NODE_W / 2 + 20,
      y: d.layoutY + offsetY,
    }));

    const edgeElements = links.map(({ source, target }) => ({
      source: {
        x: source.depth * LEVEL_WIDTH + NODE_W / 2 + 20,
        y: source.layoutY + offsetY,
      },
      target: {
        x: target.depth * LEVEL_WIDTH + NODE_W / 2 + 20,
        y: target.layoutY + offsetY,
      },
      sourceDepth: source.depth,
      sourceData: source.data,
      targetData: target.data,
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
          {t.decisionTree.placeholder}
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
        <defs>
          <style>{`
            @keyframes dtNodeAppear {
              from { opacity: 0; transform: translateX(-14px); }
              to   { opacity: 1; transform: translateX(0);     }
            }
          `}</style>
        </defs>
        <g key={animKey}>
          {edges.map((edge, i) => (
            <g
              key={i}
              style={{
                animation: `dtNodeAppear 0.28s ease-out ${
                  (edge.sourceDepth + 0.65) * ANIM_DELAY
                }s both`,
              }}
            >
              <Edge
                source={edge.source}
                target={edge.target}
                theme={theme}
                isOnPath={
                  activePathSet != null &&
                  activePathSet.has(edge.sourceData) &&
                  activePathSet.has(edge.targetData)
                }
              />
            </g>
          ))}
          {nodes.map((item, i) => (
            <g
              key={i}
              style={{
                animation: `dtNodeAppear 0.35s ease-out ${
                  item.node.depth * ANIM_DELAY
                }s both`,
              }}
            >
              <NodeBox
                node={item.node}
                classNames={trainedModel.classes ?? []}
                x={item.x}
                y={item.y}
                activePathSet={activePathSet}
                t={t}
              />
            </g>
          ))}
        </g>
      </svg>
    </Box>
  );
};

export default OrientationDecisionTreeVisualizer;
