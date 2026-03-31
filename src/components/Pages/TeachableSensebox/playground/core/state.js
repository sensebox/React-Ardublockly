/* Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0
 * https://github.com/tensorflow/playground
 *
 * Converted from TypeScript to JavaScript.
 * - Enums converted to plain objects.
 * - URL hash serialization stubbed (no-op) to avoid interfering with React Router.
 */

import * as nn from "./nn";
import * as dataset from "./dataset";

const HIDE_STATE_SUFFIX = "_hide";

export let activations = {
  relu: nn.Activations.RELU,
  tanh: nn.Activations.TANH,
  sigmoid: nn.Activations.SIGMOID,
  linear: nn.Activations.LINEAR,
};

export let regularizations = {
  none: null,
  L1: nn.RegularizationFunction.L1,
  L2: nn.RegularizationFunction.L2,
};

export let datasets = {
  circle: dataset.classifyCircleData,
  xor: dataset.classifyXORData,
  gauss: dataset.classifyTwoGaussData,
  spiral: dataset.classifySpiralData,
};

export let regDatasets = {
  "reg-plane": dataset.regressPlane,
  "reg-gauss": dataset.regressGaussian,
};

export function getKeyFromValue(obj, value) {
  for (let key in obj) {
    if (obj[key] === value) {
      return key;
    }
  }
  return undefined;
}

function endsWith(s, suffix) {
  return s.substr(-suffix.length) === suffix;
}

function getHideProps(obj) {
  let result = [];
  for (let prop in obj) {
    if (endsWith(prop, HIDE_STATE_SUFFIX)) {
      result.push(prop);
    }
  }
  return result;
}

// Enum equivalents as plain objects
export const Type = {
  STRING: "STRING",
  NUMBER: "NUMBER",
  ARRAY_NUMBER: "ARRAY_NUMBER",
  ARRAY_STRING: "ARRAY_STRING",
  BOOLEAN: "BOOLEAN",
  OBJECT: "OBJECT",
};

export const Problem = {
  CLASSIFICATION: "CLASSIFICATION",
  REGRESSION: "REGRESSION",
};

export let problems = {
  classification: Problem.CLASSIFICATION,
  regression: Problem.REGRESSION,
};

// State class
export class State {
  constructor() {
    this.learningRate = 0.03;
    this.regularizationRate = 0;
    this.showTestData = false;
    this.noise = 0;
    this.batchSize = 10;
    this.discretize = false;
    this.tutorial = null;
    this.percTrainData = 50;
    this.activation = nn.Activations.TANH;
    this.regularization = null;
    this.problem = Problem.CLASSIFICATION;
    this.initZero = false;
    this.hideText = false;
    this.collectStats = false;
    this.numHiddenLayers = 1;
    this.hiddenLayerControls = [];
    this.networkShape = [4, 2];
    this.x = true;
    this.y = true;
    this.xTimesY = false;
    this.xSquared = false;
    this.ySquared = false;
    this.cosX = false;
    this.sinX = false;
    this.cosY = false;
    this.sinY = false;
    this.dataset = dataset.classifyCircleData;
    this.regDataset = dataset.regressPlane;
    this.seed = Math.random().toFixed(5);
  }

  /** Returns a default State (no URL hash deserialization). */
  static deserializeState() {
    return new State();
  }

  /** Stub — do not modify the browser URL from inside a React component. */
  serialize() {
    // no-op
  }

  getHiddenProps() {
    let result = [];
    for (let prop in this) {
      if (endsWith(prop, HIDE_STATE_SUFFIX) && String(this[prop]) === "true") {
        result.push(prop.replace(HIDE_STATE_SUFFIX, ""));
      }
    }
    return result;
  }

  setHideProperty(name, hidden) {
    this[name + HIDE_STATE_SUFFIX] = hidden;
  }
}
