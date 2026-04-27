import { useState, useEffect, useRef, useCallback } from "react";
import { predictClasses } from "./useOrientationModelTraining";

const PREDICTION_INTERVAL_MS = 300;

/**
 * useOrientationModelPrediction
 *
 * Runs live orientation prediction on the latest single x/y/z sample
 * by walking the trained decision tree.
 */
function useOrientationModelPrediction(
  trainedModelInfo,
  latestSample,
  isConnected,
) {
  const [predictions, setPredictions] = useState([]);
  const intervalRef = useRef(null);
  const latestSampleRef = useRef(latestSample);

  // Keep ref in sync so the interval closure always sees the latest sample
  useEffect(() => {
    latestSampleRef.current = latestSample;
  }, [latestSample]);

  const runPrediction = useCallback(() => {
    if (!trainedModelInfo?.tree || !isConnected) return;
    const sample = latestSampleRef.current;
    if (!sample) return;

    const { tree, classes } = trainedModelInfo;
    const preds = predictClasses(tree, classes, sample);
    const maxProb = Math.max(...preds.map((p) => p.probability));
    setPredictions(
      preds.map((p) => ({
        ...p,
        isTopPrediction: p.probability === maxProb && maxProb > 0,
      })),
    );
  }, [trainedModelInfo, isConnected]);

  useEffect(() => {
    if (trainedModelInfo?.tree && isConnected) {
      intervalRef.current = setInterval(runPrediction, PREDICTION_INTERVAL_MS);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setPredictions([]);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [trainedModelInfo, isConnected, runPrediction]);

  return { predictions };
}

export default useOrientationModelPrediction;
