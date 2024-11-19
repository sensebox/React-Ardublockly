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

/**
 * Arduino code generator.
 * @type !Blockly.Generator
 */
Blockly["Simulator"] = new Blockly.Generator("Simulator");

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly["Simulator"].addReservedWords(
  // JavaScript reserved words
  "abstract,arguments,await,boolean,break,byte,case,catch,char,class,const," +
    "continue,debugger,default,delete,do,double,else,enum,eval,export,extends," +
    "false,final,finally,float,for,function,goto,if,implements,import,in," +
    "instanceof,int,interface,let,long,native,new,null,package," +
    "private,protected,public,return,short,static,super,switch,synchronized," +
    "this,throw,throws,transient,true,try,typeof,var,void,volatile,while,with,yield," +
    // JavaScript global functions and properties
    "Infinity,NaN,undefined,isFinite,isNaN,parseFloat,parseInt,decodeURI," +
    "decodeURIComponent,encodeURI,encodeURIComponent,escape,unescape," +
    // JavaScript built-ins
    "Array,Date,eval,Function,hasOwnProperty,Infinity,isFinite,isNaN," +
    "isPrototypeOf,length,Math,NaN,name,Number,Object,prototype,String," +
    "toString,undefined,valueOf",
);

/**
 * Order of operation ENUMs.
 *
 */
