/* Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0
 * https://github.com/tensorflow/playground
 *
 * Converted from TypeScript to JavaScript.
 * All d3 DOM selectors are scoped to the container element passed to
 * initPlayground(container) to avoid affecting the host React app.
 */

import * as nn from "./nn";
import { HeatMap, reduceMatrix } from "./heatmap";
import {
  State,
  datasets,
  regDatasets,
  activations,
  problems,
  regularizations,
  getKeyFromValue,
  Problem,
} from "./state";
import { shuffle } from "./dataset";
import { AppendingLineChart } from "./linechart";
import * as d3 from "d3";

// Debug: verify D3 v7 is loaded properly
if (!d3 || !d3.select || !d3.scaleLinear) {
  console.error("D3 v7 not loaded correctly. d3 =", d3);
}

const RECT_SIZE = 30;
const BIAS_SIZE = 5;
const NUM_SAMPLES_CLASSIFY = 500;
const NUM_SAMPLES_REGRESS = 1200;
const DENSITY = 100;

// HoverType equivalent
const HoverType = { BIAS: "BIAS", WEIGHT: "WEIGHT" };

const INPUTS = {
  x: { f: (x, y) => x, label: "X_1" },
  y: { f: (x, y) => y, label: "X_2" },
  xSquared: { f: (x, y) => x * x, label: "X_1^2" },
  ySquared: { f: (x, y) => y * y, label: "X_2^2" },
  xTimesY: { f: (x, y) => x * y, label: "X_1X_2" },
  sinX: { f: (x, y) => Math.sin(x), label: "sin(X_1)" },
  sinY: { f: (x, y) => Math.sin(y), label: "sin(X_2)" },
};

const HIDABLE_CONTROLS = [
  ["Show test data", "showTestData"],
  ["Discretize output", "discretize"],
  ["Play button", "playButton"],
  ["Step button", "stepButton"],
  ["Reset button", "resetButton"],
  ["Learning rate", "learningRate"],
  ["Activation", "activation"],
  ["Regularization", "regularization"],
  ["Regularization rate", "regularizationRate"],
  ["Problem type", "problem"],
  ["Which dataset", "dataset"],
  ["Ratio train data", "percTrainData"],
  ["Noise level", "noise"],
  ["Batch size", "batchSize"],
  ["# of hidden layers", "numHiddenLayers"],
];

/**
 * Initializes and renders the Deep Playground inside a given container element.
 * Returns a cleanup function to call on unmount.
 */
