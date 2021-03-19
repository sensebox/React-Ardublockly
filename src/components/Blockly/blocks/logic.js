import Blockly from 'blockly/core';
import { getColour } from '../helpers/colour';
import * as Types from '../helpers/types';
import { getCompatibleTypes } from '../helpers/types';



Blockly.Blocks['controls_if'] = {
    /**
     * Block for if/elseif/else condition.
     * @this Blockly.Block
     */
    init: function () {
        this.setHelpUrl(Blockly.Msg.CONTROLS_IF_HELPURL);
        this.setColour(getColour().logic);
        this.appendValueInput('IF0')
            .setCheck(Types.getCompatibleTypes('boolean'))
            .appendField(Blockly.Msg.CONTROLS_IF_MSG_IF);
        this.appendStatementInput('DO0')
            .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setMutator(new Blockly.Mutator(['controls_if_elseif',
            'controls_if_else']));
        // Assign 'this' to a variable for use in the tooltip closure below.
        var thisBlock = this;
        this.setTooltip(function () {
            if (!thisBlock.elseifCount_ && !thisBlock.elseCount_) {
                return Blockly.Msg.CONTROLS_IF_TOOLTIP_1;
            } else if (!thisBlock.elseifCount_ && thisBlock.elseCount_) {
                return Blockly.Msg.CONTROLS_IF_TOOLTIP_2;
            } else if (thisBlock.elseifCount_ && !thisBlock.elseCount_) {
                return Blockly.Msg.CONTROLS_IF_TOOLTIP_3;
            } else if (thisBlock.elseifCount_ && thisBlock.elseCount_) {
                return Blockly.Msg.CONTROLS_IF_TOOLTIP_4;
            }
            return '';
        });
        this.elseifCount_ = 0;
        this.elseCount_ = 0;
    },
    /**
     * Create XML to represent the number of else-if and else inputs.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function () {
        if (!this.elseifCount_ && !this.elseCount_) {
            return null;
        }
        var container = document.createElement('mutation');
        if (this.elseifCount_) {
            container.setAttribute('elseif', this.elseifCount_);
        }
        if (this.elseCount_) {
            container.setAttribute('else', 1);
        }
        return container;
    },
    /**
     * Parse XML to restore the else-if and else inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function (xmlElement) {
        this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'), 10) || 0;
        this.elseCount_ = parseInt(xmlElement.getAttribute('else'), 10) || 0;
        this.updateShape_();
    },
    /**
     * Populate the mutator's dialog with this block's components.
     * @param {!Blockly.Workspace} workspace Mutator's workspace.
     * @return {!Blockly.Block} Root block in mutator.
     * @this Blockly.Block
     */
    decompose: function (workspace) {
        var containerBlock = workspace.newBlock('controls_if_if');
        containerBlock.initSvg();
        var connection = containerBlock.nextConnection;
        for (var i = 1; i <= this.elseifCount_; i++) {
            var elseifBlock = workspace.newBlock('controls_if_elseif');
            elseifBlock.initSvg();
            connection.connect(elseifBlock.previousConnection);
            connection = elseifBlock.nextConnection;
        }
        if (this.elseCount_) {
            var elseBlock = workspace.newBlock('controls_if_else');
            elseBlock.initSvg();
            connection.connect(elseBlock.previousConnection);
        }
        return containerBlock;
    },
    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    compose: function (containerBlock) {
        var clauseBlock = containerBlock.nextConnection.targetBlock();
        // Count number of inputs.
        this.elseifCount_ = 0;
        this.elseCount_ = 0;
        var valueConnections = [null];
        var statementConnections = [null];
        var elseStatementConnection = null;
        while (clauseBlock) {
            switch (clauseBlock.type) {
                case 'controls_if_elseif':
                    this.elseifCount_++;
                    valueConnections.push(clauseBlock.valueConnection_);
                    statementConnections.push(clauseBlock.statementConnection_);
                    break;
                case 'controls_if_else':
                    this.elseCount_++;
                    elseStatementConnection = clauseBlock.statementConnection_;
                    break;
                default:
                    throw new Error('Unknown block type.');
            }
            clauseBlock = clauseBlock.nextConnection &&
                clauseBlock.nextConnection.targetBlock();
        }
        this.updateShape_();
        // Reconnect any child blocks.
        for (var i = 1; i <= this.elseifCount_; i++) {
            Blockly.Mutator.reconnect(valueConnections[i], this, 'IF' + i);
            Blockly.Mutator.reconnect(statementConnections[i], this, 'DO' + i);
        }
        Blockly.Mutator.reconnect(elseStatementConnection, this, 'ELSE');
    },
    /**
     * Store pointers to any connected child blocks.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    saveConnections: function (containerBlock) {
        var clauseBlock = containerBlock.nextConnection.targetBlock();
        var i = 1;
        var inputDo;
        while (clauseBlock) {
            switch (clauseBlock.type) {
                case 'controls_if_elseif':
                    var inputIf = this.getInput('IF' + i);
                    inputDo = this.getInput('DO' + i);
                    clauseBlock.valueConnection_ =
                        inputIf && inputIf.connection.targetConnection;
                    clauseBlock.statementConnection_ =
                        inputDo && inputDo.connection.targetConnection;
                    i++;
                    break;
                case 'controls_if_else':
                    inputDo = this.getInput('ELSE');
                    clauseBlock.statementConnection_ =
                        inputDo && inputDo.connection.targetConnection;
                    break;
                default:
                    throw new Error('Unknown block type.');
            }
            clauseBlock = clauseBlock.nextConnection &&
                clauseBlock.nextConnection.targetBlock();
        }
    },
    /**
     * Modify this block to have the correct number of inputs.
     * @private
     * @this Blockly.Block
     */
    updateShape_: function () {
        // Delete everything.
        if (this.getInput('ELSE')) {
            this.removeInput('ELSE');
        }
        var j = 1;
        while (this.getInput('IF' + j)) {
            this.removeInput('IF' + j);
            this.removeInput('DO' + j);
            j++;
        }
        // Rebuild block.
        for (var i = 1; i <= this.elseifCount_; i++) {
            this.appendValueInput('IF' + i)
                .setCheck(Types.getCompatibleTypes('boolean'))
                .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSEIF);
            this.appendStatementInput('DO' + i)
                .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
        }
        if (this.elseCount_) {
            this.appendStatementInput('ELSE')
                .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
        }
    }
};

