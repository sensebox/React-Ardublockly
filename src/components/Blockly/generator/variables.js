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
        var code = ''

        switch (myVar.type) {
            default:
                Blockly.Arduino.variables_[myVar + myVar.type] = myVar.type + " " + myVar.name + ';\n';
                code = variableName + ' = ' + (variableValue || defaultValue) + ';\n';
                break;
            case 'Array':
                var arrayType;
                var number;

                if (this.getChildren().length > 0) {
                    if (this.getChildren()[0].type === 'lists_create_empty') {

                        arrayType = this.getChildren()[0].getFieldValue('type');
                        number = Blockly.Arduino.valueToCode(this.getChildren()[0], 'NUMBER', Blockly['Arduino'].ORDER_ATOMIC);
                        Blockly.Arduino.variables_[myVar + myVar.type] = `${arrayType} ${myVar.name} [${number}];\n`;
                    }
                }
                break;
        }
        return code;
    };
};

const getVariableFunction = function (block) {
    const variableName = Blockly['Arduino'].variableDB_.getName(
        block.getFieldValue('VAR'),
        Blockly.Variables.NAME_TYPE
    );
    var code = variableName;
    return [code, Blockly['Arduino'].ORDER_ATOMIC];
};

Blockly['Arduino']['variables_set_dynamic'] = setVariableFunction()
Blockly['Arduino']['variables_get_dynamic'] = getVariableFunction;