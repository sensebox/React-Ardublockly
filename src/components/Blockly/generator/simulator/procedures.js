import * as Blockly from "blockly/core";

/**
 * Setup and loop block. The setup statements run once before the loop, the
 * loop statements run inside `while (true) { ... }` (see generator.js).
 *
 * Function definitions (procedures_defnoreturn, procedures_defreturn) use the
 * stock JavaScript generators, which add them to the definitions.
 */
Blockly.Generator.Simulator.forBlock["arduino_functions"] = function (block) {
  // Like statementToCode, but without indentation.
  function statementToCodeNoTab(name) {
    const targetBlock = block.getInputTargetBlock(name);
    const code = Blockly.Generator.Simulator.blockToCode(targetBlock);
    if (typeof code !== "string") {
      throw new Error(
        'Expecting code from statement block "' + targetBlock.type + '".',
      );
    }
    return code;
  }

  const setupBranch = Blockly.Generator.Simulator.statementToCode(
    block,
    "SETUP_FUNC",
  );
  if (setupBranch) {
    Blockly.Generator.Simulator.setupCode_["mainsetup"] = setupBranch;
  }

  return statementToCodeNoTab("LOOP_FUNC");
};

// The senseBox call blocks keep their arguments in `arguments_` and do not
// implement getVars(), which the stock generators rely on.
Blockly.Generator.Simulator.forBlock["procedures_callreturn"] = function (
  block,
) {
  // Call a procedure with a return value.
  const funcName = Blockly.Generator.Simulator.getProcedureName(
    block.getFieldValue("NAME"),
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
) {
  // Call a procedure with no return value.
  const funcName = Blockly.Generator.Simulator.getProcedureName(
    block.getFieldValue("NAME"),
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
