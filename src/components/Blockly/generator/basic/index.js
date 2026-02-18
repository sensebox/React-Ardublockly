// src/components/Blockly/generators/basic/index.js
import "./generator";
import * as Blockly from "blockly/core";
import { basicGenerator } from "./generator";

// ------- Expressions (return [code, order]) -------

// Zahl
basicGenerator.forBlock["math_number"] = function (block, generator) {
  const n = String(block.getFieldValue("NUM") ?? "0");
  return [n, generator.ORDER_ATOMIC];
};

// Textliteral
basicGenerator.forBlock["text"] = function (block, generator) {
  const t = block.getFieldValue("TEXT") ?? "";
  // Doppelte Quotes escapen
  const quoted = `"${t.replace(/"/g, '""')}"`;
  return [quoted, generator.ORDER_ATOMIC];
};

// Vergleich
basicGenerator.forBlock["logic_compare"] = function (block, generator) {
  const ops = { EQ: "=", NEQ: "<>", LT: "<", LTE: "<=", GT: ">", GTE: ">=" };
  const op = ops[block.getFieldValue("OP")] || "=";
  const A =
    generator.valueToCode(block, "A", generator.ORDER_RELATIONAL) || "0";
  const B =
    generator.valueToCode(block, "B", generator.ORDER_RELATIONAL) || "0";
  return [`${A} ${op} ${B}`, generator.ORDER_RELATIONAL];
};

// Boolean
basicGenerator.forBlock["logic_boolean"] = function (block, generator) {
  const val = block.getFieldValue("BOOL") === "TRUE" ? "TRUE" : "FALSE";
  return [val, generator.ORDER_ATOMIC];
};

// ------- Statements (return string) -------

// print
basicGenerator.forBlock["text_print"] = function (block, generator) {
  const msg =
    generator.valueToCode(block, "TEXT", generator.ORDER_ATOMIC) || '""';
  let code = `PRINT ${msg}\n`;
  return generator.scrub_(block, code);
};

// if / else if / else
basicGenerator.forBlock["controls_if"] = function (block, generator) {
  let n = 0;
  let code = "";
  do {
    const cond =
      generator.valueToCode(block, "IF" + n, generator.ORDER_RELATIONAL) ||
      "FALSE";
    const branch = generator.statementToCode(block, "DO" + n) || "";
    if (n === 0) {
      code += `IF ${cond} THEN\n${branch}`;
    } else {
      code += `ELSEIF ${cond} THEN\n${branch}`;
    }
    n++;
  } while (block.getInput("IF" + n));

  if (block.getInput("ELSE")) {
    const elseBranch = generator.statementToCode(block, "ELSE") || "";
    code += `ELSE\n${elseBranch}`;
  }
  code += "END IF\n";
  return generator.scrub_(block, code);
};

// repeat N times
basicGenerator.forBlock["controls_repeat_ext"] = function (block, generator) {
  const times =
    generator.valueToCode(block, "TIMES", generator.ORDER_ATOMIC) || "0";
  const body = generator.statementToCode(block, "DO") || "";
  const code = `REPEAT ${times} TIMES\n${body}END REPEAT\n`;
  return generator.scrub_(block, code);
};

// while / until
basicGenerator.forBlock["controls_whileUntil"] = function (block, generator) {
  const isUntil = block.getFieldValue("MODE") === "UNTIL";
  const cond =
    generator.valueToCode(block, "BOOL", generator.ORDER_RELATIONAL) || "FALSE";
  const condStr = isUntil ? `NOT (${cond})` : cond;
  const body = generator.statementToCode(block, "DO") || "";
  const code = `WHILE ${condStr}\n${body}WEND\n`;
  return generator.scrub_(block, code);
};

// Variablen (Standard-Var-Blöcke)
basicGenerator.forBlock["variables_set"] = function (block, generator) {
  const varName = generator.nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly.Variables.NAME_TYPE,
  );
  const val =
    generator.valueToCode(block, "VALUE", generator.ORDER_ATOMIC) || "0";
  const code = `LET ${varName} = ${val}\n`;
  return generator.scrub_(block, code);
};

basicGenerator.forBlock["variables_get"] = function (block, generator) {
  const varName = generator.nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly.Variables.NAME_TYPE,
  );
  return [varName, generator.ORDER_ATOMIC];
};
basicGenerator.forBlock["sensebox_rgb_led"] = function (block, generator) {
  var color = block.getFieldValue("COLOR");
  return "led(255,0,0)\n";
};

basicGenerator.forBlock["basic_display"] = function (block, generator) {
  var text = block.getFieldValue("value");
  return `display(${text})\n`;
};

basicGenerator.forBlock["time_delay"] = function (block, generator) {
  const value = generator.valueToCode(
    block,
    "DELAY_TIME_MILI",
    generator.ORDER_ATOMIC,
  );
  return `delay(${value})`;
};

basicGenerator.forBlock["basic_red"] = function (block, generator) {
  return `led(255,0,0)\n`;
};
basicGenerator.forBlock["basic_yellow"] = function (block, generator) {
  return `led(255,240,0)\n`;
};
basicGenerator.forBlock["basic_blue"] = function (block, generator) {
  return `led(0,0,255)\n`;
};
basicGenerator.forBlock["basic_off"] = function (block, generator) {
  return `led(0,0,0)\n`;
};

