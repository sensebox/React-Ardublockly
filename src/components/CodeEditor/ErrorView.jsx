//  src/components/CodeEditor/ErrorView.jsx

"use client";

import * as Blockly from "blockly/core";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandPointUp,
  faChevronDown,
  faCopy,
  faCheck,
  faExclamationTriangle,
  faLightbulb,
  faCode,
  faInfoCircle,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";

// Funktion, die Fehlermuster aus den Blockly.Msg Übersetzungen liest
const getErrorPatterns = () => {
  // Wenn die Fehlermuster in Blockly.Msg definiert sind, verwende sie
  if (Blockly.Msg.errorPatterns) {
    try {
      return JSON.parse(Blockly.Msg.errorPatterns);
    } catch (e) {
      console.error("Fehler beim Parsen der errorPatterns aus Blockly.Msg:", e);
    }
  }

  // Fallback, falls keine Übersetzungen gefunden wurden
  return {
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
    "expected primary-expression before": "missing_parameter",
  };
};

// Stelle sicher, dass alle erforderlichen Übersetzungen existieren
const ensureTranslations = () => {
  // Fallback-Übersetzungen, falls sie nicht in Blockly.Msg definiert sind
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
    missing_parameter:
      "You forgot a parameter. Check the function and add all required values.",
    what_to_do_next: "What you can do now:",
    in_function: "In function",
    line: "Line",
    column: "Column",
    command_failed: "Command failed: 1: Uncaught Fatal Exception",
    suggestion_prefix: "Suggestion:",
  };

  Object.keys(fallbacks).forEach((key) => {
    if (!Blockly.Msg[key]) {
      Blockly.Msg[key] = fallbacks[key];
    }
  });
};

