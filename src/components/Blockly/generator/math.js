import * as Blockly from "blockly/core";

/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Generating Arduino code for the Math blocks.
 *
 * TODO: Math on list needs lists to be implemented.
 *       math_constant and math_change needs to be tested in compiler.
 */

/**
 * Generator for a numeric value (X).
 * Arduino code: loop { X }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Generator.Arduino.forBlock["math_number"] = function (block) {
  // update tooltip in generator
  // Number block is trivial.  Use tooltip of parent block if it exists
  var parent = block.getParent();
  block.setTooltip(
    (parent && parent.getInputsInline() && parent.tooltip) ||
      Blockly.Msg.MATH_NUMBER_TOOLTIP,
  );
  var unparsedCode = block.getFieldValue("NUM");
  // understand decimal comma for german users
  unparsedCode = unparsedCode.replace(",", ".");
  var code = parseFloat(unparsedCode);
  block.setFieldValue(code, "NUM");
  if (code === Infinity) {
    code = "INFINITY";
  } else if (code === -Infinity) {
    code = "-INFINITY";
  }
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

/**
 * Generator for a basic arithmetic operators (X and Y) and power function
 * (X ^ Y).
 * Arduino code: loop { X operator Y }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Generator.Arduino.forBlock["math_arithmetic"] = function (block) {
  var OPERATORS = {
    ADD: [" + ", Blockly.Generator.Arduino.ORDER_ADDITIVE],
    MINUS: [" - ", Blockly.Generator.Arduino.ORDER_ADDITIVE],
    MULTIPLY: [" * ", Blockly.Generator.Arduino.ORDER_MULTIPLICATIVE],
    DIVIDE: [" / ", Blockly.Generator.Arduino.ORDER_MULTIPLICATIVE],
    POWER: [" ^ ", Blockly.Generator.Arduino.ORDER_NONE], // Handle power separately.
  };
  // update tooltip in generator
  // Assign 'this' to a variable for use in the tooltip closure below.
  var mode = block.getFieldValue("OP");
  var TOOLTIPS = {
    ADD: Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_ADD,
    MINUS: Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_MINUS,
    MULTIPLY: Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_MULTIPLY,
    DIVIDE: Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_DIVIDE,
    POWER: Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_POWER,
  };
  block.setTooltip(TOOLTIPS[mode]);
  var tuple = OPERATORS[block.getFieldValue("OP")];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 =
    Blockly.Generator.Arduino.valueToCode(block, "A", order) || "0";
  var argument1 =
    Blockly.Generator.Arduino.valueToCode(block, "B", order) || "0";
  var code;
  // Power in C++ requires a special case since it has no operator.
  if (operator === " ^ ") {
    code = `Math.pow(${argument0}, ${argument1})`;
    return [code, Blockly.Generator.Arduino.ORDER_UNARY_POSTFIX];
  }
  code = argument0 + operator + argument1;
  return [code, order];
};

/**
 * Generator for math operator -(X).
 * Arduino code: loop { -(X) }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Generator.Arduino.forBlock["math_single"] = function (block) {
  var operator = block.getFieldValue("OP");
  var code;
  var arg;
  // Negation is a special case given its different operator precedents.
  arg =
    Blockly.Generator.Arduino.valueToCode(
      block,
      "NUM",
      Blockly.Generator.Arduino.ORDER_UNARY_PREFIX,
    ) || "0";
  if (arg[0] === "-") {
    // --3 is not legal in C++ in this context.
    arg = " " + arg;
  }
  code = "-" + arg;
  return [code, Blockly.Generator.Arduino.ORDER_UNARY_PREFIX];
};

/**
 * Generator for math operators that contain a single operand (X).
 * Arduino code: loop { operator(X) }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Generator.Arduino.forBlock["math_single"] = function (block) {
  var operator = block.getFieldValue("OP");
  //update tooltip in generator
  var TOOLTIPS = {
    ROOT: Blockly.Msg.MATH_SINGLE_TOOLTIP_ROOT,
    ABS: Blockly.Msg.MATH_SINGLE_TOOLTIP_ABS,
    LN: Blockly.Msg.MATH_SINGLE_TOOLTIP_LN,
    LOG10: Blockly.Msg.MATH_SINGLE_TOOLTIP_LOG10,
    EXP: Blockly.Msg.MATH_SINGLE_TOOLTIP_EXP,
    POW10: Blockly.Msg.MATH_SINGLE_TOOLTIP_POW10,
    SIN: Blockly.Msg.MATH_TRIG_TOOLTIP_SIN,
    COS: Blockly.Msg.MATH_TRIG_TOOLTIP_COS,
    TAN: Blockly.Msg.MATH_TRIG_TOOLTIP_TAN,
    ASIN: Blockly.Msg.MATH_TRIG_TOOLTIP_ASIN,
    ACOS: Blockly.Msg.MATH_TRIG_TOOLTIP_ACOS,
    ATAN: Blockly.Msg.MATH_TRIG_TOOLTIP_ATAN,
    ROUND: Blockly.Msg.MATH_ROUND_TOOLTIP,
    ROUNDUP: Blockly.Msg.MATH_ROUND_TOOLTIP,
    ROUNDDOWN: Blockly.Msg.MATH_ROUND_TOOLTIP,
  };
  block.setTooltip(TOOLTIPS[operator]);
  var code;
  var arg;
  if (operator === "ABS" || operator.substring(0, 5) === "ROUND") {
    arg =
      Blockly.Generator.Arduino.valueToCode(
        block,
        "NUM",
        Blockly.Generator.Arduino.ORDER_UNARY_POSTFIX,
      ) || "0";
  } else if (operator === "SIN" || operator === "COS" || operator === "TAN") {
    arg =
      Blockly.Generator.Arduino.valueToCode(
        block,
        "NUM",
        Blockly.Generator.Arduino.ORDER_MULTIPLICATIVE,
      ) || "0";
  } else {
    arg =
      Blockly.Generator.Arduino.valueToCode(
        block,
        "NUM",
        Blockly.Generator.Arduino.ORDER_NONE,
      ) || "0";
  }
  // First, handle cases which generate values that don't need parentheses.
  switch (operator) {
    case "ABS":
      code = "abs(" + arg + ")";
      break;
    case "ROOT":
      code = "sqrt(" + arg + ")";
      break;
    case "LN":
      code = "log(" + arg + ")";
      break;
    case "EXP":
      code = "exp(" + arg + ")";
      break;
    case "POW10":
      code = "pow(10," + arg + ")";
      break;
    case "ROUND":
      code = "round(" + arg + ")";
      break;
    case "ROUNDUP":
      code = "ceil(" + arg + ")";
      break;
    case "ROUNDDOWN":
      code = "floor(" + arg + ")";
      break;
    case "SIN":
      code = "sin(" + arg + " / 180 * M_PI)";
      break;
    case "COS":
      code = "cos(" + arg + " / 180 * M_PI)";
      break;
    case "TAN":
      code = "tan(" + arg + " / 180 * M_PI)";
      break;
    default:
      break;
  }
  if (code) {
    return [code, Blockly.Generator.Arduino.ORDER_UNARY_POSTFIX];
  }
  // Second, handle cases which generate values that may need parentheses.
  switch (operator) {
    case "LOG10":
      code = "log(" + arg + ") / log(10)";
      break;
    case "ASIN":
      code = "asin(" + arg + ") / M_PI * 180";
      break;
    case "ACOS":
      code = "acos(" + arg + ") / M_PI * 180";
      break;
    case "ATAN":
      code = "atan(" + arg + ") / M_PI * 180";
      break;
    default:
      throw new Error("Unknown math operator: " + operator);
  }
  return [code, Blockly.Generator.Arduino.ORDER_MULTIPLICATIVE];
};

/** Negative sign is a single operand. */
Blockly.Generator.Arduino.forBlock["math_negative"] =
  Blockly.Generator.Arduino.forBlock["math_single"];

