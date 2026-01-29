import * as Blockly from "blockly/core";
import { getColour } from "../helpers/colour";

/**
 * EINFACHE FUNKTIONSDEFINITION
 *
 * Block zum Definieren einer eigenen Funktion mit bis zu 3 Parametern
 */
Blockly.Blocks["custom_function_define"] = {
  init: function () {
    // Funktionsname und Rückgabetyp
    this.appendDummyInput()
      .appendField("Funktion")
      .appendField(new Blockly.FieldTextInput("meineFunktion"), "FUNC_NAME")
      .appendField("Rückgabe:")
      .appendField(
        new Blockly.FieldDropdown([
          ["keine (void)", "void"],
          ["Zahl (int)", "int"],
          ["Kommazahl (float)", "float"],
          ["Text (String)", "String"],
          ["Boolean", "boolean"],
        ]),
        "RETURN_TYPE",
      );

    // Parameter 1
    this.appendDummyInput("PARAM1")
      .appendField("Parameter 1:")
      .appendField(new Blockly.FieldTextInput(""), "PARAM1_NAME")
      .appendField("Typ:")
      .appendField(
        new Blockly.FieldDropdown([
          ["--", "none"],
          ["int", "int"],
          ["float", "float"],
          ["String", "String"],
          ["boolean", "boolean"],
        ]),
        "PARAM1_TYPE",
      );

    // Parameter 2
    this.appendDummyInput("PARAM2")
      .appendField("Parameter 2:")
      .appendField(new Blockly.FieldTextInput(""), "PARAM2_NAME")
      .appendField("Typ:")
      .appendField(
        new Blockly.FieldDropdown([
          ["--", "none"],
          ["int", "int"],
          ["float", "float"],
          ["String", "String"],
          ["boolean", "boolean"],
        ]),
        "PARAM2_TYPE",
      );

    // Parameter 3
    this.appendDummyInput("PARAM3")
      .appendField("Parameter 3:")
      .appendField(new Blockly.FieldTextInput(""), "PARAM3_NAME")
      .appendField("Typ:")
      .appendField(
        new Blockly.FieldDropdown([
          ["--", "none"],
          ["int", "int"],
          ["float", "float"],
          ["String", "String"],
          ["boolean", "boolean"],
        ]),
        "PARAM3_TYPE",
      );

    // Funktionskörper
    this.appendStatementInput("FUNC_BODY").appendField("Code:");

    // Rückgabewert (nur sichtbar wenn nicht void)
    this.appendValueInput("RETURN_VALUE").appendField("Rückgabe:");

    this.setColour(getColour().procedures);
    this.setTooltip("Definiere eine eigene Funktion mit Parametern");
    this.setPreviousStatement(false);
    this.setNextStatement(false);
    this.setDeletable(true);

    // Array für Parameter-Variablen initialisieren
    this.paramVarModels_ = [];
  },

  onchange: function (event) {
    if (!this.workspace || this.isInFlyout) {
      return;
    }

    // Validierung: Funktionsname prüfen
    const funcName = this.getFieldValue("FUNC_NAME");
    if (!funcName || funcName.trim() === "") {
      this.setWarningText("Funktionsname darf nicht leer sein");
      return;
    }
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(funcName)) {
      this.setWarningText(
        "Funktionsname muss mit Buchstaben beginnen und darf nur Buchstaben, Zahlen und _ enthalten",
      );
      return;
    }
    this.setWarningText(null);

    // Parameter-Variablen aktualisieren
    this.updateParameterVariables_();

    // Return-Input zeigen/verstecken
    const returnType = this.getFieldValue("RETURN_TYPE");
    const returnInput = this.getInput("RETURN_VALUE");

    if (returnType === "void") {
      if (returnInput) {
        returnInput.setVisible(false);
        if (returnInput.connection && returnInput.connection.isConnected()) {
          returnInput.connection.disconnect();
        }
      }
    } else {
      if (returnInput) {
        returnInput.setVisible(true);
        returnInput.connection.setCheck(returnType);
      }
    }
  },

  /**
   * Aktualisiert die Parameter-Variablen, damit sie im Funktionskörper verwendet werden können
   */
  updateParameterVariables_: function () {
    if (!this.workspace) return;

    // Neue Parameter sammeln
    const newParams = [];
    for (let i = 1; i <= 3; i++) {
      const paramName = this.getFieldValue(`PARAM${i}_NAME`);
      const paramType = this.getFieldValue(`PARAM${i}_TYPE`);

      if (
        paramType &&
        paramType !== "none" &&
        paramName &&
        paramName.trim() !== ""
      ) {
        newParams.push({ name: paramName, type: paramType });
      }
    }

    // Prüfe ob sich was geändert hat
    const changed =
      newParams.length !== this.paramVarModels_.length ||
      newParams.some(
        (p, i) =>
          !this.paramVarModels_[i] ||
          this.paramVarModels_[i].name !== p.name ||
          this.paramVarModels_[i].type !== p.type,
      );

    if (changed) {
      // Variablen-Models erstellen/aktualisieren
      this.paramVarModels_ = newParams.map((param) => {
        // Suche existierende Variable oder erstelle neue
        let variable = this.workspace.getVariable(param.name, param.type);
        if (!variable) {
          variable = this.workspace.createVariable(
            param.name,
            param.type,
            null,
          );
        }
        return variable;
      });
    }
  },

  /**
   * Gibt die Variablen-Models der Parameter zurück
   * So kann Blockly diese im Flyout anzeigen
   */
  getVarModels: function () {
    return this.paramVarModels_ || [];
  },
};

