import Blockly from 'blockly';

const setVariableFunction = function (defaultValue) {
    return function (block) {
        const variableName = Blockly['Arduino'].variableDB_.getName(
            block.getFieldValue('VAR'),
            Blockly.Variables.NAME_TYPE
        );
        const variableValue = Blockly['Arduino'].valueToCode(
            block,
            'VALUE',
            Blockly['Arduino'].ORDER_ATOMIC
        );

        const allVars = Blockly.getMainWorkspace().getVariableMap().getAllVariables();
        const myVar = allVars.filter(v => v.name === variableName)[0]

        Blockly.Arduino.variables_[myVar + myVar.type] = myVar.type + " " + myVar.name + ';\n';
        return variableName + ' = ' + (variableValue || defaultValue) + ';\n';
    };
};

const getVariableFunction = function (block) {
    const variableName = Blockly['Arduino'].variableDB_.getName(
        block.getFieldValue('VAR'),
        Blockly.Variables.NAME_TYPE
    );

    return [variableName, Blockly['Arduino'].ORDER_ATOMIC];
};

Blockly['Arduino']['variables_set_dynamic'] = setVariableFunction()
Blockly['Arduino']['variables_get_dynamic'] = getVariableFunction;