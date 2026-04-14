import { useState, useRef, useCallback, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

const STROKE_IMAGE_SIZE = 32;

/**
 * Custom hook for gesture model prediction logic
 * Handles live predictions from completed gesture strokes
 */
function useGestureModelPrediction(trainedModel, latestStroke, isConnected) {
  const [predictions, setPredictions] = useState([]);
  const [lastPredictedStroke, setLastPredictedStroke] = useState(null);
  const predictionInProgressRef = useRef(false);

  /**
   * Render stroke points to an image tensor for prediction
   */
  const renderStrokeToTensor = useCallback((strokePoints) => {
    const canvas = document.createElement("canvas");
    canvas.width = STROKE_IMAGE_SIZE;
    canvas.height = STROKE_IMAGE_SIZE;
    const ctx = canvas.getContext("2d");

    // Black background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, STROKE_IMAGE_SIZE, STROKE_IMAGE_SIZE);

    if (!strokePoints || strokePoints.length === 0) {
      return tf.tidy(() => {
        const imageData = ctx.getImageData(
          0,
          0,
          STROKE_IMAGE_SIZE,
          STROKE_IMAGE_SIZE,
        );
        return tf.browser.fromPixels(imageData, 3).div(255.0);
      });
    }

    // Draw the stroke in white
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const halfSize = STROKE_IMAGE_SIZE / 2;

    ctx.beginPath();
    for (let i = 0; i < strokePoints.length; i++) {
      const { x, y } = strokePoints[i];
      const canvasX = halfSize + x * halfSize;
      const canvasY = halfSize - y * halfSize;

      if (i === 0) {
        ctx.moveTo(canvasX, canvasY);
      } else {
        ctx.lineTo(canvasX, canvasY);
      }
    }
    ctx.stroke();

    // Add endpoint marker
    if (strokePoints.length > 1) {
      const last = strokePoints[strokePoints.length - 1];
      const lastX = halfSize + last.x * halfSize;
      const lastY = halfSize - last.y * halfSize;
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    return tf.tidy(() => {
      const imageData = ctx.getImageData(
        0,
        0,
        STROKE_IMAGE_SIZE,
        STROKE_IMAGE_SIZE,
      );
      return tf.browser.fromPixels(imageData, 3).div(255.0);
    });
  }, []);

  const makePrediction = useCallback(
    async (strokePoints) => {
      if (!trainedModel || !trainedModel.model) {
        return;
      }

      if (!strokePoints || strokePoints.length === 0) {
        return;
      }

      if (predictionInProgressRef.current) {
        return;
      }

      predictionInProgressRef.current = true;

      try {
        const prediction = await tf.tidy(() => {
          const tensor = renderStrokeToTensor(strokePoints).expandDims(0);
          return trainedModel.model.predict(tensor);
        });

        const predictionData = await prediction.data();
        prediction.dispose();

        const classResults = trainedModel.classes.map((cls, index) => ({
          className: cls.name,
          confidence: predictionData[index],
        }));
        const maxConfidence = Math.max(
          ...classResults.map((r) => r.confidence),
        );

        setPredictions(
          classResults.map((r) => ({
            ...r,
            isTopPrediction: r.confidence === maxConfidence,
          })),
        );
      } catch (error) {
        console.error("Gesture prediction error:", error);
      } finally {
        predictionInProgressRef.current = false;
      }
    },
    [trainedModel, renderStrokeToTensor],
  );

  // Make prediction when a completed stroke is received
  useEffect(() => {
    if (!trainedModel || !isConnected || !latestStroke) {
      return;
    }

    // Only predict on completed strokes (state === 2 means DONE)
    if (latestStroke.isCompleted && latestStroke.strokePoints?.length > 0) {
      // Avoid re-predicting the same stroke
      if (
        lastPredictedStroke &&
        lastPredictedStroke.timestamp === latestStroke.timestamp
      ) {
        return;
      }

      setLastPredictedStroke(latestStroke);
      makePrediction(latestStroke.strokePoints);
    }
  }, [
    trainedModel,
    isConnected,
    latestStroke,
    lastPredictedStroke,
    makePrediction,
  ]);

  // Clear predictions when model or connection changes
  useEffect(() => {
    if (!trainedModel || !isConnected) {
      setPredictions([]);
      setLastPredictedStroke(null);
    }
  }, [trainedModel, isConnected]);

  /**
   * Manually trigger prediction on given stroke points
   */
  const predictStroke = useCallback(
    async (strokePoints) => {
      await makePrediction(strokePoints);
    },
    [makePrediction],
  );

  return {
    predictions,
    predictStroke,
    renderStrokeToTensor,
  };
}

export default useGestureModelPrediction;