basicGenerator.forBlock["display_print_basic"] = function (block, generator) {
  const raw = generator.valueToCode(block, "TEXT", generator.ORDER_NONE) || "";

  return `display(${raw})\n`;
};

basicGenerator.forBlock["time_delay_1s"] = function () {
  return "delay(1000)\n"; // nichts generieren
};

basicGenerator.forBlock["hdc_tmp"] = function (block) {
  // Setup-Code hinzufügen (einmalig)
  basicGenerator.addSetup("hdc_tmp_read", "temperature = readSensor");

  // Der Block selbst liefert nur den Variablennamen zurück
  return ["sensor:hdc1080:temperature", basicGenerator.ORDER_ATOMIC];
};
basicGenerator.forBlock["hdc_humi"] = function (block) {
  // Setup-Code hinzufügen (einmalig)
  basicGenerator.addSetup("hdc_humi_read", "humi = readSensor");

  // Der Block selbst liefert nur den Variablennamen zurück
  return ["sensor:hdc1080:humidity", basicGenerator.ORDER_ATOMIC];
};

basicGenerator.forBlock["time_delay_2s"] = function () {
  return "delay(2000)\n"; // nichts generieren
};

basicGenerator.forBlock["time_delay_5s"] = function () {
  return "delay(5000)\n"; // nichts generieren
};

basicGenerator.forBlock["basic_delay"] = function (block, generator) {
  const seconds =
    generator.valueToCode(block, "SECONDS", generator.ORDER_NONE) || "1";
  const milliseconds = `${seconds} * 1000`;
  return `delay(${milliseconds})\n`;
};

basicGenerator.forBlock["sensebox_start"] = function (block) {
  // Hole den Code aller Blöcke im Statement-Feld "DO"
  const statements_do = basicGenerator.statementToCode(block, "DO");

  // Optional: Füge hier Setup- oder Modul-Code hinzu, falls du willst
  const code = statements_do;

  // Gib den kombinierten Code zurück
  return code;
};
basicGenerator.forBlock["basic_if_else"] = function (block, generator) {
  // If/elseif/else condition.
  let n = 0;
  let code = "",
    branchCode,
    conditionCode;
  do {
    conditionCode =
      generator.valueToCode(block, "IF" + n, generator.ORDER_NONE) || "false";
    branchCode = generator.statementToCode(block, "DO" + n);
    code +=
      (n > 0 ? "else " : "") +
      "if (" +
      conditionCode +
      ") {\n" +
      branchCode +
      "}\n";

    ++n;
  } while (block.getInput("IF" + n));

  if (block.getInput("ELSE")) {
    branchCode = generator.statementToCode(block, "ELSE");
    code += "else {\n" + branchCode + "}\n";
  }
  return code + "\n";
};

basicGenerator.forBlock["basic_repeat_times"] = function (block, generator) {
  // Try to get times from an input connection first, then fall back to field
  let times =
    generator.valueToCode(block, "TIMES", generator.ORDER_ATOMIC) ||
    block.getFieldValue("TIMES") ||
    "10";
  // remove paranthesis from the variable
  times = times.replace(/^\((.*)\)$/, "$1");

  const body = generator.statementToCode(block, "DO") || "";

  return `i=0\nfor(i=0; i<${times}; i=i+1){\n${body}}\n\n`;
};

basicGenerator.forBlock["basic_compare"] = function (block) {
  const left =
    basicGenerator.valueToCode(block, "LEFT", basicGenerator.ORDER_NONE) || "0";
  const right =
    basicGenerator.valueToCode(block, "RIGHT", basicGenerator.ORDER_NONE) ||
    "0";
  const op = block.getFieldValue("OP");

  return [`${left} ${op} ${right}`, basicGenerator.ORDER_NONE];
};

basicGenerator.forBlock["basic_number"] = function (block) {
  const num = block.getFieldValue("NUM");
  return [String(num), basicGenerator.ORDER_NONE];
};

basicGenerator.forBlock["colour_picker"] = function (block, generator) {
  const color = block.getFieldValue("COLOUR") || "#ffffff";

  // Convert hex color to RGB
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return [`${r},${g},${b}`, generator.ORDER_ATOMIC];
};

basicGenerator.forBlock["basic_led_control"] = function (block, generator) {
  // Hole die Farbe
  const colorCode = generator.valueToCode(block, "COLOR", generator.ORDER_NONE);

  if (colorCode) {
    // colorCode kommt als RGB-String, z.B. "255,0,0"
    return `led(${colorCode})\n`;
  } else {
    // Fallback: rot
    return "led(255,0,0)\n";
  }
};

basicGenerator.forBlock["basic_rgb_color"] = function (block, generator) {
  // Get RGB values from inputs
  const r = generator.valueToCode(block, "R", generator.ORDER_NONE) || "0";
  const g = generator.valueToCode(block, "G", generator.ORDER_NONE) || "0";
  const b = generator.valueToCode(block, "B", generator.ORDER_NONE) || "0";

  // Return as RGB string (compatible with colour_picker format)
  return [`${r},${g},${b}`, generator.ORDER_ATOMIC];
};

basicGenerator.forBlock["basic_math"] = function (block, generator) {
  const left =
    generator.valueToCode(block, "LEFT", generator.ORDER_NONE) || "0";
  const right =
    generator.valueToCode(block, "RIGHT", generator.ORDER_NONE) || "0";
  const op = block.getFieldValue("OP");

  return [`(${left} ${op} ${right})`, generator.ORDER_NONE];
};
