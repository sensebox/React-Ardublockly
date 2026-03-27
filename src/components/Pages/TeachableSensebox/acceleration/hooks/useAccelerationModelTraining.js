import { useState, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";
import {
  extractFeaturesFiltered,
  getNumFeaturesForGroups,
  NUM_FEATURES,
} from "../accelerationFeatures";

const VALIDATION_FRACTION = 0.15;
const TOTAL_EPOCHS = 50;
const INITIAL_LEARNING_RATE = 0.001;
const EARLY_STOPPING_PATIENCE = 5;

/**
 * useAccelerationModelTraining
 *
 * Custom hook for training a gesture/motion classification model on
 * accelerometer data. Each recorded sample is converted to a fixed-length
 * statistical feature vector (mean, std, RMS, skewness, kurtosis, spectral
 * power per axis → 18 features) which is then fed into a two-hidden-layer
 * dense neural network.
 */
function useAccelerationModelTraining() {
  const [trainingProgress, setTrainingProgress] = useState({
    epoch: 0,
    totalEpochs: 0,
  });
  const [trainingMetrics, setTrainingMetrics] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [finalAccuracy, setFinalAccuracy] = useState(null);
  const [trainedModel, setTrainedModel] = useState(null);

  const resetTrainingState = useCallback(() => {
    setTrainingProgress({ epoch: 0, totalEpochs: 0 });
    setTrainingMetrics([]);
    setTestResults([]);
    setFinalAccuracy(null);
  }, []);

  /**
   * Build the dense classification model from a dynamic layer config.
   *
   * @param {number} numClasses
   * @param {number} numFeatures
   * @param {Array<{units: number, activation: string}>} hiddenLayersConfig
   */
  const buildModel = useCallback(
    (numClasses, numFeatures, hiddenLayersConfig) => {
      const layers =
        hiddenLayersConfig && hiddenLayersConfig.length > 0
          ? hiddenLayersConfig
          : [
              { units: 30, activation: "relu" },
              { units: 30, activation: "relu" },
            ];

      const model = tf.sequential();

      layers.forEach((layerCfg, idx) => {
        const opts = {
          units: layerCfg.units,
          activation: layerCfg.activation || "relu",
        };
        if (idx === 0) opts.inputShape = [numFeatures];
        model.add(tf.layers.dense(opts));
      });

      model.add(tf.layers.dense({ units: numClasses, activation: "softmax" }));

      model.compile({
        optimizer: tf.train.adam(INITIAL_LEARNING_RATE),
        loss: "categoricalCrossentropy",
        metrics: ["accuracy"],
      });

      return model;
    },
    [],
  );

  /**
   * Train a model on the provided classes.
   *
   * @param {Array} classes - Array of { name, samples: [{ readings: [{x,y,z}] }] }
   * @param {Function} onStart
   * @param {Function} onError
   * @param {Function} onTrained - called with the trained model info
   * @param {object}  [modelConfig]      - { hiddenLayers: [{units, activation}] }
   * @param {string[]|null} [activeGroupKeys] - feature groups to include; null = all
   */
  const trainModel = useCallback(
    async (
      classes,
      onStart,
      onError,
      onTrained,
      modelConfig,
      activeGroupKeys,
    ) => {
      onStart();
      resetTrainingState();

      try {
        const numClasses = classes.length;
        const numFeatures =
          activeGroupKeys && activeGroupKeys.length > 0
            ? getNumFeaturesForGroups(activeGroupKeys)
            : NUM_FEATURES;

        const hiddenLayersConfig = modelConfig?.hiddenLayers;

        // Build feature tensors
        const xs = [];
        const ys = [];

        for (let classIdx = 0; classIdx < classes.length; classIdx++) {
          for (const sample of classes[classIdx].samples) {
            const features = extractFeaturesFiltered(
              sample.readings,
              activeGroupKeys,
            );
            xs.push(features);
            const label = new Array(numClasses).fill(0);
            label[classIdx] = 1;
            ys.push(label);
          }
        }

        const xTensor = tf.tensor2d(xs); // [N, numFeatures]
        const yTensor = tf.tensor2d(ys); // [N, numClasses]

        // Shuffle data
        const numSamples = xs.length;
        const indices = tf.util.createShuffledIndices(numSamples);
        const shuffledX = xTensor.gather(
          tf.tensor1d(Array.from(indices), "int32"),
        );
        const shuffledY = yTensor.gather(
          tf.tensor1d(Array.from(indices), "int32"),
        );

        tf.dispose([xTensor, yTensor]);

        // Train/validation split
        const splitIdx = Math.floor(numSamples * (1 - VALIDATION_FRACTION));
        const trainX = shuffledX.slice([0, 0], [splitIdx, numFeatures]);
        const trainY = shuffledY.slice([0, 0], [splitIdx, numClasses]);
        const valX = shuffledX.slice([splitIdx, 0], [-1, numFeatures]);
        const valY = shuffledY.slice([splitIdx, 0], [-1, numClasses]);

        tf.dispose([shuffledX, shuffledY]);

        const model = buildModel(numClasses, numFeatures, hiddenLayersConfig);

        const metricsLog = [];
        setTrainingProgress({ epoch: 0, totalEpochs: TOTAL_EPOCHS });

        await model.fit(trainX, trainY, {
          epochs: TOTAL_EPOCHS,
          validationData: [valX, valY],
          callbacks: {
            onEpochEnd: (epoch, logs) => {
              const entry = {
                epoch: epoch + 1,
                trainAcc: logs.acc ?? logs.accuracy,
                valAcc: logs.val_acc ?? logs.val_accuracy,
                trainLoss: logs.loss,
                valLoss: logs.val_loss,
              };
              metricsLog.push(entry);
              setTrainingMetrics([...metricsLog]);
              setTrainingProgress({
                epoch: epoch + 1,
                totalEpochs: TOTAL_EPOCHS,
              });
            },
          },
          earlyStopping: tf.callbacks.earlyStopping({
            monitor: "val_loss",
            patience: EARLY_STOPPING_PATIENCE,
          }),
        });

        // Evaluate on validation set
        const evalResult = model.evaluate(valX, valY);
        const accuracy = (await evalResult[1].data())[0];
        setFinalAccuracy(accuracy);
        tf.dispose(evalResult);

        // Build confusion-matrix style test results on val set
        const predictions = model.predict(valX);
        const predClasses = predictions.argMax(-1).arraySync();
        const trueClasses = valY.argMax(-1).arraySync();

        const results = predClasses.map((pred, i) => ({
          predicted: classes[pred]?.name ?? String(pred),
          actual: classes[trueClasses[i]]?.name ?? String(trueClasses[i]),
        }));
        setTestResults(results);

        tf.dispose([trainX, trainY, valX, valY, predictions]);

        const modelInfo = {
          model,
          classes: classes.map((c) => c.name),
          numFeatures,
          accuracy,
          activeGroupKeys: activeGroupKeys ?? null,
        };
        setTrainedModel(modelInfo);
        onTrained(modelInfo);
      } catch (error) {
        console.error("Acceleration model training failed:", error);
        onError(`Training failed: ${error.message}`);
      }
    },
    [buildModel, resetTrainingState],
  );

  return {
    trainModel,
    trainingProgress,
    trainingMetrics,
    testResults,
    finalAccuracy,
    trainedModel,
  };
}

export default useAccelerationModelTraining;
