// // src/components/CodeEditor/ErrorView.jsx

"use client";

import * as Blockly from "blockly/core";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { connect } from "react-redux";

// Erweiterte Liste von Fehlermustern und entsprechenden Lösungsvorschlägen
const errorPatterns = {
  "'display' was not declared in this scope": "display_not_declared",
  "display not declared": "display_not_declared",
  "redefinition of": "variable_redeclared",
  "conflicting declaration": "variable_redeclared",
  redeclared: "variable_redeclared",
  "'WHITE' was not declared": "white_not_declared",
  "'BLACK' was not declared": "black_not_declared",
  "no matching function": "no_matching_function",
  "expected ';'": "expected_semicolon",
  "expected ')'": "expected_parenthesis",
  "undefined reference to": "undefined_reference",
  "'undefined' was not declared": "undefined_error",
  "was not declared": "was_not_declared",
};

// Stelle sicher, dass alle benötigten Übersetzungen im Blockly.Msg-Objekt vorhanden sind
const ensureTranslations = () => {
  // Fallback-Texte für den Fall, dass die Übersetzungen nicht vorhanden sind
  const fallbacks = {
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

  // Füge fehlende Übersetzungen hinzu
  Object.keys(fallbacks).forEach((key) => {
    if (!Blockly.Msg[key]) {
      Blockly.Msg[key] = fallbacks[key];
    }
  });
};

const ErrorView = ({ error, onClose, language, onDetailsToggle }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  useEffect(() => {
    // Informiere den übergeordneten Dialog über Änderungen des Details-Status
    if (onDetailsToggle) {
      onDetailsToggle(showDetails);
    }
  }, [showDetails, onDetailsToggle]);

  // Stelle sicher, dass alle benötigten Übersetzungen vorhanden sind
  ensureTranslations();

  // Versuche, den Fehler zu parsen
  let errorMessage;
  let processText = "";
  let exitText = "";
  let errorLines = [];

  try {
    // Wenn error bereits ein Objekt ist, verwende es direkt
    if (typeof error === "object" && error !== null) {
      errorMessage = error;
    } else {
      // Sonst versuche, es als JSON zu parsen
      errorMessage = JSON.parse(error);
    }

    // Sicherstellen, dass process und exit existieren
    processText = errorMessage.process || "No process information available";
    exitText = errorMessage.exit || "Unknown error";

    // Extrahiere die wichtigsten Fehlerzeilen mit mehr Kontext
    const lines = processText.split("\n");
    const errorLineIndices = [];

    // Finde zuerst alle Fehler- und Hinweiszeilen
    lines.forEach((line, index) => {
      if (
        line.includes("error:") ||
        line.includes("note:") ||
        line.includes("warning:")
      ) {
        errorLineIndices.push(index);
      }
    });

    // Sammle die Fehlerzeilen und die Zeilen mit dem tatsächlichen Code
    errorLines = [];
    errorLineIndices.forEach((index) => {
      // Füge die Fehlerzeile hinzu
      errorLines.push(lines[index]);

      // Suche nach der Codezeile (normalerweise in der vorherigen oder nächsten Zeile)
      // Typisches Format: "   k = undefined;"
      for (
        let i = Math.max(0, index - 2);
        i <= Math.min(lines.length - 1, index + 2);
        i++
      ) {
        if (
          i !== index &&
          !lines[i].includes("error:") &&
          !lines[i].includes("note:") &&
          !lines[i].includes("warning:") &&
          !lines[i].includes("/tmp/") &&
          lines[i].trim() &&
          !lines[i].includes("Error during build")
        ) {
          // Dies ist wahrscheinlich eine Codezeile
          errorLines.push(`Code: ${lines[i].trim()}`);
          break;
        }
      }
    });

    // Füge auch die "Error during build" Zeile hinzu, wenn vorhanden
    const buildErrorLine = lines.find((line) =>
      line.includes("Error during build"),
    );
    if (buildErrorLine && !errorLines.includes(buildErrorLine)) {
      errorLines.push(buildErrorLine);
    }

    // Füge "In function" Zeilen hinzu, wenn vorhanden
    const functionLine = lines.find((line) => line.includes("In function"));
    if (functionLine && !errorLines.includes(functionLine)) {
      errorLines.unshift(functionLine); // Am Anfang einfügen
    }
  } catch (e) {
    // Fallback, wenn das Parsen fehlschlägt
    console.error("Error parsing error message:", e);
    processText = typeof error === "string" ? error : "Unknown error";
    exitText = "Error parsing error message";
    errorLines = [processText];
  }

  // Bereinige den Prozess, um temporäre Pfade zu entfernen
  const cleanedProcess = processText.replace(
    /\/tmp\/[a-zA-Z0-9]+\/[^:]+:/g,
    "",
  );

  // Funktion zum Finden von Lösungsvorschlägen
  const getSuggestion = (process) => {
    if (!process) return null;

    for (const pattern in errorPatterns) {
      if (process.includes(pattern)) {
        const key = errorPatterns[pattern];
        return Blockly.Msg[key] || null;
      }
    }
    return null;
  };

  const suggestion = getSuggestion(cleanedProcess);

  // Kopiere Fehlerdetails in die Zwischenablage
  const copyErrorToClipboard = () => {
    navigator.clipboard.writeText(`${exitText}\n\n${processText}`).then(() => {
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    });
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      {/* Header mit Titel und Beschreibung */}
      <div
        style={{
          padding: "1.5rem 2rem",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <h2
          style={{
            color: "#4EAF47",
            margin: "0 0 0.5rem 0",
            fontSize: "1.5rem",
            fontWeight: "600",
          }}
        >
          {Blockly.Msg.drawer_ideerror_head}
        </h2>
        <p
          style={{
            color: "#555",
            margin: "0",
            fontSize: "1rem",
          }}
        >
          {Blockly.Msg.drawer_ideerror_text}
        </p>
      </div>

      {/* Lösungsvorschlag, falls vorhanden */}
      {suggestion && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            backgroundColor: "rgba(175, 126, 71, 0.1)",
            margin: "0 2rem",
            padding: "1rem",
            borderRadius: "6px",
            marginTop: "1rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "0.5rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#E53935",
              color: "white",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              maxWidth: "calc(100% - 1px)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="8" y="6" width="8" height="14" rx="4" />
              <path d="m19 7-3 2" />
              <path d="m5 7 3 2" />
              <path d="m19 19-3-2" />
              <path d="m5 19 3-2" />
              <path d="M20 13h-4" />
              <path d="M4 13h4" />
              <path d="m10 4 1 2" />
              <path d="m14 4-1 2" />
            </svg>
          </div>
          <div style={{ textAlign: "center", maxWidth: "calc(100% - 40px)" }}>
            <strong
              style={{
                color: "#E53935",
                display: "block",
                marginBottom: "0.25rem",
              }}
            >
              {Blockly.Msg.suggestion_pre_text}
            </strong>
            <span style={{ color: "#333" }}>{suggestion}</span>
          </div>
        </motion.div>
      )}

      {/* Fehlerdetails Toggle-Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          marginTop: "0.5rem",
        }}
      >
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            background: "transparent",
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "#555",
            fontSize: "0.9rem",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#f5f5f5")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <span>
            {showDetails ? Blockly.Msg.hide_details : Blockly.Msg.error_details}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: showDetails ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s",
            }}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        <button
          onClick={copyErrorToClipboard}
          style={{
            background: copiedToClipboard ? "#4EAF47" : "transparent",
            border: `1px solid ${copiedToClipboard ? "#4EAF47" : "#ddd"}`,
            borderRadius: "4px",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: copiedToClipboard ? "white" : "#555",
            fontSize: "0.9rem",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => {
            if (!copiedToClipboard) {
              e.currentTarget.style.backgroundColor = "#f5f5f5";
            }
          }}
          onMouseOut={(e) => {
            if (!copiedToClipboard) {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
        >
          {copiedToClipboard ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>{Blockly.Msg.copied}</span>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>{Blockly.Msg.copy_error}</span>
            </>
          )}
        </button>
      </div>

      {/* Fehlerdetails (ausklappbar) */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                backgroundColor: "black",
                color: "#E47128",
                padding: "1rem 2rem",
                margin: "0 2rem 2rem",
                borderRadius: "8px",
                fontFamily: "monospace",
                fontSize: "0.9rem",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                maxHeight: "300px",
                overflow: "auto",
              }}
            >
              <div style={{ color: "#FF9800", marginBottom: "0.5rem" }}>
                {exitText}
              </div>

              {/* Verbesserte Fehleranzeige */}
              {errorLines.length > 0 ? (
                <div>
                  {errorLines.map((line, index) => (
                    <div
                      key={index}
                      style={{
                        color: line.includes("error:")
                          ? "#FF5252"
                          : line.includes("note:")
                            ? "#8BC34A"
                            : line.includes("warning:")
                              ? "#FFC107"
                              : line.includes("Code:")
                                ? "#FFFFFF"
                                : "#E47128",
                        marginBottom: "0.5rem",
                        paddingLeft:
                          line.includes("note:") || line.includes("Code:")
                            ? "1rem"
                            : "0",
                        fontWeight: line.includes("Code:") ? "bold" : "normal",
                        backgroundColor: line.includes("Code:")
                          ? "rgba(255, 255, 255, 0.1)"
                          : "transparent",
                        padding: line.includes("Code:")
                          ? "0.25rem 0.5rem"
                          : "0",
                        borderRadius: line.includes("Code:") ? "4px" : "0",
                      }}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              ) : (
                <pre>{cleanedProcess}</pre>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer mit Schließen-Button */}
      <div
        style={{
          padding: "1rem 2rem 2rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* <button
          onClick={onClose}
          style={{
            backgroundColor: "#4EAF47",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "0.75rem 2rem",
            fontSize: "1rem",
            fontWeight: "500",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#3d9339")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#4EAF47")
          }
        >
          {Blockly.Msg.close}
        </button> */}
      </div>
    </div>
  );
};

// Verbinde die Komponente mit Redux, um auf die Spracheinstellung zuzugreifen
const mapStateToProps = (state) => ({
  language: state.general.language, // Hole die Spracheinstellung aus dem Redux-Store
});

// Exportiere die verbundene Komponente
export default connect(mapStateToProps)(ErrorView);

// Exportiere auch die unverbundene Komponente für Tests
export { ErrorView };
