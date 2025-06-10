import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { IconButton, Tooltip, Button, Backdrop } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardCheck } from "@fortawesome/free-solid-svg-icons";
import { workspaceName } from "../../actions/workspaceActions";
import CompilationDialog from "./CompilationDialog";
import withStyles from "@mui/styles/withStyles";
import * as Blockly from "blockly/core";
import Copy from "../copy.svg";
import copyesp32 from "../copy_esp32.svg";
import { useCompile } from "../../hooks/useCompile";

const styles = (theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  iconButton: {
    backgroundColor: theme.palette.button.compile,
    color: theme.palette.primary.contrastText,
    width: "40px",
    height: "40px",
    "&:hover": {
      backgroundColor: theme.palette.button.compile,
      color: theme.palette.primary.contrastText,
    },
  },
  button: {
    backgroundColor: theme.palette.button.compile,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.button.compile,
      color: theme.palette.primary.contrastText,
    },
  },
});

const Compile = (props) => {
  const { state, compile, toggleDialog, setFileName } = useCompile(props);

  const fallbackTexts = {
    de_DE: "Code kompilieren",
    en_US: "Compile code",
  };

  // Verwende den Tooltip aus Blockly.Msg oder den Fallback basierend auf der aktuellen Sprache
  const tooltipText =
    Blockly.Msg.tooltip_compile_code ||
    fallbackTexts[props.language] ||
    fallbackTexts.en_US;

  return (
    <div>
      {props.iconButton ? (
        <Tooltip title={tooltipText} arrow style={{ marginRight: "5px" }}>
          <IconButton
            className={`compileBlocks ${props.classes.iconButton}`}
            onClick={compile}
            size="large"
            aria-label="Compile code"
          >
            <FontAwesomeIcon icon={faClipboardCheck} size="xs" />
          </IconButton>
        </Tooltip>
      ) : (
        <Button
          style={{ float: "right", color: "white" }}
          variant="contained"
          className={props.classes.button}
          onClick={compile}
        >
          <FontAwesomeIcon
            icon={faClipboardCheck}
            style={{ marginRight: "5px" }}
          />{" "}
          Kompilieren
        </Button>
      )}

      {props.platform === null && (
        <Backdrop className={props.classes.backdrop} open={state.progress}>
          <div className="overlay">
            {props.selectedBoard === "esp32" ? (
              <img src={copyesp32} width="400" alt="copyimage" />
            ) : (
              <img src={Copy} width="400" alt="copyimage" />
            )}
            <h2>{Blockly.Msg.compile_overlay_head}</h2>
            {props.selectedBoard === "esp32" ? (
              <h3
                style={{
                  padding: "0 2%",
                  textAlign: "center",
                }}
              >
                {Blockly.Msg.compile_overlay_text_esp32}
              </h3>
            ) : (
              <h3
                style={{
                  padding: "0 2%",
                  textAlign: "center",
                }}
              >
                {Blockly.Msg.compile_overlay_text}
              </h3>
            )}
          </div>
        </Backdrop>
      )}

      <CompilationDialog
        open={state.open}
        onClose={toggleDialog}
        selectedBoard={props.selectedBoard}
        compiler={props.compiler}
        code={props.arduino}
        filename={state.name}
        platform={props.platform}
        appLink={props.appLink || ""}
        error={state.error}
        setFileName={setFileName}
        name={state.name}
        file={state.file}
        title={state.title}
        content={state.content}
        appDialog={state.appDialog}
        link={state.link}
      />
    </div>
  );
};

Compile.propTypes = {
  arduino: PropTypes.string.isRequired,
  name: PropTypes.string,
  workspaceName: PropTypes.func.isRequired,
  platform: PropTypes.bool.isRequired,
  compiler: PropTypes.string.isRequired,
  selectedBoard: PropTypes.string.isRequired,
  iconButton: PropTypes.bool,
  appLink: PropTypes.string,
  classes: PropTypes.object.isRequired,
  language: PropTypes.string,
};

const mapStateToProps = (state) => ({
  arduino: state.workspace.code.arduino,
  name: state.workspace.name,
  platform: state.general.platform,
  compiler: state.general.compiler,
  selectedBoard: state.board.board,
  appLink: state.general.appLink,
  language: state.general.language,
});

export default connect(mapStateToProps, { workspaceName })(
  withStyles(styles)(Compile),
);
