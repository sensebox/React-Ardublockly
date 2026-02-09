import * as Blockly from "blockly/core";

/**
 * Code generator to add code into the setup() and loop() functions.
 * Its use is not mandatory, but necessary to add manual code to setup().
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */

Blockly.Generator.Arduino.forBlock["arduino_functions"] = function (
  block,
  generator,
) {
  var board = window.sessionStorage.getItem("board");
  if (board === "MCU" || board === "MCU:MINI") {
    Blockly.Generator.Arduino.libraries_["library_senseBoxIO"] =
      "#include <senseBoxIO.h>";
  }
  // Edited version of Blockly.Generator.prototype.statementToCode
  function statementToCodeNoTab(block, name) {
    var targetBlock = block.getInputTargetBlock(name);
    var code = Blockly.Generator.Arduino.blockToCode(targetBlock);
    if (typeof code != "string") {
      throw new Error(
        'Expecting code from statement block "' + targetBlock.type + '".',
      );
    }
    return code;
  }

  var setupBranch = Blockly.Generator.Arduino.statementToCode(
    block,
    "SETUP_FUNC",
  );
  // //var setupCode = Blockly.Generator.Arduino.scrub_(block, setupBranch); No comment block
  if (setupBranch) {
    Blockly.Generator.Arduino.setupCode_["mainsetup"] = setupBranch;
  }

  var loopBranch = statementToCodeNoTab(block, "LOOP_FUNC");
  //var loopcode = Blockly.Generator.Arduino.scrub_(block, loopBranch); No comment block
  return loopBranch;
};

Blockly.Generator.Arduino.forBlock["procedures_defreturn"] = function (
  block,
  generator,
) {
  // Define a procedure with a return value.
  const funcName = Blockly.Generator.Arduino.nameDB_.getName(
    block.getFieldValue("NAME"),
    Blockly.Procedures.NAME_TYPE,
  );
  const branch = Blockly.Generator.Arduino.statementToCode(block, "STACK");
  const returnType = block.getFieldValue("RETURN TYPE") || "void";

  let returnValue =
    Blockly.Generator.Arduino.valueToCode(
      block,
      "RETURN",
      Blockly.Generator.Arduino.ORDER_NONE,
    ) || "";
  if (returnValue) {
    returnValue =
      Blockly.Generator.Arduino.INDENT + "return " + returnValue + ";\n";
  }
  const args = [];
  for (let i = 0; i < block.argumentVarModels_.length; i++) {
    args[i] =
      translateType(block.argumentVarModels_[i].type) +
      " " +
      block.argumentVarModels_[i].name;
  }
  let code =
    translateType(returnType) +
    " " +
    funcName +
    "(" +
    args.join(", ") +
    ") {\n" +
    branch +
    returnValue +
    "}";
  code = Blockly.Generator.Arduino.scrub_(block, code);
  // Add % so as not to collide with helper functions in definitions list.
  Blockly.Generator.Arduino.functionNames_["%" + funcName] = code;
  return null;
};

function translateType(type) {
  switch (type) {
    case "int":
      return "int";
    case "String":
      return "String";
    case "void":
      return "void";
    case "boolean":
      return "boolean";
    case "float":
      return "float";
    default:
      throw new Error("Invalid Parameter Type");
  }
}

Blockly.Generator.Arduino.forBlock["procedures_defnoreturn"] = function (
  block,
  generator,
) {
  // Define a procedure with a return value.
  const funcName = Blockly.Generator.Arduino.nameDB_.getName(
    block.getFieldValue("NAME"),
    Blockly.Procedures.NAME_TYPE,
  );
  const branch = Blockly.Generator.Arduino.statementToCode(block, "STACK");
  const returnType = "void";

  const args = [];
  for (let i = 0; i < block.argumentVarModels_.length; i++) {
    args[i] =
      translateType(block.argumentVarModels_[i].type) +
      " " +
      block.argumentVarModels_[i].name;
  }
  let code =
    translateType(returnType) +
    " " +
    funcName +
    "(" +
    args.join(", ") +
    ") {\n" +
    branch +
    "}";
  code = Blockly.Generator.Arduino.scrub_(block, code);
  // Add % so as not to collide with helper functions in definitions list.
  Blockly.Generator.Arduino.functionNames_["%" + funcName] = code;
  return null;
};

Blockly.Generator.Arduino.forBlock["procedures_callreturn"] = function (
  block,
  generator,
) {
  // Call a procedure with a return value.
  const funcName = Blockly.Generator.Arduino.nameDB_.getName(
    block.getFieldValue("NAME"),
    Blockly.Procedures.NAME_TYPE,
  );
  const args = [];
  for (let i = 0; i < block.arguments_.length; i++) {
    args[i] =
      Blockly.Generator.Arduino.valueToCode(
        block,
        "ARG" + i,
        Blockly.Generator.Arduino.ORDER_COMMA,
      ) || "null";
  }
  const code = funcName + "(" + args.join(", ") + ")";
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

Blockly.Generator.Arduino.forBlock["procedures_callnoreturn"] = function (
  block,
  generator,
) {
  // Call a procedure with no return value.
  const funcName = Blockly.Generator.Arduino.nameDB_.getName(
    block.getFieldValue("NAME"),
    Blockly.Procedures.NAME_TYPE,
  );
  const args = [];
  for (let i = 0; i < block.arguments_.length; i++) {
    args[i] =
      Blockly.Generator.Arduino.valueToCode(
        block,
        "ARG" + i,
        Blockly.Generator.Arduino.ORDER_COMMA,
      ) || "null";
  }

  return funcName + "(" + args.join(", ") + ");\n";
};
