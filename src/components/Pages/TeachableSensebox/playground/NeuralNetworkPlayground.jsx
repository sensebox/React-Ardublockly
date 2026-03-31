/* Copyright 2016 Google Inc. All Rights Reserved.
 * Original Deep Playground: https://github.com/tensorflow/playground
 * Licensed under the Apache License, Version 2.0
 * Ported to React JSX by the Teachable senseBox project.
 */

import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Link } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { initPlayground } from "./core/playgroundInit";
import { getTeachableSenseboxTranslations } from "../translations";
import "./playground.css";

const NeuralNetworkPlayground = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const language = useSelector((s) => s.general.language);
  const t = getTeachableSenseboxTranslations();

  useEffect(() => {
    if (!containerRef.current) return;
    const cleanup = initPlayground(containerRef.current);
    return () => {
      if (cleanup) cleanup();
    };
  }, []); // only on mount

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }} key={language}>
      {/* Top bar: back navigation + original credit */}
      <Box
        sx={{
          px: 2,
          py: 1,
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          flexShrink: 0,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/teachable")}
          size="small"
        >
          {t.landing?.title || "Teachable senseBox"}
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="caption" color="text.secondary">
          {t.landing.playgroundCard?.credit || "Based on"}{" "}
          <Link
            href="https://github.com/tensorflow/playground"
            target="_blank"
            rel="noopener noreferrer"
          >
            TensorFlow Playground
          </Link>{" "}
          by Daniel Smilkov &amp; Shan Carter (Apache 2.0)
        </Typography>
      </Box>

      {/* Playground container — all D3 DOM manipulation targets elements inside here */}
      <div className="pg-container" ref={containerRef}>
        {/* Top Controls */}
        <div id="top-controls">
          <div className="container l--page">
            <div className="timeline-controls">
              <button
                className="mdl-button mdl-js-button mdl-button--icon ui-resetButton"
                id="reset-button"
                title="Reset the network"
              >
                <i className="material-icons">replay</i>
              </button>
              <button
                className="mdl-button mdl-js-button mdl-button--fab mdl-button--colored ui-playButton"
                id="play-pause-button"
                title="Run/Pause"
              >
                <i className="material-icons">play_arrow</i>
                <i className="material-icons">pause</i>
              </button>
              <button
                className="mdl-button mdl-js-button mdl-button--icon ui-stepButton"
                id="next-step-button"
                title="Step"
              >
                <i className="material-icons">skip_next</i>
              </button>
            </div>
            <div className="control">
              <span className="label">Epoch</span>
              <span className="value" id="iter-number"></span>
            </div>
            <div className="control ui-learningRate">
              <label htmlFor="learningRate">Learning rate</label>
              <div className="select">
                <select id="learningRate">
                  <option value="0.00001">0.00001</option>
                  <option value="0.0001">0.0001</option>
                  <option value="0.001">0.001</option>
                  <option value="0.003">0.003</option>
                  <option value="0.01">0.01</option>
                  <option value="0.03">0.03</option>
                  <option value="0.1">0.1</option>
                  <option value="0.3">0.3</option>
                  <option value="1">1</option>
                  <option value="3">3</option>
                  <option value="10">10</option>
                </select>
              </div>
            </div>
            <div className="control ui-activation">
              <label htmlFor="activations">Activation</label>
              <div className="select">
                <select id="activations">
                  <option value="relu">ReLU</option>
                  <option value="tanh">Tanh</option>
                  <option value="sigmoid">Sigmoid</option>
                  <option value="linear">Linear</option>
                </select>
              </div>
            </div>
            <div className="control ui-regularization">
              <label htmlFor="regularizations">Regularization</label>
              <div className="select">
                <select id="regularizations">
                  <option value="none">None</option>
                  <option value="L1">L1</option>
                  <option value="L2">L2</option>
                </select>
              </div>
            </div>
            <div className="control ui-regularizationRate">
              <label htmlFor="regularRate">Regularization rate</label>
              <div className="select">
                <select id="regularRate">
                  <option value="0">0</option>
                  <option value="0.001">0.001</option>
                  <option value="0.003">0.003</option>
                  <option value="0.01">0.01</option>
                  <option value="0.03">0.03</option>
                  <option value="0.1">0.1</option>
                  <option value="0.3">0.3</option>
                  <option value="1">1</option>
                  <option value="3">3</option>
                  <option value="10">10</option>
                </select>
              </div>
            </div>
            <div className="control ui-problem">
              <label htmlFor="problem">Problem type</label>
              <div className="select">
                <select id="problem">
                  <option value="classification">Classification</option>
                  <option value="regression">Regression</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Part */}
        <div id="main-part" className="l--page">
          {/* Data Column */}
          <div className="column data">
            <h4>
              <span>Data</span>
            </h4>
            <div className="ui-dataset">
              <p>Which dataset do you want to use?</p>
              <div className="dataset-list">
                <div className="dataset" title="Circle">
                  <canvas
                    className="data-thumbnail"
                    data-dataset="circle"
                  ></canvas>
                </div>
                <div className="dataset" title="Exclusive or">
                  <canvas
                    className="data-thumbnail"
                    data-dataset="xor"
                  ></canvas>
                </div>
                <div className="dataset" title="Gaussian">
                  <canvas
                    className="data-thumbnail"
                    data-dataset="gauss"
                  ></canvas>
                </div>
                <div className="dataset" title="Spiral">
                  <canvas
                    className="data-thumbnail"
                    data-dataset="spiral"
                  ></canvas>
                </div>
                <div className="dataset" title="Plane">
                  <canvas
                    className="data-thumbnail"
                    data-regdataset="reg-plane"
                  ></canvas>
                </div>
                <div className="dataset" title="Multi gaussian">
                  <canvas
                    className="data-thumbnail"
                    data-regdataset="reg-gauss"
                  ></canvas>
                </div>
              </div>
            </div>
            <div>
              <div className="ui-percTrainData">
                <label htmlFor="percTrainData">
                  Ratio of training to test data:&nbsp;&nbsp;
                  <span className="value">XX</span>%
                </label>
                <p className="slider">
                  <input
                    className="mdl-slider mdl-js-slider"
                    type="range"
                    id="percTrainData"
                    min="10"
                    max="90"
                    step="10"
                  />
                </p>
              </div>
              <div className="ui-noise">
                <label htmlFor="noise">
                  Noise:&nbsp;&nbsp;<span className="value">XX</span>
                </label>
                <p className="slider">
                  <input
                    className="mdl-slider mdl-js-slider"
                    type="range"
                    id="noise"
                    min="0"
                    max="50"
                    step="5"
                  />
                </p>
              </div>
              <div className="ui-batchSize">
                <label htmlFor="batchSize">
                  Batch size:&nbsp;&nbsp;<span className="value">XX</span>
                </label>
                <p className="slider">
                  <input
                    className="mdl-slider mdl-js-slider"
                    type="range"
                    id="batchSize"
                    min="1"
                    max="30"
                    step="1"
                  />
                </p>
              </div>
              <button
                className="basic-button"
                id="data-regen-button"
                title="Regenerate data"
              >
                Regenerate
              </button>
            </div>
          </div>

          {/* Features Column */}
          <div className="column features">
            <h4>Features</h4>
            <p>Which properties do you want to feed in?</p>
            <div id="network">
              <svg id="svg" width="510" height="450">
                <defs>
                  <marker
                    id="markerArrow"
                    markerWidth="7"
                    markerHeight="13"
                    refX="1"
                    refY="6"
                    orient="auto"
                    markerUnits="userSpaceOnUse"
                  >
                    <path d="M2,11 L7,6 L2,2" />
                  </marker>
                </defs>
              </svg>
              {/* Hover card */}
              <div id="hovercard">
                <div style={{ fontSize: "10px" }}>Click anywhere to edit.</div>
                <div>
                  <span className="type">Weight/Bias</span> is{" "}
                  <span className="value">0.2</span>
                  <span>
                    <input type="number" />
                  </span>
                  .
                </div>
              </div>
              <div className="callout thumbnail">
                <svg viewBox="0 0 30 30">
                  <defs>
                    <marker
                      id="arrow"
                      markerWidth="5"
                      markerHeight="5"
                      refX="5"
                      refY="2.5"
                      orient="auto"
                      markerUnits="userSpaceOnUse"
                    >
                      <path d="M0,0 L5,2.5 L0,5 z" />
                    </marker>
                  </defs>
                  <path d="M12,30C5,20 2,15 12,0" markerEnd="url(#arrow)" />
                </svg>
                <div className="label">
                  This is the output from one <b>neuron</b>. Hover to see it
                  larger.
                </div>
              </div>
              <div className="callout weights">
                <svg viewBox="0 0 30 30">
                  <defs>
                    <marker
                      id="arrow2"
                      markerWidth="5"
                      markerHeight="5"
                      refX="5"
                      refY="2.5"
                      orient="auto"
                      markerUnits="userSpaceOnUse"
                    >
                      <path d="M0,0 L5,2.5 L0,5 z" />
                    </marker>
                  </defs>
                  <path d="M12,30C5,20 2,15 12,0" markerEnd="url(#arrow2)" />
                </svg>
                <div className="label">
                  The outputs are mixed with varying <b>weights</b>, shown by
                  the thickness of the lines.
                </div>
              </div>
            </div>
          </div>

          {/* Hidden Layers Column */}
          <div className="column hidden-layers">
            <h4>
              <div className="ui-numHiddenLayers">
                <button
                  id="add-layers"
                  className="mdl-button mdl-js-button mdl-button--icon"
                >
                  <i className="material-icons">add</i>
                </button>
                <button
                  id="remove-layers"
                  className="mdl-button mdl-js-button mdl-button--icon"
                >
                  <i className="material-icons">remove</i>
                </button>
              </div>
              <span id="num-layers"></span>
              <span id="layers-label"></span>
            </h4>
            <div className="bracket"></div>
          </div>

          {/* Output Column */}
          <div className="column output">
            <h4>Output</h4>
            <div className="metrics">
              <div className="output-stats ui-percTrainData">
                <span>Test loss</span>
                <div className="value" id="loss-test"></div>
              </div>
              <div className="output-stats train">
                <span>Training loss</span>
                <div className="value" id="loss-train"></div>
              </div>
              <div id="linechart"></div>
            </div>
            <div id="heatmap"></div>
            <div style={{ float: "left", marginTop: "20px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  className="label"
                  style={{ width: "105px", marginRight: "10px" }}
                >
                  Colors shows data, neuron and weight values.
                </div>
                <svg width="150" height="30" id="colormap">
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="100%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        stopColor="#E27136"
                        stopOpacity="1"
                      ></stop>
                      <stop
                        offset="50%"
                        stopColor="#e8eaeb"
                        stopOpacity="1"
                      ></stop>
                      <stop
                        offset="100%"
                        stopColor="#4EAF47"
                        stopOpacity="1"
                      ></stop>
                    </linearGradient>
                  </defs>
                  <g className="core" transform="translate(3, 0)">
                    <rect
                      width="144"
                      height="10"
                      style={{ fill: "url('#gradient')" }}
                    ></rect>
                  </g>
                </svg>
              </div>
              <br />
              <div style={{ display: "flex" }}>
                <label
                  className="ui-showTestData mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect"
                  htmlFor="show-test-data"
                >
                  <input
                    type="checkbox"
                    id="show-test-data"
                    className="mdl-checkbox__input"
                    defaultChecked={false}
                  />
                  <span className="mdl-checkbox__label label">
                    Show test data
                  </span>
                </label>
                <label
                  className="ui-discretize mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect"
                  htmlFor="discretize"
                >
                  <input
                    type="checkbox"
                    id="discretize"
                    className="mdl-checkbox__input"
                    defaultChecked={false}
                  />
                  <span className="mdl-checkbox__label label">
                    Discretize output
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default NeuralNetworkPlayground;
