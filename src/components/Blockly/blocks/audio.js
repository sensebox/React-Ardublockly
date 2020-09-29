import Blockly from 'blockly/core';
import { selectedBoard } from '../helpers/board'
import * as Types from '../helpers/types'
import { getColour } from '../helpers/colour';


Blockly.Blocks['io_tone'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(Blockly.Msg.ARD_SETTONE)
            .appendField(new Blockly.FieldDropdown(
                selectedBoard().digitalPins), "TONEPIN");
        this.appendValueInput("FREQUENCY")
            .setCheck(Types.getCompatibleTypes('int'))
            .appendField(Blockly.Msg.ARD_TONEFREQ);
        this.appendDummyInput()
            .appendField("Hz");
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(getColour().audio);
        this.setTooltip(Blockly.Msg.ARD_TONE_TIP);
        this.setHelpUrl('https://www.arduino.cc/en/Reference/tone');
    },
    /**
     * Called whenever anything on the workspace changes.
     * It checks frequency values and sets a warning if out of range.
     * @this Blockly.Block
     */
    onchange: function (event) {
        if (!this.workspace || event.type === Blockly.Events.MOVE ||
            event.type === Blockly.Events.UI) {
            return;  // Block deleted or irrelevant event
        }
        var freq = Blockly.Arduino.valueToCode(
            this, "FREQUENCY", Blockly.Arduino.ORDER_ATOMIC)
        if (freq < 31 || freq > 65535) {
            this.setWarningText(Blockly.Msg.ARD_TONE_WARNING, 'io_tone');
        } else {
            this.setWarningText(null, 'io_tone');
        }
    }
};

Blockly.Blocks['io_notone'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(Blockly.Msg.ARD_NOTONE)
            .appendField(new Blockly.FieldDropdown(
                selectedBoard().digitalPins), "TONEPIN");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour(getColour().audio);
        this.setTooltip(Blockly.Msg.ARD_NOTONE_TIP);
        this.setHelpUrl('https://www.arduino.cc/en/Reference/noTone');
    },
    /** @return {!string} The type of input value for the block, an integer. */
    getBlockType: function () {
        return Blockly.Types.NUMBER;
    }
};
