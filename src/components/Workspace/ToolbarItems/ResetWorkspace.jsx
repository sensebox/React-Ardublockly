import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  clearStats,
  onChangeCode,
  workspaceName,
} from "../../../actions/workspaceActions.js";

import * as Blockly from "blockly/core";

import { createNameId } from "mnemonic-id";
import { initialXml } from "../../Blockly/initialXml.js";

import Snackbar from "../../Snackbar.jsx";

import withStyles from "@mui/styles/withStyles";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dialog from "../../ui/Dialog.jsx";
import Button from "@mui/material/Button";

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

class ResetWorkspace extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      snackbar: false,
      open: false,
      type: "",
      key: "",
      message: "",
    };
  }

  toggleDialog = () => {
    this.setState({ open: !this.state });
  };

  openDialog = () => {
    this.setState({ open: true });
  };

  resetWorkspace = () => {
    const workspace = Blockly.getMainWorkspace();
    Blockly.Events.disable(); // https://groups.google.com/forum/#!topic/blockly/m7e3g0TC75Y
    // if events are disabled, then the workspace will be cleared AND the blocks are not in the trashcan
    const xmlDom = Blockly.utils.xml.textToDom(initialXml);
    Blockly.Xml.clearWorkspaceAndLoadFromXml(xmlDom, workspace);
    Blockly.Events.enable();
    workspace.options.maxBlocks = Infinity;
    this.props.onChangeCode();
    this.props.clearStats();
    if (!this.props.assessment) {
      this.props.workspaceName(createNameId());
    }
    this.setState({
      snackbar: true,
      type: "success",
      key: Date.now(),
      message: Blockly.Msg.messages_reset_workspace_success,
    });
  };

  render() {
    return (
      <div style={this.props.style}>
        <Tooltip title={Blockly.Msg.tooltip_reset_workspace} arrow>
          <IconButton
            className={this.props.classes.button}
            onClick={() => this.openDialog()}
            size="large"
          >
            <FontAwesomeIcon icon={faShare} size="xs" flip="horizontal" />
          </IconButton>
        </Tooltip>

        <Snackbar
          open={this.state.snackbar}
          message={this.state.message}
          type={this.state.type}
          key={this.state.key}
        />
        <Dialog
          open={this.state.open}
          title={Blockly.Msg.resetDialog_headline}
          content={Blockly.Msg.resetDialog_text}
          onClose={() => {
            this.toggleDialog();
          }}
          onClick={() => {
            this.toggleDialog();
          }}
          button={Blockly.Msg.button_cancel}
        >
          {" "}
          <div style={{ marginTop: "10px" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                this.resetWorkspace();
                this.toggleDialog();
              }}
            >
              {Blockly.Msg.reset_text}
            </Button>
          </div>
        </Dialog>
      </div>
    );
  }
}

ResetWorkspace.propTypes = {
  clearStats: PropTypes.func.isRequired,
  onChangeCode: PropTypes.func.isRequired,
  workspaceName: PropTypes.func.isRequired,
};

export default connect(null, { clearStats, onChangeCode, workspaceName })(
  withStyles(styles, { withTheme: true })(ResetWorkspace),
);
