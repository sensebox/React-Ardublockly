/* Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0
 * https://github.com/tensorflow/playground
 *
 * Converted from TypeScript to JavaScript (type annotations removed).
 */

import * as d3 from "d3";

const NUM_SHADES = 30;

export class HeatMap {
  constructor(width, numSamples, xDomain, yDomain, container, userSettings) {
    this.settings = { showAxes: false, noSvg: false };
    this.numSamples = numSamples;
    let height = width;
    let padding = userSettings && userSettings.showAxes ? 20 : 0;

    if (userSettings != null) {
      for (let prop in userSettings) {
        this.settings[prop] = userSettings[prop];
      }
    }

    this.xScale = d3
      .scaleLinear()
      .domain(xDomain)
      .range([0, width - 2 * padding]);
    this.yScale = d3
      .scaleLinear()
      .domain(yDomain)
      .range([height - 2 * padding, 0]);

    let tmpScale = d3
      .scaleLinear()
      .domain([0, 0.5, 1])
      .range(["#E27136", "#e8eaeb", "#4EAF47"])
      .clamp(true);

    let colors = d3.range(0, 1 + 1e-9, 1 / NUM_SHADES).map((a) => tmpScale(a));
    this.color = d3.scaleQuantize().domain([-1, 1]).range(colors);

    container = container
      .append("div")
      .style("width", `${width}px`)
      .style("height", `${height}px`)
      .style("position", "relative")
      .style("top", `-${padding}px`)
      .style("left", `-${padding}px`);

    this.canvas = container
      .append("canvas")
      .attr("width", numSamples)
      .attr("height", numSamples)
      .style("width", width - 2 * padding + "px")
      .style("height", height - 2 * padding + "px")
      .style("position", "absolute")
      .style("top", `${padding}px`)
      .style("left", `${padding}px`);

    if (!this.settings.noSvg) {
      this.svg = container
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("position", "absolute")
        .style("left", "0")
        .style("top", "0")
        .append("g")
        .attr("transform", `translate(${padding},${padding})`);

      this.svg.append("g").attr("class", "train");
      this.svg.append("g").attr("class", "test");
    }

    if (this.settings.showAxes) {
      let xAxis = d3.axisBottom(this.xScale);
      let yAxis = d3.axisRight(this.yScale);

      this.svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${height - 2 * padding})`)
        .call(xAxis);

      this.svg
        .append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (width - 2 * padding) + ",0)")
        .call(yAxis);
    }
  }

  updateTestPoints(points) {
    if (this.settings.noSvg) {
      throw Error("Can't add points since noSvg=true");
    }
    this._updateCircles(this.svg.select("g.test"), points);
  }

  updatePoints(points) {
    if (this.settings.noSvg) {
      throw Error("Can't add points since noSvg=true");
    }
    this._updateCircles(this.svg.select("g.train"), points);
  }

  updateBackground(data, discretize) {
    let dx = data[0].length;
    let dy = data.length;

    if (dx !== this.numSamples || dy !== this.numSamples) {
      throw new Error(
        "The provided data matrix must be of size numSamples X numSamples",
      );
    }

    let context = this.canvas.node().getContext("2d");
    let image = context.createImageData(dx, dy);

    for (let y = 0, p = -1; y < dy; ++y) {
      for (let x = 0; x < dx; ++x) {
        let value = data[x][y];
        if (discretize) {
          value = value >= 0 ? 1 : -1;
        }
        let c = d3.rgb(this.color(value));
        image.data[++p] = c.r;
        image.data[++p] = c.g;
        image.data[++p] = c.b;
        image.data[++p] = 160;
      }
    }
    context.putImageData(image, 0, 0);
  }

  _updateCircles(container, points) {
    let xDomain = this.xScale.domain();
    let yDomain = this.yScale.domain();
    points = points.filter(
      (p) =>
        p.x >= xDomain[0] &&
        p.x <= xDomain[1] &&
        p.y >= yDomain[0] &&
        p.y <= yDomain[1],
    );

    let selection = container.selectAll("circle").data(points);
    let entered = selection.enter().append("circle").attr("r", 3);
    let merged = entered.merge(selection);
    merged
      .attr("cx", (d) => this.xScale(d.x))
      .attr("cy", (d) => this.yScale(d.y))
      .style("fill", (d) => this.color(d.label));
    selection.exit().remove();
  }
}

export function reduceMatrix(matrix, factor) {
  if (matrix.length !== matrix[0].length) {
    throw new Error("The provided matrix must be a square matrix");
  }
  if (matrix.length % factor !== 0) {
    throw new Error(
      "The width/height of the matrix must be divisible by the reduction factor",
    );
  }
  let result = new Array(matrix.length / factor);
  for (let i = 0; i < matrix.length; i += factor) {
    result[i / factor] = new Array(matrix.length / factor);
    for (let j = 0; j < matrix.length; j += factor) {
      let avg = 0;
      for (let k = 0; k < factor; k++) {
        for (let l = 0; l < factor; l++) {
          avg += matrix[i + k][j + l];
        }
      }
      avg /= factor * factor;
      result[i / factor][j / factor] = avg;
    }
  }
  return result;
}
