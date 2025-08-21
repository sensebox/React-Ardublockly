import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { saveAs } from "file-saver";

import { detectWhitespacesAndReturnReadableResult } from "../../../helpers/whitespace";

import withStyles from "@mui/styles/withStyles";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import { faFileDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Blockly from "blockly/core";

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

class DownloadProject extends Component {
  downloadXmlFile = () => {
    var code = this.props.xml;
    var fileName = detectWhitespacesAndReturnReadableResult(
      this.props.name || "untitled",
    );
    fileName = `${fileName}.xml`;
    var blob = new Blob([code], { type: "text/xml" });
    saveAs(blob, fileName);
  };

  render() {
    return (
      <div style={this.props.style}>
        <Tooltip title={Blockly.Msg.tooltip_download_project} arrow>
          <IconButton
            className={`saveBlocks ${this.props.classes.button}`}
            onClick={() => this.downloadXmlFile()}
            size="large"
          >
            <FontAwesomeIcon icon={faFileDownload} size="xs" />
          </IconButton>
        </Tooltip>
      </div>
    );
  }
}

DownloadProject.propTypes = {
  xml: PropTypes.string.isRequired,
  name: PropTypes.string,
};

const mapStateToProps = (state) => ({
  xml: state.workspace.code.xml,
  name: state.workspace.name,
});

export default connect(
  mapStateToProps,
  null,
)(withStyles(styles, { withTheme: true })(DownloadProject));
