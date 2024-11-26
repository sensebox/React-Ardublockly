import * as Blockly from "blockly/core";

Blockly.Generator.Arduino.forBlock["logic_boolean"] = function (
  block,
  generator,
) {
  // Boolean values true and false.
  const code = block.getFieldValue("BOOL") === "TRUE" ? "true" : "false";
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

Blockly.Generator.Arduino.forBlock["logic_compare"] = function (
  block,
  generator,
) {
  // Comparison operator.
  const OPERATORS = {
    EQ: "==",
    NEQ: "!=",
    LT: "<",
    LTE: "<=",
    GT: ">",
    GTE: ">=",
  };
  const operator = OPERATORS[block.getFieldValue("OP")];
  const order =
    operator === "==" || operator === "!="
      ? Blockly.Generator.Arduino.ORDER_EQUALITY
      : Blockly.Generator.Arduino.ORDER_RELATIONAL;
  const argument0 =
    Blockly.Generator.Arduino.valueToCode(block, "A", order) || "0";
  const argument1 =
    Blockly.Generator.Arduino.valueToCode(block, "B", order) || "0";
  const code = "( " + argument0 + " " + operator + " " + argument1 + ")";
  return [code, order];
};

Blockly.Generator.Arduino.forBlock["logic_operation"] = function (
  block,
  generator,
) {
  // Operations 'and', 'or'.
  const operator = block.getFieldValue("OP") === "AND" ? "&&" : "||";
  const order =
    operator === "&&"
      ? Blockly.Generator.Arduino.ORDER_LOGICAL_AND
      : Blockly.Generator.Arduino.ORDER_LOGICAL_OR;
  let argument0 = Blockly.Generator.Arduino.valueToCode(block, "A", order);
  let argument1 = Blockly.Generator.Arduino.valueToCode(block, "B", order);
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = "false";
    argument1 = "false";
  } else {
    // Single missing arguments have no effect on the return value.
    const defaultArgument = operator === "&&" ? "true" : "false";
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
  const code = argument0 + " " + operator + " " + argument1;
  return [code, order];
};

Blockly.Generator.Arduino.forBlock["controls_if"] = function (
  block,
  generator,
) {
  // If/elseif/else condition.
  let n = 0;
  let code = "",
    branchCode,
    conditionCode;
  do {
    conditionCode =
      Blockly.Generator.Arduino.valueToCode(
        block,
        "IF" + n,
        Blockly.Generator.Arduino.ORDER_NONE,
      ) || "false";
    branchCode = Blockly.Generator.Arduino.statementToCode(block, "DO" + n);
    code +=
      (n > 0 ? " else " : "") +
      "if (" +
      conditionCode +
      ") {\n" +
      branchCode +
      "}\n";

    ++n;
  } while (block.getInput("IF" + n));

  if (block.getInput("ELSE")) {
    branchCode = Blockly.Generator.Arduino.statementToCode(block, "ELSE");
    code += " else {\n" + branchCode + "}\n";
  }
  return code + "\n";
};

Blockly.Generator.Arduino.forBlock["controls_ifelse"] = function (
  block,
  generator,
) {
  // If/elseif/else condition.
  let n = 0;
  let code = "",
    branchCode,
    conditionCode;
  do {
    conditionCode =
      Blockly.Generator.Arduino.valueToCode(
        block,
        "IF" + n,
        Blockly.Generator.Arduino.ORDER_NONE,
      ) || "false";
    branchCode = Blockly.Generator.Arduino.statementToCode(block, "DO" + n);
    code +=
      (n > 0 ? " else " : "") +
      "if (" +
      conditionCode +
      ") {\n" +
      branchCode +
      "}\n";

    ++n;
  } while (block.getInput("IF" + n));

  if (block.getInput("ELSE")) {
    branchCode = Blockly.Generator.Arduino.statementToCode(block, "ELSE");
    code += " else {\n" + branchCode + "}\n";
  }
  return code + "\n";
};

Blockly.Generator.Arduino.forBlock["logic_negate"] = function (
  block,
  generator,
) {
  // Negation.
  const order = Blockly.Generator.Arduino.ORDER_UNARY_PREFIX;
  const argument0 =
    Blockly.Generator.Arduino.valueToCode(block, "BOOL", order) || "true";
  const code = "!" + argument0;
  return [code, order];
};

Blockly.Generator.Arduino.forBlock["switch_case"] = function (
  block,
  generator,
) {
  var n = 0;
  var argument =
    Blockly.Generator.Arduino.valueToCode(
      this,
      "CONDITION",
      Blockly.Generator.Arduino.ORDER_NONE,
    ) || "";
  var branch = Blockly.Generator.Arduino.statementToCode(
    block,
    "CASECONDITION" + n,
  );
  var cases = "";
  var default_code = "";
  var DO = Blockly.Generator.Arduino.statementToCode(block, "CASE" + n);
  for (n = 0; n <= block.caseCount_; n++) {
    DO = Blockly.Generator.Arduino.statementToCode(block, "CASE" + n);
    branch =
      Blockly.Generator.Arduino.valueToCode(
        block,
        "CASECONDITION" + n,
        Blockly.Generator.Arduino.ORDER_NONE,
      ) || "0";
    cases += "case " + branch + ":\n";
    cases += DO + "\nbreak;\n";
  }
  if (block.defaultCount_) {
    branch = Blockly.Generator.Arduino.statementToCode(block, "ONDEFAULT");
    default_code = "default: \n" + branch + "\n break;\n";
  }
  var code = "switch (" + argument + ") {\n" + cases + default_code + "}";
  return code + "\n";
};
