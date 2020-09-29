import * as Blockly from 'blockly/core';


Blockly['Arduino']['controls_repeat_ext'] = function (Block) {
    // Repeat n times.

    const repeats =
        Blockly['Arduino'].valueToCode(
            Block,
            'TIMES',
            Blockly['Arduino'].ORDER_ASSIGNMENT
        ) || '0';

    let branch = Blockly['Arduino'].statementToCode(Block, 'DO');
    branch = Blockly['Arduino'].addLoopTrap(branch, Block.id);
    let code = '';
    const loopVar = 'i';
    code +=
        'for (int ' +
        loopVar +
        ' = 1; ' +
        loopVar +
        ' <= ' +
        repeats +
        '; ' +
        loopVar +
        ' += 1) {\n' +
        branch +
        '}\n';

    return code;
};

Blockly['Arduino']['controls_for'] = function (Block) {
    const loopIndexVariable = Blockly.mainWorkspace.getVariableById(
        Block.getFieldValue('VAR')
    ).name;



    const branch = Blockly['Arduino'].statementToCode(Block, 'DO');

    const startNumber =
        Blockly['Arduino'].valueToCode(
            Block,
            'FROM',
            Blockly['Arduino'].ORDER_ASSIGNMENT
        ) || '0';

    const toNumber =
        Blockly['Arduino'].valueToCode(
            Block,
            'TO',
            Blockly['Arduino'].ORDER_ASSIGNMENT
        ) || '0';

    let byNumber = Math.abs(
        parseInt(
            Blockly['Arduino'].valueToCode(
                Block,
                'BY',
                Blockly['Arduino'].ORDER_ASSIGNMENT
            )
        )
    );

    byNumber = byNumber === 0 ? 1 : byNumber;

    const addingSub = startNumber < toNumber ? ' +' : ' -';
    const sign = startNumber < toNumber ? ' <= ' : ' >= ';

    return (
        'for (' +
        loopIndexVariable +
        ' = ' +
        startNumber +
        '; ' +
        loopIndexVariable +
        sign +
        toNumber +
        '; ' +
        loopIndexVariable +
        addingSub +
        '= ' +
        byNumber +
        ') {\n' +
        branch +
        '}\n'
    );
};

Blockly['Arduino']['controls_whileUntil'] = function (Block) {
    // Do while/until loop.
    const until = Block.getFieldValue('MODE') === 'UNTIL';
    let argument0 =
        Blockly['Arduino'].valueToCode(
            Block,
            'BOOL',
            Blockly['Arduino'].ORDER_LOGICAL_AND
        ) || 'false';
    let branch = Blockly['Arduino'].statementToCode(Block, 'DO');
    branch = Blockly['Arduino'].addLoopTrap(branch, Block.id);
    if (until) {
        argument0 = '!' + argument0;
    }
    return '\twhile (' + argument0 + ') {\n' + branch + '\t}\n';
};

Blockly['Arduino']['controls_flow_statements'] = function (Block) {
    // Flow statements: continue, break.
    switch (Block.getFieldValue('FLOW')) {
        case 'BREAK':
            return 'break;\n';
        case 'CONTINUE':
            return 'continue;\n';
        default:
            break;
    }
    throw Error('Unknown flow statement.');
};