/** Rounding functions have a single operand. */
Blockly.Generator.Arduino.forBlock["math_round"] =
  Blockly.Generator.Arduino.forBlock["math_single"];

/** Trigonometry functions have a single operand. */
Blockly.Generator.Arduino.forBlock["math_trig"] =
  Blockly.Generator.Arduino.forBlock["math_single"];

/**
 * Generator for math constants (PI, E, the Golden Ratio, sqrt(2), 1/sqrt(2),
 * INFINITY).
 * Arduino code: loop { constant }
 * TODO: Might need to include "#define _USE_MATH_DEFINES"
 *       The arduino header file already includes math.h
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Generator.Arduino.forBlock["math_constant"] = function (block) {
  var CONSTANTS = {
    PI: ["M_PI", Blockly.Generator.Arduino.ORDER_UNARY_POSTFIX],
    E: ["M_E", Blockly.Generator.Arduino.ORDER_UNARY_POSTFIX],
    GOLDEN_RATIO: [
      "(1 + sqrt(5)) / 2",
      Blockly.Generator.Arduino.ORDER_MULTIPLICATIVE,
    ],
    SQRT2: ["M_SQRT2", Blockly.Generator.Arduino.ORDER_UNARY_POSTFIX],
    SQRT1_2: ["M_SQRT1_2", Blockly.Generator.Arduino.ORDER_UNARY_POSTFIX],
    INFINITY: ["INFINITY", Blockly.Generator.Arduino.ORDER_ATOMIC],
  };
  return CONSTANTS[block.getFieldValue("CONSTANT")];
};

/**
 * Generator for math checks: if a number is even, odd, prime, whole, positive,
 * negative, or if it is divisible by certain number. Returns true or false.
 * Arduino code: complex code, can create external functions.
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Generator.Arduino.forBlock["math_number_property"] = function (block) {
  var number_to_check =
    Blockly.Generator.Arduino.valueToCode(
      block,
      "NUMBER_TO_CHECK",
      Blockly.Generator.Arduino.ORDER_MULTIPLICATIVE,
    ) || "0";
  var dropdown_property = block.getFieldValue("PROPERTY");
  var code;
  if (dropdown_property === "PRIME") {
    Blockly.Generator.Arduino.codeFunctions_["isPrime"] =
      `boolean isPrime(int n) {
      // https://en.wikipedia.org/wiki/Primality_test#Naive_methods
      if (n == 2 || n == 3) {
        return true;
      }
      // False if n is NaN, negative, is 1 or divisible by 2 or 3.
      if (isnan(n) || (n <= 1) || (n == 1) || (n % 2 == 0) || (n % 3 == 0)) {
        return false;
      }
      // Check all the numbers of form 6k +/- 1, up to sqrt(n).
      for (int x = 6; x <= sqrt(n) + 1; x += 6) {
        if (n % (x - 1) == 0 || n % (x + 1) == 0) {
          return false;
        }
      }
      return true;
    }`;
    Blockly.Generator.Arduino.libraries_["math"] = "#include <math.h>";
    code = `isPrime(${number_to_check})`;
    return [code, Blockly.Generator.Arduino.ORDER_UNARY_POSTFIX];
  }
  switch (dropdown_property) {
    case "EVEN":
      code = number_to_check + " % 2 == 0";
      break;
    case "ODD":
      code = number_to_check + " % 2 == 1";
      break;
    case "WHOLE":
      Blockly.Generator.Arduino.libraries_["math"] = "#include <math.h>";
      code = "(floor(" + number_to_check + ") == " + number_to_check + ")";
      break;
    case "POSITIVE":
      code = number_to_check + " > 0";
      break;
    case "NEGATIVE":
      code = number_to_check + " < 0";
      break;
    case "DIVISIBLE_BY":
      var divisor =
        Blockly.Generator.Arduino.valueToCode(
          block,
          "DIVISOR",
          Blockly.Generator.Arduino.ORDER_MULTIPLICATIVE,
        ) || "0";
      code = number_to_check + " % " + divisor + " == 0";
      break;
    default:
      break;
  }
  return [code, Blockly.Generator.Arduino.ORDER_EQUALITY];
};

/**
 * Generator to add/subtract (Y) to a variable (X).
 * If variable X has not been declared before this block it will be declared as
 * a (not initialised) global int, however globals are 0 initialised in C/C++.
 * Arduino code: loop { X += Y; }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Generator.Arduino.forBlock["math_change"] = function (block) {
  var argument0 =
    Blockly.Generator.Arduino.valueToCode(
      block,
      "DELTA",
      Blockly.Generator.Arduino.ORDER_ADDITIVE,
    ) || "0";
  var id = block.getFieldValue("VAR");
  const varName = Blockly.Variables.getVariable(
    Blockly.getMainWorkspace(),
    id,
  ).name;
  var dropdown_direction = block.getFieldValue("DIRECTION");
  // update tooltip in generator
  this.setTooltip(
    Blockly.Msg.MATH_CHANGE_TOOLTIP_WITH_VARIABLE.replace("%1", varName),
  );
  // var varName = Blockly.Generator.Arduino.nameDB_.getName(
  //   block.getFieldValue("VAR"),
  //   Blockly.Variables.NAME_TYPE
  // );
  return `${varName} ${dropdown_direction} ${argument0};\n`;
};

/**
 * Generator for the math function to a list.
 * Arduino code: ???
 * TODO: List have to be implemented first. Removed from toolbox for now.
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Generator.Arduino.forBlock["math_on_list"] =
  Blockly.Generator.Arduino.noGeneratorCodeInline;

/**
 * Generator for the math modulo function (calculates remainder of X/Y).
 * Arduino code: loop { X % Y }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Generator.Arduino.forBlock["math_modulo"] = function (block) {
  var argument0 =
    Blockly.Generator.Arduino.valueToCode(
      block,
      "DIVIDEND",
      Blockly.Generator.Arduino.ORDER_MULTIPLICATIVE,
    ) || "0";
  var argument1 =
    Blockly.Generator.Arduino.valueToCode(
      block,
      "DIVISOR",
      Blockly.Generator.Arduino.ORDER_MULTIPLICATIVE,
    ) || "0";
  var code = argument0 + " % " + argument1;
  return [code, Blockly.Generator.Arduino.ORDER_MULTIPLICATIVE];
};

/**
 * Generator for clipping a number(X) between two limits (Y and Z).
 * Arduino code: loop { (X < Y ? Y : ( X > Z ? Z : X)) }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Generator.Arduino.forBlock["math_constrain"] = function (block) {
  // Constrain a number between two limits.
  var argument0 =
    Blockly.Generator.Arduino.valueToCode(
      block,
      "VALUE",
      Blockly.Generator.Arduino.ORDER_NONE,
    ) || "0";
  var argument1 =
    Blockly.Generator.Arduino.valueToCode(
      block,
      "LOW",
      Blockly.Generator.Arduino.ORDER_NONE,
    ) || "0";
  var argument2 =
    Blockly.Generator.Arduino.valueToCode(
      block,
      "HIGH",
      Blockly.Generator.Arduino.ORDER_NONE,
    ) || "0";
  var code =
    "(" +
    argument0 +
    " < " +
    argument1 +
    " ? " +
    argument1 +
    " : ( " +
    argument0 +
    " > " +
    argument2 +
    " ? " +
    argument2 +
    " : " +
    argument0 +
    "))";
  return [code, Blockly.Generator.Arduino.ORDER_UNARY_POSTFIX];
};

/**
 * Generator for a random integer between two numbers (X and Y).
 * Arduino code: loop { math_random_int(X, Y); }
 *               and an aditional math_random_int function
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Generator.Arduino.forBlock["math_random_int"] = function (block) {
  var argument0 =
    Blockly.Generator.Arduino.valueToCode(
      block,
      "FROM",
      Blockly.Generator.Arduino.ORDER_NONE,
    ) || "0";
  var argument1 =
    Blockly.Generator.Arduino.valueToCode(
      block,
      "TO",
      Blockly.Generator.Arduino.ORDER_NONE,
    ) || "0";
  Blockly.Generator.Arduino.setupCode_["init_rand"] =
    "randomSeed(analogRead(0));";
  Blockly.Generator.Arduino.functionNames_["math_random_int"] =
    `int mathRandomInt (int min, int max) {\n
      if (min > max) {
        int temp = min;
        min = max;
        max = temp;
      }
      return min + (rand() % (max - min + 1));
    }
    `;
  var code = `mathRandomInt(${argument0},${argument1})`;
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

/**
 * Generator for a random float from 0 to 1.
 * Arduino code: loop { (rand() / RAND_MAX) }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Generator.Arduino.forBlock["math_random_float"] = function () {
  return ["(rand() / RAND_MAX)", Blockly.Generator.Arduino.ORDER_UNARY_POSTFIX];
};
