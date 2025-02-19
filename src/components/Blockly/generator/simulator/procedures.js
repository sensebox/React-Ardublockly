import * as Blockly from "blockly/core";

/**
 * Code generator to add code into the setup() and loop() functions.
 * Its use is not mandatory, but necessary to add manual code to setup().
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */

Blockly.Generator.Simulator.forBlock["arduino_functions"] = function (block) {
  // Ensure libraries_ object exists
  if (!Blockly.Generator.Simulator.libraries_) {
    Blockly.Generator.Simulator.libraries_ = Object.create(null);
  }

  // Safely set library
  try {
    Blockly.Generator.Simulator.libraries_["library_senseBoxIO"] =
      "#include <SenseBoxIO.h>";
  } catch (err) {
    console.warn("Could not set library_senseBoxIO");
  }

  var board = window.sessionStorage.getItem("board");

  if (board === "mcu" || board === "mini") {
    Blockly.Generator.Simulator.libraries_["library_senseBoxIO"] =
      "#include <senseBoxIO.h>";
  }
  // Edited version of Blockly.Generator.prototype.statementToCode
  function statementToCodeNoTab(block, name) {
    var targetBlock = block.getInputTargetBlock(name);
    var code = Blockly.Generator.Simulator.blockToCode(targetBlock);
    if (typeof code != "string") {
      throw new Error(
        'Expecting code from statement block "' + targetBlock.type + '".',
      );
    }
    return code;
  }

  var setupBranch = Blockly.Generator.Simulator.statementToCode(
    block,
    "SETUP_FUNC",
  );
  // //var setupCode = Blockly.Generator.Simulator.scrub_(block, setupBranch); No comment block
  if (setupBranch) {
    Blockly.Generator.Simulator.setupCode_["mainsetup"] = setupBranch;
  }

  var loopBranch = statementToCodeNoTab(block, "LOOP_FUNC");
  //var loopcode = Blockly.Generator.Simulator.scrub_(block, loopBranch); No comment block
  return loopBranch;
};

Blockly.Generator.Simulator.forBlock["procedures_defreturn"] = function (
  block,
  generator,
) {
  // Define a procedure with a return value.
  const funcName = Blockly.Generator.Simulator.nameDB_.getName(
    block.getFieldValue("NAME"),
    Blockly.Procedures.NAME_TYPE,
  );
  const branch = Blockly.Generator.Simulator.statementToCode(block, "STACK");
  const returnType = block.getFieldValue("RETURN TYPE") || "void";

  let returnValue =
    Blockly.Generator.Simulator.valueToCode(
      block,
      "RETURN",
      Blockly.Generator.Simulator.ORDER_NONE,
    ) || "";
  if (returnValue) {
    returnValue =
      Blockly.Generator.Simulator.INDENT + "return " + returnValue + ";\n";
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
  code = Blockly.Generator.Simulator.scrub_(block, code);
  // Add % so as not to collide with helper functions in definitions list.
  Blockly.Generator.Simulator.functionNames_["%" + funcName] = code;
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

Blockly.Generator.Simulator["procedures_defnoreturn"] =
  Blockly.Generator.Simulator["procedures_defreturn"];

Blockly.Generator.Simulator.forBlock["procedures_callreturn"] = function (
  block,
  generator,
) {
  // Call a procedure with a return value.
  const funcName = Blockly.Generator.Simulator.nameDB_.getName(
    block.getFieldValue("NAME"),
    Blockly.Procedures.NAME_TYPE,
  );
  const args = [];
  for (let i = 0; i < block.arguments_.length; i++) {
    args[i] =
      Blockly.Generator.Simulator.valueToCode(
        block,
        "ARG" + i,
        Blockly.Generator.Simulator.ORDER_COMMA,
      ) || "null";
  }
  const code = funcName + "(" + args.join(", ") + ")";
  return [code, Blockly.Generator.Simulator.ORDER_ATOMIC];
};

Blockly.Generator.Simulator.forBlock["procedures_callnoreturn"] = function (
  block,
  generator,
) {
  // Call a procedure with no return value.
  const funcName = Blockly.Generator.Simulator.nameDB_.getName(
    block.getFieldValue("NAME"),
    Blockly.Procedures.NAME_TYPE,
  );
  const args = [];
  for (let i = 0; i < block.arguments_.length; i++) {
    args[i] =
      Blockly.Generator.Simulator.valueToCode(
        block,
        "ARG" + i,
        Blockly.Generator.Simulator.ORDER_COMMA,
      ) || "null";
  }

  return funcName + "(" + args.join(", ") + ");\n";
};