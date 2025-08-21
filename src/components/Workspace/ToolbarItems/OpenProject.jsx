import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { clearStats, workspaceName } from "../../../actions/workspaceActions";
import { setBoard } from "../../../actions/boardAction";

import * as Blockly from "blockly/core";

import Snackbar from "../../Snackbar";
import Dialog from "../../ui/Dialog";

import withStyles from "@mui/styles/withStyles";
import Tooltip from "@mui/material/Tooltip";

import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Button } from "@mui/material";
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

class OpenProject extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      title: "",
      content: "",
      open: false,
      open2: false,
      title2: Blockly.Msg.dialog_title,
      snackbar: false,
      type: "",
      key: "",
      message: "",
      selectedBoard: "",
      xmlFileState: null,
      xmlFileBoard: "",
      showOldXMLFileWarning: false,
    };
  }

  toggleDialog = () => {
    this.setState({ open: !this.state, title: "", content: "" });
  };

  toggleDialog2 = () => {
    this.setState({ open2: !this.state.open2, title2: "" });
  };

  processXMLFile = () => {
    this.props.setBoard(this.state.xmlFileBoard);

    const workspace = Blockly.getMainWorkspace();
    var xmlFile = this.state.xmlFileState;
    var xmlBefore = this.props.xml;
    workspace.clear();
    this.props.clearStats();
    Blockly.Xml.domToWorkspace(xmlFile, workspace);
    if (workspace.getAllBlocks().length < 1) {
      Blockly.Xml.domToWorkspace(
        Blockly.utils.xml.textToDom(xmlBefore),
        workspace,
      );
      this.setState({
        open: true,
        title: Blockly.Msg.no_blocks_found_title,
        content: Blockly.Msg.no_blocks_found_text,
      });
    } else {
      if (!this.props.assessment) {
        var extensionPosition = this.state.xmlFileName.lastIndexOf(".");
        this.props.workspaceName(
          this.state.xmlFileName.substr(0, extensionPosition),
        );
      }
      this.setState({
        open2: false,
        showOldXMLFileWarning: false,
        snackbar: true,
        type: "success",
        key: Date.now(),
        message: Blockly.Msg.xml_loaded,
      });
    }
  };

  uploadXmlFile = (xmlFile) => {
    if (xmlFile.type !== "text/xml") {
      this.setState({
        open: true,
        title: Blockly.Msg.no_valid_data_type_title,
        content: Blockly.Msg.no_valid_data_type_text,
      });
    } else {
      var reader = new FileReader();
      reader.readAsText(xmlFile);
      reader.onloadend = () => {
        var xmlDom = null;
        try {
          xmlDom = Blockly.utils.xml.textToDom(reader.result);
          var boardAttribute = xmlDom.getAttribute("board");
          if (!boardAttribute) {
            this.setState({ showOldXMLFileWarning: true });
            this.props.setBoard("mcu");
          }
          // store attributes and open confirmation dialog
          this.setState({
            open2: true,
            selectedBoard: window.sessionStorage.getItem("board"),
            xmlFileName: xmlFile.name,
            xmlFileState: xmlDom,
            xmlFileBoard: boardAttribute ? boardAttribute : "mcu",
          });
        } catch (err) {
          this.setState({
            open: true,
            title: Blockly.Msg.no_valid_xml_title,
            content: Blockly.Msg.no_valid_xml_text,
          });
        }
      };
    }
  };

  render() {
    return (
      <div>
        <div
          ref={this.inputRef}
          style={{
            width: "max-content",
            height: "40px",
            marginRight: "5px",
          }}
        >
          <input
            style={{ display: "none" }}
            accept="text/xml"
            onChange={(e) => {
              this.uploadXmlFile(e.target.files[0]);
            }}
            id="open-blocks"
            type="file"
          />
          <label htmlFor="open-blocks">
            <Tooltip
              title={Blockly.Msg.tooltip_open_project}
              arrow
              style={this.props.style}
            >
              <div
                className={this.props.classes.button}
                style={{
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "table-cell",
                  verticalAlign: "middle",
                  textAlign: "center",
                }}
              >
                <FontAwesomeIcon
                  icon={faUpload}
                  style={{ width: "18px", height: "18px" }}
                />
              </div>
            </Tooltip>
          </label>
        </div>
        <Dialog
          open={this.state.open2}
          title={this.state.title2}
          onClose={this.toggleDialog2}
          onClick={this.toggleDialog2}
        >
          <div>
            {this.state.selectedBoard !== this.state.xmlFileBoard ? (
              // give a warning that the board is different
              <Alert severity="warning" style={{ width: "fit-content" }}>
                {Blockly.Msg.warning_file_board}
              </Alert>
            ) : null}
            {this.state.showOldXMLFileWarning ? (
              <Alert severity="warning" style={{ width: "fit-content" }}>
                {Blockly.Msg.warning_old_xml_file}
              </Alert>
            ) : null}
            <p>{Blockly.Msg.dialog_confirm}</p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <Button
                style={{ width: "auto", height: "auto" }}
                className={this.props.classes.button}
                onClick={this.toggleDialog2}
              >
                {Blockly.Msg.button_close}{" "}
              </Button>
              <Button
                style={{ width: "auto", height: "auto" }}
                className={this.props.classes.button}
                onClick={() => this.processXMLFile()}
              >
                {Blockly.Msg.button_accept}
              </Button>
            </div>
          </div>
        </Dialog>

        <Dialog
          open={this.state.open}
          title={this.state.title}
          content={this.state.content}
          onClose={this.toggleDialog}
          onClick={this.toggleDialog}
          button={Blockly.Msg.button_close}
        />
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

OpenProject.propTypes = {
  clearStats: PropTypes.func.isRequired,
  workspaceName: PropTypes.func.isRequired,
  xml: PropTypes.string.isRequired,
  name: PropTypes.string,
  setBoard: PropTypes.func,
  assessment: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  xml: state.workspace.code.xml,
  name: state.workspace.name,
});

export default connect(mapStateToProps, {
  clearStats,
  workspaceName,
  setBoard,
})(withStyles(styles, { withTheme: true })(OpenProject));
