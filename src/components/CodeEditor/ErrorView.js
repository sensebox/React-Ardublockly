import * as Blockly from "blockly/core";
import { Divider } from "@mui/material";

export const ErrorView = ({ error }) => {
  const errorMessage = JSON.parse(error);
  const cleanedProcess = errorMessage.process.replace(
    /\/tmp\/[a-zA-Z0-9]+\/[^:]+:/g,
    ""
  );
  const errorSuggestions = {
    "'display' was not declared in this scope":
      Blockly.Msg.display_not_declared,
    // Weitere Fehlermeldungen und Vorschläge können hier hinzugefügt werden
  };
  // Function to provide suggestions based on the errorSuggestions object
  const getSuggestion = (process) => {
    // Iterate through the keys of the errorSuggestions object
    for (const key in errorSuggestions) {
      if (process.includes(key)) {
        return errorSuggestions[key];
      }
    }
    return null; // If no suggestion matches
  };
  const suggestion = getSuggestion(cleanedProcess);

  // Inline CSS styles based on your color scheme
  const containerStyle = {
    backgroundColor: "black",
    color: "#E47128",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "16px",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  };

  const headerStyle = {
    color: "#4EAF47",
    paddingLeft: "1rem",
    paddingRight: "1rem",
  };

  const textStyle = {
    color: "#4EAF47",
    paddingLeft: "1rem",
    paddingRight: "1rem",
  };

  const dividerStyle = {
    backgroundColor: "white",
    height: "1px",
    margin: "1rem 0",
  };

  return (
    <div>
      <h2 style={headerStyle}>{Blockly.Msg.drawer_ideerror_head} </h2>
      <p style={textStyle}> {Blockly.Msg.drawer_ideerror_text}</p>
      {suggestion && (
        <div
          style={{ marginTop: "1rem", paddingLeft: "1rem", color: "#4EAF47" }}
        >
          <strong>Versuchs mal mit:</strong> {suggestion}
        </div>
      )}
      <div style={dividerStyle}></div>
      <div style={containerStyle}>
        <strong>{errorMessage.exit}</strong>
        <pre>{cleanedProcess}</pre>
      </div>
    </div>
  );
};
