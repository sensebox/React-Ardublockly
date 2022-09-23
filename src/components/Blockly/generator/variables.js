import Blockly from "blockly";

const setVariableFunction = function (defaultValue) {
  return function (block) {
    var id = block.getFieldValue("VAR");

    const variableName = Blockly.Variables.getVariable(
      Blockly.getMainWorkspace(),
      id
    ).name;

    // const variableName = Blockly["Arduino"].nameDB_.getName(
    //   id,
    //   Blockly.Variables.NAME_TYPE
    // );
    const variableValue = Blockly["Arduino"].valueToCode(
      block,
      "VALUE",
      Blockly["Arduino"].ORDER_ATOMIC
    );

    const allVars = Blockly.getMainWorkspace()
      .getVariableMap()
      .getAllVariables();
    const myVar = allVars.filter((v) => v.name === variableName)[0];
    var code = "";
    if (myVar !== undefined) {
      Blockly.Arduino.variables_[variableName + myVar.type] =
        myVar.type + " " + myVar.name + ";\n";
      code = variableName + " = " + (variableValue || defaultValue) + ";\n";
    }
    return code;
  };
};

const getVariableFunction = function (block) {
  const variableName = Blockly["Arduino"].nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly.Variables.NAME_TYPE
  );
  var code = variableName;
  return [code, Blockly["Arduino"].ORDER_ATOMIC];
};

Blockly["Arduino"]["variables_set_dynamic"] = setVariableFunction();
Blockly["Arduino"]["variables_get_dynamic"] = getVariableFunction;