Blockly["Simulator"].ORDER_ATOMIC = 0; // 0 "" ...
Blockly["Simulator"].ORDER_UNARY_POSTFIX = 1; // expr++ expr-- () [] .
Blockly["Simulator"].ORDER_UNARY_PREFIX = 2; // -expr !expr ~expr ++expr --expr
Blockly["Simulator"].ORDER_MULTIPLICATIVE = 3; // * / % ~/
Blockly["Simulator"].ORDER_ADDITIVE = 4; // + -
Blockly["Simulator"].ORDER_LOGICAL_NOT = 4.4; // !
Blockly["Simulator"].ORDER_SHIFT = 5; // << >>
Blockly["Simulator"].ORDER_MODULUS = 5.3; // %
Blockly["Simulator"].ORDER_RELATIONAL = 6; // is is! >= > <= <
Blockly["Simulator"].ORDER_EQUALITY = 7; // === !== === !==
Blockly["Simulator"].ORDER_BITWISE_AND = 8; // &
Blockly["Simulator"].ORDER_BITWISE_XOR = 9; // ^
Blockly["Simulator"].ORDER_BITWISE_OR = 10; // |
Blockly["Simulator"].ORDER_LOGICAL_AND = 11; // &&
Blockly["Simulator"].ORDER_LOGICAL_OR = 12; // ||
Blockly["Simulator"].ORDER_CONDITIONAL = 13; // expr ? expr : expr
Blockly["Simulator"].ORDER_ASSIGNMENT = 14; // = *= /= ~/= %= += -= <<= >>= &= ^= |=
Blockly["Simulator"].ORDER_COMMA = 18; // ,
Blockly["Simulator"].ORDER_NONE = 99; // (...)

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
Blockly["Simulator"].init = function (workspace) {
  // Create a dictionary of definitions to be printed before the code.
  Blockly["Simulator"].libraries_ = Object.create(null);

  Blockly["Simulator"].definitions_ = Object.create(null);

  // creates a list of code to be setup before the setup block
  Blockly["Simulator"].setupCode_ = Object.create(null);

  // creates a list of code to be setup before the setup block
  Blockly["Simulator"].phyphoxSetupCode_ = Object.create(null);

  // creates a list of code to be setup before the setup block
  Blockly["Simulator"].loraSetupCode_ = Object.create(null);

  // creates a list of code for the loop to be runned once
  Blockly["Simulator"].loopCodeOnce_ = Object.create(null);

  // creates a list of code for the loop to be runned once
  Blockly["Simulator"].codeFunctions_ = Object.create(null);

  // creates a list of code variables
  Blockly["Simulator"].variables_ = Object.create(null);

  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly["Simulator"].functionNames_ = Object.create(null);

  Blockly["Simulator"].variablesInitCode_ = "";

  if (!Blockly["Simulator"].nameDB_) {
    Blockly["Simulator"].nameDB_ = new Blockly.Names(
      Blockly["Simulator"].RESERVED_WORDS_,
    );
  } else {
    Blockly["Simulator"].nameDB_.reset();
  }

  Blockly["Simulator"].nameDB_.setVariableMap(workspace.getVariableMap());

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
Blockly["Simulator"].finish = function (code) {
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
  let loraSetupCode = "";
  let devVariables = "\n";

  commentCode =
    "// Simulator code generated by senseBox Blockly on " + new Date();
  for (const key in Blockly["Simulator"].libraries_) {
    libraryCode += Blockly["Simulator"].libraries_[key] + "\n";
  }

  for (const key in Blockly["Simulator"].variables_) {
    variablesCode += Blockly["Simulator"].variables_[key] + "\n";
  }

  for (const key in Blockly["Simulator"].definitions_) {
    definitionsCode += Blockly["Simulator"].definitions_[key] + "\n";
  }

  for (const key in Blockly["Simulator"].loopCodeOnce_) {
    loopCodeOnce += Blockly["Simulator"].loopCodeOnce_[key] + "\n";
  }

  for (const key in Blockly["Simulator"].codeFunctions_) {
    codeFunctions += Blockly["Simulator"].codeFunctions_[key] + "\n";
  }

  for (const key in Blockly["Simulator"].functionNames_) {
    functionsCode += Blockly["Simulator"].functionNames_[key] + "\n";
  }

  for (const key in Blockly["Simulator"].setupCode_) {
    preSetupCode += Blockly["Simulator"].setupCode_[key] + "\n" || "";
  }

  for (const key in Blockly["Simulator"].loraSetupCode_) {
    loraSetupCode += Blockly["Simulator"].loraSetupCode_[key] + "\n" || "";
  }

  setupCode =
    "\nvoid setup() { \n" + preSetupCode + "\n" + loraSetupCode + "\n}\n";
  for (const key in Blockly["Simulator"].phyphoxSetupCode_) {
    phyphoxSetupCode +=
      Blockly["Simulator"].phyphoxSetupCode_[key] + "\n" || "";
  }

  setupCode =
    "\nvoid setup() { \n" +
    preSetupCode +
    "\n" +
    phyphoxSetupCode +
    "\n" +
    loraSetupCode +
    "\n}\n";

  let loopCode = "\nvoid loop() { \n" + loopCodeOnce + code + "\n}\n";

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
    Blockly["Simulator"].variablesInitCode_ +
    "\n" +
    functionsCode +
    "\n" +
    setupCode +
    "\n" +
    loopCode;

  // Clean up temporary data.
  delete Blockly["Simulator"].definitions_;
  delete Blockly["Simulator"].functionNames_;
  delete Blockly["Simulator"].loopCodeOnce_;
  delete Blockly["Simulator"].variablesInitCode_;
  delete Blockly["Simulator"].libraries_;
  Blockly["Simulator"].nameDB_.reset();

  return Blockly["Simulator"].formatCode(code);
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly["Simulator"].scrubNakedValue = function (line) {
  return line + ";\n";
};

/**
 * Format the generated Arduino code for better readability.
 * This function adds proper indentation and removes duplicate empty lines.
 * @param {string} code The Arduino code to format.
 * @return {string} Formatted Arduino code.
 */
Blockly["Simulator"].formatCode = function (code) {
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
Blockly["Simulator"].quote_ = function (string) {
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
Blockly["Simulator"].scrub_ = function (block, code) {
  let commentCode = "";
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    let comment = block.getCommentText();
    //@ts-ignore
    comment = comment
      ? Blockly.utils.string.wrap(
          comment,
          Blockly["Simulator"].COMMENT_WRAP - 3,
        )
      : null;
    if (comment) {
      if (block.getProcedureDef) {
        // Use a comment block for function comments.
        commentCode +=
          "/**\n" +
          Blockly["Simulator"].prefixLines(comment + "\n", " * ") +
          " */\n";
      } else {
        commentCode += Blockly["Simulator"].prefixLines(comment + "\n", "// ");
      }
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (let i = 0; i < block.inputList.length; i++) {
      if (block.inputList[i].type === Blockly.INPUT_VALUE) {
        const childBlock = block.inputList[i].connection.targetBlock();
        if (childBlock) {
          const comment = Blockly["Simulator"].allNestedComments(childBlock);
          if (comment) {
            commentCode += Blockly["Simulator"].prefixLines(comment, "// ");
          }
        }
      }
    }
  }
  const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  const nextCode = Blockly["Simulator"].blockToCode(nextBlock);
  return commentCode + code + nextCode;
};
