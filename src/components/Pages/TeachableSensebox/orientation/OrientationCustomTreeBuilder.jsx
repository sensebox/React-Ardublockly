import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { getOrientationTranslations } from "./translations";

// ─── Tree model ───────────────────────────────────────────────────────────────
//
// Nodes of a user-defined tree:
//   { kind: "empty" }                                  – open branch end
//   { kind: "leaf", classId }                           – predicts a class
//                         (falls back to the first class if unset/deleted)
//   { kind: "decision", feature, threshold, yes, no }
//                         ("yes" when value ≤ threshold, else "no")
//
// `threshold` is kept as the raw text field string so the user can type
// freely (e.g. "-", "1,"); it is parsed when validating / evaluating.
//
// The same node format (with a numeric threshold and leaves
// carrying a `label`) is used to display the generated tree read-only, see
// OrientationDecisionTreeVisualizer.

const FEATURES = ["x", "y", "z"];

const EMPTY = { kind: "empty" };

const newDecision = () => ({
  kind: "decision",
  feature: "x",
  threshold: "0",
  yes: EMPTY,
  no: EMPTY,
});

const newLeaf = () => ({ kind: "leaf", classId: "" });

/** The class a leaf predicts: its own if it still exists, else the first */
const resolveClassId = (node, classes) =>
  classes.some((c) => c.id === node.classId)
    ? node.classId
    : (classes[0]?.id ?? "");

/** Initial tree: a single default decision with two open branches */
export const createInitialCustomTree = () => newDecision();

/** Parse a threshold string, accepting "," as decimal separator */
const parseThreshold = (text) => {
  const normalized = String(text).trim().replace(",", ".");
  if (normalized === "" || !/^[-+]?(\d+\.?\d*|\.\d+)$/.test(normalized)) {
    return null;
  }
  return parseFloat(normalized);
};

/** A tree is valid when every branch ends in a leaf (and orientations exist)
 *  and every decision has input, comparison and a numeric threshold. */
export const isCustomTreeValid = (node, classes) => {
  switch (node.kind) {
    case "leaf":
      return classes.length > 0;
    case "decision":
      return (
        FEATURES.includes(node.feature) &&
        parseThreshold(node.threshold) !== null &&
        isCustomTreeValid(node.yes, classes) &&
        isCustomTreeValid(node.no, classes)
      );
    default:
      return false;
  }
};

/** Returns the set of nodes visited by `sample` (only call on valid trees) */
export const getActivePath = (tree, sample) => {
  const path = new Set();
  let current = tree;
  while (current) {
    path.add(current);
    if (current.kind !== "decision") break;
    const threshold =
      typeof current.threshold === "number"
        ? current.threshold
        : parseThreshold(current.threshold);
    current = sample[current.feature] <= threshold ? current.yes : current.no;
  }
  return path;
};

/** Immutably replace the node at `path` (array of "yes"/"no") */
const updateAt = (node, path, updater) => {
  if (path.length === 0) return updater(node);
  const [head, ...rest] = path;
  return { ...node, [head]: updateAt(node[head], rest, updater) };
};

// ─── Styling constants ────────────────────────────────────────────────────────

const ACTIVE = "#43a047";
const BRANCH_W = 72; // horizontal space between a card and its children

/** Stable key of a node position, used to look up its measured card */
const pathKey = (path) => ["root", ...path].join(".");

/** All parent → child edges of the tree (only decisions have children) */
const collectEdges = (node, path = [], edges = []) => {
  if (node.kind !== "decision") return edges;
  for (const branch of ["yes", "no"]) {
    const child = node[branch];
    edges.push({
      from: pathKey(path),
      to: pathKey([...path, branch]),
      branch,
      parentNode: node,
      childNode: child,
    });
    collectEdges(child, [...path, branch], edges);
  }
  return edges;
};

// ─── Node cards ───────────────────────────────────────────────────────────────

/** Static stand-in for a small Select / TextField in read-only trees */
const ReadOnlyValue = ({ children }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      height: 40,
      px: 1.75,
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 1,
      bgcolor: "background.paper",
      fontSize: "1rem",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </Box>
);

const RemoveButton = ({ onClick, title }) => (
  <Tooltip title={title}>
    <IconButton size="small" onClick={onClick} sx={{ ml: 0.5 }}>
      <CloseIcon fontSize="small" />
    </IconButton>
  </Tooltip>
);

/** Fixed comparison sign between input and threshold */
const LessOrEqual = () => (
  <Box component="span" sx={{ fontSize: "1.1rem", fontWeight: 600 }}>
    ≤
  </Box>
);

