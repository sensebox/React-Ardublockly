import * as Blockly from "blockly/core";

/**
 * Code generator to add code into the setup() and loop() functions.
 * Its use is not mandatory, but necessary to add manual code to setup().
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */

Blockly.Simulator["arduino_functions"] = function (block) {
  var board = window.sessionStorage.getItem("board");

  if (board === "mcu" || board === "mini") {
    Blockly.Simulator.libraries_["library_senseBoxIO"] =
      "#include <senseBoxIO.h>";
  }
  // Edited version of Blockly.Generator.prototype.statementToCode
  function statementToCodeNoTab(block, name) {
    var targetBlock = block.getInputTargetBlock(name);
    var code = Blockly.Simulator.blockToCode(targetBlock);
    if (typeof code != "string") {
      throw new Error(
        'Expecting code from statement block "' + targetBlock.type + '".',
      );
    }
    return code;
  }

  var setupBranch = Blockly.Simulator.statementToCode(block, "SETUP_FUNC");
  // //var setupCode = Blockly.Simulator.scrub_(block, setupBranch); No comment block
  if (setupBranch) {
    Blockly.Simulator.setupCode_["mainsetup"] = setupBranch;
  }

  var loopBranch = statementToCodeNoTab(block, "LOOP_FUNC");
  //var loopcode = Blockly.Simulator.scrub_(block, loopBranch); No comment block
  return loopBranch;
};

Blockly.Simulator["procedures_defreturn"] = function (block) {
  // Define a procedure with a return value.
  const funcName = Blockly.Simulator.nameDB_.getName(
    block.getFieldValue("NAME"),
    Blockly.Procedures.NAME_TYPE,
  );
  const branch = Blockly.Simulator.statementToCode(block, "STACK");
  const returnType = block.getFieldValue("RETURN TYPE") || "void";

  let returnValue =
    Blockly.Simulator.valueToCode(block, "RETURN", Blockly.Simulator.ORDER_NONE) ||
    "";
  if (returnValue) {
    returnValue = Blockly.Simulator.INDENT + "return " + returnValue + ";\n";
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
  code = Blockly.Simulator.scrub_(block, code);
  // Add % so as not to collide with helper functions in definitions list.
  Blockly.Simulator.functionNames_["%" + funcName] = code;
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

Blockly.Simulator["procedures_defnoreturn"] =
  Blockly.Simulator["procedures_defreturn"];

Blockly.Simulator["procedures_callreturn"] = function (block) {
  // Call a procedure with a return value.
  const funcName = Blockly.Simulator.nameDB_.getName(
    block.getFieldValue("NAME"),
    Blockly.Procedures.NAME_TYPE,
  );
  const args = [];
  for (let i = 0; i < block.arguments_.length; i++) {
    args[i] =
      Blockly.Simulator.valueToCode(
        block,
        "ARG" + i,
        Blockly.Simulator.ORDER_COMMA,
      ) || "null";
  }
  const code = funcName + "(" + args.join(", ") + ")";
  return [code, Blockly.Simulator.ORDER_ATOMIC];
};

Blockly.Simulator["procedures_callnoreturn"] = function (block) {
  // Call a procedure with no return value.
  const funcName = Blockly.Simulator.nameDB_.getName(
    block.getFieldValue("NAME"),
    Blockly.Procedures.NAME_TYPE,
  );
  const args = [];
  for (let i = 0; i < block.arguments_.length; i++) {
    args[i] =
      Blockly.Simulator.valueToCode(
        block,
        "ARG" + i,
        Blockly.Simulator.ORDER_COMMA,
      ) || "null";
  }

  return funcName + "(" + args.join(", ") + ");\n";
};
