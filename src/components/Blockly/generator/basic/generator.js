/**
 * @license
 *
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Define generation methods for custom blocks.
 * @author samelh@google.com (Sam El-Husseini)
 */

// More on generating code:
// https://developers.google.com/blockly/guides/create-custom-blocks/generating-code

import * as Blockly from "blockly/core";
import { javascriptGenerator } from "blockly/javascript";

/**
 * Arduino code generator.
 * @type !Blockly.Generator
 */
export const basicGenerator = new Blockly.CodeGenerator("Basic");
basicGenerator.ORDER_ATOMIC = 0;
basicGenerator.ORDER_NONE = 99;

/**
 *
 * @param {} workspace
 *
 * Blockly Types
 */

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
basicGenerator.init = function (workspace) {
  // creates a dictionary of modules / components that are used in the code
  basicGenerator.modules_ = Object.create(null);

  // creates a list of code to be setup before the setup block
  basicGenerator.setupCode_ = Object.create(null);

  // creates a list of code for the loop to be runned once
  basicGenerator.codeFunctions_ = Object.create(null);

  // creates a list of code variables
  basicGenerator.variables_ = Object.create(null);

  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  basicGenerator.functionNames_ = Object.create(null);

  basicGenerator.variablesInitCode_ = "";

  if (!basicGenerator.nameDB_) {
    basicGenerator.nameDB_ = new Blockly.Names(basicGenerator.RESERVED_WORDS_);
  } else {
    basicGenerator.nameDB_.reset();
  }

  basicGenerator.nameDB_.setVariableMap(workspace.getVariableMap());
};

/**
 * Fügt Code in den Setup-Bereich ein.
 *
 * @param {string} key   – eindeutiger Schlüssel, damit Code nicht doppelt erscheint
 * @param {string} code  – die konkrete Zeile Setup-Code
 */
basicGenerator.addSetup = function (key, code) {
  basicGenerator.setupCode_[key] = code;
};

basicGenerator.statementToCode = function (block, name) {
  const target = block.getInputTargetBlock(name);
  if (!target) return "";

  let code = "";
  let current = target;

  while (current) {
    const line = basicGenerator.blockToCode(current);

    if (Array.isArray(line)) {
      // Falls ein Valueblock "aus Versehen" hier landet
      code += line[0] + "\n";
    } else {
      code += line;
    }

    current = current.getNextBlock();
  }

  return code;
};

/**
 * finish — wird ausgeführt, nachdem alle Blöcke generiert wurden.
 * Fügt Setup-Code oben an, dann normalen Code unten.
 *
 * @param {string} code – Der generierte Code der Blöcke
 * @return {string} – finaler Output
 */
basicGenerator.finish = function (code) {
  const setup = Object.values(basicGenerator.setupCode_)
    .filter(Boolean)
    .join("\n");

  let finalCode = "";

  if (setup) {
    finalCode += setup + "\n";
  }

  finalCode += code;

  return finalCode;
};
