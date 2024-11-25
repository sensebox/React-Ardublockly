import * as Blockly from "blockly/core";

Blockly.Generator.Arduino.forBlock["controls_repeat_ext"] = function (
  block,
  generator,
) {
  // Repeat n times.

  const repeats =
    Blockly.Generator.Arduino.valueToCode(
      Block,
      "TIMES",
      Blockly.Generator.Arduino.ORDER_ASSIGNMENT,
    ) || "0";

  let branch = Blockly.Generator.Arduino.statementToCode(Block, "DO");
  branch = Blockly.Generator.Arduino.addLoopTrap(branch, Block.id);
  let code = "";
  const loopVar = "i";
  code +=
    "for (int " +
    loopVar +
    " = 1; " +
    loopVar +
    " <= " +
    repeats +
    "; " +
    loopVar +
    " += 1) {\n" +
    branch +
    "}\n";

  return code;
};

Blockly.Generator.Arduino.forBlock["controls_for"] = function (
  block,
  generator,
) {
  const loopIndexVariable = Blockly.getMainWorkspace().getVariableById(
    Block.getFieldValue("VAR"),
  ).name;

  const allVars = Blockly.getMainWorkspace().getVariableMap().getAllVariables();
  const myVar = allVars.filter((v) => v.name === loopIndexVariable)[0];
  var initVariable = "";
  if (
    Blockly.Generator.Arduino.variables_[loopIndexVariable + myVar.type] ==
    undefined
  ) {
    initVariable = "int "; // alternatively set to 'myVar.type' but that could lead to issues if users choose a char or a boolean
  }

  const branch = Blockly.Generator.Arduino.statementToCode(Block, "DO");

  const startNumber =
    Blockly.Generator.Arduino.valueToCode(
      Block,
      "FROM",
      Blockly.Generator.Arduino.ORDER_ASSIGNMENT,
    ) || "0";

  const toNumber =
    Blockly.Generator.Arduino.valueToCode(
      Block,
      "TO",
      Blockly.Generator.Arduino.ORDER_ASSIGNMENT,
    ) || "0";

  let byNumber = Math.abs(
    parseInt(
      Blockly.Generator.Arduino.valueToCode(
        Block,
        "BY",
        Blockly.Generator.Arduino.ORDER_ASSIGNMENT,
      ),
    ),
  );

  byNumber = byNumber === 0 ? 1 : byNumber;

  const addingSub = startNumber < toNumber ? " +" : " -";
  const sign = startNumber < toNumber ? " <= " : " >= ";

  return (
    "for (" +
    initVariable +
    loopIndexVariable +
    " = " +
    startNumber +
    "; " +
    loopIndexVariable +
    sign +
    toNumber +
    "; " +
    loopIndexVariable +
    addingSub +
    "= " +
    byNumber +
    ") {\n" +
    branch +
    "}\n"
  );
};

Blockly.Generator.Arduino.forBlock["controls_whileUntil"] = function (
  block,
  generator,
) {
  // Do while/until loop.
  const until = Block.getFieldValue("MODE") === "UNTIL";
  let argument0 =
    Blockly.Generator.Arduino.valueToCode(
      Block,
      "BOOL",
      Blockly.Generator.Arduino.ORDER_LOGICAL_AND,
    ) || "false";
  let branch = Blockly.Generator.Arduino.statementToCode(Block, "DO");
  branch = Blockly.Generator.Arduino.addLoopTrap(branch, Block.id);
  if (until) {
    argument0 = "!" + argument0;
  }
  return "\twhile (" + argument0 + ") {\n" + branch + "\t}\n";
};

Blockly.Generator.Arduino.forBlock["controls_flow_statements"] = function (
  block,
  generator,
) {
  // Flow statements: continue, break.
  switch (Block.getFieldValue("FLOW")) {
    case "BREAK":
      return "break;\n";
    case "CONTINUE":
      return "continue;\n";
    default:
      break;
  }
  throw Error("Unknown flow statement.");
};
