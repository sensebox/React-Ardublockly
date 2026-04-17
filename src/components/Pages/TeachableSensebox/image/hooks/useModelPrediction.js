import { useState, useRef, useCallback, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

const PREDICTION_INTERVAL_MS = 500;

/**
 * Custom hook for model prediction logic
 * Handles live predictions from camera preview
 */
function useModelPrediction(trainedModel, getPreviewElement, isCameraActive) {
  const [predictions, setPredictions] = useState([]);
  const predictionIntervalRef = useRef(null);

  const makePrediction = useCallback(async () => {
    if (
      !trainedModel ||
      !trainedModel.featureExtractor ||
      !trainedModel.trainingModel
    ) {
      return;
    }

    const previewElement = getPreviewElement();
    if (!previewElement) return;

    if (previewElement.tagName === "VIDEO") {
      if (previewElement.readyState < 2 || previewElement.paused) {
        return;
      }
    } else if (previewElement.tagName === "IMG") {
      if (!previewElement.complete || !previewElement.naturalWidth) {
        return;
      }
    }

    try {
      const prediction = await tf.tidy(() => {
        const tensor = tf.browser
          .fromPixels(previewElement)
          .resizeBilinear([96, 96])
          .mean(-1)
          .expandDims(-1)
          .div(255.0)
          .expandDims(0);

        const features = trainedModel.featureExtractor.predict(tensor);
        return trainedModel.trainingModel.predict(features);
      });

      const predictionData = await prediction.data();
      prediction.dispose();

      const classResults = trainedModel.classes.map((cls, index) => ({
        className: cls.name,
        confidence: predictionData[index],
      }));
      const maxConfidence = Math.max(...classResults.map((r) => r.confidence));

      setPredictions(
        classResults.map((r) => ({
          ...r,
          isTopPrediction: r.confidence === maxConfidence,
        })),
      );
    } catch (error) {
      console.error("Prediction error:", error);
    }
  }, [trainedModel, getPreviewElement]);

  // Automatically start/stop predictions based on camera and model availability
  useEffect(() => {
    if (trainedModel && isCameraActive) {
      if (predictionIntervalRef.current) {
        clearInterval(predictionIntervalRef.current);
      }

      setPredictions([]);
      predictionIntervalRef.current = setInterval(async () => {
        await makePrediction();
      }, PREDICTION_INTERVAL_MS);
    } else {
      if (predictionIntervalRef.current) {
        clearInterval(predictionIntervalRef.current);
        predictionIntervalRef.current = null;
      }
      setPredictions([]);
    }

    return () => {
      if (predictionIntervalRef.current) {
        clearInterval(predictionIntervalRef.current);
        predictionIntervalRef.current = null;
      }
    };
  }, [trainedModel, isCameraActive, makePrediction]);

  return { predictions };
}

export default useModelPrediction;
