import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { clearStats, workspaceName } from "../actions/workspaceActions";

import * as Blockly from "blockly/core";
import { createNameId } from "mnemonic-id";

import BlocklyWindow from "./Blockly/BlocklyWindow";

import withStyles from "@mui/styles/withStyles";
import { Button } from "@mui/material";
import store from "../store";
import { setPlatform } from "../actions/generalActions";

const styles = (theme) => ({
  codeOn: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.contrastText,
      color: theme.palette.primary.main,
      border: `1px solid ${theme.palette.secondary.main}`,
    },
  },
  codeOff: {
    backgroundColor: theme.palette.primary.contrastText,
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.secondary.main}`,
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  },
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      codeOn: true,
      snackbar: false,
      type: "",
      key: "",
      message: "",
      open: true,
      initialXml: localStorage.getItem("autoSaveXML"),
    };
  }

  componentDidMount() {
    if (this.props.platform === true) {
      this.setState({ codeOn: false });
    }
    this.setState({ stats: window.localStorage.getItem("stats") });
    if (!this.props.project) {
      this.props.workspaceName(createNameId());
    }
    if (this.props.message && this.props.message.id === "GET_SHARE_FAIL") {
      this.setState({
        snackbar: true,
        key: Date.now(),
        message: `Das angefragte geteilte Projekt konnte nicht gefunden werden.`,
        type: "error",
      });
    }
    store.dispatch(setPlatform(""));
    // Listen for messages from Flutter
    window.addEventListener("message", this.handleFlutterMessage);
  }

  componentDidUpdate(props) {
    /* Resize and reposition all of the workspace chrome (toolbox, trash,
    scrollbars etc.) This should be called when something changes that requires
    recalculating dimensions and positions of the trash, zoom, toolbox, etc.
    (e.g. window resize). */
    const workspace = Blockly.getMainWorkspace();
    Blockly.svgResize(workspace);
  }

  componentWillUnmount() {
    this.props.clearStats();
    this.props.workspaceName(null);
    window.removeEventListener("message", this.handleFlutterMessage);
  }

  handleFlutterMessage = (event) => {
    // You may want to check event.origin for security in production
    try {
      const data =
        typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      if (data && data.action === "triggerCompile") {
        this.handleCompileFromFlutter();
      }
    } catch (e) {
      // Ignore invalid JSON
    }
  };

  handleCompileFromFlutter = async () => {
    try {
      // Simulate some work (replace with your actual logic)
      const board =
        this.props.selectedBoard === "mcu" ||
        this.props.selectedBoard === "mini"
          ? "sensebox-mcu"
          : "sensebox-esp32s2";

      const response = await fetch(`${this.props.compilerUrl}/compile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sketch: this.props.arduinoCode,
          board,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Compilation failed");
      }
      if (data.data.id) {
        const result = {
          status: "success",
          message: "Compile finished",
          sketchId: data.data.id,
          board: board,
        };
        window.FlutterChannel.postMessage(JSON.stringify(result));
        return;
      }
    } catch (e) {
      const result = {
        status: "error",
        message: e.message || "An error occurred",
      };
      window.FlutterChannel.postMessage(JSON.stringify(result));
      return;
    }
  };

  toggleDialog = () => {
    this.setState({ open: !this.state });
  };

  onChangeCheckbox = (e) => {
    if (e.target.checked) {
      window.localStorage.setItem("ota", e.target.checked);
    } else {
      window.localStorage.removeItem("ota");
    }
  };

  onChange = () => {
    this.setState({ codeOn: !this.state.codeOn });
    const workspace = Blockly.getMainWorkspace();
    // https://github.com/google/blockly/blob/master/core/blockly.js#L314
    if (workspace.trashcan && workspace.trashcan.flyout) {
      workspace.trashcan.flyout.hide(); // in case of resize, the trash flyout does not reposition
    }
  };

  render() {
    return (
      <div className="blocklyWindow" style={{ height: "100%" }}>
        <BlocklyWindow initialXml={this.state.initialXml} />
      </div>
    );
  }
}

Home.propTypes = {
  clearStats: PropTypes.func.isRequired,
  workspaceName: PropTypes.func.isRequired,
  message: PropTypes.object.isRequired,
  statistics: PropTypes.bool.isRequired,
  platform: PropTypes.bool.isRequired,
  arduinoCode: PropTypes.string.isRequired,
  board: PropTypes.string.isRequired,
  compilerUrl: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  message: state.message,
  statistics: state.general.statistics,
  platform: state.general.platform,
  arduinoCode: state.workspace.code.arduino,
  selectedBoard: state.board.board,
  compilerUrl: state.general.compiler,
});

export default connect(mapStateToProps, { clearStats, workspaceName })(
  withStyles(styles, { withTheme: true })(Home),
);
