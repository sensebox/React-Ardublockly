import React, { Component } from "react";
import PropTypes from "prop-types";

import * as Blockly from "blockly/core";

import withStyles from "@mui/styles/withStyles";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const styles = (theme) => ({
  button: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    width: "40px",
    height: "40px",
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
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
            size="large"
          >
            <FontAwesomeIcon icon={faRotateLeft} size="xs" />
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
