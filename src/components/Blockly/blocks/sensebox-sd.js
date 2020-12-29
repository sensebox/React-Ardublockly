import * as Blockly from 'blockly/core';
import { getColour } from '../helpers/colour';


Blockly.Blocks['sensebox_sd_open_file'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_sd_open_file)
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField(
                new Blockly.FieldTextInput('Data.txt'),
                'Filename');
        this.appendStatementInput('SD')
            .setCheck(null);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(getColour().sensebox);
        this.setTooltip(Blockly.Msg.senseBox_sd_open_file_tooltip);
        this.setHelpUrl('https://docs.sensebox.de/hardware/bee-sd/');
    }
};

Blockly.Blocks['sensebox_sd_create_file'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_sd_create_file)
            .setAlign(Blockly.ALIGN_LEFT)
            .appendField(Blockly.Msg.senseBox_output_filename)
            .appendField(
                new Blockly.FieldTextInput('Data.txt'),
                'Filename');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(getColour().sensebox);
        this.setTooltip(Blockly.Msg.senseBox_sd_create_file_tooltip);
        this.setHelpUrl('https://docs.sensebox.de/hardware/bee-sd/');
    }
};

Blockly.Blocks['sensebox_sd_write_file'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_sd_write_file)
            .setAlign(Blockly.ALIGN_LEFT);
        this.appendValueInput('DATA')
            .setCheck(null);
        this.appendDummyInput('CheckboxText')
            .appendField(Blockly.Msg.senseBox_output_linebreak)
            .appendField(new Blockly.FieldCheckbox('TRUE'), 'linebreak');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(getColour().sensebox);
        this.setTooltip(Blockly.Msg.senseBox_sd_write_file_tooltip);
        this.setHelpUrl('https://docs.sensebox.de/hardware/bee-sd/');
    },
    /**
     * Called whenever anything on the workspace changes.
     * Add warning if block is not nested inside a the correct loop.
     * @param {!Blockly.Events.Abstract} e Change event.
     * @this Blockly.Block
     */
    onchange: function (e) {
        var legal = false;
        // Is the block nested in a loop?
        var block = this;
        do {
            if (this.LOOP_TYPES.indexOf(block.type) !== -1) {
                legal = true;
                break;
            }
            block = block.getSurroundParent();
        } while (block);
        if (legal) {
            this.setWarningText(null);
        } else {
            this.setWarningText(Blockly.Msg.CONTROLS_FLOW_STATEMENTS_WARNING);
        }
    },
    LOOP_TYPES: ['sensebox_sd_open_file'],
};