Blockly.Blocks['controls_if_if'] = {
    /**
     * Mutator block for if container.
     * @this Blockly.Block
     */
    init: function () {
        this.setColour(getColour().logic);
        this.appendDummyInput()
            .appendField(Blockly.Msg.CONTROLS_IF_IF_TITLE_IF);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.CONTROLS_IF_IF_TOOLTIP);
        this.contextMenu = false;
    }
};

Blockly.Blocks['controls_if_elseif'] = {
    /**
     * Mutator bolck for else-if condition.
     * @this Blockly.Block
     */
    init: function () {
        this.setColour(getColour().logic);
        this.appendDummyInput()
            .appendField(Blockly.Msg.CONTROLS_IF_ELSEIF_TITLE_ELSEIF);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.CONTROLS_IF_ELSEIF_TOOLTIP);
        this.contextMenu = false;
    }
};

Blockly.Blocks['controls_if_else'] = {
    /**
     * Mutator block for else condition.
     * @this Blockly.Block
     */
    init: function () {
        this.setColour(getColour().logic);
        this.appendDummyInput()
            .appendField(Blockly.Msg.CONTROLS_IF_ELSE_TITLE_ELSE);
        this.setPreviousStatement(true);
        this.setTooltip(Blockly.Msg.CONTROLS_IF_ELSE_TOOLTIP);
        this.contextMenu = false;
    }
};


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
        "output": Types.BOOLEAN.typeName,
        "style": "logic_blocks",
        "tooltip": "%{BKY_LOGIC_BOOLEAN_TOOLTIP}",
        "helpUrl": "%{BKY_LOGIC_BOOLEAN_HELPURL}"
    },
    {
        "type": "controls_ifelse",
        "message0": "%{BKY_CONTROLS_IF_MSG_IF} %1",
        "args0": [
            {
                "type": "input_value",
                "name": "IF0",
                "check": Types.getCompatibleTypes('boolean')
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
        "output": Types.BOOLEAN.typeName,
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
                "check": Types.getCompatibleTypes('boolean')
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
                "check": Types.getCompatibleTypes('boolean')
            }
        ],
        "inputsInline": true,
        "output": Types.BOOLEAN.typeName,
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
                "check": Types.getCompatibleTypes('boolean'),
            }
        ],
        "output": Types.BOOLEAN.typeName,
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
                "check": Types.getCompatibleTypes('boolean'),
            }
        ],
        "message1": "%{BKY_LOGIC_TERNARY_IF_TRUE} %1",
        "args1": [
            {
                "type": "input_value",
                "name": "THEN",
                "check": Types.getCompatibleTypes('boolean'),
            }
        ],
        "message2": "%{BKY_LOGIC_TERNARY_IF_FALSE} %1",
        "args2": [
            {
                "type": "input_value",
                "name": "ELSE",
                "check": Types.getCompatibleTypes('boolean'),
            }
        ],
        "output": null,
        "style": "logic_blocks",
        "tooltip": "%{BKY_LOGIC_TERNARY_TOOLTIP}",
        "helpUrl": "%{BKY_LOGIC_TERNARY_HELPURL}",
        "extensions": ["logic_ternary"]
    }
]);  // END JSON EXTRACT (Do not delete this comment.)


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
        this.setTooltip(Blockly.Msg.cases_tooltip);
        this.setNextStatement(true);
        this.appendValueInput('CONDITION')
            .appendField(Blockly.Msg.cases_switch);
        this.appendValueInput('CASECONDITION0')
            .appendField(Blockly.Msg.cases_condition);
        this.appendStatementInput('CASE0')
            .appendField(Blockly.Msg.cases_do);
        this.setMutator(new Blockly.Mutator(['case_incaseof', 'case_default']));
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
