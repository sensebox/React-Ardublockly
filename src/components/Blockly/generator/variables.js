import * as Blockly from "blockly";

const setVariableFunction = function (defaultValue) {
  return function (block) {
    var id = block.getFieldValue("VAR");

    const variableName = Blockly.Variables.getVariable(
      Blockly.getMainWorkspace(),
      id,
    ).name;

    // const variableName = Blockly.Generator.Arduino.nameDB_.getName(
    //   id,
    //   Blockly.Variables.NAME_TYPE
    // );

    const allVars = Blockly.getMainWorkspace()
      .getVariableMap()
      .getAllVariables();
    const myVar = allVars.filter((v) => v.name === variableName)[0];
    var code = "";
    if (myVar !== undefined) {
      const variableValue = Blockly.Generator.Arduino.valueToCode(
        block,
        "VALUE",
        Blockly.Generator.Arduino.ORDER_ATOMIC,
      );
      if (myVar.type === "bitmap") {
        Blockly.Generator.Arduino.variables_[variableName + myVar.type] =
          `uint16_t ${variableName}[96];\n`;
        if (variableValue != "") {
          code =`memcpy(${variableName}, ${variableValue}, sizeof(${variableName}));\n`;
        }
      } else {
        Blockly.Generator.Arduino.variables_[variableName + myVar.type] =
          `${myVar.type} ${variableName};\n`;
        code =
        `${variableName} = ${(variableValue || defaultValue)};\n`;
      }
    }
    return code;
  };
};

const getVariableFunction = function (block) {
  var id = block.getFieldValue("VAR");

  const variableName = Blockly.Variables.getVariable(
    Blockly.getMainWorkspace(),
    id,
  ).name;

  const allVars = Blockly.getMainWorkspace().getVariableMap().getAllVariables();
  const myVar = allVars.filter((v) => v.name === variableName)[0];
  // const variableName = Blockly.Generator.Arduino.nameDB_.getName(
  //   block.getFieldValue("VAR"),
  //   Blockly.Variables.NAME_TYPE
  // );
  var code = myVar.name.replace(/_/g, "__").replace(/[^a-zA-Z0-9_]/g, "_");
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

Blockly.Generator.Arduino.forBlock["variables_set_dynamic"] = setVariableFunction();
Blockly.Generator.Arduino.forBlock["variables_get_dynamic"] = getVariableFunction;
