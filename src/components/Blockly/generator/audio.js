import * as Blockly from 'blockly/core';


/**
 * Function for turning the tone library on on a given pin (X).
 * Arduino code: setup { pinMode(X, OUTPUT) }
 *               loop  { tone(X, frequency) }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */

Blockly.Arduino['io_tone'] = function (block) {
    var pin = block.getFieldValue('TONEPIN');
    var freq = Blockly.Arduino.valueToCode(block, 'FREQUENCY', Blockly.Arduino.ORDER_ATOMIC);
    Blockly.Arduino.setupCode_['io_tone' + pin] = 'pinMode(' + pin + ', OUTPUT);\n';
    var code = 'tone(' + pin + ',' + freq + ');\n';
    return code;
};

Blockly.Arduino['io_notone'] = function (block) {
    var pin = block.getFieldValue("TONEPIN");
    Blockly.Arduino.setupCode_['io_tone' + pin] = 'pinMode(' + pin + ', OUTPUT);\n';
    var code = 'noTone(' + pin + ');\n';
    return code;
};
