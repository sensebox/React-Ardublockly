import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as Blockly from 'blockly/core';

import { saveAs } from 'file-saver';

import { detectWhitespacesAndReturnReadableResult } from '../../helpers/whitespace';

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const styles = (theme) => ({
  button: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    width: '40px',
    height: '40px',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    }
  }
});


class Screenshot extends Component {

  getSvg = () => {
    const workspace = Blockly.getMainWorkspace();
    var canvas = workspace.svgBlockCanvas_.cloneNode(true);

    if (canvas.children[0] !== undefined) {
      canvas.removeAttribute("transform");
      // does not work in  react
      // var cssContent = Blockly.Css.CONTENT.join('');
      var cssContent = '';
      for (var i = 0; i < document.getElementsByTagName('style').length; i++) {
        if (/^blockly.*$/.test(document.getElementsByTagName('style')[i].id)) {
          cssContent += document.getElementsByTagName('style')[i].firstChild.data.replace(/\..* \./g, '.');
        }
      }
      // ensure that fill-opacity is 1, because there cannot be a replacing
      // https://github.com/google/blockly/pull/3431/files#diff-00254795773903d3c0430915a68c9521R328
      cssContent += `.blocklyPath {
        fill-opacity: 1;
      }
      .blocklyPathDark {
        display: flex;
      }
      .blocklyPathLight {
        display: flex;
      }  `;
      var css = '<defs><style type="text/css" xmlns="http://www.w3.org/1999/xhtml"><![CDATA[' + cssContent + ']]></style></defs>';
      var bbox = document.getElementsByClassName("blocklyBlockCanvas")[0].getBBox();
      var content = new XMLSerializer().serializeToString(canvas);
      var xml = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                  width="${bbox.width}" height="${bbox.height}" viewBox="${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}">
                  ${css}">${content}</svg>`;
      var fileName = detectWhitespacesAndReturnReadableResult(this.props.name);
      // this.props.workspaceName(this.state.name);
      fileName = `${fileName}.svg`
      var blob = new Blob([xml], { type: 'image/svg+xml;base64' });
      saveAs(blob, fileName);
    }
  }

  render() {
    return (
      <div style={this.props.style}>
        <Tooltip title={Blockly.Msg.tooltip_screenshot} arrow>
          <IconButton
            className={this.props.classes.button}
            onClick={() => this.getSvg()}
          >
            <FontAwesomeIcon icon={faCamera} size="xs" />
          </IconButton>
        </Tooltip>
      </div>
    );
  };
}

Screenshot.propTypes = {
  name: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  name: state.workspace.name,
});

export default connect(mapStateToProps, null)(withStyles(styles, { withTheme: true })(Screenshot));
