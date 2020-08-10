import * as Blockly from 'blockly/core';
import { getColour } from '../helpers/colour';
import * as Types from '../helpers/types'


Blockly.Blocks['sensebox_display_beginDisplay'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_display_beginDisplay)
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(getColour().sensebox);
        this.setTooltip(Blockly.Msg.senseBox_display_beginDisplay_tip);
        this.setHelpUrl('https://sensebox.de/books');
    }
};

Blockly.Blocks['sensebox_display_clearDisplay'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_display_clearDisplay)
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(getColour().sensebox);
        this.setTooltip(Blockly.Msg.senseBox_display_clearDisplay_tip);
        this.setHelpUrl('https://sensebox.de/books');
    }
};

Blockly.Blocks['sensebox_display_printDisplay'] = {
    init: function (block) {
        this.setColour(getColour().sensebox);
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_display_printDisplay);
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_display_color)
            .appendField(new Blockly.FieldDropdown([[Blockly.Msg.senseBox_display_white, "WHITE,BLACK"], [Blockly.Msg.senseBox_display_black, "BLACK,WHITE"]]), "COLOR");
        this.appendValueInput("SIZE", 'Number')
            .appendField(Blockly.Msg.senseBox_display_setSize);
        this.appendValueInput("X", 'Number')
            .appendField(Blockly.Msg.senseBox_display_printDisplay_x);
        this.appendValueInput("Y", 'Number')
            .appendField(Blockly.Msg.senseBox_display_printDisplay_y);
        this.appendValueInput('printDisplay')
            .appendField(Blockly.Msg.senseBox_display_printDisplay_value)
            .setCheck(null);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(Blockly.Msg.senseBox_display_printDisplay_tip);
        this.setHelpUrl('https://sensebox.de/books');
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
    LOOP_TYPES: ['sensebox_display_show'],
};


Blockly.Blocks['sensebox_display_plotDisplay'] = {
    init: function () {
        this.setColour(getColour().sensebox);
        this.appendDummyInput()
            .appendField(Blockly.Msg.senseBox_display_plotDisplay)
        this.appendValueInput("Title", 'Text')
            .appendField(Blockly.Msg.senseBox_display_plotTitle);
        this.appendValueInput("YLabel", 'Text')
            .appendField(Blockly.Msg.senseBox_display_plotYLabel);
        this.appendValueInput("XLabel", 'Text')
            .appendField(Blockly.Msg.senseBox_display_plotXLabel);
        this.appendValueInput("XRange1", 'Number')
            .appendField(Blockly.Msg.senseBox_display_plotXRange1);
        this.appendValueInput("XRange2", 'Number')
            .appendField(Blockly.Msg.senseBox_display_plotXRange2)
        this.appendValueInput("YRange1", 'Number')
            .appendField(Blockly.Msg.senseBox_display_plotYRange1);
        this.appendValueInput("YRange2", 'Number')
            .appendField(Blockly.Msg.senseBox_display_plotYRange2);
        this.setInputsInline(false);
        this.appendValueInput("XTick", 'Number')
            .appendField(Blockly.Msg.senseBox_display_plotXTick);
        this.appendValueInput("YTick", 'Number')
            .appendField(Blockly.Msg.senseBox_display_plotYTick);
        this.appendValueInput("TimeFrame", 'Number')
            .appendField(Blockly.Msg.senseBox_display_plotTimeFrame);
        this.appendValueInput('plotDisplay')
            .appendField(Blockly.Msg.senseBox_display_printDisplay_value)
            .setCheck(null);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(Blockly.Msg.senseBox_display_printDisplay_tip);
        this.setHelpUrl('https://sensebox.de/books');
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
    LOOP_TYPES: ['sensebox_display_show'],
};

Blockly.Blocks['sensebox_display_show'] = {
    init: function () {

        this.setColour(getColour().sensebox);
        this.appendDummyInput()
            .appendField(Blockly.Msg.sensebox_display_show);
        this.appendStatementInput('SHOW');
        this.setTooltip(Blockly.Msg.sensebox_display_show_tip);
        this.setHelpUrl('');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.Blocks['sensebox_display_fillCircle'] = {
    init: function () {
        this.setColour(getColour().sensebox);
        this.appendDummyInput()
            .appendField(Blockly.Msg.sensebox_display_fillCircle);
        this.appendValueInput('X')
            .appendField(Blockly.Msg.senseBox_display_printDisplay_x)
            .setCheck(Types.NUMBER.compatibleTypes);
        this.appendValueInput('Y')
            .appendField(Blockly.Msg.senseBox_display_printDisplay_y)
            .setCheck(Types.NUMBER.compatibleTypes);
        this.appendValueInput('Radius')
            .appendField(Blockly.Msg.sensebox_display_fillCircle_radius)
            .setCheck(Types.NUMBER.compatibleTypes);
        this.appendDummyInput('fill')
            .appendField(Blockly.Msg.senseBox_display_filled)
            .appendField(new Blockly.FieldCheckbox("TRUE"), "FILL");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
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
    LOOP_TYPES: ['sensebox_display_show'],
};

Blockly.Blocks['sensebox_display_drawRectangle'] = {
    init: function () {
        this.setColour(getColour().sensebox);
        this.appendDummyInput()
            .appendField(Blockly.Msg.sensebox_display_drawRectangle);
        this.appendValueInput('X')
            .appendField(Blockly.Msg.senseBox_display_printDisplay_x)
            .setCheck(Types.NUMBER.compatibleTypes);
        this.appendValueInput('Y')
            .appendField(Blockly.Msg.senseBox_display_printDisplay_y)
            .setCheck(Types.NUMBER.compatibleTypes);
        this.appendValueInput('width')
            .appendField(Blockly.Msg.sensebox_display_drawRectangle_width)
            .setCheck(Types.NUMBER.compatibleTypes);
        this.appendValueInput('height')
            .appendField(Blockly.Msg.sensebox_display_drawRectangle_height)
            .setCheck(Types.NUMBER.compatibleTypes);
        this.appendDummyInput('fill')
            .appendField(Blockly.Msg.senseBox_display_filled)
            .appendField(new Blockly.FieldCheckbox("TRUE"), "FILL");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
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
    LOOP_TYPES: ['sensebox_display_show'],
};