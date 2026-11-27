import React, { Component } from "react";
import PropTypes from "prop-types";

import * as Blockly from "blockly/core";

import withStyles from "@mui/styles/withStyles";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const styles = (theme) => ({
  // plain icon in the style of the AutoSave icon (SaveIcon)
  button: {
    width: "2rem",
    height: "2rem",
    padding: 0,
    color: theme.palette.primary.main,
  },
});

class UndoWorkspace extends Component {
  undo = () => {
    const workspace = Blockly.getMainWorkspace();
    if (!workspace) return;
    // same behaviour as the Ctrl+Z shortcut in Blockly
    workspace.hideChaff?.();
    workspace.undo(false);
  };

  render() {
    return (
      <div style={this.props.style}>
        <Tooltip title={Blockly.Msg.tooltip_undo} arrow>
          <IconButton
            className={`undoWorkspace ${this.props.classes.button}`}
            onClick={this.undo}
            aria-label={Blockly.Msg.tooltip_undo}
            size="small"
          >
            <FontAwesomeIcon icon={faRotateLeft} size="lg" />
          </IconButton>
        </Tooltip>
      </div>
    );
  }
}

UndoWorkspace.propTypes = {
  style: PropTypes.object,
};

export default withStyles(styles, { withTheme: true })(UndoWorkspace);
