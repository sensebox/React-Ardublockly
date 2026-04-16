import { useState, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";

const STROKE_IMAGE_SIZE = 32;
const VALIDATION_FRACTION = 0.15;
const TOTAL_EPOCHS = 50;
const INITIAL_LEARNING_RATE = 0.001;
const EARLY_STOPPING_PATIENCE = 5;
const LR_DECAY_FACTOR = 0.5;
const LR_DECAY_PATIENCE = 7;

/**
 * Render stroke points to a canvas image and return the raw RGBA pixel data.
 * Exported so callers (e.g. sample capture) can pre-compute and cache this data
 * on the sample object, avoiding repeated re-rendering during training.
 */
export function renderStrokeToImage(strokePoints) {
  const canvas = document.createElement("canvas");
  canvas.width = STROKE_IMAGE_SIZE;
  canvas.height = STROKE_IMAGE_SIZE;
  const ctx = canvas.getContext("2d");

  // Black background
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, STROKE_IMAGE_SIZE, STROKE_IMAGE_SIZE);

  if (strokePoints.length === 0) {
    return ctx.getImageData(0, 0, STROKE_IMAGE_SIZE, STROKE_IMAGE_SIZE).data;
  }

  const halfSize = STROKE_IMAGE_SIZE / 2;
  const n = strokePoints.length;

  if (n === 1) {
    const px = halfSize + strokePoints[0].x * halfSize;
    const py = halfSize - strokePoints[0].y * halfSize;
    ctx.fillStyle = "rgb(128,128,128)";
    ctx.beginPath();
    ctx.arc(px, py, 2, 0, Math.PI * 2);
    ctx.fill();
    return ctx.getImageData(0, 0, STROKE_IMAGE_SIZE, STROKE_IMAGE_SIZE).data;
  }

  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Encode temporal direction across all three RGB channels so that the
  // model can distinguish forward vs. reversed spells even when they
  // share the same spatial path:
  //   R = 255 at the start, fades to 0 at the end  ("where it began")
  //   G = 128 throughout                            (constant visibility)
  //   B = 0   at the start, rises to 255 at the end ("where it ended")
  for (let i = 1; i < n; i++) {
    const t = n > 2 ? (i - 1) / (n - 2) : 0;
    const r = Math.round(255 * (1 - t));
    const b = Math.round(255 * t);
    const { x: x0, y: y0 } = strokePoints[i - 1];
    const { x: x1, y: y1 } = strokePoints[i];
    ctx.strokeStyle = `rgb(${r},128,${b})`;
    ctx.beginPath();
    ctx.moveTo(halfSize + x0 * halfSize, halfSize - y0 * halfSize);
    ctx.lineTo(halfSize + x1 * halfSize, halfSize - y1 * halfSize);
    ctx.stroke();
  }

  return ctx.getImageData(0, 0, STROKE_IMAGE_SIZE, STROKE_IMAGE_SIZE).data;
}

/**
 * Custom hook for spell model training logic
 * Renders stroke points to images and uses the same CNN approach as image classification
 */