const formatThreshold = (threshold) =>
  typeof threshold === "number" ? threshold.toFixed(1) : threshold;

const DecisionCard = ({ node, isActive, readOnly, onChange, onRemove, t }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const thresholdInvalid =
    node.threshold !== "" && parseThreshold(node.threshold) === null;

  return (
    <Box
      data-testid="custom-tree-decision"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        p: 1,
        borderRadius: 2,
        border: "2px solid",
        borderColor: isActive ? ACTIVE : "divider",
        bgcolor: isActive
          ? isDark
            ? "#1b3d1e"
            : "#c8e6c9"
          : isDark
            ? "grey.800"
            : "grey.200",
        flexShrink: 0,
      }}
    >
      {readOnly ? (
        <>
          <ReadOnlyValue>{node.feature}</ReadOnlyValue>
          <LessOrEqual />
          <ReadOnlyValue>{formatThreshold(node.threshold)}</ReadOnlyValue>
        </>
      ) : (
        <>
          <Select
            size="small"
            value={node.feature}
            onChange={(e) => onChange({ ...node, feature: e.target.value })}
            inputProps={{ "data-testid": "custom-tree-feature" }}
            sx={{ bgcolor: "background.paper" }}
          >
            {FEATURES.map((f) => (
              <MenuItem key={f} value={f}>
                {f}
              </MenuItem>
            ))}
          </Select>
          <LessOrEqual />
          <TextField
            size="small"
            value={node.threshold}
            error={thresholdInvalid}
            onChange={(e) => onChange({ ...node, threshold: e.target.value })}
            inputProps={{
              inputMode: "decimal",
              "data-testid": "custom-tree-threshold",
              "aria-label": t.decisionTree.custom.threshold,
            }}
            sx={{
              width: 56,
              bgcolor: "background.paper",
              "& input": { px: 1 },
            }}
          />
        </>
      )}
      {onRemove && (
        <RemoveButton onClick={onRemove} title={t.decisionTree.custom.remove} />
      )}
    </Box>
  );
};

