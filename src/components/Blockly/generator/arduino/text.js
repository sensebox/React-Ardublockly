import * as Blockly from "blockly/core";

/**
 * Code generator for a literal String (X).
 * Arduino code: loop { "X" }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Generator.Arduino.forBlock["text"] = function (block, generator) {
  var code = Blockly.Generator.Arduino.quote_(block.getFieldValue("TEXT"));
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

/**
 * Code generator for a String concatenation (X...Y). This string can be made
 * up of any number of elements of any type.
 * This block uses a mutator.
 * String construction info: http://arduino.cc/en/Reference/StringConstructor
 * Arduino code: loop { "String(X)" + ... + "String(Y)" }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Generator.Arduino.forBlock["text_join"] = function (block, generator) {
  var code;
  if (block.itemCount_ === 0) {
    return ['""', Blockly.Generator.Arduino.ORDER_ATOMIC];
  } else if (block.itemCount_ === 1) {
    var argument0 =
      Blockly.Generator.Arduino.valueToCode(
        block,
        "ADD0",
        Blockly.Generator.Arduino.ORDER_UNARY_POSTFIX,
      ) || '""';
    code = "String(" + argument0 + ")";
    return [code, Blockly.Generator.Arduino.ORDER_UNARY_POSTFIX];
  } else {
    var argument;
    code = [];
    for (var n = 0; n < block.itemCount_; n++) {
      argument = Blockly.Generator.Arduino.valueToCode(
        block,
        "ADD" + n,
        Blockly.Generator.Arduino.ORDER_NONE,
      );
      if (argument === "") {
        code[n] = '""';
      } else {
        code[n] = "String(" + argument + ")";
      }
    }
    code = code.join(" + ");
    return [code, Blockly.Generator.Arduino.ORDER_UNARY_POSTFIX];
  }
};

/**
 * Code generator for appending text (Y) to a variable in place (X).
 * String constructor info: http://arduino.cc/en/Reference/StringConstructor
 * Arduino code: loop { X += String(Y) }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Generator.Arduino.forBlock["text_append"] = function (
  block,
  generator,
) {
  // Append to a variable in place.
  var id = block.getFieldValue("VAR");
  const variable = Blockly.Variables.getVariable(
    Blockly.getMainWorkspace(),
    id,
  );
  var argument0 = Blockly.Generator.Arduino.valueToCode(
    block,
    "TEXT",
    Blockly.Generator.Arduino.ORDER_UNARY_POSTFIX,
  );
  if (argument0 === "") {
    argument0 = '""';
  } else {
    argument0 = "String(" + argument0 + ")";
  }
  return variable.name + " += " + argument0 + ";\n";
};

/**
 * Code generator to get the length of a string (X).
 * String length info: http://arduino.cc/en/Reference/StringLength
 * Arduino code: loop { String(X).length() }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Generator.Arduino.forBlock["text_length"] = function (
  block,
  generator,
) {
  var argument0 =
    Blockly.Generator.Arduino.valueToCode(
      block,
      "VALUE",
      Blockly.Generator.Arduino.ORDER_UNARY_POSTFIX,
    ) || '""';
  var code = "String(" + argument0 + ").length()";
  return [code, Blockly.Generator.Arduino.ORDER_UNARY_POSTFIX];
};

Blockly.Generator.Arduino.forBlock["text8"] = function (block, generator) {
  var code = Blockly.Generator.Arduino.quote_(block.getFieldValue("TEXT"));
  code = code.substring(0, 8); // Sicherheit: max. 8 Zeichen

  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};
