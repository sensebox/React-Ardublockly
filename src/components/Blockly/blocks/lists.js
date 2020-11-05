import Blockly, { FieldDropdown } from 'blockly/core'
import * as Types from '../helpers/types'
import { getColour } from '../helpers/colour';

Blockly.Blocks['lists_create_empty'] = {
    /**
     * Elapsed time in milliseconds block definition
     * @this Blockly.Block
     */
    init: function () {
        this.setHelpUrl('http://arduino.cc/en/Reference/Millis');
        this.setColour(getColour().arrays);
        this.appendDummyInput()
            .appendField("create List with")
        this.appendValueInput('NUMBER');
        this.appendDummyInput()
            .appendField("Items of Type")
            .appendField(new FieldDropdown(Types.VARIABLE_TYPES), 'type');
        this.setOutput(true, Types.ARRAY.typeId);
        this.setTooltip(Blockly.Msg.ARD_TIME_MILLIS_TIP);
    },
};


Blockly.Blocks['array_getIndex'] = {
    /**
     * Elapsed time in milliseconds block definition
     * @this Blockly.Block
     */
    init: function () {
        this.setHelpUrl('http://arduino.cc/en/Reference/Millis');
        this.setColour(getColour().arrays);
        this.appendDummyInput()
            .appendField(new Blockly.FieldVariable(
                'X',
                null,
                ['Array'],
                'Array'
            ), 'FIELDNAME');
        this.setOutput(true, Types.ARRAY.typeId);
        this.setTooltip(Blockly.Msg.ARD_TIME_MILLIS_TIP);
    },
};

Blockly.Blocks['lists_length'] = {
    /**
     * Elapsed time in milliseconds block definition
     * @this Blockly.Block
     */
    init: function () {
        this.setHelpUrl('http://arduino.cc/en/Reference/Millis');
        this.setColour(getColour().arrays);
        this.appendValueInput('ARRAY')
            .appendField('length of')
            .setCheck(Types.ARRAY.compatibleTypes);
        this.setOutput(true, Types.NUMBER.typeName);
        this.setTooltip(Blockly.Msg.ARD_TIME_MILLIS_TIP);
    },
};