export function initPlayground(playgroundContainer) {
  // Scoped d3 selector root — all DOM queries go through here
  const sel = d3.select(playgroundContainer);

  let mainWidth;

  class Player {
    constructor() {
      this.timerIndex = 0;
      this.isPlaying = false;
      this.callback = null;
    }

    playOrPause() {
      if (this.isPlaying) {
        this.isPlaying = false;
        this.pause();
      } else {
        this.isPlaying = true;
        if (iter === 0) {
          simulationStarted();
        }
        this.play();
      }
    }

    onPlayPause(callback) {
      this.callback = callback;
    }

    play() {
      this.pause();
      this.isPlaying = true;
      if (this.callback) {
        this.callback(this.isPlaying);
      }
      this._start(this.timerIndex);
    }

    pause() {
      this.timerIndex++;
      this.isPlaying = false;
      if (this.callback) {
        this.callback(this.isPlaying);
      }
    }

    _start(localTimerIndex) {
      const t = d3.timer(() => {
        if (localTimerIndex < this.timerIndex) {
          t.stop();
          return;
        }
        oneStep();
      }, 0);
    }
  }

  // "More" scroll button
  sel.select(".more button").on("click", function () {
    let position = 800;
    d3.transition().duration(1000).tween("scroll", scrollTween(position));
  });

  function scrollTween(offset) {
    return function () {
      let i = d3.interpolateNumber(
        window.pageYOffset || document.documentElement.scrollTop,
        offset,
      );
      return function (t) {
        scrollTo(0, i(t));
      };
    };
  }

  let state = State.deserializeState();

  // Filter out inputs that are hidden.
  state.getHiddenProps().forEach((prop) => {
    if (prop in INPUTS) {
      delete INPUTS[prop];
    }
  });

  let boundary = {};
  let selectedNodeId = null;
  let xDomain = [-6, 6];
  let heatMap = new HeatMap(
    300,
    DENSITY,
    xDomain,
    xDomain,
    sel.select("#heatmap"),
    { showAxes: true },
  );
  let linkWidthScale = d3
    .scaleLinear()
    .domain([0, 5])
    .range([1, 10])
    .clamp(true);
  let colorScale = d3
    .scaleLinear()
    .domain([-1, 0, 1])
    .range(["#E27136", "#e8eaeb", "#4EAF47"])
    .clamp(true);
  let iter = 0;
  let trainData = [];
  let testData = [];
  let network = null;
  let lossTrain = 0;
  let lossTest = 0;
  let player = new Player();
  let lineChart = new AppendingLineChart(sel.select("#linechart"), [
    "#777",
    "black",
  ]);

  function makeGUI() {
    sel.select("#reset-button").on("click", () => {
      reset();
      userHasInteracted();
    });

    sel.select("#play-pause-button").on("click", function () {
      userHasInteracted();
      player.playOrPause();
    });

    player.onPlayPause((isPlaying) => {
      sel.select("#play-pause-button").classed("playing", isPlaying);
    });

    sel.select("#next-step-button").on("click", () => {
      player.pause();
      userHasInteracted();
      if (iter === 0) {
        simulationStarted();
      }
      oneStep();
    });

    sel.select("#data-regen-button").on("click", () => {
      generateData();
      parametersChanged = true;
    });

    let dataThumbnails = sel.selectAll("canvas[data-dataset]");
    dataThumbnails.on("click", function () {
      let newDataset = datasets[this.dataset.dataset];
      if (newDataset === state.dataset) {
        return;
      }
      state.dataset = newDataset;
      dataThumbnails.classed("selected", false);
      d3.select(this).classed("selected", true);
      generateData();
      parametersChanged = true;
      reset();
    });

    let datasetKey = getKeyFromValue(datasets, state.dataset);
    sel.select(`canvas[data-dataset=${datasetKey}]`).classed("selected", true);

    let regDataThumbnails = sel.selectAll("canvas[data-regdataset]");
    regDataThumbnails.on("click", function () {
      let newDataset = regDatasets[this.dataset.regdataset];
      if (newDataset === state.regDataset) {
        return;
      }
      state.regDataset = newDataset;
      regDataThumbnails.classed("selected", false);
      d3.select(this).classed("selected", true);
      generateData();
      parametersChanged = true;
      reset();
    });

    let regDatasetKey = getKeyFromValue(regDatasets, state.regDataset);
    sel
      .select(`canvas[data-regdataset=${regDatasetKey}]`)
      .classed("selected", true);

    sel.select("#add-layers").on("click", () => {
      if (state.numHiddenLayers >= 6) {
        return;
      }
      state.networkShape[state.numHiddenLayers] = 2;
      state.numHiddenLayers++;
      parametersChanged = true;
      reset();
    });

    sel.select("#remove-layers").on("click", () => {
      if (state.numHiddenLayers <= 0) {
        return;
      }
      state.numHiddenLayers--;
      state.networkShape.splice(state.numHiddenLayers);
      parametersChanged = true;
      reset();
    });

    let showTestData = sel.select("#show-test-data").on("change", function () {
      state.showTestData = this.checked;
      state.serialize();
      userHasInteracted();
      heatMap.updateTestPoints(state.showTestData ? testData : []);
    });
    showTestData.property("checked", state.showTestData);

    let discretize = sel.select("#discretize").on("change", function () {
      state.discretize = this.checked;
      state.serialize();
      userHasInteracted();
      updateUI();
    });
    discretize.property("checked", state.discretize);

    let percTrain = sel.select("#percTrainData").on("input", function () {
      state.percTrainData = this.value;
      sel.select("label[for='percTrainData'] .value").text(this.value);
      generateData();
      parametersChanged = true;
      reset();
    });
    percTrain.property("value", state.percTrainData);
    sel.select("label[for='percTrainData'] .value").text(state.percTrainData);

    let noise = sel.select("#noise").on("input", function () {
      state.noise = this.value;
      sel.select("label[for='noise'] .value").text(this.value);
      generateData();
      parametersChanged = true;
      reset();
    });
    let currentMax = parseInt(noise.property("max"));
    if (state.noise > currentMax) {
      if (state.noise <= 80) {
        noise.property("max", state.noise);
      } else {
        state.noise = 50;
      }
    } else if (state.noise < 0) {
      state.noise = 0;
    }
    noise.property("value", state.noise);
    sel.select("label[for='noise'] .value").text(state.noise);

    let batchSize = sel.select("#batchSize").on("input", function () {
      state.batchSize = this.value;
      sel.select("label[for='batchSize'] .value").text(this.value);
      parametersChanged = true;
      reset();
    });
    batchSize.property("value", state.batchSize);
    sel.select("label[for='batchSize'] .value").text(state.batchSize);

    let activationDropdown = sel
      .select("#activations")
      .on("change", function () {
        state.activation = activations[this.value];
        parametersChanged = true;
        reset();
      });
    activationDropdown.property(
      "value",
      getKeyFromValue(activations, state.activation),
    );

    let learningRate = sel.select("#learningRate").on("change", function () {
      state.learningRate = +this.value;
      state.serialize();
      userHasInteracted();
      parametersChanged = true;
    });
    learningRate.property("value", state.learningRate);

    let regularDropdown = sel
      .select("#regularizations")
      .on("change", function () {
        state.regularization = regularizations[this.value];
        parametersChanged = true;
        reset();
      });
    regularDropdown.property(
      "value",
      getKeyFromValue(regularizations, state.regularization),
    );

    let regularRate = sel.select("#regularRate").on("change", function () {
      state.regularizationRate = +this.value;
      parametersChanged = true;
      reset();
    });
    regularRate.property("value", state.regularizationRate);

    let problem = sel.select("#problem").on("change", function () {
      state.problem = problems[this.value];
      generateData();
      drawDatasetThumbnails();
      parametersChanged = true;
      reset();
    });
    problem.property("value", getKeyFromValue(problems, state.problem));

    // Add scale to the gradient color map.
    let x = d3.scaleLinear().domain([-1, 1]).range([0, 144]);
    let xAxis = d3
      .axisBottom(x)
      .tickValues([-1, 0, 1])
      .tickFormat(d3.format("d"));
    sel
      .select("#colormap g.core")
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0,10)")
      .call(xAxis);

    const resizeHandler = () => {
      let mainPart = playgroundContainer.querySelector("#main-part");
      if (!mainPart) return;
      let newWidth = mainPart.getBoundingClientRect().width;
      if (newWidth !== mainWidth) {
        mainWidth = newWidth;
        drawNetwork(network);
        updateUI(true);
      }
    };
    window.addEventListener("resize", resizeHandler);
    // Store on container for cleanup
    playgroundContainer._pgResizeHandler = resizeHandler;

    if (state.hideText) {
      sel.select("#article-text").style("display", "none");
      sel.select("div.more").style("display", "none");
      sel.select(".pg-header").style("display", "none");
    }
  }

  function updateBiasesUI(network) {
    nn.forEachNode(network, true, (node) => {
      sel.select(`rect#bias-${node.id}`).style("fill", colorScale(node.bias));
    });
  }

  function updateWeightsUI(network, container) {
    for (let layerIdx = 1; layerIdx < network.length; layerIdx++) {
      let currentLayer = network[layerIdx];
      for (let i = 0; i < currentLayer.length; i++) {
        let node = currentLayer[i];
        for (let j = 0; j < node.inputLinks.length; j++) {
          let link = node.inputLinks[j];
          container
            .select(`#link${link.source.id}-${link.dest.id}`)
            .style("stroke-dashoffset", -iter / 3)
            .style("stroke-width", linkWidthScale(Math.abs(link.weight)))
            .style("stroke", colorScale(link.weight))
            .datum(link);
        }
      }
    }
  }

  function drawNode(cx, cy, nodeId, isInput, container, node) {
    let x = cx - RECT_SIZE / 2;
    let y = cy - RECT_SIZE / 2;

    let nodeGroup = container
      .append("g")
      .attr("class", "node")
      .attr("id", `node${nodeId}`)
      .attr("transform", `translate(${x},${y})`);

    nodeGroup
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", RECT_SIZE)
      .attr("height", RECT_SIZE);

    let activeOrNotClass = state[nodeId] ? "active" : "inactive";

    if (isInput) {
      let label = INPUTS[nodeId].label != null ? INPUTS[nodeId].label : nodeId;
      let text = nodeGroup
        .append("text")
        .attr("class", "main-label")
        .attr("x", -10)
        .attr("y", RECT_SIZE / 2)
        .attr("text-anchor", "end");
      if (/[_^]/.test(label)) {
        let myRe = /(.*?)([_^])(.)/g;
        let myArray;
        let lastIndex;
        while ((myArray = myRe.exec(label)) !== null) {
          lastIndex = myRe.lastIndex;
          let prefix = myArray[1];
          let sep = myArray[2];
          let suffix = myArray[3];
          if (prefix) {
            text.append("tspan").text(prefix);
          }
          text
            .append("tspan")
            .attr("baseline-shift", sep === "_" ? "sub" : "super")
            .style("font-size", "9px")
            .text(suffix);
        }
        if (label.substring(lastIndex)) {
          text.append("tspan").text(label.substring(lastIndex));
        }
      } else {
        text.append("tspan").text(label);
      }
      nodeGroup.classed(activeOrNotClass, true);
    }

    if (!isInput) {
      nodeGroup
        .append("rect")
        .attr("id", `bias-${nodeId}`)
        .attr("x", -BIAS_SIZE - 2)
        .attr("y", RECT_SIZE - BIAS_SIZE + 3)
        .attr("width", BIAS_SIZE)
        .attr("height", BIAS_SIZE)
        .on("mouseenter", function (event) {
          updateHoverCard(
            HoverType.BIAS,
            node,
            d3.pointer(event, container.node()),
          );
        })
        .on("mouseleave", function () {
          updateHoverCard(null);
        });
    }

    let div = sel
      .select("#network")
      .insert("div", ":first-child")
      .attr("id", `canvas-${nodeId}`)
      .attr("class", "canvas")
      .style("position", "absolute")
      .style("left", `${x + 3}px`)
      .style("top", `${y + 3}px`)
      .on("mouseenter", function () {
        selectedNodeId = nodeId;
        div.classed("hovered", true);
        nodeGroup.classed("hovered", true);
        updateDecisionBoundary(network, false);
        heatMap.updateBackground(boundary[nodeId], state.discretize);
      })
      .on("mouseleave", function () {
        selectedNodeId = null;
        div.classed("hovered", false);
        nodeGroup.classed("hovered", false);
        updateDecisionBoundary(network, false);
        heatMap.updateBackground(
          boundary[nn.getOutputNode(network).id],
          state.discretize,
        );
      });

    if (isInput) {
      div.on("click", function () {
        state[nodeId] = !state[nodeId];
        parametersChanged = true;
        reset();
      });
      div.style("cursor", "pointer");
    }
    if (isInput) {
      div.classed(activeOrNotClass, true);
    }

    let nodeHeatMap = new HeatMap(
      RECT_SIZE,
      DENSITY / 10,
      xDomain,
      xDomain,
      div,
      { noSvg: true },
    );
    div.datum({ heatmap: nodeHeatMap, id: nodeId });
  }

  function drawNetwork(network) {
    let svg = sel.select("#svg");
    svg.select("g.core").remove();
    sel.select("#network").selectAll("div.canvas").remove();
    sel.select("#network").selectAll("div.plus-minus-neurons").remove();

    let padding = 3;
    let co = sel.select(".column.output").node();
    let cf = sel.select(".column.features").node();
    let width = co.offsetLeft - cf.offsetLeft;
    svg.attr("width", width);

    let node2coord = {};
    let container = svg
      .append("g")
      .classed("core", true)
      .attr("transform", `translate(${padding},${padding})`);

    let numLayers = network.length;
    let featureWidth = 118;
    let layerScale = d3
      .scalePoint()
      .domain(d3.range(1, numLayers - 1))
      .range([featureWidth, width - RECT_SIZE])
      .padding(0.7);
    let nodeIndexScale = (nodeIndex) => nodeIndex * (RECT_SIZE + 25);

    let calloutThumb = sel
      .select(".callout.thumbnail")
      .style("display", "none");
    let calloutWeights = sel
      .select(".callout.weights")
      .style("display", "none");
    let idWithCallout = null;
    let targetIdWithCallout = null;

    let cx = RECT_SIZE / 2 + 50;
    let nodeIds = Object.keys(INPUTS);
    let maxY = nodeIndexScale(nodeIds.length);
    nodeIds.forEach((nodeId, i) => {
      let cy = nodeIndexScale(i) + RECT_SIZE / 2;
      node2coord[nodeId] = { cx, cy };
      drawNode(cx, cy, nodeId, true, container);
    });

    for (let layerIdx = 1; layerIdx < numLayers - 1; layerIdx++) {
      let numNodes = network[layerIdx].length;
      let cx = layerScale(layerIdx) + RECT_SIZE / 2;
      maxY = Math.max(maxY, nodeIndexScale(numNodes));
      addPlusMinusControl(layerScale(layerIdx), layerIdx);
      for (let i = 0; i < numNodes; i++) {
        let node = network[layerIdx][i];
        let cy = nodeIndexScale(i) + RECT_SIZE / 2;
        node2coord[node.id] = { cx, cy };
        drawNode(cx, cy, node.id, false, container, node);

        let numNodes = network[layerIdx].length;
        let nextNumNodes = network[layerIdx + 1].length;
        if (
          idWithCallout == null &&
          i === numNodes - 1 &&
          nextNumNodes <= numNodes
        ) {
          calloutThumb
            .style("display", null)
            .style("top", `${20 + 3 + cy}px`)
            .style("left", `${cx}px`);
          idWithCallout = node.id;
        }

        for (let j = 0; j < node.inputLinks.length; j++) {
          let link = node.inputLinks[j];
          let path = drawLink(
            link,
            node2coord,
            network,
            container,
            j === 0,
            j,
            node.inputLinks.length,
          ).node();
          let prevLayer = network[layerIdx - 1];
          let lastNodePrevLayer = prevLayer[prevLayer.length - 1];
          if (
            targetIdWithCallout == null &&
            i === numNodes - 1 &&
            link.source.id === lastNodePrevLayer.id &&
            (link.source.id !== idWithCallout || numLayers <= 5) &&
            link.dest.id !== idWithCallout &&
            prevLayer.length >= numNodes
          ) {
            let midPoint = path.getPointAtLength(path.getTotalLength() * 0.7);
            calloutWeights
              .style("display", null)
              .style("top", `${midPoint.y + 5}px`)
              .style("left", `${midPoint.x + 3}px`);
            targetIdWithCallout = link.dest.id;
          }
        }
      }
    }

    cx = width + RECT_SIZE / 2;
    let node = network[numLayers - 1][0];
    let cy = nodeIndexScale(0) + RECT_SIZE / 2;
    node2coord[node.id] = { cx, cy };
    for (let i = 0; i < node.inputLinks.length; i++) {
      let link = node.inputLinks[i];
      drawLink(
        link,
        node2coord,
        network,
        container,
        i === 0,
        i,
        node.inputLinks.length,
      );
    }
    svg.attr("height", maxY);

    let height = Math.max(
      getRelativeHeight(calloutThumb),
      getRelativeHeight(calloutWeights),
      getRelativeHeight(sel.select("#network")),
    );
    sel.select(".column.features").style("height", height + "px");
  }

  function getRelativeHeight(selection) {
    let node = selection.node();
    return node.offsetHeight + node.offsetTop;
  }

  function addPlusMinusControl(x, layerIdx) {
    let div = sel
      .select("#network")
      .append("div")
      .classed("plus-minus-neurons", true)
      .style("left", `${x - 10}px`);

    let i = layerIdx - 1;
    let firstRow = div.append("div").attr("class", `ui-numNodes${layerIdx}`);

    firstRow
      .append("button")
      .attr("class", "mdl-button mdl-js-button mdl-button--icon")
      .on("click", () => {
        let numNeurons = state.networkShape[i];
        if (numNeurons >= 8) return;
        state.networkShape[i]++;
        parametersChanged = true;
        reset();
      })
      .append("i")
      .attr("class", "material-icons")
      .text("add");

    firstRow
      .append("button")
      .attr("class", "mdl-button mdl-js-button mdl-button--icon")
      .on("click", () => {
        let numNeurons = state.networkShape[i];
        if (numNeurons <= 1) return;
        state.networkShape[i]--;
        parametersChanged = true;
        reset();
      })
      .append("i")
      .attr("class", "material-icons")
      .text("remove");

    let suffix = state.networkShape[i] > 1 ? "s" : "";
    div.append("div").text(state.networkShape[i] + " neuron" + suffix);
  }

  function updateHoverCard(type, nodeOrLink, coordinates) {
    let hovercard = sel.select("#hovercard");
    if (type == null) {
      hovercard.style("display", "none");
      sel.select("#svg").on("click", null);
      return;
    }
    sel.select("#svg").on("click", () => {
      hovercard.select(".value").style("display", "none");
      let input = hovercard.select("input");
      input.style("display", null);
      input.on("input", function () {
        if (this.value != null && this.value !== "") {
          if (type === HoverType.WEIGHT) {
            nodeOrLink.weight = +this.value;
          } else {
            nodeOrLink.bias = +this.value;
          }
          updateUI();
        }
      });
      input.on("keypress", (event) => {
        if (event.keyCode === 13) {
          updateHoverCard(type, nodeOrLink, coordinates);
        }
      });
      input.node().focus();
    });

    let value = type === HoverType.WEIGHT ? nodeOrLink.weight : nodeOrLink.bias;
    let name = type === HoverType.WEIGHT ? "Weight" : "Bias";

    hovercard
      .style("left", `${coordinates[0] + 20}px`)
      .style("top", `${coordinates[1]}px`)
      .style("display", "block");
    hovercard.select(".type").text(name);
    hovercard
      .select(".value")
      .style("display", null)
      .text(value.toPrecision(2));
    hovercard
      .select("input")
      .property("value", value.toPrecision(2))
      .style("display", "none");
  }

  function drawLink(
    input,
    node2coord,
    network,
    container,
    isFirst,
    index,
    length,
  ) {
    let line = container.insert("path", ":first-child");
    let source = node2coord[input.source.id];
    let dest = node2coord[input.dest.id];
    let datum = {
      source: {
        y: source.cx + RECT_SIZE / 2 + 2,
        x: source.cy,
      },
      target: {
        y: dest.cx - RECT_SIZE / 2,
        x: dest.cy + ((index - (length - 1) / 2) / length) * 12,
      },
    };
    let diagonal = d3
      .linkHorizontal()
      .x((d) => d.y)
      .y((d) => d.x);
    line
      .attr("marker-start", "url(#markerArrow)")
      .attr("class", "link")
      .attr("id", "link" + input.source.id + "-" + input.dest.id)
      .attr("d", diagonal(datum));

    container
      .append("path")
      .attr("d", diagonal(datum))
      .attr("class", "link-hover")
      .on("mouseenter", function (event) {
        updateHoverCard(HoverType.WEIGHT, input, d3.pointer(event));
      })
      .on("mouseleave", function () {
        updateHoverCard(null);
      });
    return line;
  }

  function updateDecisionBoundary(network, firstTime) {
    if (firstTime) {
      boundary = {};
      nn.forEachNode(network, true, (node) => {
        boundary[node.id] = new Array(DENSITY);
      });
      for (let nodeId in INPUTS) {
        boundary[nodeId] = new Array(DENSITY);
      }
    }
    let xScale = d3
      .scaleLinear()
      .domain([0, DENSITY - 1])
      .range(xDomain);
    let yScale = d3
      .scaleLinear()
      .domain([DENSITY - 1, 0])
      .range(xDomain);

    let i = 0,
      j = 0;
    for (i = 0; i < DENSITY; i++) {
      if (firstTime) {
        nn.forEachNode(network, true, (node) => {
          boundary[node.id][i] = new Array(DENSITY);
        });
        for (let nodeId in INPUTS) {
          boundary[nodeId][i] = new Array(DENSITY);
        }
      }
      for (j = 0; j < DENSITY; j++) {
        let x = xScale(i);
        let y = yScale(j);
        let input = constructInput(x, y);
        nn.forwardProp(network, input);
        nn.forEachNode(network, true, (node) => {
          boundary[node.id][i][j] = node.output;
        });
        if (firstTime) {
          for (let nodeId in INPUTS) {
            boundary[nodeId][i][j] = INPUTS[nodeId].f(x, y);
          }
        }
      }
    }
  }

  function getLoss(network, dataPoints) {
    let loss = 0;
    for (let i = 0; i < dataPoints.length; i++) {
      let dataPoint = dataPoints[i];
      let input = constructInput(dataPoint.x, dataPoint.y);
      let output = nn.forwardProp(network, input);
      loss += nn.Errors.SQUARE.error(output, dataPoint.label);
    }
    return loss / dataPoints.length;
  }

  function updateUI(firstStep = false) {
    updateWeightsUI(network, sel.select("g.core"));
    updateBiasesUI(network);
    updateDecisionBoundary(network, firstStep);
    let selectedId =
      selectedNodeId != null ? selectedNodeId : nn.getOutputNode(network).id;
    heatMap.updateBackground(boundary[selectedId], state.discretize);

    sel
      .select("#network")
      .selectAll("div.canvas")
      .each(function (data) {
        data.heatmap.updateBackground(
          reduceMatrix(boundary[data.id], 10),
          state.discretize,
        );
      });

    function zeroPad(n) {
      let pad = "000000";
      return (pad + n).slice(-pad.length);
    }
    function addCommas(s) {
      return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    function humanReadable(n) {
      return n.toFixed(3);
    }

    sel.select("#loss-train").text(humanReadable(lossTrain));
    sel.select("#loss-test").text(humanReadable(lossTest));
    sel.select("#iter-number").text(addCommas(zeroPad(iter)));
    lineChart.addDataPoint([lossTrain, lossTest]);
  }

  function constructInputIds() {
    let result = [];
    for (let inputName in INPUTS) {
      if (state[inputName]) {
        result.push(inputName);
      }
    }
    return result;
  }

  function constructInput(x, y) {
    let input = [];
    for (let inputName in INPUTS) {
      if (state[inputName]) {
        input.push(INPUTS[inputName].f(x, y));
      }
    }
    return input;
  }

  function oneStep() {
    iter++;
    trainData.forEach((point, i) => {
      let input = constructInput(point.x, point.y);
      nn.forwardProp(network, input);
      nn.backProp(network, point.label, nn.Errors.SQUARE);
      if ((i + 1) % state.batchSize === 0) {
        nn.updateWeights(network, state.learningRate, state.regularizationRate);
      }
    });
    lossTrain = getLoss(network, trainData);
    lossTest = getLoss(network, testData);
    updateUI();
  }

  function reset(onStartup = false) {
    lineChart.reset();
    state.serialize();
    if (!onStartup) {
      userHasInteracted();
    }
    player.pause();

    let suffix = state.numHiddenLayers !== 1 ? "s" : "";
    sel.select("#layers-label").text("Hidden layer" + suffix);
    sel.select("#num-layers").text(state.numHiddenLayers);

    iter = 0;
    let numInputs = constructInput(0, 0).length;
    let shape = [numInputs].concat(state.networkShape).concat([1]);
    let outputActivation =
      state.problem === Problem.REGRESSION
        ? nn.Activations.LINEAR
        : nn.Activations.TANH;
    network = nn.buildNetwork(
      shape,
      state.activation,
      outputActivation,
      state.regularization,
      constructInputIds(),
      state.initZero,
    );
    lossTrain = getLoss(network, trainData);
    lossTest = getLoss(network, testData);
    drawNetwork(network);
    updateUI(true);
  }

  function drawDatasetThumbnails() {
    function renderThumbnail(canvas, dataGenerator) {
      let w = 100;
      let h = 100;
      canvas.setAttribute("width", w);
      canvas.setAttribute("height", h);
      let context = canvas.getContext("2d");
      let data = dataGenerator(200, 0);
      data.forEach(function (d) {
        context.fillStyle = colorScale(d.label);
        context.fillRect((w * (d.x + 6)) / 12, (h * (d.y + 6)) / 12, 4, 4);
      });
      d3.select(canvas.parentNode).style("display", null);
    }
    sel.selectAll(".dataset").style("display", "none");

    if (state.problem === Problem.CLASSIFICATION) {
      for (let dataset in datasets) {
        let canvas = playgroundContainer.querySelector(
          `canvas[data-dataset=${dataset}]`,
        );
        let dataGenerator = datasets[dataset];
        renderThumbnail(canvas, dataGenerator);
      }
    }
    if (state.problem === Problem.REGRESSION) {
      for (let regDataset in regDatasets) {
        let canvas = playgroundContainer.querySelector(
          `canvas[data-regdataset=${regDataset}]`,
        );
        let dataGenerator = regDatasets[regDataset];
        renderThumbnail(canvas, dataGenerator);
      }
    }
  }

  function hideControls() {
    let hiddenProps = state.getHiddenProps();
    hiddenProps.forEach((prop) => {
      let controls = sel.selectAll(`.ui-${prop}`);
      if (controls.size() === 0) {
        console.warn(`0 html elements found with class .ui-${prop}`);
      }
      controls.style("display", "none");
    });

    let hideControlsEl = sel.select(".hide-controls");
    HIDABLE_CONTROLS.forEach(([text, id]) => {
      let label = hideControlsEl
        .append("label")
        .attr("class", "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect");
      let input = label
        .append("input")
        .attr("type", "checkbox")
        .attr("class", "mdl-checkbox__input");
      if (hiddenProps.indexOf(id) === -1) {
        input.attr("checked", "true");
      }
      input.on("change", function () {
        state.setHideProperty(id, !this.checked);
        state.serialize();
        userHasInteracted();
      });
      label
        .append("span")
        .attr("class", "mdl-checkbox__label label")
        .text(text);
    });
  }

  function generateData(firstTime = false) {
    if (!firstTime) {
      state.seed = Math.random().toFixed(5);
      state.serialize();
      userHasInteracted();
    }
    let numSamples =
      state.problem === Problem.REGRESSION
        ? NUM_SAMPLES_REGRESS
        : NUM_SAMPLES_CLASSIFY;
    let generator =
      state.problem === Problem.CLASSIFICATION
        ? state.dataset
        : state.regDataset;
    let data = generator(numSamples, state.noise / 100);
    shuffle(data);
    let splitIndex = Math.floor((data.length * state.percTrainData) / 100);
    trainData = data.slice(0, splitIndex);
    testData = data.slice(splitIndex);
    heatMap.updatePoints(trainData);
    heatMap.updateTestPoints(state.showTestData ? testData : []);
  }

  let firstInteraction = true;
  let parametersChanged = false;

  function userHasInteracted() {
    // Analytics stub — no-op
    firstInteraction = false;
  }

  function simulationStarted() {
    // Analytics stub — no-op
    parametersChanged = false;
  }

  // --- Bootstrap ---
  drawDatasetThumbnails();
  makeGUI();
  generateData(true);
  reset(true);
  hideControls();

  // Return cleanup function
  return function cleanup() {
    player.pause();
    if (playgroundContainer._pgResizeHandler) {
      window.removeEventListener(
        "resize",
        playgroundContainer._pgResizeHandler,
      );
      delete playgroundContainer._pgResizeHandler;
    }
  };
}