/**
 * EINFACHER FUNKTIONSAUFRUF
 *
 * Block zum Aufrufen einer definierten Funktion
 * Zeigt automatisch die passenden Parameter an
 */
Blockly.Blocks["custom_function_call"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Rufe Funktion auf:")
      .appendField(new Blockly.FieldTextInput("meineFunktion"), "FUNC_NAME");

    // Argument-Inputs (werden dynamisch angezeigt)
    this.appendValueInput("ARG1").appendField("Arg1:");
    this.appendValueInput("ARG2").appendField("Arg2:");
    this.appendValueInput("ARG3").appendField("Arg3:");

    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(getColour().procedures);
    this.setTooltip("Rufe eine definierte Funktion auf");

    // Alle Args initial verstecken
    this.getInput("ARG1").setVisible(false);
    this.getInput("ARG2").setVisible(false);
    this.getInput("ARG3").setVisible(false);
  },

  onchange: function (event) {
    if (!this.workspace || this.isInFlyout) {
      return;
    }

    const funcName = this.getFieldValue("FUNC_NAME");
    const allBlocks = this.workspace.getAllBlocks(false);

    // Suche die Funktionsdefinition
    let funcDef = null;
    for (let block of allBlocks) {
      if (
        block.type === "custom_function_define" &&
        block.getFieldValue("FUNC_NAME") === funcName
      ) {
        funcDef = block;
        break;
      }
    }

    if (!funcDef) {
      this.setWarningText(`Funktion "${funcName}" nicht gefunden!`);
      this.getInput("ARG1").setVisible(false);
      this.getInput("ARG2").setVisible(false);
      this.getInput("ARG3").setVisible(false);
      return;
    }

    this.setWarningText(null);

    // Call-Block bleibt IMMER ein Statement-Block
    // Auch wenn die Funktion einen Return-Wert hat, kann sie als Statement aufgerufen werden
    // (Der Return-Wert wird dann einfach ignoriert, wie in C++)
    // Dies ermöglicht es, den Block in Schleifen, if-Statements etc. zu verwenden

    // Parameter dynamisch anzeigen
    for (let i = 1; i <= 3; i++) {
      const paramName = funcDef.getFieldValue(`PARAM${i}_NAME`);
      const paramType = funcDef.getFieldValue(`PARAM${i}_TYPE`);
      const argInput = this.getInput(`ARG${i}`);

      if (
        paramType &&
        paramType !== "none" &&
        paramName &&
        paramName.trim() !== ""
      ) {
        argInput.setVisible(true);
        argInput.fieldRow[0].setValue(`${paramName}:`);
        argInput.connection.setCheck(paramType);
      } else {
        argInput.setVisible(false);
        if (argInput.connection && argInput.connection.isConnected()) {
          argInput.connection.disconnect();
        }
      }
    }
  },
};

/**
 * PARAMETER-VARIABLE BLOCK
 *
 * Ein spezieller Variablen-Getter für Funktionsparameter
 * Hat die gleiche Farbe wie Funktionsblöcke
 */
Blockly.Blocks["custom_function_parameter_get"] = {
  init: function () {
    this.setColour(getColour().procedures);
    this.appendDummyInput()
      .appendField("Parameter")
      .appendField(new Blockly.FieldVariable("param"), "VAR");
    this.setOutput(true);
    this.setTooltip("Verwende einen Funktionsparameter");
  },

  onchange: function (e) {
    const variableID = this.getFieldValue("VAR");
    const variable = Blockly.getMainWorkspace()
      ?.getVariableMap()
      ?.getVariableById(variableID);
    if (variable !== null && variable) {
      this.setOutput(true, variable.type);
    }
  },
};
