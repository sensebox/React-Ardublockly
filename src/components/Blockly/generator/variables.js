import * as Blockly from "blockly";

// Flag to prevent multiple alerts
let alertShown = false;

/**
 * @param {string} name
 * @param {!Blockly.Workspace} workspace
 * @return {Blockly.VariableModel|null}
 */
function validateVariable(name, workspace) {
  if (!name) {
    return null;
  }

  name = name.trim();

  if (!name) {
    return null;
  }

  // Sammle alle Validierungsfehler
  let errorMessage = null;

  const reservedWords = Blockly.Generator.Arduino.RESERVED_WORDS_
    ? Blockly.Generator.Arduino.RESERVED_WORDS_.split(",")
    : [];

  if (reservedWords.includes(name)) {
    errorMessage =
      "The name '" + name + "' is a reserved word and cannot be used.";
  } else if (/^\d/.test(name)) {
    errorMessage =
      "The name '" + name + "' starts with a number and cannot be used.";
  } else if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
    errorMessage =
      "The name '" + name + "' contains invalid characters and cannot be used.";
  }

  // Zeige nur einen Alert an, wenn ein Fehler gefunden wurde
  if (errorMessage && !alertShown) {
    alertShown = true;
    if (Blockly.Msg.PROCEDURES_INVALID_NAME) {
      alert(Blockly.Msg.PROCEDURES_INVALID_NAME.replace("%1", name));
    } else {
      alert(errorMessage);
    }
    // Reset the flag after a short delay
    setTimeout(() => {
      alertShown = false;
    }, 1000);
    return null;
  }

  let variable = workspace.getVariable(name);
  if (!variable) {
    variable = workspace.createVariable(name);
  }
  return variable;
}

const setVariableFunction = function (defaultValue) {
  return function (block) {
    var id = block.getFieldValue("VAR");

    const variable = Blockly.Variables.getVariable(
      Blockly.getMainWorkspace(),
      id,
    );

    if (!variable) {
      return "";
    }

    const validatedVariable = validateVariable(
      variable.name,
      Blockly.getMainWorkspace(),
    );
    if (!validatedVariable) {
      return "";
    }

    const variableName = validatedVariable.name;
    const variableValue = Blockly.Generator.Arduino.valueToCode(
      block,
      "VALUE",
      Blockly.Generator.Arduino.ORDER_ATOMIC,
    );

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
          code = `memcpy(${variableName}, ${variableValue}, sizeof(${variableName}));\n`;
        }
      } else {
        Blockly.Generator.Arduino.variables_[variableName + myVar.type] =
          `${myVar.type} ${variableName};\n`;
        code = `${variableName} = ${variableValue || defaultValue};\n`;
      }
    }
    return code;
  };
};

const getVariableFunction = function (block) {
  var id = block.getFieldValue("VAR");

  const variable = Blockly.Variables.getVariable(
    Blockly.getMainWorkspace(),
    id,
  );

  if (!variable) {
    return ["0", Blockly.Generator.Arduino.ORDER_ATOMIC];
  }

  const validatedVariable = validateVariable(
    variable.name,
    Blockly.getMainWorkspace(),
  );
  if (!validatedVariable) {
    return ["0", Blockly.Generator.Arduino.ORDER_ATOMIC];
  }

  const variableName = validatedVariable.name;

  const allVars = Blockly.getMainWorkspace().getVariableMap().getAllVariables();
  const myVar = allVars.filter((v) => v.name === variableName)[0];
  var code = myVar.name.replace(/_/g, "__").replace(/[^a-zA-Z0-9_]/g, "_");
  return [code, Blockly.Generator.Arduino.ORDER_ATOMIC];
};

Blockly.Generator.Arduino.forBlock["variables_set_dynamic"] =
  setVariableFunction();
Blockly.Generator.Arduino.forBlock["variables_get_dynamic"] =
  getVariableFunction;
