/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Block for the Arduino map functionality.
 *     The Arduino built in functions syntax can be found at:
 *     http://arduino.cc/en/Reference/HomePage
 *
 * TODO: This block can be improved to set the new range properly.
 */


import * as Blockly from 'blockly/core';
import { getColour } from '../helpers/colour';
import * as Types from '../helpers/types'

Blockly.Blocks['base_map'] = {
    /**
     * Block for creating a the map function.
     * @this Blockly.Block
     */
    init: function () {
        this.setHelpUrl('http://arduino.cc/en/Reference/map');
        this.setColour(getColour().math);
        this.appendValueInput('NUM')
            .appendField(Blockly.Msg.ARD_MAP)
            .setCheck(Types.NUMBER.compatibleTypes);
        this.appendValueInput('FMIN')
            .appendField(Blockly.Msg.ARD_MAP_FROMMIN)
            .setCheck(Types.NUMBER.compatibleTypes);
        this.appendValueInput('FMAX')
            .appendField(Blockly.Msg.ARD_MAP_FROMMAX)
            .setCheck(Types.NUMBER.compatibleTypes);
        this.appendValueInput('DMIN')
            .appendField(Blockly.Msg.ARD_MAP_TOMIN)
            .setCheck(Types.NUMBER.compatibleTypes);
        this.appendValueInput('DMAX')
            .appendField(Blockly.Msg.ARD_MAP_TOMAX)
            .setCheck(Types.NUMBER.compatibleTypes);
        this.setOutput(true);
        this.setInputsInline(false);
        this.setTooltip(Blockly.Msg.ARD_MAP_TIP);
    },
    /** @return {string} The type of return value for the block, an integer. */
    getBlockType: function () {
        return Types.NUMBER.typeId;
    }
};
