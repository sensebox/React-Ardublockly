import { defineBlocksWithJsonArray } from 'blockly';
import Blockly from 'blockly/core';




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



