import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { clearStats, workspaceName } from "@/actions/workspaceActions";

import * as Blockly from "blockly/core";
import { createNameId } from "mnemonic-id";

import WorkspaceStats from "../Workspace/WorkspaceStats";
import WorkspaceToolbar from "../Workspace/WorkspaceToolbar";
import BlocklyWindow from "../Blockly/BlocklyWindow";
import CodeViewer from "../Workspace/CodeViewer";
import TrashcanButtons from "../Workspace/TrashcanButtons";
// import HintTutorialExists from "./Tutorial/HintTutorialExists";
import DeviceSelection from "../DeviceSelection";

import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import withStyles from "@mui/styles/withStyles";

import { faCode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TooltipViewer from "@/components/Workspace/TooltipViewer";
import Dialog from "@/components/ui/Dialog";

// import Autosave from "./Workspace/AutoSave";
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
  }

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
      <div>
        {this.props.statistics ? (
          <div
            style={{
              float: "left",
              height: "40px",
              position: "relative",
            }}
          >
            <WorkspaceStats />
          </div>
        ) : null}

        <div
          className="workspaceFunc"
          style={{
            float: "right",
            height: "40px",
            marginBottom: "20px",
          }}
        >
          {/* <Autosave /> */}
          <WorkspaceToolbar
            project={this.props.project}
            projectType={this.props.projectType}
          />
        </div>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            md={this.state.codeOn ? 8 : 12}
            style={{ position: "relative" }}
          >
            <Tooltip
              title={
                this.state.codeOn
                  ? Blockly.Msg.tooltip_hide_code
                  : Blockly.Msg.tooltip_show_code
              }
            >
              <IconButton
                className={`showCode ${
                  this.state.codeOn
                    ? this.props.classes.codeOn
                    : this.props.classes.codeOff
                }`}
                style={{
                  width: "40px",
                  height: "40px",
                  position: "absolute",
                  top: -12,
                  right: 8,
                  zIndex: 21,
                }}
                onClick={() => this.onChange()}
                size="large"
              >
                <FontAwesomeIcon icon={faCode} size="xs" />
              </IconButton>
            </Tooltip>

            <TrashcanButtons />
            <div className="blocklyWindow">
              {this.props.project ? (
                <BlocklyWindow
                  blocklyCSS={{ height: "80vH" }}
                  initialXml={this.props.project.xml}
                />
              ) : (
                <BlocklyWindow
                  blocklyCSS={{ height: "80vH" }}
                  initialXml={this.state.initialXml}
                />
              )}
            </div>
          </Grid>
          {this.state.codeOn ? (
            <Grid item xs={12} md={4}>
              <CodeViewer />
              <TooltipViewer />
            </Grid>
          ) : null}
        </Grid>
        <DeviceSelection />
        {/* <HintTutorialExists /> */}
        {this.props.platform ? (
          <Dialog
            style={{ zIndex: 9999999 }}
            fullWidth
            maxWidth={"sm"}
            open={this.state.open}
            title={Blockly.Msg.tabletDialog_headline}
            content={""}
            onClose={this.toggleDialog}
            onClick={this.toggleDialog}
            button={Blockly.Msg.button_close}
          >
            <div>{Blockly.Msg.tabletDialog_text}</div>
            <div>
              {Blockly.Msg.tabletDialog_more}{" "}
              <a
                href="https://sensebox.de/app"
                target="_blank"
                rel="noreferrer"
              >
                https://sensebox.de/app
              </a>
            </div>
          </Dialog>
        ) : null}
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
  project: PropTypes.object,
  projectType: PropTypes.string,
};

const mapStateToProps = (state) => ({
  message: state.message,
  statistics: state.general.statistics,
  platform: state.general.platform,
});

export default connect(mapStateToProps, { clearStats, workspaceName })(
  withStyles(styles, { withTheme: true })(Home),
);
