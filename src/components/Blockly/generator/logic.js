import * as Blockly from 'blockly/core';

Blockly.Arduino['logic_boolean'] = function (Block) {
    // Boolean values true and false.
    const code = Block.getFieldValue('BOOL') === 'TRUE' ? 'true' : 'false';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['logic_compare'] = function (Block) {
    // Comparison operator.
    const OPERATORS = {
        EQ: '==',
        NEQ: '!=',
        LT: '<',
        LTE: '<=',
        GT: '>',
        GTE: '>='
    };
    const operator = OPERATORS[Block.getFieldValue('OP')];
    const order =
        operator === '==' || operator === '!='
            ? Blockly.Arduino.ORDER_EQUALITY
            : Blockly.Arduino.ORDER_RELATIONAL;
    const argument0 = Blockly.Arduino.valueToCode(Block, 'A', order) || '0';
    const argument1 = Blockly.Arduino.valueToCode(Block, 'B', order) || '0';
    const code = '( ' + argument0 + ' ' + operator + ' ' + argument1 + ')';
    return [code, order];
};

Blockly.Arduino['logic_operation'] = function (Block) {
    // Operations 'and', 'or'.
    const operator = Block.getFieldValue('OP') === 'AND' ? '&&' : '||';
    const order =
        operator === '&&'
            ? Blockly.Arduino.ORDER_LOGICAL_AND
            : Blockly.Arduino.ORDER_LOGICAL_OR;
    let argument0 = Blockly.Arduino.valueToCode(Block, 'A', order);
    let argument1 = Blockly.Arduino.valueToCode(Block, 'B', order);
    if (!argument0 && !argument1) {
        // If there are no arguments, then the return value is false.
        argument0 = 'false';
        argument1 = 'false';
    } else {
        // Single missing arguments have no effect on the return value.
        const defaultArgument = operator === '&&' ? 'true' : 'false';
        if (!argument0) {
            argument0 = defaultArgument;
        }
        if (!argument1) {
            argument1 = defaultArgument;
        }
    }
    const code = argument0 + ' ' + operator + ' ' + argument1;
    return [code, order];
};

Blockly.Arduino['controls_if'] = function (Block) {
    // If/elseif/else condition.
    let n = 0;
    let code = '',
        branchCode,
        conditionCode;
    do {
        conditionCode =
            Blockly.Arduino.valueToCode(
                Block,
                'IF' + n,
                Blockly.Arduino.ORDER_NONE
            ) || 'false';
        branchCode = Blockly.Arduino.statementToCode(Block, 'DO' + n);
        code +=
            (n > 0 ? ' else ' : '') +
            'if (' +
            conditionCode +
            ') {\n' +
            branchCode +
            '}\n';

        ++n;
    } while (Block.getInput('IF' + n));

    if (Block.getInput('ELSE')) {
        branchCode = Blockly.Arduino.statementToCode(Block, 'ELSE');
        code += ' else {\n' + branchCode + '}\n';
    }
    return code + '\n';
};

Blockly.Arduino['controls_ifelse'] = function (Block) {
    // If/elseif/else condition.
    let n = 0;
    let code = '',
        branchCode,
        conditionCode;
    do {
        conditionCode =
            Blockly.Arduino.valueToCode(
                Block,
                'IF' + n,
                Blockly.Arduino.ORDER_NONE
            ) || 'false';
        branchCode = Blockly.Arduino.statementToCode(Block, 'DO' + n);
        code +=
            (n > 0 ? ' else ' : '') +
            'if (' +
            conditionCode +
            ') {\n' +
            branchCode +
            '}\n';

        ++n;
    } while (Block.getInput('IF' + n));

    if (Block.getInput('ELSE')) {
        branchCode = Blockly.Arduino.statementToCode(Block, 'ELSE');
        code += ' else {\n' + branchCode + '}\n';
    }
    return code + '\n';
}

Blockly.Arduino['logic_negate'] = function (Block) {
    // Negation.
    const order = Blockly.Arduino.ORDER_UNARY_PREFIX;
    const argument0 = Blockly.Arduino.valueToCode(Block, 'BOOL', order) || 'true';
    const code = '!' + argument0;
    return [code, order];
};


Blockly.Arduino['switch_case'] = function (block) {
    var n = 0;
    var argument = Blockly.Arduino.valueToCode(this, 'CONDITION',
        Blockly.Arduino.ORDER_NONE) || '';
    var branch = Blockly.Arduino.statementToCode(block, 'CASECONDITON0' + n);
    var cases = '';
    var default_code = '';
    var DO = Blockly.Arduino.statementToCode(block, ('CASE' + n));
    for (n = 0; n <= block.caseCount_; n++) {
        DO = Blockly.Arduino.statementToCode(block, ('CASE' + n));
        branch = Blockly.Arduino.valueToCode(block, ('CASECONDITION' + n), Blockly.Arduino.ORDER_NONE) || '0';
        cases += 'case ' + branch + ':\n';
        cases += DO + '\nbreak;\n';
    }
    if (block.defaultCount_) {
        branch = Blockly.Arduino.statementToCode(block, 'ONDEFAULT');
        default_code = 'default: \n' + branch + '\n break;\n';
    }
    var code = 'switch (' + argument + ') {\n' + cases + default_code + '}';
    return code + '\n';
};

