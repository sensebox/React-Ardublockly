// Diese Datei sollte irgendwo in deinem Projekt importiert werden,
// bevor die ErrorView-Komponente verwendet wird

import * as Blockly from "blockly/core";

// Füge die benötigten Übersetzungen zum Blockly.Msg-Objekt hinzu
export const setupErrorMessages = () => {
  // Englische Texte (Fallback)
  const enMessages = {
    drawer_ideerror_head: "Oops something went wrong",
    drawer_ideerror_text:
      "An error occurred while compiling, check your blocks",
    suggestion_pre_text: "Maybe you should try:",
    error_details: "Show details",
    hide_details: "Hide details",
    copy_error: "Copy error",
    copied: "Copied!",
    close: "CLOSE",
    display_not_declared:
      "Make sure to initialize the display in the setup function.",
    variable_redeclared:
      "Make sure you don't use special characters in your variable names.",
    undefined_error:
      "The variable 'undefined' doesn't exist in C/C++. Use a defined variable instead.",
    white_not_declared:
      "Define the color constants (e.g. WHITE, BLACK) before using them.",
    black_not_declared:
      "Define the color constants (e.g. WHITE, BLACK) before using them.",
    no_matching_function: "Check the function parameters and data types.",
    expected_semicolon: "Add a semicolon at the end of the line.",
    expected_parenthesis: "Close the parenthesis in your function call.",
    undefined_reference: "Make sure all used functions are defined.",
    was_not_declared: "A variable or function was used but not declared.",
  };

  // Deutsche Texte
  const deMessages = {
    drawer_ideerror_head: "Hoppla da ist was schief gegangen.",
    drawer_ideerror_text:
      "Beim kompilieren ist ein Fehler aufgetreten, überprüfe deine Blöcke.",
    suggestion_pre_text: "Versuch es mal mit:",
    error_details: "Details anzeigen",
    hide_details: "Details ausblenden",
    copy_error: "Fehler kopieren",
    copied: "Kopiert!",
    close: "SCHLIESSEN",
    display_not_declared:
      "Stelle sicher, dass du das Display im Setup initialisiert hast.",
    variable_redeclared:
      "Stelle sicher, dass du keine Sonderzeichen in deinen Variablennamen verwendest.",
    undefined_error:
      "Die Variable 'undefined' existiert nicht in C/C++. Verwende stattdessen eine definierte Variable.",
    white_not_declared:
      "Definiere die Farbkonstanten (z.B. WHITE, BLACK) vor der Verwendung.",
    black_not_declared:
      "Definiere die Farbkonstanten (z.B. WHITE, BLACK) vor der Verwendung.",
    no_matching_function: "Überprüfe die Funktionsparameter und Datentypen.",
    expected_semicolon: "Füge ein Semikolon am Ende der Zeile hinzu.",
    expected_parenthesis: "Schließe die Klammer in deinem Funktionsaufruf.",
    undefined_reference:
      "Stelle sicher, dass alle verwendeten Funktionen definiert sind.",
    was_not_declared:
      "Eine Variable oder Funktion wurde verwendet, aber nicht deklariert.",
  };

  // Füge die englischen Texte als Fallback hinzu
  Object.keys(enMessages).forEach((key) => {
    if (!Blockly.Msg[key]) {
      Blockly.Msg[key] = enMessages[key];
    }
  });

  // Füge die deutschen Texte hinzu, wenn die Sprache Deutsch ist
  if (Blockly.Msg.LANGUAGE_NAME === "Deutsch") {
    Object.keys(deMessages).forEach((key) => {
      Blockly.Msg[key] = deMessages[key];
    });
  }
};

// Führe die Funktion aus
setupErrorMessages();
