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
Blockly.Generator.Simulator = javascriptGenerator;

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
Blockly.Generator.Simulator.init = function (workspace) {
  // creates a dictionary of modules / components that are used in the code
  Blockly.Generator.Simulator.modules_ = Object.create(null);

  // creates a list of code to be setup before the setup block
  Blockly.Generator.Simulator.setupCode_ = Object.create(null);

  // creates a list of code for the loop to be runned once
  Blockly.Generator.Simulator.codeFunctions_ = Object.create(null);

  // creates a list of code variables
  Blockly.Generator.Simulator.variables_ = Object.create(null);

  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly.Generator.Simulator.functionNames_ = Object.create(null);

  Blockly.Generator.Simulator.variablesInitCode_ = "";

  if (!Blockly.Generator.Simulator.nameDB_) {
    Blockly.Generator.Simulator.nameDB_ = new Blockly.Names(
      Blockly.Generator.Simulator.RESERVED_WORDS_,
    );
  } else {
    Blockly.Generator.Simulator.nameDB_.reset();
  }

  Blockly.Generator.Simulator.nameDB_.setVariableMap(
    workspace.getVariableMap(),
  );
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.Generator.Simulator.finish = function (code) {
  const setupCode =
    Object.values(Blockly.Generator.Simulator.setupCode_).join("\n") || "";

  const modules =
    Object.values(Blockly.Generator.Simulator?.modules_).join(", ") || "";

  const loopCode = `while (true) {
${code}}`;

  const simCode = `
// modules: ${modules} #
${setupCode}
${loopCode}`;

  console.log(Blockly.Generator.Simulator.formatCode(simCode));

  return Blockly.Generator.Simulator.formatCode(simCode);
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.Generator.Simulator.scrubNakedValue = function (line) {
  return line + ";\n";
};

/**
 * Format the generated Arduino code for better readability.
 * This function adds proper indentation and removes duplicate empty lines.
 * @param {string} code The Arduino code to format.
 * @return {string} Formatted Arduino code.
 */
Blockly.Generator.Simulator.formatCode = function (code) {
  let formattedCode = "";
  let indentLevel = 0;
  const indentSize = 2; // Number of spaces per indentation level
  let previousLineWasEmpty = false; // Track if the previous line was empty

  const lines = code.split("\n");

  lines.forEach((line) => {
    line = line.trim();

    // Skip duplicate empty lines
    if (line === "" && previousLineWasEmpty) {
      return; // Skip this line if it's an empty line after another empty line
    }

    // Mark if the current line is empty
    previousLineWasEmpty = line === "";

    // Adjust indentation for closing braces
    if (line.startsWith("}")) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    // Special case for 'else if' and 'else' to ensure they align with 'if'
    if (line.startsWith("else if") || line.startsWith("else")) {
      formattedCode += " ".repeat(indentLevel * indentSize) + line + "\n";
    } else {
      // Add the appropriate indentation for normal lines
      formattedCode += " ".repeat(indentLevel * indentSize) + line + "\n";
    }

    // Increase indentation after opening braces
    if (line.endsWith("{")) {
      indentLevel++;
    }
  });

  // Remove any trailing empty lines
  return formattedCode.replace(/\n\s*\n\s*\n/g, "\n\n").trim();
};

/**
 * Encode a string as a properly escaped Arduino string, complete with
 * quotes.
 * @param {string} string Text to encode.
 * @return {string} Arduino string.
 * @private
 */
Blockly.Generator.Simulator.quote_ = function (string) {
  // Can't use goog.string.quote since Google's style guide recommends
  // JS string literals use single quotes.
  string = string
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\\n")
    .replace(/'/g, "\\'");
  return '"' + string + '"';
};

/**
 * Common tasks for generating Arduino from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Arduino code created for this block.
 * @param {boolean=} opt_thisOnly True to generate code for only this statement.
 * @return {string} Arduino code with comments and subsequent blocks added.
 * @private
 */
Blockly.Generator.Simulator.scrub_ = function (block, code) {
  let commentCode = "";
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    let comment = block.getCommentText();
    //@ts-ignore
    comment = comment
      ? Blockly.utils.string.wrap(
          comment,
          Blockly.Generator.Simulator.COMMENT_WRAP - 3,
        )
      : null;
    if (comment) {
      if (block.getProcedureDef) {
        // Use a comment block for function comments.
        commentCode +=
          "/**\n" +
          Blockly.Generator.Simulator.prefixLines(comment + "\n", " * ") +
          " */\n";
      } else {
        commentCode += Blockly.Generator.Simulator.prefixLines(
          comment + "\n",
          "// ",
        );
      }
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (let i = 0; i < block.inputList.length; i++) {
      if (block.inputList[i].type === Blockly.INPUT_VALUE) {
        const childBlock = block.inputList[i].connection.targetBlock();
        if (childBlock) {
          const comment =
            Blockly.Generator.Simulator.allNestedComments(childBlock);
          if (comment) {
            commentCode += Blockly.Generator.Simulator.prefixLines(
              comment,
              "// ",
            );
          }
        }
      }
    }
  }
  const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  const nextCode = Blockly.Generator.Simulator.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};