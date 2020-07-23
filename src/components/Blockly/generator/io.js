import * as Blockly from 'blockly/core';
import { Block } from 'blockly';

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
