import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Box, Typography, useTheme } from "@mui/material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { getOrientationTranslations } from "./translations";
import {
  TreeView,
  getActivePath,
  TreeFrame,
} from "./OrientationCustomTreeBuilder";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Convert a trained CART tree ({ isLeaf, feature, threshold, left, right })
 * into the node format of the custom tree builder, so both are rendered the
 * same way. `left` is taken when value ≤ threshold, i.e. the "yes" branch.
 */
const toDisplayTree = (node) =>
  node.isLeaf
    ? {
        kind: "leaf",
        label: node.prediction,
        samplesCount: node.samplesCount,
      }
    : {
        kind: "decision",
        feature: node.feature,
        threshold: node.threshold,
        samplesCount: node.samplesCount,
        yes: toDisplayTree(node.left),
        no: toDisplayTree(node.right),
      };

// ─── OrientationDecisionTreeVisualizer ───────────────────────────────────────

/** Read-only view of the generated decision tree with live path highlight */
const OrientationDecisionTreeVisualizer = ({ trainedModel, latestSample }) => {
  const theme = useTheme();
  const language = useSelector((s) => s.general.language);
  const t = getOrientationTranslations(language);

  const displayTree = useMemo(
    () => (trainedModel?.tree ? toDisplayTree(trainedModel.tree) : null),
    [trainedModel],
  );

  const activePath = useMemo(
    () =>
      displayTree && latestSample
        ? getActivePath(displayTree, latestSample)
        : null,
    [displayTree, latestSample],
  );

  if (!displayTree) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 6,
          bgcolor: "background.grey",
          borderRadius: 2,
          border: "2px dashed",
          borderColor: "divider",
          gap: 1,
        }}
      >
        <AccountTreeIcon sx={{ fontSize: 48, color: "text.disabled" }} />
        <Typography variant="body1" color="text.secondary" textAlign="center">
          {t.decisionTree.placeholder}
        </Typography>
      </Box>
    );
  }

  return (
    <TreeFrame
      outlineColor={theme.palette.divider}
      data-testid="generated-tree-view"
    >
      <TreeView tree={displayTree} activePath={activePath} readOnly />
    </TreeFrame>
  );
};

export default OrientationDecisionTreeVisualizer;
