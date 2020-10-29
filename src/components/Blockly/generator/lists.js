import * as Blockly from 'blockly/core';


Blockly.Arduino['lists_create_empty'] = function () {
    var code = '';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
}

Blockly.Arduino['array_getIndex'] = function () {
    var code = '';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
}


Blockly.Arduino['lists_length'] = function () {
    var array = Blockly.Arduino.valueToCode(this, 'ARRAY', Blockly.Arduino.ORDER_ATOMIC);
    var code = `${array}.length`;
    return [code, Blockly.Arduino.ORDER_ATOMIC];
}