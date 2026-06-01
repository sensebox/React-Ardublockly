import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import * as Blockly from "blockly/core";

import { saveAs } from "file-saver";

import { detectWhitespacesAndReturnReadableResult } from "../../../helpers/whitespace";

import withStyles from "@mui/styles/withStyles";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import { faCamera } from "@fortawesome/free-solid-svg-icons";
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

class Screenshot extends Component {
  getSvg = () => {
    const workspace = Blockly.getMainWorkspace();

    // Check if there are any blocks to screenshot
    const blocks = workspace.getTopBlocks(false);
    if (blocks.length === 0) {
      console.warn("No blocks in workspace to screenshot");
      return;
    }

    // Clone the block canvas
    var canvas = workspace.svgBlockCanvas_.cloneNode(true);

    if (canvas.children[0] !== undefined) {
      canvas.removeAttribute("transform");

      // Collect CSS styles
      var cssContent = "";
      for (var i = 0; i < document.getElementsByTagName("style").length; i++) {
        if (/^blockly.*$/.test(document.getElementsByTagName("style")[i].id)) {
          cssContent += document
            .getElementsByTagName("style")
            [i].firstChild.data.replace(/\..* \./g, ".");
        }
      }
      cssContent += `.blocklyPath {
        fill-opacity: 1;
      }
      .blocklyPathDark {
        display: flex;
      }
      .blocklyPathLight {
        display: flex;
      }`;

      var css =
        '<defs><style type="text/css" xmlns="http://www.w3.org/1999/xhtml"><![CDATA[' +
        cssContent +
        "]]></style></defs>";

      // Get the actual content bounds from the cloned canvas
      // We need to temporarily add it to the DOM to get accurate measurements
      const tempSvg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      tempSvg.style.position = "absolute";
      tempSvg.style.left = "-9999px";
      tempSvg.appendChild(canvas.cloneNode(true));
      document.body.appendChild(tempSvg);
      const contentBBox = tempSvg.getBBox();
      document.body.removeChild(tempSvg);

      // Add padding to content bounds
      const padding = 10;
      const finalX = contentBBox.x - padding;
      const finalY = contentBBox.y - padding;
      const finalWidth = contentBBox.width + padding * 2;
      const finalHeight = contentBBox.height + padding * 2;

      var content = new XMLSerializer().serializeToString(canvas);
      var xml = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                  width="${finalWidth}" height="${finalHeight}" viewBox="${finalX} ${finalY} ${finalWidth} ${finalHeight}">
                  ${css}>${content}</svg>`;
      var fileName = detectWhitespacesAndReturnReadableResult(this.props.name);
      fileName = `${fileName}.svg`;
      var blob = new Blob([xml], { type: "image/svg+xml;base64" });
      saveAs(blob, fileName);
    }
  };

  render() {
    return (
      <div style={this.props.style}>
        <Tooltip title={Blockly.Msg.tooltip_screenshot} arrow>
          <IconButton
            className={this.props.classes.button}
            onClick={() => this.getSvg()}
            size="large"
          >
            <FontAwesomeIcon icon={faCamera} size="xs" />
          </IconButton>
        </Tooltip>
      </div>
    );
  }
}

Screenshot.propTypes = {
  name: PropTypes.string,
};

const mapStateToProps = (state) => ({
  name: state.workspace.name,
});

export default connect(
  mapStateToProps,
  null,
)(withStyles(styles, { withTheme: true })(Screenshot));
