// src/components/Blockly/generators/basic/index.js
import "./generator";
import * as Blockly from "blockly/core";

// ------- Expressions (return [code, order]) -------

// Zahl
Blockly.Generator.Basic.forBlock["math_number"] = function (block, generator) {
  const n = String(block.getFieldValue("NUM") ?? "0");
  return [n, generator.ORDER_ATOMIC];
};

// Textliteral
Blockly.Generator.Basic.forBlock["text"] = function (block, generator) {
  const t = block.getFieldValue("TEXT") ?? "";
  // Doppelte Quotes escapen
  const quoted = `"${t.replace(/"/g, '""')}"`;
  return [quoted, generator.ORDER_ATOMIC];
};

// Vergleich
Blockly.Generator.Basic.forBlock["logic_compare"] = function (
  block,
  generator,
) {
  const ops = { EQ: "=", NEQ: "<>", LT: "<", LTE: "<=", GT: ">", GTE: ">=" };
  const op = ops[block.getFieldValue("OP")] || "=";
  const A =
    generator.valueToCode(block, "A", generator.ORDER_RELATIONAL) || "0";
  const B =
    generator.valueToCode(block, "B", generator.ORDER_RELATIONAL) || "0";
  return [`${A} ${op} ${B}`, generator.ORDER_RELATIONAL];
};

// Boolean
Blockly.Generator.Basic.forBlock["logic_boolean"] = function (
  block,
  generator,
) {
  const val = block.getFieldValue("BOOL") === "TRUE" ? "TRUE" : "FALSE";
  return [val, generator.ORDER_ATOMIC];
};

// ------- Statements (return string) -------

// print
Blockly.Generator.Basic.forBlock["text_print"] = function (block, generator) {
  const msg =
    generator.valueToCode(block, "TEXT", generator.ORDER_ATOMIC) || '""';
  let code = `PRINT ${msg}\n`;
  return generator.scrub_(block, code);
};

// if / else if / else
Blockly.Generator.Basic.forBlock["controls_if"] = function (block, generator) {
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
Blockly.Generator.Basic.forBlock["controls_repeat_ext"] = function (
  block,
  generator,
) {
  const times =
    generator.valueToCode(block, "TIMES", generator.ORDER_ATOMIC) || "0";
  const body = generator.statementToCode(block, "DO") || "";
  const code = `REPEAT ${times} TIMES\n${body}END REPEAT\n`;
  return generator.scrub_(block, code);
};

// while / until
Blockly.Generator.Basic.forBlock["controls_whileUntil"] = function (
  block,
  generator,
) {
  const isUntil = block.getFieldValue("MODE") === "UNTIL";
  const cond =
    generator.valueToCode(block, "BOOL", generator.ORDER_RELATIONAL) || "FALSE";
  const condStr = isUntil ? `NOT (${cond})` : cond;
  const body = generator.statementToCode(block, "DO") || "";
  const code = `WHILE ${condStr}\n${body}WEND\n`;
  return generator.scrub_(block, code);
};

// Variablen (Standard-Var-Blöcke)
Blockly.Generator.Basic.forBlock["variables_set"] = function (
  block,
  generator,
) {
  const varName = generator.nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly.Variables.NAME_TYPE,
  );
  const val =
    generator.valueToCode(block, "VALUE", generator.ORDER_ATOMIC) || "0";
  const code = `LET ${varName} = ${val}\n`;
  return generator.scrub_(block, code);
};

Blockly.Generator.Basic.forBlock["variables_get"] = function (
  block,
  generator,
) {
  const varName = generator.nameDB_.getName(
    block.getFieldValue("VAR"),
    Blockly.Variables.NAME_TYPE,
  );
  return [varName, generator.ORDER_ATOMIC];
};
Blockly.Generator.Basic.forBlock["sensebox_rgb_led"] = function (
  block,
  generator,
) {
  var color = block.getFieldValue("COLOR");
  return "led(255,0,0)\n";
};

Blockly.Generator.Basic.forBlock["basic_display"] = function (
  block,
  generator,
) {
  var text = block.getFieldValue("value");
  return `display(${text})\n`;
};

Blockly.Generator.Basic.forBlock["time_delay"] = function (block, generator) {
  const value = generator.valueToCode(
    block,
    "DELAY_TIME_MILI",
    generator.ORDER_ATOMIC,
  );
  return `delay(${value})`;
};

Blockly.Generator.Basic.forBlock["basic_red"] = function (block, generator) {
  return `led(255,0,0)\n`;
};
Blockly.Generator.Basic.forBlock["basic_yellow"] = function (block, generator) {
  return `led(255,255,0)\n`;
};
Blockly.Generator.Basic.forBlock["basic_blue"] = function (block, generator) {
  return `led(0,0,255)\n`;
};
Blockly.Generator.Basic.forBlock["basic_off"] = function (block, generator) {
  return `led(0,0,0)\n`;
};

Blockly.Generator.Basic.forBlock["display_print_basic"] = function (
  block,
  generator,
) {
  const value =
    generator.valueToCode(block, "inside", generator.ORDER_ATOMIC) || '""';
  return `display(${value})\n`;
};

Blockly.Generator.Basic.forBlock["time_delay_1s"] = function () {
  return "delay(1000)"; // nichts generieren
};

Blockly.Generator.Basic.forBlock["time_delay_2s"] = function () {
  return "delay(2000)"; // nichts generieren
};

Blockly.Generator.Basic.forBlock["time_delay_5s"] = function () {
  return "delay(5000)"; // nichts generieren
};

Blockly.Generator.Basic.forBlock["sensebox_start"] = function (block) {
  // Hole den Code aller Blöcke im Statement-Feld "DO"
  const statements_do = Blockly.Generator.Basic.statementToCode(block, "DO");

  // Optional: Füge hier Setup- oder Modul-Code hinzu, falls du willst
  const code = statements_do;

  // Gib den kombinierten Code zurück
  return code;
};

// Default-Fallback: Unsupported Block -> Kommentar
// Blockly.Generator.Basic.blockToCode = function (block) {
//   const fn = Blockly.Generator.Basic.forBlock?.[block.type];
//   if (!fn) {
//     return `REM Unsupported block: ${block.type}\n`;
//   }
//   return fn.call(Blockly.Generator.Basic, block, Blockly.Generator.Basic);
// };

// Name-DB initialisieren, wenn ein Workspace kompiliert wird
Blockly.Generator.Basic.init = function (workspace) {
  Blockly.Generator.prototype.init.call(this, workspace);
  // eigene Präfixe / Konfiguration hier ergänzen, falls nötig
};

Blockly.Generator.Basic.finish = function (code) {
  return Array.isArray(code) ? code.join("") : code;
};
