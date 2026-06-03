import { useState, useCallback } from "react";

const MAX_DEPTH = 6;
const MIN_SAMPLES = 2;

// ─── Gini helpers ─────────────────────────────────────────────────────────────

function gini(classCounts, total) {
  if (total === 0) return 0;
  let sum = 0;
  for (const count of Object.values(classCounts)) {
    const p = count / total;
    sum += p * p;
  }
  return 1 - sum;
}

function countClasses(samples, labels) {
  const counts = {};
  for (const idx of samples) {
    const lbl = labels[idx];
    counts[lbl] = (counts[lbl] || 0) + 1;
  }
  return counts;
}

function majorityClass(counts) {
  let best = null;
  let bestCount = -1;
  for (const [cls, count] of Object.entries(counts)) {
    if (count > bestCount) {
      bestCount = count;
      best = cls;
    }
  }
  return best;
}

// ─── Split search ─────────────────────────────────────────────────────────────

const FEATURES = ["x", "y", "z"];

/**
 * Find the best (feature, threshold) split for the given sample indices.
 * Returns null if no split improves Gini.
 */
function bestSplit(sampleIndices, data, labels) {
  const total = sampleIndices.length;
  const parentCounts = countClasses(sampleIndices, labels);
  const parentGini = gini(parentCounts, total);

  let bestGain = 0;
  let bestFeature = null;
  let bestThreshold = null;
  let bestLeft = null;
  let bestRight = null;

  for (const feature of FEATURES) {
    // Collect unique sorted values for candidate thresholds
    const values = sampleIndices.map((i) => data[i][feature]);
    values.sort((a, b) => a - b);

    for (let k = 0; k < values.length - 1; k++) {
      if (values[k] === values[k + 1]) continue;
      const threshold = (values[k] + values[k + 1]) / 2;

      const left = sampleIndices.filter((i) => data[i][feature] <= threshold);
      const right = sampleIndices.filter((i) => data[i][feature] > threshold);

      if (left.length === 0 || right.length === 0) continue;

      const leftCounts = countClasses(left, labels);
      const rightCounts = countClasses(right, labels);

      const weightedGini =
        (left.length / total) * gini(leftCounts, left.length) +
        (right.length / total) * gini(rightCounts, right.length);

      const gain = parentGini - weightedGini;

      if (gain > bestGain) {
        bestGain = gain;
        bestFeature = feature;
        bestThreshold = threshold;
        bestLeft = left;
        bestRight = right;
      }
    }
  }

  if (bestFeature === null) return null;

  return {
    feature: bestFeature,
    threshold: bestThreshold,
    gain: bestGain,
    left: bestLeft,
    right: bestRight,
  };
}

// ─── Tree builder ─────────────────────────────────────────────────────────────

function buildNode(sampleIndices, data, labels, depth) {
  const classCounts = countClasses(sampleIndices, labels);
  const total = sampleIndices.length;
  const prediction = majorityClass(classCounts);

  // Stop criteria: too deep, too few samples, or pure node
  const uniqueClasses = Object.keys(classCounts);
  if (depth >= MAX_DEPTH || total < MIN_SAMPLES || uniqueClasses.length === 1) {
    return { isLeaf: true, prediction, classCounts, samplesCount: total };
  }

  const split = bestSplit(sampleIndices, data, labels);
  if (!split) {
    return { isLeaf: true, prediction, classCounts, samplesCount: total };
  }

  return {
    isLeaf: false,
    feature: split.feature,
    threshold: split.threshold,
    giniImprovement: split.gain,
    classCounts,
    samplesCount: total,
    left: buildNode(split.left, data, labels, depth + 1),
    right: buildNode(split.right, data, labels, depth + 1),
  };
}

// ─── Prediction ───────────────────────────────────────────────────────────────

function walkTree(node, sample) {
  if (node.isLeaf) return node;
  const val = sample[node.feature];
  return walkTree(val <= node.threshold ? node.left : node.right, sample);
}

function predictClasses(tree, classNames, sample) {
  const leaf = walkTree(tree, sample);
  const total = leaf.samplesCount;
  return classNames.map((name) => ({
    className: name,
    probability: total > 0 ? (leaf.classCounts[name] || 0) / total : 0,
  }));
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useOrientationModelTraining
 *
 * Trains a CART decision tree on { x, y, z } snapshot samples.
 * No TensorFlow — pure JS implementation.
 */
function useOrientationModelTraining() {
  const [trainedModel, setTrainedModel] = useState(null);

  const trainModel = useCallback(
    async (classes, onStart, onError, onTrained) => {
      onStart();

      try {
        const classNames = classes.map((c) => c.name);

        // Flatten all samples into data/labels arrays
        const data = [];
        const labels = [];

        for (const cls of classes) {
          for (const sample of cls.samples) {
            data.push({ x: sample.x, y: sample.y, z: sample.z });
            labels.push(cls.name);
          }
        }

        const n = data.length;

        // Train on all data — no validation split
        const allIndices = Array.from({ length: n }, (_, i) => i);
        const tree = buildNode(allIndices, data, labels, 0);

        const modelInfo = {
          tree,
          classes: classNames,
        };

        setTrainedModel(modelInfo);
        onTrained(modelInfo);
      } catch (err) {
        onError(`Training failed: ${err.message}`);
      }
    },
    [],
  );

  return { trainModel, trainedModel };
}

export default useOrientationModelTraining;

// Export helpers for use in the visualizer / prediction hook
export { walkTree, predictClasses };
