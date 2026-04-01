import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  clearStats,
  onChangeCode,
} from "../../../actions/workspaceActions.js";

import * as Blockly from "blockly/core";

import Snackbar from "../../Snackbar.jsx";

import withStyles from "@mui/styles/withStyles";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";

import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const styles = (theme) => {
  return {
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
  };
};

class ReloadWorkspace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snackbar: false,
      type: "",
      key: "",
      message: "",
    };
  }

  reloadWorkspace = () => {
    const workspace = Blockly.getMainWorkspace();
    const savedXml = localStorage.getItem("autoSaveXML");
    
    if (!savedXml) {
      this.setState({
        snackbar: true,
        type: "warning",
        key: Date.now(),
        message: Blockly.Msg.messages_reload_workspace_no_data || "Keine gespeicherten Daten gefunden.",
      });
      return;
    }

    try {
      Blockly.Events.disable();
      const xmlDom = Blockly.utils.xml.textToDom(savedXml);
      Blockly.Xml.clearWorkspaceAndLoadFromXml(xmlDom, workspace);
      Blockly.Events.enable();
      
      this.props.onChangeCode();
      
      this.setState({
        snackbar: true,
        type: "success",
        key: Date.now(),
        message: Blockly.Msg.messages_reload_workspace_success || "Workspace erfolgreich neu geladen.",
      });
    } catch (error) {
      console.error("Failed to reload workspace:", error);
      this.setState({
        snackbar: true,
        type: "error",
        key: Date.now(),
        message: Blockly.Msg.messages_reload_workspace_error || "Fehler beim Neu-Laden des Workspace.",
      });
    }
  };

  render() {
    const tooltipText = Blockly.Msg.tooltip_reload_workspace || "Workspace neu laden";
    return (
      <div style={this.props.style}>
        {this.props.isEmbedded ? (
          <Button
            className={`embedded-button embedded-button-secondary`}
            onClick={this.reloadWorkspace}
            variant="outlined"
            startIcon={<FontAwesomeIcon icon={faRotateRight} size="sm" />}
          >
            Neu laden
          </Button>
        ) : (
          <Tooltip title={tooltipText} arrow>
            <IconButton
              className={this.props.classes.button}
              onClick={this.reloadWorkspace}
              size="large"
            >
              <FontAwesomeIcon icon={faRotateRight} size="xs" />
            </IconButton>
          </Tooltip>
        )}

        <Snackbar
          open={this.state.snackbar}
          message={this.state.message}
          type={this.state.type}
          key={this.state.key}
        />
      </div>
    );
  }
}

ReloadWorkspace.propTypes = {
  onChangeCode: PropTypes.func.isRequired,
  isEmbedded: PropTypes.bool,
  style: PropTypes.object,
  classes: PropTypes.object,
};

const mapStateToProps = (state) => ({
  isEmbedded: state.general.embeddedMode,
});

export default connect(mapStateToProps, { onChangeCode })(
  withStyles(styles, { withTheme: true })(ReloadWorkspace),
);