const LeafCard = ({
  node,
  classes,
  isActive,
  readOnly,
  onChange,
  onRemove,
  t,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const classId = resolveClassId(node, classes);

  return (
    <Box
      data-testid="custom-tree-leaf"
      sx={{
        display: "flex",
        alignItems: "center",
        px: 2,
        py: 1,
        borderRadius: 999,
        bgcolor: isActive
          ? isDark
            ? "#2e7d32"
            : "#81c784"
          : isDark
            ? "grey.600"
            : "grey.400",
        border: "2px solid",
        borderColor: isActive ? ACTIVE : "grey.500",
        flexShrink: 0,
      }}
    >
      {readOnly ? (
        <ReadOnlyValue>
          {node.label ?? classes.find((c) => c.id === classId)?.name}
        </ReadOnlyValue>
      ) : (
        <Select
          size="small"
          value={classId}
          onChange={(e) => onChange({ ...node, classId: e.target.value })}
          inputProps={{ "data-testid": "custom-tree-class" }}
          sx={{ bgcolor: "background.paper" }}
        >
          {classes.length === 0 && (
            <MenuItem disabled value="">
              {t.decisionTree.custom.noClasses}
            </MenuItem>
          )}
          {classes.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </Select>
      )}
      {onRemove && (
        <RemoveButton onClick={onRemove} title={t.decisionTree.custom.remove} />
      )}
    </Box>
  );
};

const EmptySlot = ({ onAddDecision, onAddLeaf, t }) => (
  <Box
    data-testid="custom-tree-empty"
    sx={{
      display: "flex",
      gap: 1,
      p: 1,
      borderRadius: 2,
      border: "2px dashed",
      borderColor: "divider",
      flexShrink: 0,
    }}
  >
    <Button
      size="small"
      variant="outlined"
      startIcon={<AddIcon />}
      onClick={onAddDecision}
      data-testid="custom-tree-add-decision"
    >
      {t.decisionTree.custom.addDecision}
    </Button>
    <Button
      size="small"
      variant="outlined"
      startIcon={<AddIcon />}
      onClick={onAddLeaf}
      data-testid="custom-tree-add-leaf"
    >
      {t.decisionTree.custom.addLeaf}
    </Button>
  </Box>
);

// ─── Recursive tree node ──────────────────────────────────────────────────────
//
// Cards are laid out with flexbox (each decision is vertically centred on its
// children column). Connectors are drawn separately as an SVG overlay from
// the measured card positions, so uneven branches still connect correctly.

const TreeNode = ({
  node,
  path,
  classes,
  activePath,
  onUpdate,
  readOnly,
  registerCard,
  t,
}) => {
  const isActive = activePath != null && activePath.has(node);
  const replace = (next) => onUpdate(path, () => next);
  // The root can't be removed; other nodes turn back into an open branch end.
  const remove = !readOnly && path.length > 0 ? () => replace(EMPTY) : null;

  let card;
  if (node.kind === "decision") {
    card = (
      <DecisionCard
        node={node}
        isActive={isActive}
        readOnly={readOnly}
        onChange={replace}
        onRemove={remove}
        t={t}
      />
    );
  } else if (node.kind === "leaf") {
    card = (
      <LeafCard
        node={node}
        classes={classes}
        isActive={isActive}
        readOnly={readOnly}
        onChange={replace}
        onRemove={remove}
        t={t}
      />
    );
  } else {
    card = (
      <EmptySlot
        onAddDecision={() => replace(newDecision())}
        onAddLeaf={() => replace(newLeaf())}
        t={t}
      />
    );
  }

  const key = pathKey(path);
  let measuredCard = (
    <Box
      ref={(el) => registerCard(key, el)}
      sx={{ display: "flex", flexShrink: 0, position: "relative" }}
    >
      {card}
    </Box>
  );
  // Generated trees show how many training samples reached a node
  if (node.samplesCount != null) {
    measuredCard = (
      <Tooltip
        title={t.decisionTree.samplesLabel.replace(
          "{count}",
          node.samplesCount,
        )}
      >
        {measuredCard}
      </Tooltip>
    );
  }

  if (node.kind !== "decision") return measuredCard;

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {measuredCard}
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {["yes", "no"].map((branch) => (
          <Box
            key={branch}
            sx={{
              display: "flex",
              alignItems: "center",
              pl: `${BRANCH_W}px`,
              py: 1,
            }}
          >
            <TreeNode
              node={node[branch]}
              path={[...path, branch]}
              classes={classes}
              activePath={activePath}
              onUpdate={onUpdate}
              readOnly={readOnly}
              registerCard={registerCard}
              t={t}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// ─── Connectors ───────────────────────────────────────────────────────────────

const Connectors = ({ edges, positions, activePath, width, height, t }) => {
  const theme = useTheme();
  return (
    <svg
      width={width}
      height={height}
      style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
    >
      {edges
        .map((edge) => ({
          ...edge,
          onPath:
            activePath != null &&
            activePath.has(edge.parentNode) &&
            activePath.has(edge.childNode),
        }))
        // Draw the active edge last so its green covers the shared stub
        .sort((a, b) => a.onPath - b.onPath)
        .map((edge) => {
          const from = positions[edge.from];
          const to = positions[edge.to];
          if (!from || !to) return null;
          const sx = from.right;
          const sy = from.cy;
          const tx = to.left;
          const ty = to.cy;
          // Right-angled connector: stub → vertical → into the child
          const mx = sx + BRANCH_W / 2;
          return (
            <g key={edge.to}>
              <path
                d={`M ${sx} ${sy} H ${mx} V ${ty} H ${tx}`}
                fill="none"
                stroke={edge.onPath ? ACTIVE : theme.palette.divider}
                strokeWidth={2.5}
              />
              <text
                x={mx + 6}
                y={ty - 5}
                fill={theme.palette.text.secondary}
                fontSize={10}
              >
                {edge.branch === "yes" ? t.decisionTree.yes : t.decisionTree.no}
              </text>
            </g>
          );
        })}
    </svg>
  );
};

// ─── TreeView ─────────────────────────────────────────────────────────────────

/**
 * Renders a tree (cards + connectors). Shared by the custom builder and the
 * read-only view of the generated tree, so both look the same.
 */
export const TreeView = ({
  tree,
  classes = [],
  activePath,
  onUpdate,
  readOnly = false,
}) => {
  const language = useSelector((s) => s.general.language);
  const t = getOrientationTranslations(language);

  const edges = useMemo(() => collectEdges(tree), [tree]);

  // ── Card measurement for the connector overlay ────────────────────────────
  const contentRef = useRef(null);
  const cardsRef = useRef(new Map());
  const [layout, setLayout] = useState({ positions: {}, width: 0, height: 0 });

  const registerCard = useCallback((key, el) => {
    if (el) cardsRef.current.set(key, el);
    else cardsRef.current.delete(key);
  }, []);

  const measure = useCallback(() => {
    const content = contentRef.current;
    if (!content) return;
    const base = content.getBoundingClientRect();
    const positions = {};
    cardsRef.current.forEach((el, key) => {
      const r = el.getBoundingClientRect();
      positions[key] = {
        left: r.left - base.left,
        right: r.right - base.left,
        cy: r.top - base.top + r.height / 2,
      };
    });
    const next = {
      positions,
      width: content.scrollWidth,
      height: content.scrollHeight,
    };
    setLayout((prev) =>
      JSON.stringify(prev) === JSON.stringify(next) ? prev : next,
    );
  }, []);

  // Re-measure after every render (card sizes change with dropdown values)…
  useLayoutEffect(measure);
  // …and when the content is resized from outside (window, fonts).
  useEffect(() => {
    if (!contentRef.current) return;
    const ro = new ResizeObserver(measure);
    ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, [measure]);

  return (
    // inline-flex so the content can grow wider than the view and scroll
    <Box
      ref={contentRef}
      sx={{ display: "inline-flex", minWidth: "100%", position: "relative" }}
    >
      <Connectors
        edges={edges}
        positions={layout.positions}
        activePath={activePath}
        width={layout.width}
        height={layout.height}
        t={t}
      />
      <TreeNode
        node={tree}
        path={[]}
        classes={classes}
        activePath={activePath}
        onUpdate={onUpdate}
        readOnly={readOnly}
        registerCard={registerCard}
        t={t}
      />
    </Box>
  );
};

// Elements that keep their normal mouse behaviour inside the frame
const INTERACTIVE_SELECTOR =
  'input, textarea, button, a, [role="combobox"], [role="button"]';

/**
 * Scrollable frame around a TreeView, outlined in `outlineColor`.
 * Besides the scroll bar, the tree can be panned by dragging anywhere in the
 * frame with the mouse (touch devices scroll natively).
 */
export const TreeFrame = ({ outlineColor, children, ...rest }) => {
  const frameRef = useRef(null);
  const dragRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const frame = frameRef.current;
    // React bubbles events from portals (e.g. open Select menus) through the
    // component tree, so ignore anything not physically inside the frame.
    if (!frame.contains(e.target)) return;
    if (e.target.closest(INTERACTIVE_SELECTOR)) return;
    dragRef.current = {
      x: e.clientX,
      y: e.clientY,
      scrollLeft: frame.scrollLeft,
      scrollTop: frame.scrollTop,
    };
    frame.setPointerCapture(e.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    const start = dragRef.current;
    if (!start) return;
    const frame = frameRef.current;
    frame.scrollLeft = start.scrollLeft - (e.clientX - start.x);
    frame.scrollTop = start.scrollTop - (e.clientY - start.y);
  };

  const handlePointerUp = (e) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    if (frameRef.current.hasPointerCapture(e.pointerId)) {
      frameRef.current.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
  };

  return (
    <Box
      ref={frameRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      sx={{
        overflowX: "auto",
        overflowY: "auto",
        borderRadius: 1,
        bgcolor: "background.paper",
        border: `3px solid ${outlineColor}`,
        transition: "border-color 0.3s",
        p: 2,
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none", // no text selection while dragging
        [`& :is(${INTERACTIVE_SELECTOR})`]: { cursor: "pointer" },
        "& input": { cursor: "text", userSelect: "text" },
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};

// ─── OrientationCustomTreeBuilder ─────────────────────────────────────────────

/**
 * Lets the user build their own decision tree. While the tree is incomplete
 * the view is outlined red; once valid it turns green and the live sample's
 * path through the tree is highlighted (live classification).
 */
const OrientationCustomTreeBuilder = ({
  tree,
  onTreeChange,
  classes,
  latestSample,
}) => {
  const theme = useTheme();

  const isValid = useMemo(
    () => isCustomTreeValid(tree, classes),
    [tree, classes],
  );

  const activePath = useMemo(
    () => (isValid && latestSample ? getActivePath(tree, latestSample) : null),
    [isValid, tree, latestSample],
  );

  const handleUpdate = useCallback(
    (path, updater) => onTreeChange((prev) => updateAt(prev, path, updater)),
    [onTreeChange],
  );

  const statusColor = isValid
    ? theme.palette.success.main
    : theme.palette.error.main;

  return (
    <TreeFrame
      outlineColor={statusColor}
      data-testid="custom-tree-view"
      data-valid={isValid ? "true" : "false"}
    >
      <TreeView
        tree={tree}
        classes={classes}
        activePath={activePath}
        onUpdate={handleUpdate}
      />
    </TreeFrame>
  );
};

export default OrientationCustomTreeBuilder;
