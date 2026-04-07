import { useState, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";

const TOTAL_EPOCHS = 100;
const INITIAL_LEARNING_RATE = 0.01;

/**
 * useOrientationNNTraining
 *
 * Trains a dense neural network on raw { x, y, z } orientation snapshot
 * samples. Uses 3 inputs (x, y, z) fed directly into configurable hidden
 * layers, followed by a softmax output over the class names.
 */
function useOrientationNNTraining() {
  const [trainedModel, setTrainedModel] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState({
    epoch: 0,
    totalEpochs: 0,
  });

  /**
   * Build TF.js sequential model.
   * @param {number} numClasses
   * @param {Array<{units: number, activation: string}>} hiddenLayersConfig
   */
  const buildModel = useCallback((numClasses, hiddenLayersConfig) => {
    const layers =
      hiddenLayersConfig && hiddenLayersConfig.length > 0
        ? hiddenLayersConfig
        : [
            { units: 2, activation: "relu" },
            { units: 2, activation: "relu" },
          ];

    const model = tf.sequential();

    layers.forEach((layerCfg, idx) => {
      const opts = {
        units: layerCfg.units,
        activation: layerCfg.activation || "relu",
      };
      if (idx === 0) opts.inputShape = [3]; // x, y, z
      model.add(tf.layers.dense(opts));
    });

    model.add(tf.layers.dense({ units: numClasses, activation: "softmax" }));

    model.compile({
      optimizer: tf.train.adam(INITIAL_LEARNING_RATE),
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"],
    });

    return model;
  }, []);

  /**
   * Train a model on the provided orientation classes.
   *
   * @param {Array} classes            - [{ name, samples: [{x, y, z}] }]
   * @param {Function} onStart
   * @param {Function} onError
   * @param {Function} onTrained       - called with the model info object
   * @param {object}  [modelConfig]    - { hiddenLayers: [{units, activation}] }
   */
  const trainModel = useCallback(
    async (classes, onStart, onError, onTrained, modelConfig) => {
      onStart();
      setIsTraining(true);
      setTrainingProgress({ epoch: 0, totalEpochs: TOTAL_EPOCHS });

      try {
        const numClasses = classes.length;
        const hiddenLayersConfig = modelConfig?.hiddenLayers;

        // Build feature matrix: each sample → [x, y, z]
        const xs = [];
        const ys = [];

        for (let ci = 0; ci < classes.length; ci++) {
          for (const s of classes[ci].samples) {
            xs.push([s.x, s.y, s.z]);
            const label = new Array(numClasses).fill(0);
            label[ci] = 1;
            ys.push(label);
          }
        }

        const xTensor = tf.tensor2d(xs); // [N, 3]
        const yTensor = tf.tensor2d(ys); // [N, numClasses]

        const totalSamples = xs.length;
        const classWeights = {};
        for (let ci = 0; ci < numClasses; ci++) {
          const count = classes[ci].samples.length;
          classWeights[ci] =
            count > 0 ? totalSamples / (numClasses * count) : 1;
        }

        const model = buildModel(numClasses, hiddenLayersConfig);

        let bestLoss = Number.POSITIVE_INFINITY;
        let epochsSinceImprovement = 0;
        let shouldStop = false;

        await model.fit(xTensor, yTensor, {
          epochs: TOTAL_EPOCHS,
          classWeight: classWeights,
          callbacks: {
            onEpochEnd: async (epoch, logs) => {
              setTrainingProgress({
                epoch: epoch + 1,
                totalEpochs: TOTAL_EPOCHS,
              });
              if (logs && logs.loss !== undefined) {
                console.log(
                  `Epoch ${epoch + 1}/${TOTAL_EPOCHS} - loss: ${logs.loss}`,
                );
                if (logs.loss < bestLoss - 1e-4) {
                  bestLoss = logs.loss;
                  epochsSinceImprovement = 0;
                } else {
                  epochsSinceImprovement++;
                }
                if (epochsSinceImprovement >= 5) {
                  shouldStop = true;
                  if (model.stopTraining !== undefined) {
                    model.stopTraining = true;
                  }
                  console.log(
                    "Early stopping: loss did not improve for 5 epochs.",
                  );
                }
              }
            },
          },
        });

        tf.dispose([xTensor, yTensor]);

        const modelInfo = {
          model,
          classes: classes.map((c) => c.name),
          accuracy: null,
        };

        setTrainedModel(modelInfo);
        setIsTraining(false);
        onTrained(modelInfo);
      } catch (err) {
        console.error("Orientation NN training failed:", err);
        setIsTraining(false);
        onError(`Training failed: ${err.message}`);
      }
    },
    [buildModel],
  );

  return { trainModel, trainedModel, trainingProgress, isTraining };
}

export default useOrientationNNTraining;
