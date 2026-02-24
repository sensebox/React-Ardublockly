import * as Blockly from "blockly/core";

/**
 * GENERATOR FÜR FUNKTIONSDEFINITION
 *
 * Generiert Arduino-Code für eine Funktionsdefinition mit Parametern
 */
Blockly.Generator.Arduino.forBlock["custom_function_define"] = function (
  block,
  generator,
) {
  const funcName = block.getFieldValue("FUNC_NAME");
  const returnType = block.getFieldValue("RETURN_TYPE");

  // Funktionskörper generieren
  const funcBody = Blockly.Generator.Arduino.statementToCode(
    block,
    "FUNC_BODY",
  );

  // Parameter sammeln
  const params = [];
  for (let i = 1; i <= 3; i++) {
    const paramName = block.getFieldValue(`PARAM${i}_NAME`);
    const paramType = block.getFieldValue(`PARAM${i}_TYPE`);

    if (
      paramType &&
      paramType !== "none" &&
      paramName &&
      paramName.trim() !== ""
    ) {
      params.push(`${paramType} ${paramName}`);
    }
  }

  // Return-Statement generieren (nur wenn nicht void)
  let returnStatement = "";
  if (returnType !== "void") {
    const returnValue = Blockly.Generator.Arduino.valueToCode(
      block,
      "RETURN_VALUE",
      Blockly.Generator.Arduino.ORDER_NONE,
    );
    if (returnValue) {
      returnStatement = `  return ${returnValue};\n`;
    }
  }

  // Komplette Funktionsdefinition zusammenbauen
  let code = `${returnType} ${funcName}(${params.join(", ")}) {\n`;
  code += funcBody;
  code += returnStatement;
  code += "}\n";

  // Funktion in die definitions schreiben (nicht in den loop)
  code = Blockly.Generator.Arduino.scrub_(block, code);
  Blockly.Generator.Arduino.functionNames_["%" + funcName] = code;

  // Block selbst gibt keinen Code zurück (steht außerhalb von setup/loop)
  return null;
};

/**
 * GENERATOR FÜR FUNKTIONSAUFRUF
 *
 * Generiert Arduino-Code für einen Funktionsaufruf mit Argumenten
 */
Blockly.Generator.Arduino.forBlock["custom_function_call"] = function (
  block,
  generator,
) {
  const funcName = block.getFieldValue("FUNC_NAME");

  // Argumente sammeln
  const args = [];
  for (let i = 1; i <= 3; i++) {
    const argInput = block.getInput(`ARG${i}`);
    if (argInput && argInput.isVisible()) {
      const argValue = Blockly.Generator.Arduino.valueToCode(
        block,
        `ARG${i}`,
        Blockly.Generator.Arduino.ORDER_NONE,
      );
      args.push(argValue || "");
    }
  }

  // Funktionsaufruf generieren
  const functionCall = `${funcName}(${args.join(", ")})`;

  // Wenn die Funktion einen Rückgabewert hat, als Expression zurückgeben
  if (block.outputConnection) {
    return [functionCall, Blockly.Generator.Arduino.ORDER_ATOMIC];
  } else {
    // Sonst als Statement mit Semikolon
    return `${functionCall};\n`;
  }
};

/**
 * GENERATOR FÜR PARAMETER-VARIABLE
 *
 * Gibt einfach den Parameternamen zurück
 */
Blockly.Generator.Arduino.forBlock["custom_function_parameter_get"] = function (
  block,
  generator,
) {
  const variable = block.getField("VAR").getVariable();
  const varName = variable.name;
  return [varName, Blockly.Generator.Arduino.ORDER_ATOMIC];
};
