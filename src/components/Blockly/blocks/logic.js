import Blockly from 'blockly/core';
import { getColour } from '../helpers/colour';
import * as Types from '../helpers/types';
import { getCompatibleTypes } from '../helpers/types';


Blockly.defineBlocksWithJsonArray([  // BEGIN JSON EXTRACT
    // Block for boolean data type: true and false.
    {
        "type": "logic_boolean",
        "message0": "%1",
        "args0": [
            {
                "type": "field_dropdown",
                "name": "BOOL",
                "options": [
                    ["%{BKY_LOGIC_BOOLEAN_TRUE}", "TRUE"],
                    ["%{BKY_LOGIC_BOOLEAN_FALSE}", "FALSE"]
                ]
            }
        ],
        "output": "Boolean",
        "style": "logic_blocks",
        "tooltip": "%{BKY_LOGIC_BOOLEAN_TOOLTIP}",
        "helpUrl": "%{BKY_LOGIC_BOOLEAN_HELPURL}"
    },
    // Block for if/elseif/else condition.
    {
        "type": "controls_if",
        "message0": "%{BKY_CONTROLS_IF_MSG_IF} %1",
        "args0": [
            {
                "type": "input_value",
                "name": "IF0",
                "check": "Boolean"
            }
        ],
        "message1": "%{BKY_CONTROLS_IF_MSG_THEN} %1",
        "args1": [
            {
                "type": "input_statement",
                "name": "DO0"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "style": "logic_blocks",
        "helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
        "mutator": "controls_if_mutator",
        "extensions": ["controls_if_tooltip"]
    },
    // If/else block that does not use a mutator.
    {
        "type": "controls_ifelse",
        "message0": "%{BKY_CONTROLS_IF_MSG_IF} %1",
        "args0": [
            {
                "type": "input_value",
                "name": "IF0",
                "check": "Boolean"
            }
        ],
        "message1": "%{BKY_CONTROLS_IF_MSG_THEN} %1",
        "args1": [
            {
                "type": "input_statement",
                "name": "DO0"
            }
        ],
        "message2": "%{BKY_CONTROLS_IF_MSG_ELSE} %1",
        "args2": [
            {
                "type": "input_statement",
                "name": "ELSE"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "style": "logic_blocks",
        "tooltip": "%{BKYCONTROLS_IF_TOOLTIP_2}",
        "helpUrl": "%{BKY_CONTROLS_IF_HELPURL}",
        "extensions": ["controls_if_tooltip"]
    },
    // Block for comparison operator.
    {
        "type": "logic_compare",
        "message0": "%1 %2 %3",
        "args0": [
            {
                "type": "input_value",
                "name": "A"
            },
            {
                "type": "field_dropdown",
                "name": "OP",
                "options": [
                    ["=", "EQ"],
                    ["\u2260", "NEQ"],
                    ["\u200F<", "LT"],
                    ["\u200F\u2264", "LTE"],
                    ["\u200F>", "GT"],
                    ["\u200F\u2265", "GTE"]
                ]
            },
            {
                "type": "input_value",
                "name": "B"
            }
        ],
        "inputsInline": true,
        "output": "Boolean",
        "style": "logic_blocks",
        "helpUrl": "%{BKY_LOGIC_COMPARE_HELPURL}",
        "extensions": ["logic_compare", "logic_op_tooltip"]
    },
    // Block for logical operations: 'and', 'or'.
    {
        "type": "logic_operation",
        "message0": "%1 %2 %3",
        "args0": [
            {
                "type": "input_value",
                "name": "A",
                "check": "Boolean"
            },
            {
                "type": "field_dropdown",
                "name": "OP",
                "options": [
                    ["%{BKY_LOGIC_OPERATION_AND}", "AND"],
                    ["%{BKY_LOGIC_OPERATION_OR}", "OR"]
                ]
            },
            {
                "type": "input_value",
                "name": "B",
                "check": "Boolean"
            }
        ],
        "inputsInline": true,
        "output": "Boolean",
        "style": "logic_blocks",
        "helpUrl": "%{BKY_LOGIC_OPERATION_HELPURL}",
        "extensions": ["logic_op_tooltip"]
    },
    // Block for negation.
    {
        "type": "logic_negate",
        "message0": "%{BKY_LOGIC_NEGATE_TITLE}",
        "args0": [
            {
                "type": "input_value",
                "name": "BOOL",
                "check": "Boolean"
            }
        ],
        "output": "Boolean",
        "style": "logic_blocks",
        "tooltip": "%{BKY_LOGIC_NEGATE_TOOLTIP}",
        "helpUrl": "%{BKY_LOGIC_NEGATE_HELPURL}"
    },
    // Block for null data type.
    {
        "type": "logic_null",
        "message0": "%{BKY_LOGIC_NULL}",
        "output": null,
        "style": "logic_blocks",
        "tooltip": "%{BKY_LOGIC_NULL_TOOLTIP}",
        "helpUrl": "%{BKY_LOGIC_NULL_HELPURL}"
    },
    // Block for ternary operator.
    {
        "type": "logic_ternary",
        "message0": "%{BKY_LOGIC_TERNARY_CONDITION} %1",
        "args0": [
            {
                "type": "input_value",
                "name": "IF",
                "check": "Boolean"
            }
        ],
        "message1": "%{BKY_LOGIC_TERNARY_IF_TRUE} %1",
        "args1": [
            {
                "type": "input_value",
                "name": "THEN"
            }
        ],
        "message2": "%{BKY_LOGIC_TERNARY_IF_FALSE} %1",
        "args2": [
            {
                "type": "input_value",
                "name": "ELSE"
            }
        ],
        "output": null,
        "style": "logic_blocks",
        "tooltip": "%{BKY_LOGIC_TERNARY_TOOLTIP}",
        "helpUrl": "%{BKY_LOGIC_TERNARY_HELPURL}",
        "extensions": ["logic_ternary"]
    }
]);  // END JSON EXTRACT (Do not delete this comment.)

Blockly.defineBlocksWithJsonArray([ // Mutator blocks. Do not extract.
    // Block representing the if statement in the controls_if mutator.
    {
        "type": "controls_if_if",
        "message0": "%{BKY_CONTROLS_IF_IF_TITLE_IF}",
        "nextStatement": null,
        "enableContextMenu": false,
        "style": "logic_blocks",
        "tooltip": "%{BKY_CONTROLS_IF_IF_TOOLTIP}"
    },
    // Block representing the else-if statement in the controls_if mutator.
    {
        "type": "controls_if_elseif",
        "message0": "%{BKY_CONTROLS_IF_ELSEIF_TITLE_ELSEIF}",
        "previousStatement": null,
        "nextStatement": null,
        "enableContextMenu": false,
        "style": "logic_blocks",
        "tooltip": "%{BKY_CONTROLS_IF_ELSEIF_TOOLTIP}"
    },
    // Block representing the else statement in the controls_if mutator.
    {
        "type": "controls_if_else",
        "message0": "%{BKY_CONTROLS_IF_ELSE_TITLE_ELSE}",
        "previousStatement": null,
        "enableContextMenu": false,
        "style": "logic_blocks",
        "tooltip": "%{BKY_CONTROLS_IF_ELSE_TOOLTIP}"
    }
]);

Blockly.Blocks['logic_compare'] = {
    /**
     * Block for comparison operator.
     * @this Blockly.Block
     */
    init: function () {
        var OPERATORS = this.RTL ? [
            ['=', 'EQ'],
            ['\u2260', 'NEQ'],
            ['>', 'LT'],
            ['\u2265', 'LTE'],
            ['<', 'GT'],
            ['\u2264', 'GTE']
        ] : [
                ['=', 'EQ'],
                ['\u2260', 'NEQ'],
                ['<', 'LT'],
                ['\u2264', 'LTE'],
                ['>', 'GT'],
                ['\u2265', 'GTE']
            ];
        this.setHelpUrl(Blockly.Msg.LOGIC_COMPARE_HELPURL);
        this.setColour(getColour().logic);
        this.setOutput(true, Types.BOOLEAN.typeName);
        this.appendValueInput('A');
        this.appendValueInput('B')
            .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
        this.setInputsInline(true);
        // Assign 'this' to a variable for use in the tooltip closure below.
        var thisBlock = this;
        this.setTooltip(function () {
            var op = thisBlock.getFieldValue('OP');
            var TOOLTIPS = {
                'EQ': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_EQ,
                'NEQ': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_NEQ,
                'LT': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LT,
                'LTE': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LTE,
                'GT': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GT,
                'GTE': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GTE
            };
            return TOOLTIPS[op];
        });
    },
    /**
     * Called whenever anything on the workspace changes.
     * Prevent mismatched types from being compared.
     * @param {!Blockly.Events.Abstract} e Change event.
     * @this Blockly.Block
     */
    onchange: function (e) {
        var blockA = this.getInputTargetBlock('A');
        var blockB = this.getInputTargetBlock('B');
        if (blockA === null && blockB === null) {
            this.getInput('A').setCheck(null);
            this.getInput('B').setCheck(null);
        }
        if (blockA !== null && blockB === null) {
            this.getInput('A').setCheck(getCompatibleTypes(blockA.outputConnection.check_[0]));
            this.getInput('B').setCheck(getCompatibleTypes(blockA.outputConnection.check_[0]));
        }
        if (blockB !== null && blockA === null) {
            this.getInput('B').setCheck(getCompatibleTypes(blockB.outputConnection.check_[0]));
            this.getInput('A').setCheck(getCompatibleTypes(blockB.outputConnection.check_[0]));
        }
    }
};


Blockly.Blocks['switch_case'] = {
    init: function () {
        this.setColour(getColour().logic);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendValueInput('CONDITION')
            .appendField(Blockly.Msg.cases_switch);
        this.appendValueInput('CASECONDITION0')
            .appendField(Blockly.Msg.cases_condition);
        this.appendStatementInput('CASE0')
            .appendField(Blockly.Msg.cases_do);
        this.setMutator(new Blockly.Mutator(['case_incaseof', 'case_default']));
        this.setTooltip('Does something if the condition is true. If there isn\'t a matching case the default function will be executed.');
        this.caseCount_ = 0;
        this.defaultCount_ = 0;
    },

    mutationToDom: function () {
        if (!this.caseCount_ && !this.defaultCount_) {
            return null;
        }
        var container = document.createElement('mutation');
        if (this.caseCount_) {
            container.setAttribute('case', this.caseCount_);
        }
        if (this.defaultCount_) {
            container.setAttribute('default', 1);
        }
        return container;
    },

    domToMutation: function (xmlElement) {
        this.caseCount_ = parseInt(xmlElement.getAttribute('case'), 10);
        this.defaultCount_ = parseInt(xmlElement.getAttribute('default'), 10);
        for (var x = 0; x <= this.caseCount_; x++) {
            this.appendValueInput('CASECONDITION' + x)
                .appendField(Blockly.Msg.cases_condition);
            this.appendStatementInput('CASE' + x)
                .appendField(Blockly.Msg.cases_do);
        }
        if (this.defaultCount_) {
            this.appendStatementInput('ONDEFAULT')
                .appendField('default');
        }
    },

    decompose: function (workspace) {
        var containerBlock = workspace.newBlock('control_case');
        containerBlock.initSvg();
        var connection = containerBlock.getInput('STACK').connection;
        for (var x = 1; x <= this.caseCount_; x++) {
            var caseBlock = workspace.newBlock('case_incaseof');
            caseBlock.initSvg();
            connection.connect(caseBlock.previousConnection);
            connection = caseBlock.nextConnection;
        }
        if (this.defaultCount_) {
            var defaultBlock = Blockly.Block.obtain(workspace, 'case_default');
            defaultBlock.initSvg();
            connection.connect(defaultBlock.previousConnection);
        }
        return containerBlock;
    },

    compose: function (containerBlock) {
        //Disconnect all input blocks and remove all inputs.
        if (this.defaultCount_) {
            this.removeInput('ONDEFAULT');
        }
        this.defaultCount_ = 0;
        for (var x = this.caseCount_; x > 0; x--) {
            this.removeInput('CASECONDITION' + x);
            this.removeInput('CASE' + x);
        }
        this.caseCount_ = 0;
        var caseBlock = containerBlock.getInputTargetBlock('STACK');
        while (caseBlock) {
            switch (caseBlock.type) {
                case 'case_incaseof':
                    this.caseCount_++;
                    var caseconditionInput = this.appendValueInput('CASECONDITION' + this.caseCount_)
                        .appendField(Blockly.Msg.cases_condition);
                    var caseInput = this.appendStatementInput('CASE' + this.caseCount_)
                        .appendField(Blockly.Msg.cases_do);
                    if (caseBlock.valueConnection_) {
                        caseconditionInput.connection.connect(caseBlock.valueConnection_);
                    }
                    if (caseBlock.statementConnection_) {
                        caseInput.connection.connect(caseBlock.statementConnection_);
                    }
                    break;
                case 'case_default':
                    this.defaultCount_++;
                    var defaultInput = this.appendStatementInput('ONDEFAULT')
                        .appendField('default');
                    if (caseBlock.statementConnection_) {
                        defaultInput.connection.connect(caseBlock.statementConnection_);
                    }
                    break;
                default:
                    throw new Error('Unknown block type.');
            }
            caseBlock = caseBlock.nextConnection &&
                caseBlock.nextConnection.targetBlock();
        }
    },

    saveConnections: function (containerBlock) {
        var caseBlock = containerBlock.getInputTargetBlock('STACK');
        var x = 1;
        while (caseBlock) {
            switch (caseBlock.type) {
                case 'case_incaseof':
                    var caseconditionInput = this.getInput('CASECONDITION' + x);
                    var caseInput = this.getInput('CASE' + x);
                    caseBlock.valueConnection_ = caseconditionInput && caseconditionInput.connection.targetConnection;
                    caseBlock.statementConnection_ = caseInput && caseInput.connection.targetConnection;
                    x++;
                    break;
                case 'case_default':
                    var defaultInput = this.getInput('ONDEFAULT');
                    caseBlock.satementConnection_ = defaultInput && defaultInput.connection.targetConnection;
                    break;
                default:
                    throw new Error('Unknown block type');
            }
            caseBlock = caseBlock.nextConnection &&
                caseBlock.nextConnection.targetBlock();
        }
    }
};

Blockly.Blocks['control_case'] = {
    init: function () {
        this.setColour(getColour().logic);
        this.appendDummyInput()
            .appendField(Blockly.Msg.cases_switch);
        this.appendStatementInput('STACK');
        this.setTooltip('--Placeholder--');
        this.contextMenu = false;
    }
};

Blockly.Blocks['case_incaseof'] = {
    init: function () {
        this.setColour(getColour().logic);
        this.appendDummyInput()
            .appendField(Blockly.Msg.cases_add);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('--Placeholder--');
        this.contextMenu = false;
    }
};

Blockly.Blocks['case_default'] = {
    init: function () {
        this.setColour(getColour().logic);
        this.appendValueInput('default')
            .appendField('default');
        this.setPreviousStatement(true);
        this.setNextStatement(false);
        this.setTooltip('This function will run if there aren\'t any matching cases.');
        this.contextMenu = false;
    }
};
