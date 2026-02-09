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
import { reservedWords } from "@/components/Blockly/helpers/reservedWords";

import store from "@/store";

var ota = store.getState().general.platform
  ? store.getState().general.platform
  : null;
var board = store.getState().board.board ? store.getState().board.board : null;
store.subscribe(() => {
  ota = store.getState().general.platform
    ? store.getState().general.platform
    : null;
  board = store.getState().board.board ? store.getState().board.board : null;
});

/**
 * Arduino code generator.
 * @type !Blockly.Generator
 */
Blockly.Generator.Arduino = new Blockly.Generator("Arduino");

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly.Generator.Arduino.addReservedWords(reservedWords);

/**
 * Order of operation ENUMs.
 *
 */
Blockly.Generator.Arduino.ORDER_ATOMIC = 0; // 0 "" ...
Blockly.Generator.Arduino.ORDER_UNARY_POSTFIX = 1; // expr++ expr-- () [] .
Blockly.Generator.Arduino.ORDER_UNARY_PREFIX = 2; // -expr !expr ~expr ++expr --expr
Blockly.Generator.Arduino.ORDER_MULTIPLICATIVE = 3; // * / % ~/
Blockly.Generator.Arduino.ORDER_ADDITIVE = 4; // + -
Blockly.Generator.Arduino.ORDER_LOGICAL_NOT = 4.4; // !
Blockly.Generator.Arduino.ORDER_SHIFT = 5; // << >>
Blockly.Generator.Arduino.ORDER_MODULUS = 5.3; // %
Blockly.Generator.Arduino.ORDER_RELATIONAL = 6; // is is! >= > <= <
Blockly.Generator.Arduino.ORDER_EQUALITY = 7; // === !== === !==
Blockly.Generator.Arduino.ORDER_BITWISE_AND = 8; // &
Blockly.Generator.Arduino.ORDER_BITWISE_XOR = 9; // ^
Blockly.Generator.Arduino.ORDER_BITWISE_OR = 10; // |
Blockly.Generator.Arduino.ORDER_LOGICAL_AND = 11; // &&
Blockly.Generator.Arduino.ORDER_LOGICAL_OR = 12; // ||
Blockly.Generator.Arduino.ORDER_CONDITIONAL = 13; // expr ? expr : expr
Blockly.Generator.Arduino.ORDER_ASSIGNMENT = 14; // = *= /= ~/= %= += -= <<= >>= &= ^= |=
Blockly.Generator.Arduino.ORDER_COMMA = 18; // ,
Blockly.Generator.Arduino.ORDER_NONE = 99; // (...)

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
Blockly.Generator.Arduino.init = function (workspace) {
  // Create a dictionary of definitions to be printed before the code.
  Blockly.Generator.Arduino.libraries_ = Object.create(null);

  Blockly.Generator.Arduino.definitions_ = Object.create(null);

  // creates a list of code to be setup before the setup block
  Blockly.Generator.Arduino.preSetupCode_ = Object.create(null);

  // creates a list of code to be setup before the setup block
  Blockly.Generator.Arduino.setupCode_ = Object.create(null);

  // creates a list of phyphox code to be in the setup block
  Blockly.Generator.Arduino.phyphoxSetupCode_ = Object.create(null);

  // creates a list of lora code to be in the setup block
  Blockly.Generator.Arduino.loraSetupCode_ = Object.create(null);

  // creates a list of code for the loop to be runned once
  Blockly.Generator.Arduino.loopCodeOnce_ = Object.create(null);

  // creates a list of code for the loop to be runned once
  Blockly.Generator.Arduino.codeFunctions_ = Object.create(null);

  // creates a list of code variables
  Blockly.Generator.Arduino.variables_ = Object.create(null);

  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly.Generator.Arduino.functionNames_ = Object.create(null);

  Blockly.Generator.Arduino.variablesInitCode_ = "";

  if (!Blockly.Generator.Arduino.nameDB_) {
    Blockly.Generator.Arduino.nameDB_ = new Blockly.Names(
      Blockly.Generator.Arduino.RESERVED_WORDS_,
    );
  } else {
    Blockly.Generator.Arduino.nameDB_.reset();
  }

  Blockly.Generator.Arduino.nameDB_.setVariableMap(workspace.getVariableMap());

  // We don't have developer variables for now
  // // Add developer variables (not created or named by the user).
  // var devVarList = Blockly.Variables.allDeveloperVariables(workspace);
  // for (var i = 0; i < devVarList.length; i++) {
  //     defvars.push(Blockly['Arduino'].nameDB_.getName(devVarList[i],
  //         Blockly.Names.DEVELOPER_VARIABLE_TYPE));
  // }
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.Generator.Arduino.finish = function (code) {
  let commentCode = "";
  let libraryCode = "";
  let variablesCode = "";
  let codeFunctions = "";
  let functionsCode = "";
  let definitionsCode = "";
  let phyphoxSetupCode = "";
  let loopCodeOnce = "";
  let setupCode = "";
  let preSetupCode = "";
  let mainSetupCode = "";
  let loraSetupCode = "";
  let devVariables = "\n";

  commentCode = "// Code generated by senseBox Blockly on " + new Date();
  for (const key in Blockly.Generator.Arduino.libraries_) {
    libraryCode += Blockly.Generator.Arduino.libraries_[key] + "\n";
  }

  for (const key in Blockly.Generator.Arduino.variables_) {
    variablesCode += Blockly.Generator.Arduino.variables_[key] + "\n";
  }

  for (const key in Blockly.Generator.Arduino.definitions_) {
    definitionsCode += Blockly.Generator.Arduino.definitions_[key] + "\n";
  }

  for (const key in Blockly.Generator.Arduino.loopCodeOnce_) {
    loopCodeOnce += Blockly.Generator.Arduino.loopCodeOnce_[key] + "\n";
  }

  for (const key in Blockly.Generator.Arduino.codeFunctions_) {
    codeFunctions += Blockly.Generator.Arduino.codeFunctions_[key] + "\n";
  }

  for (const key in Blockly.Generator.Arduino.functionNames_) {
    functionsCode += Blockly.Generator.Arduino.functionNames_[key] + "\n";
  }

  if (Blockly.Generator.Arduino.preSetupCode_["Wire.begin"]) {
    preSetupCode +=
      Blockly.Generator.Arduino.preSetupCode_["Wire.begin"] + "\n";
    if (Blockly.Generator.Arduino.preSetupCode_["vl53l8cx_clock_address"]) {
      preSetupCode +=
        Blockly.Generator.Arduino.preSetupCode_["vl53l8cx_clock_address"] +
        "\n";
    }
  }

  for (const key in Blockly.Generator.Arduino.setupCode_) {
    mainSetupCode += Blockly.Generator.Arduino.setupCode_[key] + "\n" || "";
  }

  for (const key in Blockly.Generator.Arduino.loraSetupCode_) {
    loraSetupCode += Blockly.Generator.Arduino.loraSetupCode_[key] + "\n" || "";
  }

  for (const key in Blockly.Generator.Arduino.phyphoxSetupCode_) {
    phyphoxSetupCode +=
      Blockly.Generator.Arduino.phyphoxSetupCode_[key] + "\n" || "";
  }

  setupCode =
    "\nvoid setup() { \n" +
    preSetupCode +
    "\n" +
    mainSetupCode +
    "\n" +
    phyphoxSetupCode +
    "\n" +
    loraSetupCode +
    "\n}\n";

  let loopCode = "\nvoid loop() { \n" + loopCodeOnce + code + "\n}\n";
  // only add OTA code if tablet mode is enabled
  if (ota === true && board !== "MCU-S2") {
    code =
      commentCode +
      "\n" +
      devVariables +
      "\n" +
      "#include <SenseBoxOTA.h>" +
      "\n" +
      libraryCode +
      "\n" +
      variablesCode +
      "\n" +
      definitionsCode +
      "\n" +
      codeFunctions +
      "\n" +
      Blockly.Generator.Arduino.variablesInitCode_ +
      "\n" +
      functionsCode +
      "\n" +
      setupCode +
      "\n" +
      loopCode;
  } else {
    // Convert the definitions dictionary into a list.
    code =
      commentCode +
      "\n" +
      devVariables +
      "\n" +
      libraryCode +
      "\n" +
      variablesCode +
      "\n" +
      definitionsCode +
      "\n" +
      codeFunctions +
      "\n" +
      Blockly.Generator.Arduino.variablesInitCode_ +
      "\n" +
      functionsCode +
      "\n" +
      setupCode +
      "\n" +
      loopCode;
  }

  // Clean up temporary data.
  delete Blockly.Generator.Arduino.definitions_;
  delete Blockly.Generator.Arduino.functionNames_;
  delete Blockly.Generator.Arduino.loopCodeOnce_;
  delete Blockly.Generator.Arduino.variablesInitCode_;
  delete Blockly.Generator.Arduino.libraries_;
  Blockly.Generator.Arduino.nameDB_.reset();

  return Blockly.Generator.Arduino.formatCode(code);
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.Generator.Arduino.scrubNakedValue = function (line) {
  return line + ";\n";
};

/**
 * Format the generated Arduino code for better readability.
 * This function adds proper indentation and removes duplicate empty lines.
 * @param {string} code The Arduino code to format.
 * @return {string} Formatted Arduino code.
 */
Blockly.Generator.Arduino.formatCode = function (code) {
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
Blockly.Generator.Arduino.quote_ = function (string) {
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

Blockly.Generator.Arduino.scrub_ = function (block, code) {
  let commentCode = "";
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    let comment = block.getCommentText();
    //@ts-ignore
    comment = comment
      ? Blockly.utils.string.wrap(
          comment,
          Blockly.Generator.Arduino.COMMENT_WRAP - 3,
        )
      : null;
    if (comment) {
      if (block.getProcedureDef) {
        // Use a comment block for function comments.
        commentCode +=
          "/**\n" +
          Blockly.Generator.Arduino.prefixLines(comment + "\n", " * ") +
          " */\n";
      } else {
        commentCode += Blockly.Generator.Arduino.prefixLines(
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
            Blockly.Generator.Arduino.allNestedComments(childBlock);
          if (comment) {
            commentCode += Blockly.Generator.Arduino.prefixLines(
              comment,
              "// ",
            );
          }
        }
      }
    }
  }
  const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  const nextCode = Blockly.Generator.Arduino.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};
