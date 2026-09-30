/**
 * @fileoverview JavaScript code generator for the in-browser simulator.
 *
 * The generated program runs in js-interpreter (see
 * src/components/Simulator/runtime.js). Its first line lists the modules
 * (sensors, display, ...) used by the program, e.g.
 * `// modules: senseBox_hdc1080, senseBox_display #`. The simulator reads
 * this line to decide which components to show next to the board.
 */

import * as Blockly from "blockly/core";
import { JavascriptGenerator, javascriptGenerator } from "blockly/javascript";

/**
 * Own generator instance, so that other users of Blockly's shared
 * `javascriptGenerator` are not affected by the overrides below.
 */
export const simulatorGenerator = new JavascriptGenerator("Simulator");

// Standard blocks (logic, loops, math, text, variables, ...) use the stock
// JavaScript generators. The files in this folder add or override the rest.
Object.assign(simulatorGenerator.forBlock, javascriptGenerator.forBlock);

// Legacy alias used by the block generators in this folder.
Blockly.Generator.Simulator = simulatorGenerator;

/**
 * Native functions provided by the simulator runtime
 * (src/components/Simulator/init). Reserving them keeps user variables from
 * shadowing them.
 */
simulatorGenerator.addReservedWords(
  [
    "delay",
    "random",
    "log",
    "drawText",
    "clearDisplay",
    "neopixel",
    "toggleLED",
    "isPressed",
    "wasPressed",
    "longPress",
    "toggleButton",
    "readTemperature",
    "readHumidity",
    "readIlluminance",
    "readUvIntensity",
    "readPhotodiode",
    "readWaterTemperature",
    "readUltrasonicDistance",
    "readDistance",
    "readSoilTemperature",
    "readSoilMoisture",
    "readTemperatureBME680",
    "readHumidityBME680",
    "readPressureBME680",
    "readIAQBME680",
    "readIAQAccuracyBME680",
    "readCO2EquivalentBME680",
    "readBreathVOCEquivalentBME680",
    "readCO2SCD30",
    "readTemperatureSCD30",
    "readHumiditySCD30",
    "readTemperatureDPS310",
    "readPressureDPS310",
    "readAltitudeDPS310",
    "readAccelerationX",
    "readAccelerationY",
    "readAccelerationZ",
    "readTemperatureAccelerometer",
    "readPM25SDS011",
    "readPM10SDS011",
    "readPM1SPS30",
    "readPM25SPS30",
    "readPM4SPS30",
    "readPM10SPS30",
    "getTotalAccumulation",
    "getRainfallIntensity",
  ].join(","),
);

/**
 * Initialise the generator state for a new run.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
simulatorGenerator.init = function (workspace) {
  // Sets up definitions_, the name database and the variable declarations.
  JavascriptGenerator.prototype.init.call(this, workspace);

  // Modules (sensors, display, ...) used by the program.
  this.modules_ = Object.create(null);

  // Code that runs once before the loop.
  this.setupCode_ = Object.create(null);

  // Blocks that the simulator cannot run, keyed by block type.
  this.unsupportedBlocks_ = new Map();
};

/**
 * Text that identifies a block for the user, e.g. "Temperatur/Luftfeuchte".
 * @param {!Blockly.Block} block
 * @return {string}
 */
function getBlockLabel(block) {
  const firstRow = block.inputList[0]?.fieldRow ?? [];
  const label = firstRow
    .map((field) => field.getText())
    .join(" ")
    .trim();
  return label || block.type;
}

/**
 * Remember that a block (or one of its options) cannot be simulated.
 * @param {!Blockly.Block} block
 * @param {string=} detail Optional text, e.g. the unsupported option.
 */
simulatorGenerator.markUnsupported = function (block, detail) {
  const key = detail ? `${block.type}:${detail}` : block.type;
  if (!this.unsupportedBlocks_?.has(key)) {
    const label = getBlockLabel(block);
    this.unsupportedBlocks_?.set(key, detail ? `${label}: ${detail}` : label);
  }
};

/**
 * Labels of all blocks that were skipped during the last generation.
 * @return {!Array<string>}
 */
simulatorGenerator.getUnsupportedBlockLabels = function () {
  return Array.from(this.unsupportedBlocks_?.values() ?? []);
};

/**
 * Blocks without a simulator generator are skipped instead of aborting the
 * whole generation, so the rest of the program can still be simulated.
 */
simulatorGenerator.blockToCode = function (block, opt_thisOnly) {
  if (
    block &&
    block.isEnabled() &&
    !block.isInsertionMarker() &&
    typeof this.forBlock[block.type] !== "function"
  ) {
    this.markUnsupported(block);
    if (block.outputConnection) {
      return ["0", this.ORDER_ATOMIC];
    }
    return opt_thisOnly ? "" : this.blockToCode(block.getNextBlock());
  }
  return JavascriptGenerator.prototype.blockToCode.call(
    this,
    block,
    opt_thisOnly,
  );
};

/**
 * Wrap the generated loop code into the simulator program.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
simulatorGenerator.finish = function (code) {
  const modules = Object.values(this.modules_).join(", ");
  const setupCode = Object.values(this.setupCode_).join("\n");

  // JavascriptGenerator.finish prepends the definitions (variables, helper
  // functions, user functions) and resets the generator.
  const program = JavascriptGenerator.prototype.finish.call(
    this,
    `${setupCode}\nwhile (true) {\n${code}}`,
  );

  return this.formatCode(`// modules: ${modules} #\n${program}`);
};

/**
 * Format the generated code for better readability.
 * Adds proper indentation and removes duplicate empty lines.
 * @param {string} code The code to format.
 * @return {string} Formatted code.
 */
simulatorGenerator.formatCode = function (code) {
  let formattedCode = "";
  let indentLevel = 0;
  const indentSize = 2;
  let previousLineWasEmpty = false;

  code.split("\n").forEach((rawLine) => {
    const line = rawLine.trim();

    // Skip duplicate empty lines
    if (line === "" && previousLineWasEmpty) {
      return;
    }
    previousLineWasEmpty = line === "";

    // Adjust indentation for closing braces
    if (line.startsWith("}")) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    formattedCode += " ".repeat(indentLevel * indentSize) + line + "\n";

    // Increase indentation after opening braces
    if (line.endsWith("{")) {
      indentLevel++;
    }
  });

  return formattedCode.replace(/\n\s*\n\s*\n/g, "\n\n").trim();
};
