import { useState, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";

// TODO: host somewhere else
const BASE_MODEL_URL =
  "https://raw.githubusercontent.com/PaulaScharf/teachable_machine_base_model/refs/heads/main/image_classification/model.json";
const FEATURE_EXTRACTION_BATCH_SIZE = 16;
const VALIDATION_FRACTION = 0.15;

// Default training settings (exported for use in UI)
export const DEFAULT_TRAINING_SETTINGS = {
  epochs: 70,
  learningRate: 0.0001,
  earlyStopping: true,
};

const EARLY_STOPPING_PATIENCE = 5;
const LR_DECAY_FACTOR = 0.5;
const LR_DECAY_PATIENCE = 3;

/**
 * Custom hook for model training logic
 * Extracts TensorFlow training from ModelTrainer component
 */
function useModelTraining() {
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

  const loadImage = (url) =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = url;
    });

  const extractFeatures = async (classes, featureExtractor) => {
    const examples = Array(classes.length)
      .fill(null)
      .map(() => []);

    for (let classIndex = 0; classIndex < classes.length; classIndex++) {
      const cls = classes[classIndex];
      const samples = cls.samples;

      for (
        let batchStart = 0;
        batchStart < samples.length;
        batchStart += FEATURE_EXTRACTION_BATCH_SIZE
      ) {
        const batchEnd = Math.min(
          batchStart + FEATURE_EXTRACTION_BATCH_SIZE,
          samples.length,
        );
        const batchSamples = samples.slice(batchStart, batchEnd);
        const loadedImages = await Promise.all(
          batchSamples.map((sample) => loadImage(sample.url)),
        );

        const batchActivations = tf.tidy(() => {
          const tensors = loadedImages.map((img) =>
            tf.browser
              .fromPixels(img)
              .resizeBilinear([96, 96])
              .mean(-1)
              .expandDims(-1)
              .div(255.0),
          );
          const batchTensor = tf.stack(tensors);
          const extracted = featureExtractor.predict(batchTensor);
          return extracted.arraySync();
        });

        for (const activation of batchActivations) {
          examples[classIndex].push(new Float32Array(activation));
        }
      }
    }

    return examples;
  };

  const calculateClassWeights = (examples, numClasses) => {
    const totalSamples = examples.reduce((sum, cls) => sum + cls.length, 0);
    const classWeights = {};
    examples.forEach((classExamples, classIndex) => {
      const numSamplesInClass = classExamples.length;
      classWeights[classIndex] =
        totalSamples / (numClasses * numSamplesInClass);
    });
    return classWeights;
  };

  const prepareDatasets = (examples, numClasses) => {
    let trainDataset = [];
    let validationDataset = [];

    for (let i = 0; i < examples.length; i++) {
      const y = new Array(numClasses).fill(0);
      y[i] = 1;

      const classLength = examples[i].length;
      const numValidation = Math.ceil(VALIDATION_FRACTION * classLength);
      const numTrain = classLength - numValidation;

      const classTrain = examples[i]
        .slice(0, numTrain)
        .map((dataArray) => ({ data: dataArray, label: y }));

      const classValidation = examples[i]
        .slice(numTrain)
        .map((dataArray) => ({ data: dataArray, label: y }));

      trainDataset = trainDataset.concat(classTrain);
      validationDataset = validationDataset.concat(classValidation);
    }

    return { trainDataset, validationDataset };
  };

  const createTrainingModel = (featureDimension, numClasses) => {
    return tf.sequential({
      layers: [
        tf.layers.dense({
          inputShape: [featureDimension],
          units: 100,
          activation: "relu",
          kernelInitializer: "varianceScaling",
          useBias: true,
          kernelRegularizer: tf.regularizers.l2({ l2: 0.01 }),
        }),
        tf.layers.dropout({ rate: 0.4 }),
        tf.layers.dense({
          kernelInitializer: "varianceScaling",
          useBias: false,
          activation: "softmax",
          units: numClasses,
        }),
      ],
    });
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
    trainingModel,
    featureDimension,
    numClasses,
  ) => {
    const confMatrix = Array(numClasses)
      .fill(null)
      .map(() => Array(numClasses).fill(0));

    let totalCorrectPredictions = 0;
    let totalValidationSamples = 0;

    for (const sample of validationDataset) {
      const prediction = tf.tidy(() => {
        const input = tf.tensor2d(
          [Array.from(sample.data)],
          [1, featureDimension],
        );
        return trainingModel.predict(input);
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
    async (
      classes,
      onTrainingStart,
      onTrainingError,
      onModelTrained,
      trainingSettings = {},
    ) => {
      if (classes.length < 2 || classes.some((cls) => cls.samples.length < 2)) {
        return false;
      }

      // Merge user settings with defaults
      const settings = {
        ...DEFAULT_TRAINING_SETTINGS,
        ...trainingSettings,
      };

      const TOTAL_EPOCHS = settings.epochs;
      const INITIAL_LEARNING_RATE = settings.learningRate;
      const useEarlyStopping = settings.earlyStopping;

      resetTrainingState();
      const hasEnoughSamples = classes.every((cls) => cls.samples.length >= 10);
      onTrainingStart();

      try {
        // Load base model and create feature extractor
        const baseModel = await tf.loadLayersModel(BASE_MODEL_URL);
        const featureExtractor = tf.sequential();
        const numLayersToInclude = baseModel.layers.length - 1;
        for (let i = 0; i < numLayersToInclude; i++) {
          featureExtractor.add(baseModel.layers[i]);
        }
        featureExtractor.layers.forEach((layer) => {
          layer.trainable = false;
        });

        // Extract features from all samples
        const examples = await extractFeatures(classes, featureExtractor);
        const classWeights = calculateClassWeights(examples, classes.length);
        const { trainDataset, validationDataset } = prepareDatasets(
          examples,
          classes.length,
        );

        const trainTfDataset = tf.data.zip({
          xs: tf.data.array(trainDataset.map((sample) => sample.data)),
          ys: tf.data.array(trainDataset.map((sample) => sample.label)),
        });
        const validationTfDataset = tf.data.zip({
          xs: tf.data.array(validationDataset.map((sample) => sample.data)),
          ys: tf.data.array(validationDataset.map((sample) => sample.label)),
        });

        const featureDimension = examples[0][0].length;
        const trainingModel = createTrainingModel(
          featureDimension,
          classes.length,
        );

        const totalTrainingSamples = trainDataset.length;
        const batchSize = calculateBatchSize(totalTrainingSamples);
        console.log(
          `Dynamic batch size: ${batchSize} (total samples: ${totalTrainingSamples})`,
        );

        let currentLearningRate = INITIAL_LEARNING_RATE;
        let epochsSinceBestLoss = 0;
        const optimizer = tf.train.adam(INITIAL_LEARNING_RATE);
        trainingModel.compile({
          optimizer,
          loss: "categoricalCrossentropy",
          metrics: ["accuracy"],
        });

        const trainDataBatched = trainTfDataset.shuffle(100).batch(batchSize);
        const validationDataBatched = validationTfDataset.batch(batchSize);

        let bestValLoss = Infinity;
        let bestValAcc = -Infinity;
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

        await trainingModel.fitDataset(trainDataBatched, {
          epochs: TOTAL_EPOCHS,
          validationData: validationDataBatched,
          classWeight: classWeights,
          callbacks: {
            onBatchEnd: (batch) => {
              setTrainingProgress((prev) => ({ ...prev, batch: batch + 1 }));
            },
            onEpochEnd: (epoch, logs) => {
              console.log(
                `Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}, val_loss = ${logs.val_loss.toFixed(4)}, val_acc = ${logs.val_acc.toFixed(4)}, lr = ${currentLearningRate.toExponential(2)}`,
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
              const valLossImproved = logs.val_loss < bestValLoss;
              const valAccImproved = logs.val_acc > bestValAcc;

              if (valLossImproved && valAccImproved) {
                if (valLossImproved) bestValLoss = logs.val_loss;
                if (valAccImproved) bestValAcc = logs.val_acc;
                patienceCounter = 0;
                epochsSinceBestLoss = 0;
                bestWeights = trainingModel.getWeights().map((w) => w.clone());
              } else {
                patienceCounter++;
                epochsSinceBestLoss++;

                // Adaptive learning rate scheduling
                if (epochsSinceBestLoss >= LR_DECAY_PATIENCE) {
                  currentLearningRate = currentLearningRate * LR_DECAY_FACTOR;
                  optimizer.learningRate = currentLearningRate;
                  epochsSinceBestLoss = 0;
                  console.log(
                    `Reducing learning rate to ${currentLearningRate.toExponential(2)}`,
                  );
                }

                if (
                  useEarlyStopping &&
                  patienceCounter >= EARLY_STOPPING_PATIENCE &&
                  epoch >= 10
                ) {
                  console.log(`Early stopping at epoch ${epoch + 1}`);
                  trainingModel.stopTraining = true;
                  if (bestWeights) {
                    trainingModel.setWeights(bestWeights);
                    bestWeights.forEach((w) => w.dispose());
                    console.log(`Restored best model weights`);
                  }
                }
              }
            },
          },
        });

        const combinedModel = tf.sequential();
        combinedModel.add(featureExtractor);
        combinedModel.add(trainingModel);

        // Generate confusion matrix
        const { confMatrix, accuracy } = await generateConfusionMatrix(
          validationDataset,
          trainingModel,
          featureDimension,
          classes.length,
        );

        if (hasEnoughSamples) {
          setTestResults(confMatrix);
          setFinalAccuracy(accuracy);
        }

        const modelData = {
          model: combinedModel,
          featureExtractor,
          trainingModel,
          inputShape: [96, 96, 1],
          classes: classes.map((cls) => ({ id: cls.id, name: cls.name })),
          representativeSamples: classes.flatMap((cls) =>
            cls.samples
              .slice(0, Math.min(10, cls.samples.length))
              .map((s) => s.url),
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
        console.error("Training error:", error);
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

export default useModelTraining;
