import * as Blockly from "blockly/core";

/**
 * Function for 'set pin' (X) to a state (Y).
 * Arduino code: setup { pinMode(X, OUTPUT); }
 *               loop  { digitalWrite(X, Y); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Generator.Arduino.forBlock["io_digitalwrite"] = function (
  block,
  generator,
) {
  var pin = block.getFieldValue("PIN");
  var stateOutput =
    Blockly.Generator.Arduino.valueToCode(
      block,
      "STATE",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || "LOW";
  Blockly.Generator.Arduino.setupCode_["pinMode"] =
    "pinMode(" + pin + ", OUTPUT);";
  var code = "digitalWrite(" + pin + ", " + stateOutput + ");\n";
  return code;
};

/**
 * Function for reading a digital pin (X).
 * Arduino code: setup { pinMode(X, INPUT); }
 *               loop  { digitalRead(X)     }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Generator.Arduino.forBlock["io_digitalread"] = function (
  block,
  generator,
) {
  var pin = block.getFieldValue("PIN");
  Blockly.Generator.Arduino.setupCode_["pinMode" + pin] =
    "pinMode(" + pin + ", INPUT);";
  var code = "digitalRead(" + pin + ")";
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

/**
 * Function for setting the state (Y) of a built-in LED (X).
 * Arduino code: setup { pinMode(X, OUTPUT); }
 *               loop  { digitalWrite(X, Y); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Generator.Arduino.forBlock["io_builtin_led"] = function (
  block,
  generator,
) {
  var pin = block.getFieldValue("BUILT_IN_LED");
  var stateOutput =
    Blockly.Generator.Arduino.valueToCode(
      block,
      "STATE",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || "LOW";
  Blockly.Generator.Arduino.setupCode_["pinMode" + pin] =
    "pindMode(" + pin + "OUTPUT);";
  var code = "digitalWrite(" + pin + ", " + stateOutput + ");\n";
  return code;
};

/**
 * Function for setting the state (Y) of an analogue output (X).
 * Arduino code: setup { pinMode(X, OUTPUT); }
 *               loop  { analogWrite(X, Y);  }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Generator.Arduino.forBlock["io_analogwrite"] = function (
  block,
  generator,
) {
  var pin = block.getFieldValue("PIN");
  var stateOutput =
    Blockly.Generator.Arduino.valueToCode(
      block,
      "NUM",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    ) || "0";
  Blockly.Generator.Arduino.setupCode_["pinMode" + pin] =
    "pinMode(" + pin + ", OUTPUT);";
  // Warn if the input value is out of range
  if (stateOutput < 0 || stateOutput > 255) {
    block.setWarningText(
      "The analogue value set must be between 0 and 255",
      "pwm_value",
    );
  } else {
    block.setWarningText(null, "pwm_value");
  }
  var code = "analogWrite(" + pin + ", " + stateOutput + ");\n";
  return code;
};

/**
 * Function for reading an analogue pin value (X).
 * Arduino code: setup { pinMode(X, INPUT); }
 *               loop  { analogRead(X)      }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Generator.Arduino.forBlock["io_analogread"] = function (
  block,
  generator,
) {
  var pin = block.getFieldValue("PIN");
  Blockly.Generator.Arduino.setupCode_["pinMode" + pin] =
    "pinMode(" + pin + ", INPUT);";
  var code = "analogRead(" + pin + ")";
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

/**
 * Value for defining a digital pin state.
 * Arduino code: loop { HIGH / LOW }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Generator.Arduino.forBlock["io_highlow"] = function (block, generator) {
  var code = block.getFieldValue("STATE");
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

Blockly.Generator.Arduino.forBlock["io_pulsein"] = function (block, generator) {
  var pin = block.getFieldValue("PULSEPIN");
  var type = Blockly.Generator.Arduino.valueToCode(
    block,
    "PULSETYPE",
    Blockly.Generator.Arduino.ORDER_ATOMIC,
  );
  Blockly.Generator.Arduino.setupCode_["pinMode" + pin] =
    "pinMode(" + pin + ", INPUT);";
  var code = "pulseIn(" + pin + ", " + type + ")";
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

Blockly.Generator.Arduino.forBlock["io_pulsetimeout"] = function (
  block,
  generator,
) {
  var pin = block.getFieldValue("PULSEPIN");
  var type = Blockly.Generator.Arduino.valueToCode(
    block,
    "PULSETYPE",
    Blockly.Generator.Arduino.ORDER_ATOMIC,
  );
  var timeout = Blockly.Generator.Arduino.valueToCode(
    block,
    "TIMEOUT",
    Blockly.Generator.Arduino.ORDER_ATOMIC,
  );
  Blockly.Generator.Arduino.setupCode_["pinMode" + pin] =
    "pinMode(" + pin + ", INPUT);";
  var code = "pulseIn(" + pin + ", " + type + ", " + timeout + ")";
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

Blockly.Generator.Arduino.forBlock["io_analogreadmillivolt"] = function (
  block,
  generator,
) {
  var dropdown_port = this.getFieldValue("Port");
  var pin = 1;
  switch (dropdown_port) {
    case "IO3_2":
      pin = 3;
      break;
    case "IO3_4":
      pin = 3;
      break;
    case "IO5_4":
      pin = 5;
      break;
    case "IO5_6":
      pin = 5;
      break;
    case "IO7_6":
      pin = 7;
      break;
    default: // "IO1_2"
      pin = 1;
  }

  var code = "analogReadMilliVolts(" + pin + ")";
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};
