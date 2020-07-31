import * as Blockly from 'blockly/core';

/**
 * Function for 'set pin' (X) to a state (Y).
 * Arduino code: setup { pinMode(X, OUTPUT); }
 *               loop  { digitalWrite(X, Y); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Arduino['io_digitalwrite'] = function (block) {
    var pin = block.getFieldValue('PIN');
    var stateOutput = Blockly.Arduino.valueToCode(
        block, 'STATE', Blockly['Arduino'].ORDER_ATOMIC) || 'LOW';
    Blockly['Arduino'].setupCode_['pinMode'] = 'pinMode(' + pin + ', OUTPUT);';
    var code = 'digitalWrite(' + pin + ', ' + stateOutput + ');\n';
    return code;
};

/**
 * Function for reading a digital pin (X).
 * Arduino code: setup { pinMode(X, INPUT); }
 *               loop  { digitalRead(X)     }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Arduino['io_digitalread'] = function (block) {
    var pin = block.getFieldValue('PIN');
    Blockly['Arduino'].setupCode_['pinMode' + pin] = 'pinMode(' + pin + ', INPUT);'
    var code = 'digitalRead(' + pin + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};


/**
 * Function for setting the state (Y) of a built-in LED (X).
 * Arduino code: setup { pinMode(X, OUTPUT); }
 *               loop  { digitalWrite(X, Y); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Arduino['io_builtin_led'] = function (block) {
    var pin = block.getFieldValue('BUILT_IN_LED');
    var stateOutput = Blockly.Arduino.valueToCode(
        block, 'STATE', Blockly.Arduino.ORDER_ATOMIC) || 'LOW';
    Blockly['Arduino'].setupCode_['pinMode' + pin] = 'pindMode(' + pin + 'OUTPUT);'
    var code = 'digitalWrite(' + pin + ', ' + stateOutput + ');\n';
    return code;
};


/**
 * Function for setting the state (Y) of an analogue output (X).
 * Arduino code: setup { pinMode(X, OUTPUT); }
 *               loop  { analogWrite(X, Y);  }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Arduino['io_analogwrite'] = function (block) {
    var pin = block.getFieldValue('PIN');
    var stateOutput = Blockly.Arduino.valueToCode(
        block, 'NUM', Blockly.Arduino.ORDER_ATOMIC) || '0';
    Blockly['Arduino'].setupCode_['pinMode' + pin] = 'pinMode(' + pin + ', OUTPUT);';
    // Warn if the input value is out of range
    if ((stateOutput < 0) || (stateOutput > 255)) {
        block.setWarningText('The analogue value set must be between 0 and 255',
            'pwm_value');
    } else {
        block.setWarningText(null, 'pwm_value');
    }
    var code = 'analogWrite(' + pin + ', ' + stateOutput + ');\n';
    return code;
};

/**
 * Function for reading an analogue pin value (X).
 * Arduino code: setup { pinMode(X, INPUT); }
 *               loop  { analogRead(X)      }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Arduino['io_analogread'] = function (block) {
    var pin = block.getFieldValue('PIN');
    Blockly['Arduino'].setupCode_['pinMode' + pin] = 'pinMode(' + pin + ', INPUT);';
    var code = 'analogRead(' + pin + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

/**
 * Value for defining a digital pin state.
 * Arduino code: loop { HIGH / LOW }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Arduino['io_highlow'] = function (block) {
    var code = block.getFieldValue('STATE');
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['io_pulsein'] = function (block) {
    var pin = block.getFieldValue("PULSEPIN");
    var type = Blockly.Arduino.valueToCode(block, "PULSETYPE", Blockly.Arduino.ORDER_ATOMIC);
    Blockly['Arduino'].setupCode_['pinMode' + pin] = 'pinMode(' + pin + ', INPUT);';
    var code = 'pulseIn(' + pin + ', ' + type + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['io_pulsetimeout'] = function (block) {
    var pin = block.getFieldValue("PULSEPIN");
    var type = Blockly.Arduino.valueToCode(block, "PULSETYPE", Blockly.Arduino.ORDER_ATOMIC);
    var timeout = Blockly.Arduino.valueToCode(block, "TIMEOUT", Blockly.Arduino.ORDER_ATOMIC);
    Blockly['Arduino'].setupCode_['pinMode' + pin] = 'pinMode(' + pin + ', INPUT);';
    var code = 'pulseIn(' + pin + ', ' + type + ', ' + timeout + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};