function useSpellModelTraining() {
  const [trainingProgress, setTrainingProgress] = useState({
    epoch: 0,
    totalEpochs: 0,
    batch: 0,
    totalBatches: 0,
  });
  const [trainingMetrics, setTrainingMetrics] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [finalAccuracy, setFinalAccuracy] = useState(null);
  const [trainedModel, setTrainedModel] = useState(null);

  const resetTrainingState = useCallback(() => {
    setTrainingProgress({
      epoch: 0,
      totalEpochs: 0,
      batch: 0,
      totalBatches: 0,
    });
    setTrainingMetrics([]);
    setTestResults([]);
    setFinalAccuracy(null);
  }, []);

  /**
   * Convert pre-rendered RGBA pixel data (Uint8ClampedArray) to a model input tensor.
   */
  const strokeToTensor = (pixelData) => {
    return tf.tidy(() => {
      const imageData = new ImageData(
        pixelData,
        STROKE_IMAGE_SIZE,
        STROKE_IMAGE_SIZE,
      );
      // Model expects 3-channel (RGB) input per batch_input_shape [null, 32, 32, 3]
      const tensor = tf.browser.fromPixels(imageData, 3);
      return tensor.div(255.0);
    });
  };

  const calculateClassWeights = (classes) => {
    const totalSamples = classes.reduce(
      (sum, cls) => sum + cls.samples.length,
      0,
    );
    const classWeights = {};
    classes.forEach((cls, classIndex) => {
      classWeights[classIndex] =
        totalSamples / (classes.length * cls.samples.length);
    });
    return classWeights;
  };

  const AUGMENTATION_COUNT = 10;
  const AUGMENT_MOVE_RANGE = 0.1;
  const AUGMENT_SCALE_RANGE = 0.1;
  const AUGMENT_ROTATE_RANGE = 0.3;

  const augmentPoints = (points) => {
    const moveX = Math.random() * 2 * AUGMENT_MOVE_RANGE - AUGMENT_MOVE_RANGE;
    const moveY = Math.random() * 2 * AUGMENT_MOVE_RANGE - AUGMENT_MOVE_RANGE;
    const scale =
      1.0 - AUGMENT_SCALE_RANGE + Math.random() * 2 * AUGMENT_SCALE_RANGE;
    const rotate =
      Math.random() * 2 * AUGMENT_ROTATE_RANGE - AUGMENT_ROTATE_RANGE;

    const xAxisX = Math.cos(rotate) * scale;
    const xAxisY = Math.sin(rotate) * scale;
    const yAxisX = -Math.sin(rotate) * scale;
    const yAxisY = Math.cos(rotate) * scale;

    return points.map(({ x, y }) => ({
      x: xAxisX * x + xAxisY * y + moveX,
      y: yAxisX * x + yAxisY * y + moveY,
    }));
  };

  const prepareDatasets = (classes) => {
    let trainDataset = [];
    let validationDataset = [];

    for (let i = 0; i < classes.length; i++) {
      const y = new Array(classes.length).fill(0);
      y[i] = 1;

      const samples = classes[i].samples;
      const classLength = samples.length;
      const numValidation = Math.ceil(VALIDATION_FRACTION * classLength);
      const numTrain = classLength - numValidation;

      const trainSamples = samples.slice(0, numTrain);
      const validationSamples = samples.slice(numTrain);

      // Original training samples — reuse cached pixelData from capture if available
      const classTrain = trainSamples.map((sample) => ({
        pixelData: sample.pixelData ?? renderStrokeToImage(sample.strokePoints),
        label: y,
      }));

      // Augmented copies — pre-render once here so the generator doesn't re-render per epoch
      const classTrainAugmented = trainSamples.flatMap((sample) =>
        Array.from({ length: AUGMENTATION_COUNT }, () => ({
          pixelData: renderStrokeToImage(augmentPoints(sample.strokePoints)),
          label: y,
        })),
      );

      const classValidation = validationSamples.map((sample) => ({
        pixelData: sample.pixelData ?? renderStrokeToImage(sample.strokePoints),
        label: y,
      }));

      trainDataset = trainDataset.concat(classTrain, classTrainAugmented);
      validationDataset = validationDataset.concat(classValidation);
    }

    return { trainDataset, validationDataset };
  };

  const calculateBatchSize = (totalSamples) => {
    if (totalSamples < 20) return 4;
    if (totalSamples < 50) return 8;
    if (totalSamples < 100) return 16;
    if (totalSamples < 200) return 32;
    return 64;
  };

  const generateConfusionMatrix = async (
    validationDataset,
    model,
    numClasses,
  ) => {
    const confMatrix = Array(numClasses)
      .fill(null)
      .map(() => Array(numClasses).fill(0));

    let totalCorrectPredictions = 0;
    let totalValidationSamples = 0;

    for (const sample of validationDataset) {
      const prediction = tf.tidy(() => {
        const imageTensor = strokeToTensor(sample.pixelData);
        const input = imageTensor.expandDims(0);
        return model.predict(input);
      });
      const predData = await prediction.data();
      prediction.dispose();

      const predictedClass = predData.indexOf(Math.max(...predData));
      const actualClass = sample.label.indexOf(1);

      confMatrix[actualClass][predictedClass]++;
      totalValidationSamples++;
      if (predictedClass === actualClass) {
        totalCorrectPredictions++;
      }
    }

    const accuracy =
      totalValidationSamples > 0
        ? totalCorrectPredictions / totalValidationSamples
        : 0;

    return { confMatrix, accuracy };
  };

  const trainModel = useCallback(
    async (classes, onTrainingStart, onTrainingError, onModelTrained) => {
      if (classes.length < 2 || classes.some((cls) => cls.samples.length < 2)) {
        return false;
      }

      resetTrainingState();
      const hasEnoughSamples = classes.every((cls) => cls.samples.length >= 50);
      onTrainingStart();

      try {
        // Build the spell CNN from scratch (8 → 16 → 32 filters).
        // All layers are trained from random initialisation — no remote model
        // dependency, and the filter count is small enough to avoid dead-ReLU
        // saturation that plagued the larger 16→32→64 base model.
        const numClasses = classes.length;
        const model = tf.sequential({
          layers: [
            tf.layers.conv2d({
              inputShape: [STROKE_IMAGE_SIZE, STROKE_IMAGE_SIZE, 3],
              filters: 8,
              kernelSize: 3,
              strides: [2, 2],
              padding: "same",
              activation: "relu",
              kernelInitializer: "glorotUniform",
            }),
            tf.layers.conv2d({
              filters: 16,
              kernelSize: 3,
              strides: [2, 2],
              padding: "same",
              activation: "relu",
              kernelInitializer: "glorotUniform",
            }),
            tf.layers.conv2d({
              filters: 32,
              kernelSize: 3,
              strides: [2, 2],
              padding: "same",
              activation: "relu",
              kernelInitializer: "glorotUniform",
            }),
            tf.layers.globalAveragePooling2d({}),
            tf.layers.dense({
              units: numClasses,
              activation: "softmax",
              kernelInitializer: "varianceScaling",
              useBias: false,
            }),
          ],
        });

        const classWeights = calculateClassWeights(classes);
        const { trainDataset, validationDataset } = prepareDatasets(classes);

        // // Fisher-Yates shuffle so every batch has a balanced class mix
        // for (let i = trainDataset.length - 1; i > 0; i--) {
        //   const j = Math.floor(Math.random() * (i + 1));
        //   [trainDataset[i], trainDataset[j]] = [trainDataset[j], trainDataset[i]];
        // }

        const trainTfDataset = tf.data.generator(function* () {
          for (const sample of trainDataset) {
            yield {
              xs: strokeToTensor(sample.pixelData),
              ys: tf.tensor1d(sample.label),
            };
          }
        });
        const validationTfDataset = tf.data.generator(function* () {
          for (const sample of validationDataset) {
            yield {
              xs: strokeToTensor(sample.pixelData),
              ys: tf.tensor1d(sample.label),
            };
          }
        });

        const totalTrainingSamples = trainDataset.length;
        const batchSize = calculateBatchSize(totalTrainingSamples);
        console.log(
          `Spell training - batch size: ${batchSize} (total samples: ${totalTrainingSamples})`,
        );

        let currentLearningRate = INITIAL_LEARNING_RATE;
        let epochsSinceBestLoss = 0;
        const optimizer = tf.train.adam(INITIAL_LEARNING_RATE);
        model.compile({
          optimizer,
          loss: "categoricalCrossentropy",
          metrics: ["accuracy"],
        });

        const trainDataBatched = trainTfDataset.shuffle(100).batch(batchSize);
        const validationDataBatched = validationTfDataset.batch(batchSize);

        let bestValLoss = Infinity;
        let patienceCounter = 0;
        let bestWeights = null;

        const totalBatches = Math.max(
          1,
          Math.ceil(totalTrainingSamples / batchSize),
        );
        setTrainingProgress({
          epoch: 0,
          totalEpochs: TOTAL_EPOCHS,
          batch: 0,
          totalBatches,
        });

        await model.fitDataset(trainDataBatched, {
          epochs: TOTAL_EPOCHS,
          validationData: validationDataBatched,
          classWeight: classWeights,
          callbacks: {
            onBatchEnd: (batch) => {
              setTrainingProgress((prev) => ({ ...prev, batch: batch + 1 }));
            },
            onEpochEnd: (epoch, logs) => {
              console.log(
                `Spell Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}, val_loss = ${logs.val_loss.toFixed(4)}, val_acc = ${logs.val_acc.toFixed(4)}`,
              );

              setTrainingProgress((prev) => ({
                ...prev,
                epoch: epoch + 1,
                batch: 0,
              }));

              setTrainingMetrics((prev) => [
                ...prev,
                {
                  epoch: epoch + 1,
                  accuracy: logs.acc,
                  val_accuracy: logs.val_acc,
                  loss: logs.loss,
                  val_loss: logs.val_loss,
                },
              ]);

              // Early stopping logic
              if (logs.val_loss < bestValLoss) {
                bestValLoss = logs.val_loss;
                patienceCounter = 0;
                epochsSinceBestLoss = 0;
                bestWeights = model.getWeights().map((w) => w.clone());
              } else {
                patienceCounter++;
                epochsSinceBestLoss++;

                if (epochsSinceBestLoss >= LR_DECAY_PATIENCE) {
                  currentLearningRate = currentLearningRate * LR_DECAY_FACTOR;
                  optimizer.learningRate = currentLearningRate;
                  epochsSinceBestLoss = 0;
                }

                if (patienceCounter >= EARLY_STOPPING_PATIENCE && epoch >= 20) {
                  console.log(`Spell early stopping at epoch ${epoch + 1}`);
                  model.stopTraining = true;
                  if (bestWeights) {
                    model.setWeights(bestWeights);
                    bestWeights.forEach((w) => w.dispose());
                  }
                }
              }
            },
          },
        });

        // Generate confusion matrix
        const { confMatrix, accuracy } = await generateConfusionMatrix(
          validationDataset,
          model,
          numClasses,
        );

        if (hasEnoughSamples) {
          setTestResults(confMatrix);
          setFinalAccuracy(accuracy);
        }

        const modelData = {
          model,
          inputShape: [STROKE_IMAGE_SIZE, STROKE_IMAGE_SIZE, 1],
          classes: classes.map((cls) => ({ id: cls.id, name: cls.name })),
          // Store representative stroke data for potential export
          representativeSamples: classes.flatMap((cls) =>
            cls.samples.slice(0, Math.min(5, cls.samples.length)),
          ),
        };

        optimizer.dispose();
        setTrainingProgress((prev) => ({
          ...prev,
          epoch: prev.totalEpochs,
          batch: prev.totalBatches,
        }));

        setTrainedModel(modelData);
        onModelTrained(modelData);
        return true;
      } catch (error) {
        console.error("Spell training error:", error);
        onTrainingError(`Training failed: ${error.message}`);
        return false;
      }
    },
    [resetTrainingState],
  );

  return {
    trainModel,
    trainingProgress,
    trainingMetrics,
    testResults,
    finalAccuracy,
    trainedModel,
    resetTrainingState,
  };
}

export default useSpellModelTraining;
