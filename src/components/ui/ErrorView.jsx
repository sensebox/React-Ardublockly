import * as Blockly from "blockly/core";
import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLightbulb,
  faCircleChevronDown,
} from "@fortawesome/free-solid-svg-icons";

export const ErrorView = ({ error }) => {
  const errorMessage = JSON.parse(error);
  const cleanedProcess = errorMessage.process.replace(
    /\/tmp\/[a-zA-Z0-9]+\/[^:]+:/g,
    "",
  );
  const errorSuggestions = {
    "'display' was not declared in this scope":
      Blockly.Msg.display_not_declared,
    "redefinition of": Blockly.Msg.variable_redeclared,
    "conflicting declaration": Blockly.Msg.variable_redeclared,
  };

  const getSuggestion = (process) => {
    for (const key in errorSuggestions) {
      if (process.includes(key)) return errorSuggestions[key];
    }
    return null;
  };
  const suggestion = getSuggestion(cleanedProcess);

  const [expanded, setExpanded] = useState(false);
  const [fadeOpacity, setFadeOpacity] = useState(0);
  const containerRef = useRef(null);
  const collapsedHeight = "100px"; // Höhe im nicht ausgeklappten Zustand
  const expandedMaxHeight = "250px"; // Maximale Höhe im ausgeklappten Zustand

  useEffect(() => {
    if (!expanded && containerRef.current) {
      const scrollHeight = containerRef.current.scrollHeight;
      const ratio = Math.min(
        1,
        Math.max(
          0,
          (scrollHeight - parseInt(collapsedHeight)) /
            parseInt(collapsedHeight),
        ),
      );
      setFadeOpacity(ratio);
    } else {
      setFadeOpacity(0);
    }
  }, [error, expanded, collapsedHeight]);

  const headerStyle = {
    color: "#4EAF47",
    fontSize: "1.5rem",
    fontWeight: "bold",
    margin: "1rem 0 1rem 0 ",
  };

  const textStyle = { color: "#4EAF47" };

  const dividerStyle = {
    backgroundColor: "white",
    height: "1px",
    margin: "1rem 0",
  };

  const suggestionStyle = {
    backgroundColor: "#f0f4f8",
    border: "1px solid #4EAF47",
    color: "#333",
    borderRadius: "6px",
    padding: "0.75rem",
    marginTop: "1rem",
    paddingLeft: "1rem",
    maxWidth: "fit-content",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  };

  const suggestionTextStyle = { color: "#4EAF47", fontWeight: "bold" };

  // Fade-Overlay nur im collapsed Zustand
  const fadeStyle = {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "2rem",
    background: "linear-gradient(transparent, black)",
    opacity: fadeOpacity,
    pointerEvents: "none",
    transition: "opacity 0.3s ease",
  };

  const containerStyle = {
    backgroundColor: "black",
    color: "#E47128",
    borderRadius: "8px",
    marginBottom: "16px",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    padding: "1rem",
    maxHeight: expanded ? expandedMaxHeight : collapsedHeight,
    overflowY: expanded ? "auto" : "hidden",
    position: "relative",
    transition: "max-height 0.3s ease",
  };

  // Pfeil zum Umschalten (Expand/Collapse)
  const arrowStyle = {
    cursor: "pointer",
    textAlign: "center",
    transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
    transition: "transform 0.3s ease",
    marginTop: "-0.8rem",
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {expanded ? (
        // Kleiner Header, wenn expandiert
        <h4 style={headerStyle}>Fehlermeldung</h4>
      ) : (
        // Ausführlicher Header, wenn nicht expandiert
        <>
          <h2 style={headerStyle}>{Blockly.Msg.drawer_ideerror_head}</h2>
          <p style={textStyle}>{Blockly.Msg.drawer_ideerror_text}</p>
          {suggestion && (
            <div style={suggestionStyle}>
              <FontAwesomeIcon
                icon={faLightbulb}
                style={{ color: "#4EAF47", marginRight: "0.5rem" }}
              />
              <strong style={suggestionTextStyle}>
                {Blockly.Msg.suggestion_pre_text}
              </strong>{" "}
              {suggestion}
            </div>
          )}
          <div style={dividerStyle}></div>
        </>
      )}

      <div ref={containerRef} style={containerStyle}>
        <strong>{errorMessage.exit}</strong>
        <pre>{cleanedProcess}</pre>
        {!expanded && <div style={fadeStyle} />}
      </div>
      <div style={arrowStyle} onClick={() => setExpanded(!expanded)}>
        <FontAwesomeIcon
          color="#4EAF47"
          size="2xl"
          icon={faCircleChevronDown}
        />
      </div>
    </div>
  );
};