// Styles
const styles = {
  container: (showDetails) => ({
    backgroundColor: "white",
    borderRadius: "8px",
    overflow: "hidden",
    maxWidth: "1200px", // Erhöht auf 1200px für mehr Breite
    margin: showDetails ? "-8% auto 0" : "-34% auto 0", // Dynamischer Margin basierend auf showDetails
    // transition: "margin 0.8s ease", // Sanfte Übergangsanimation
    transition:
      "width 0.5s ease, height 0.5s ease, max-width 0.5s ease, max-height 0.5s ease",
    display: "flex",
    flexDirection: "column",
    // alignContent: "center",
    alignItems: "center", // Horizontale Zentrierung
    justifyContent: "center", // Vertikale Zentrierung
    marginBottom: "20px",
  }),
  header: {
    padding: "1rem 2rem",
    backgroundColor: "#4EAF47", // senseBox Blockly Grün
    color: "white",
    borderBottom: "1px solid rgba(0,0,0,0.05)",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    width: "100%", // Volle Breite
    boxSizing: "border-box", // Damit Padding in die Breite eingerechnet wird
  },
  headerIcon: {
    backgroundColor: "white",
    color: "#4EAF47",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
  },
  headerContent: {
    flex: 1,
  },
  title: {
    color: "white",
    margin: "0 0 0.5rem 0",
    fontSize: "1.5rem",
    fontWeight: "600",
  },
  description: {
    color: "white",
    margin: "0",
    fontSize: "1rem",
    opacity: 0.9,
  },
  suggestionContainer: {
    backgroundColor: "rgba(175, 126, 71, 0.1)",
    margin: "0 2rem",
    padding: "1rem",
    borderRadius: "6px",
    marginTop: "1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    // alignContent: "center",
    gap: "0.5rem",
    width: "calc(100% - 4rem)", // Volle Breite minus Margins
    maxWidth: "1100px", // Erhöht auf 1100px für mehr Breite
    boxSizing: "border-box", // Damit Padding in die Breite eingerechnet wird
  },
  iconContainer: {
    backgroundColor: "#4EAF47",
    color: "white",
    borderRadius: "50%",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  suggestionText: {
    textAlign: "center",
    maxWidth: "calc(100% - 40px)",
  },
  suggestionTitle: {
    color: "#4EAF47", // Geändert auf senseBox Blockly Grün
    display: "block",
    marginBottom: "0.25rem",
  },
  suggestionContent: {
    color: "#333",
  },
  controlsContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    marginTop: "0.5rem",
    width: "calc(100% - 4rem)", // Volle Breite minus Paddings
    maxWidth: "1100px", // Erhöht auf 1100px für mehr Breite
    boxSizing: "border-box", // Damit Padding in die Breite eingerechnet wird
  },
  button: {
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
  },
  copyButton: (copied) => ({
    background: copied ? "#4EAF47" : "transparent",
    border: `1px solid ${copied ? "#4EAF47" : "#ddd"}`,
    borderRadius: "4px",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: copied ? "white" : "#555",
    fontSize: "0.9rem",
    transition: "all 0.2s",
  }),
  errorContainer: {
    backgroundColor: "black",
    color: "#E47128",
    padding: "1rem 2rem",
    margin: "0 2rem 2rem",
    borderRadius: "0", // Entferne die abgerundeten Ecken
    fontFamily: "monospace",
    fontSize: "0.9rem",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    maxHeight: "300px",
    overflow: "auto",
    position: "relative",
    border: "none", // Entferne Rahmen
    width: "calc(100% - 4rem)", // Volle Breite minus Margins
    maxWidth: "1100px", // Erhöht auf 1100px für mehr Breite
    boxSizing: "border-box", // Damit Padding in die Breite eingerechnet wird
  },
  exitText: {
    color: "#E47128", // Ändere auf die gleiche Farbe wie commandFailedLine
    marginBottom: "0.5rem",
    fontWeight: "bold",
  },
  errorLine: (type) => ({
    color:
      type === "error"
        ? "#FF5252"
        : type === "note"
          ? "#8BC34A"
          : type === "warning"
            ? "#FFC107"
            : type === "code"
              ? "#FFFFFF"
              : type === "location"
                ? "#64B5F6"
                : "#E47128",
    marginBottom: "0.5rem",
    paddingLeft: type === "note" || type === "code" ? "1rem" : "0",
    fontWeight: type === "code" ? "bold" : "normal",
    backgroundColor:
      type === "code" ? "rgba(255, 255, 255, 0.1)" : "transparent",
    padding: type === "code" ? "0.25rem 0.5rem" : "0",
    borderRadius: type === "code" ? "4px" : "0",
  }),
  // Neue Stile für die verbesserte Fehleranzeige
  errorSummary: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: "1rem",
    borderRadius: "6px",
    marginBottom: "1.5rem",
    border: "1px solid #FF5252",
  },
  errorSummaryTitle: {
    color: "#FF5252",
    fontSize: "1.1rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  errorLocation: {
    color: "#555",
    fontSize: "0.9rem",
    marginBottom: "0.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  errorCode: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: "0.75rem",
    borderRadius: "4px",
    color: "white",
    fontFamily: "monospace",
    marginBottom: "0.75rem",
    border: "1px dashed rgba(255, 255, 255, 0.3)",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.9rem",
  },
  errorSuggestion: {
    color: "#4EAF47",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.95rem",
  },
  // Neue Stile für die sofort sichtbare Fehleranzeige
  errorHighlight: {
    backgroundColor: "rgba(229, 57, 53, 0.1)",
    padding: "1rem",
    margin: "0 2rem",
    borderRadius: "6px",
    marginTop: "1rem",
    marginBottom: "1rem",
    border: "1px solid rgba(229, 57, 53, 0.3)",
    width: "calc(100% - 4rem)", // Volle Breite minus Margins
    maxWidth: "1100px", // Erhöht auf 1100px für mehr Breite
    boxSizing: "border-box", // Damit Padding in die Breite eingerechnet wird
  },
  errorMainMessage: {
    color: "#E53935",
    fontWeight: "bold",
    fontSize: "1.1rem",
    marginBottom: "0.75rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  errorCodeBlock: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: "0.75rem",
    borderRadius: "4px",
    color: "white",
    fontFamily: "monospace",
    marginBottom: "0.75rem",
    border: "1px dashed rgba(255, 255, 255, 0.3)",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.9rem",
  },
  errorHint: {
    color: "#4EAF47",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.95rem",
    marginBottom: "0.5rem",
  },
  // Füge einen neuen Stil für die Befehlszeile hinzu
  commandFailedLine: {
    color: "#E47128", // Orange-rote Farbe wie im Screenshot
    fontWeight: "bold",
    padding: "0.5rem 0",
    borderTop: "none",
    fontSize: "1rem",
    fontFamily: "monospace",
  },
  // Füge einen Stil für den Gerätehinweis hinzu

  deviceHint: {
    color: "#4EAF47",
    marginTop: "1rem",
    marginBottom: "0.5rem",
    fontStyle: "italic",
  },
  // Wrapper für den Header, um die Breite zu kontrollieren
  headerWrapper: {
    width: "100%",
    maxWidth: "1200px", // Erhöht auf 1200px für mehr Breite
    display: "flex",
    justifyContent: "center",
  },
};

