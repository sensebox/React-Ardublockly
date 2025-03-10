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
      "redefinition of": Blockly.Msg.variable_redeclared,
      "conflicting declaration": Blockly.Msg.variable_redeclared,
  };

  const getSuggestion = (process) => {
    for (const key in errorSuggestions) {
      if (process.includes(key)) {
        return errorSuggestions[key];
      }
    }
    return null;
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

  const suggestionStyle = {
    backgroundColor: "#f0f4f8",
    border: "1px solid #4EAF47",
    color: "#333",
    borderRadius: "6px",
    padding: "0.75rem",
    marginTop: "1rem",
    marginLeft: "1rem",
    paddingLeft: "1rem",
    maxWidth: "fit-content",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  };

  const suggestionTextStyle = {
    color: "#4EAF47",
    fontWeight: "bold",
  };

  return (
    <div>
      <h2 style={headerStyle}>{Blockly.Msg.drawer_ideerror_head} </h2>
      <p style={textStyle}> {Blockly.Msg.drawer_ideerror_text}</p>
      {suggestion && (
        <div style={suggestionStyle}>
          <strong style={suggestionTextStyle}>
            {Blockly.Msg.suggestion_pre_text}
          </strong>{" "}
          {suggestion}
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
