import { useState, useEffect, useRef, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";
import { extractFeaturesFiltered } from "../accelerationFeatures";

const PREDICTION_INTERVAL_MS = 500;
const PREDICTION_WINDOW_MS = 2000;

/**
 * useAccelerationModelPrediction
 *
 * Runs live gesture prediction on a rolling window of accelerometer samples.
 */
function useAccelerationModelPrediction(
  trainedModelInfo,
  latestSample,
  isConnected,
) {
  const [predictions, setPredictions] = useState([]);
  const sampleBufferRef = useRef([]);
  const intervalRef = useRef(null);

  // Keep rolling buffer of recent samples
  useEffect(() => {
    if (latestSample) {
      const now = Date.now();
      sampleBufferRef.current.push(latestSample);
      // Drop samples older than the window
      sampleBufferRef.current = sampleBufferRef.current.filter(
        (s) => now - s.timestamp < PREDICTION_WINDOW_MS + 100,
      );
    }
  }, [latestSample]);

  const runPrediction = useCallback(async () => {
    if (!trainedModelInfo?.model || !isConnected) return;

    const { model, classes, activeGroupKeys } = trainedModelInfo;
    const buffer = sampleBufferRef.current;
    if (buffer.length < 2) return;

    const features = extractFeaturesFiltered(buffer, activeGroupKeys ?? null);
    const input = tf.tensor2d([features]); // [1, numFeatures]
    const result = model.predict(input);
    const probabilities = await result.data();
    tf.dispose([input, result]);

    const preds = classes.map((name, i) => ({
      className: name,
      probability: probabilities[i],
    }));
    const maxProbability = Math.max(...preds.map((p) => p.probability));
    setPredictions(
      preds.map((p) => ({
        ...p,
        isTopPrediction: p.probability === maxProbability,
      })),
    );
  }, [trainedModelInfo, isConnected]);

  useEffect(() => {
    if (trainedModelInfo?.model && isConnected) {
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

export default useAccelerationModelPrediction;