// Animation variants for staggered animations
const containerVariants = {
  hidden: {
    height: 0,
    opacity: 0,
    scale: 0.98,
    filter: "blur(8px)",
  },
  visible: {
    height: "auto",
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      height: { type: "spring", stiffness: 300, damping: 30, mass: 0.8 },
      opacity: { duration: 0.4, ease: "easeOut" },
      scale: { type: "spring", stiffness: 400, damping: 30 },
      filter: { duration: 0.3, ease: "easeOut" },
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    scale: 0.98,
    filter: "blur(8px)",
    transition: {
      height: { duration: 0.25, ease: "easeInOut" },
      opacity: { duration: 0.2, ease: "easeOut" },
      scale: { duration: 0.2, ease: "easeOut" },
      filter: { duration: 0.15, ease: "easeOut" },
      staggerChildren: 0.02,
      staggerDirection: -1,
    },
  },
};

const contentVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
    },
  },
  exit: {
    y: 10,
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: "easeOut",
    },
  },
};

const lineVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    },
  },
  exit: {
    x: -5,
    opacity: 0,
    transition: {
      duration: 0.1,
      ease: "easeOut",
    },
  },
};

const ErrorView = ({ error, language, onDetailsToggle }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const errorContainerRef = useRef(null);

  // Ändere den useEffect-Hook für die Sprachauswahl
  useEffect(() => {
    // Stelle sicher, dass alle erforderlichen Übersetzungen existieren
    ensureTranslations();

    // Die Übersetzungen werden bereits durch die Blockly-Umgebung geladen
    // und sind in Blockly.Msg verfügbar, basierend auf der ausgewählten Sprache

    // Wir müssen hier nichts weiter tun, da die Anwendung bereits
    // die richtigen Übersetzungen in Blockly.Msg basierend auf der Sprache lädt
  }, [language]);

  useEffect(() => {
    if (onDetailsToggle) {
      onDetailsToggle(showDetails);
    }
  }, [showDetails, onDetailsToggle]);

  // Ensure all required translations exist
  ensureTranslations();

  // Parse the error
  let errorMessage;
  let processText = "";
  let exitText = "";
  let errorLines = [];

  // Neue Variablen für die verbesserte Fehleranzeige
  let mainErrorMessage = "";
  let errorLocation = "";
  let errorCode = "";
  let errorSuggestion = "";
  let inFunction = "";

  try {
    // If error is already an object, use it directly
    if (typeof error === "object" && error !== null) {
      errorMessage = error;
    } else {
      // Otherwise try to parse it as JSON
      errorMessage = JSON.parse(error);
    }

    // Ensure process and exit exist
    processText = errorMessage.process || "No process information available";
    exitText = errorMessage.exit || "Unknown error";

    // Extract the most important error lines with more context
    const lines = processText.split("\n");
    const errorLineIndices = [];

    // First find all error and note lines
    lines.forEach((line, index) => {
      if (
        line.includes("error:") ||
        line.includes("note:") ||
        line.includes("warning:")
      ) {
        errorLineIndices.push(index);
      }
    });

    // Collect the error lines and the lines with the actual code
    errorLines = [];
    errorLineIndices.forEach((index) => {
      // Add the error line
      errorLines.push(lines[index]);

      // Look for the code line (usually in the previous or next line)
      // Typical format: "   k = undefined;"
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
          // This is probably a code line
          errorLines.push(`Code: ${lines[i].trim()}`);
          break;
        }
      }
    });

    // Also add the "Error during build" line if present
    const buildErrorLine = lines.find((line) =>
      line.includes("Error during build"),
    );
    if (buildErrorLine && !errorLines.includes(buildErrorLine)) {
      errorLines.push(buildErrorLine);
    }

    // Add "In function" lines if present
    const functionLine = lines.find((line) => line.includes("In function"));
    if (functionLine && !errorLines.includes(functionLine)) {
      errorLines.unshift(functionLine); // Insert at the beginning
    }

    // Extrahiere die wichtigsten Informationen für die verbesserte Fehleranzeige
    // 1. Hauptfehlermeldung
    const errorLine = lines.find((line) => line.includes("error:"));
    if (errorLine) {
      const errorParts = errorLine.split("error:");
      if (errorParts.length > 1) {
        mainErrorMessage = errorParts[1].trim();
      }
    }

    // 2. Fehlerort (In function...)
    const functionLineText = lines.find((line) => line.includes("In function"));
    if (functionLineText) {
      inFunction = functionLineText.split("In function")[1].trim();
    }

    // 3. Fehlercode
    const codeLine = lines.find(
      (line) => line.includes("Code:") && !line.includes("--build-cache-path"),
    );
    if (codeLine) {
      errorCode = codeLine.replace("Code:", "").trim();
    }

    // 4. Vorschlag
    const noteLine = lines.find((line) =>
      line.includes("note: suggested alternative:"),
    );
    if (noteLine) {
      const noteParts = noteLine.split("suggested alternative:");
      if (noteParts.length > 1) {
        errorSuggestion = noteParts[1].trim();
      }
    }

    // 5. Fehlerort (Datei und Zeile)
    const locationLine = lines.find(
      (line) => line.includes(".ino:") && line.includes("error:"),
    );
    if (locationLine) {
      const locationParts = locationLine.split(":");
      if (locationParts.length > 2) {
        // Format: Datei:Zeile:Spalte
        errorLocation = `${Blockly.Msg.line} ${locationParts[1]}, ${Blockly.Msg.column} ${locationParts[2].split(" ")[0]}`;
      }
    }
  } catch (e) {
    // Fallback if parsing fails
    console.error("Error parsing error message:", e);
    processText = typeof error === "string" ? error : "Unknown error";
    exitText = "Error parsing error message";
    errorLines = [processText];
  }

  // Clean the process to remove temporary paths
  const cleanedProcess = processText.replace(
    /\/tmp\/[a-zA-Z0-9]+\/[^:]+:/g,
    "",
  );

  // Function to find solution suggestions
  const getSuggestion = (process) => {
    if (!process) return null;

    const errorPatterns = getErrorPatterns();

    for (const pattern in errorPatterns) {
      if (process.includes(pattern)) {
        const key = errorPatterns[pattern];
        return Blockly.Msg[key] || null;
      }
    }
    return null;
  };

  const suggestion = getSuggestion(cleanedProcess);

  // Copy error details to clipboard
  const copyErrorToClipboard = () => {
    navigator.clipboard.writeText(`${exitText}\n\n${processText}`).then(() => {
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    });
  };

  // Determine the type of error line for styling

  // Animation for the toggle button
  const toggleButtonVariants = {
    closed: { rotate: 0 },
    open: { rotate: 180 },
  };

  return (
    <div style={styles.container(showDetails)}>
      {/* Header mit Titel und Beschreibung */}
      <div style={styles.headerWrapper}>
        <div style={styles.header}>
          <div style={styles.headerIcon}>
            <FontAwesomeIcon icon={faRobot} />
          </div>
          <div style={styles.headerContent}>
            <h2 style={styles.title}>{Blockly.Msg.drawer_ideerror_head}</h2>
            <p style={styles.description}>{Blockly.Msg.drawer_ideerror_text}</p>
          </div>
        </div>
      </div>

      {/* Wichtigste Fehlerinformationen - IMMER SICHTBAR */}
      {mainErrorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={styles.errorHighlight}
        >
          <div style={styles.errorMainMessage}>
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <span>{mainErrorMessage}</span>
          </div>

          {inFunction && (
            <div style={styles.errorLocation}>
              <FontAwesomeIcon icon={faInfoCircle} />
              <span>
                {Blockly.Msg.in_function}: {inFunction}
              </span>
            </div>
          )}

          {errorLocation && (
            <div style={styles.errorLocation}>
              <FontAwesomeIcon icon={faInfoCircle} />
              <span>{errorLocation}</span>
            </div>
          )}

          {errorCode && (
            <div style={styles.errorCodeBlock}>
              <FontAwesomeIcon icon={faCode} />
              <span>{errorCode}</span>
            </div>
          )}

          {errorSuggestion && (
            <div style={styles.errorHint}>
              <FontAwesomeIcon icon={faLightbulb} />
              <span>
                {Blockly.Msg.suggestion_prefix} {errorSuggestion}
              </span>
            </div>
          )}
        </motion.div>
      )}

      {/* Lösungsvorschlag, falls verfügbar */}
      {suggestion && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={styles.suggestionContainer}
        >
          <div style={styles.iconContainer}>
            <FontAwesomeIcon icon={faHandPointUp} size="sm" />
          </div>
          <div style={styles.suggestionText}>
            <strong style={styles.suggestionTitle}>
              {Blockly.Msg.suggestion_pre_text}
            </strong>
            <span style={styles.suggestionContent}>{suggestion}</span>
          </div>
        </motion.div>
      )}

      {/* Fehlerdetails-Umschalter und Kopier-Button */}
      <div style={styles.controlsContainer}>
        <motion.button
          onClick={() => setShowDetails(!showDetails)}
          style={styles.button}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#f5f5f5")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
          whileTap={{ scale: 0.95 }}
          animate={showDetails ? "open" : "closed"}
        >
          <span>
            {showDetails ? Blockly.Msg.hide_details : Blockly.Msg.error_details}
          </span>
          <motion.div
            variants={toggleButtonVariants}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <FontAwesomeIcon icon={faChevronDown} />
          </motion.div>
        </motion.button>

        <motion.button
          onClick={copyErrorToClipboard}
          style={styles.copyButton(copiedToClipboard)}
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
          whileTap={{ scale: 0.95 }}
        >
          {copiedToClipboard ? (
            <>
              <FontAwesomeIcon icon={faCheck} />
              <span>{Blockly.Msg.copied}</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faCopy} />
              <span>{Blockly.Msg.copy_error}</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Vollständige Fehlerdetails (erweiterbar) */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            ref={errorContainerRef}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              overflow: "hidden",
              transformOrigin: "top center",
              perspective: "1000px",
              position: "relative",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <motion.div
              variants={contentVariants}
              style={{
                position: "relative",
                zIndex: 1,
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div style={styles.errorContainer}>
                {/* Command failed Zeile - immer zuerst anzeigen */}
                <motion.div
                  variants={lineVariants}
                  style={styles.commandFailedLine}
                >
                  {Blockly.Msg.command_failed}
                </motion.div>

                {/* JSON-Fehlerausgabe direkt anzeigen */}
                <motion.pre
                  variants={lineVariants}
                  style={{
                    color: "#E47128",
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                    fontSize: "0.9rem",
                    marginTop: "1rem",
                  }}
                >
                  {typeof error === "string"
                    ? error
                    : JSON.stringify(error, null, 2)}
                </motion.pre>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Connect the component to Redux to access the language setting
const mapStateToProps = (state) => ({
  language: state.general.language, // Get the language setting from the Redux store
});

// Export the connected component
export default connect(mapStateToProps)(ErrorView);

// Also export the unconnected component for tests
export { ErrorView };
