
import Blockly from 'blockly';
import { getColour } from '../helpers/colour';
import { getCompatibleTypes } from '../helpers/types'
import * as Types from '../helpers/types';

Blockly.Blocks['controls_whileUntil'] = {
    /**
     * Block for 'do while/until' loop.
     * @this Blockly.Block
     */
    init: function () {
        var OPERATORS =
            [[Blockly.Msg.CONTROLS_WHILEUNTIL_OPERATOR_WHILE, 'WHILE'],
            [Blockly.Msg.CONTROLS_WHILEUNTIL_OPERATOR_UNTIL, 'UNTIL']];
        this.setHelpUrl(Blockly.Msg.CONTROLS_WHILEUNTIL_HELPURL);
        this.setColour(getColour().loops);
        this.appendValueInput('BOOL')
            .setCheck(getCompatibleTypes(Boolean))
            .appendField(new Blockly.FieldDropdown(OPERATORS), 'MODE');
        this.appendStatementInput('DO')
            .appendField(Blockly.Msg.CONTROLS_WHILEUNTIL_INPUT_DO);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        // Assign 'this' to a variable for use in the tooltip closure below.
        var thisBlock = this;
        this.setTooltip(function () {
            var op = thisBlock.getFieldValue('MODE');
            var TOOLTIPS = {
                'WHILE': Blockly.Msg.CONTROLS_WHILEUNTIL_TOOLTIP_WHILE,
                'UNTIL': Blockly.Msg.CONTROLS_WHILEUNTIL_TOOLTIP_UNTIL
            };
            return TOOLTIPS[op];
        });
    }
};

Blockly.Blocks['controls_for'] = {
    /**
     * Block for 'for' loop.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.CONTROLS_FOR_TITLE,
            "args0": [
                {
                    "type": "field_variable",
                    "name": "VAR",
                    "defaultType": Types.NUMBER.typeName,
                    "variable": null
                },
                {
                    "type": "input_value",
                    "name": "FROM",
                    "check": getCompatibleTypes(Number),
                    "align": "RIGHT"
                },
                {
                    "type": "input_value",
                    "name": "TO",
                    "check": getCompatibleTypes(Number),
                    "align": "RIGHT"
                },
                {
                    "type": "input_value",
                    "name": "BY",
                    "check": getCompatibleTypes(Number),
                    "align": "RIGHT"
                }
            ],
            "inputsInline": true,
            "previousStatement": null,
            "nextStatement": null,
            "colour": getColour().loops,
            "helpUrl": Blockly.Msg.CONTROLS_FOR_HELPURL
        });
        this.appendStatementInput('DO')
            .appendField(Blockly.Msg.CONTROLS_FOR_INPUT_DO);
        // Assign 'this' to a variable for use in the tooltip closure below.
        var thisBlock = this;
        this.setTooltip(function () {
            return Blockly.Msg.CONTROLS_FOR_TOOLTIP.replace('%1',
                thisBlock.getFieldValue('VAR'));
        });
    }
};

Blockly.Blocks['controls_forEach'] = {
    /**
     * Block for 'for each' loop.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.CONTROLS_FOREACH_TITLE,
            "args0": [
                {
                    "type": "field_variable",
                    "name": "VAR",
                    "defaultType": Types.NUMBER.typeName,
                    "variable": null
                },
                {
                    "type": "input_value",
                    "name": "LIST",
                    "check": getCompatibleTypes(Array)
                }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": getColour().loops,
            "helpUrl": Blockly.Msg.CONTROLS_FOREACH_HELPURL
        });
        this.appendStatementInput('DO')
            .appendField(Blockly.Msg.CONTROLS_FOREACH_INPUT_DO);
        // Assign 'this' to a variable for use in the tooltip closure below.
        var thisBlock = this;
        this.setTooltip(function () {
            return Blockly.Msg.CONTROLS_FOREACH_TOOLTIP.replace('%1',
                thisBlock.getFieldValue('VAR'));
        });
    },
    customContextMenu: Blockly.Blocks['controls_for'].customContextMenu,
    /** @returns {!string} The type of the variable used in this block */
    getVarType: function (varName) {
        return Blockly.Types.NUMBER;
    }
};

Blockly.Blocks['controls_flow_statements'] = {
    /**
     * Block for flow statements: continue, break.
     * @this Blockly.Block
     */
    init: function () {
        var OPERATORS =
            [[Blockly.Msg.CONTROLS_FLOW_STATEMENTS_OPERATOR_BREAK, 'BREAK'],
            [Blockly.Msg.CONTROLS_FLOW_STATEMENTS_OPERATOR_CONTINUE, 'CONTINUE']];
        this.setHelpUrl(Blockly.Msg.CONTROLS_FLOW_STATEMENTS_HELPURL);
        this.setColour(getColour().loops);
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(OPERATORS), 'FLOW');
        this.setPreviousStatement(true);
        // Assign 'this' to a variable for use in the tooltip closure below.
        var thisBlock = this;
        this.setTooltip(function () {
            var op = thisBlock.getFieldValue('FLOW');
            var TOOLTIPS = {
                'BREAK': Blockly.Msg.CONTROLS_FLOW_STATEMENTS_TOOLTIP_BREAK,
                'CONTINUE': Blockly.Msg.CONTROLS_FLOW_STATEMENTS_TOOLTIP_CONTINUE
            };
            return TOOLTIPS[op];
        });
    },
    /**
     * Called whenever anything on the workspace changes.
     * Add warning if this flow block is not nested inside a loop.
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
    /**
     * List of block types that are loops and thus do not need warnings.
     * To add a new loop type add this to your code:
     * Blockly.Blocks['controls_flow_statements'].LOOP_TYPES.push('custom_loop');
     */
    LOOP_TYPES: ['controls_repeat', 'controls_repeat_ext', 'controls_forEach',
        'controls_for', 'controls_whileUntil']
};

Blockly.Blocks['controls_repeat_ext'] = {
    /**
     * Block for repeat n times (external number).
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.CONTROLS_REPEAT_TITLE,
            "args0": [
                {
                    "type": "input_value",
                    "name": "TIMES",
                    "check": getCompatibleTypes(Number),
                }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": getColour().loops,
            "tooltip": Blockly.Msg.CONTROLS_REPEAT_TOOLTIP,
            "helpUrl": Blockly.Msg.CONTROLS_REPEAT_HELPURL
        });
        this.appendStatementInput('DO')
            .appendField(Blockly.Msg.CONTROLS_REPEAT_INPUT_DO);
    }
};

