import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { clearStats, workspaceName } from '../../actions/workspaceActions';

import * as Blockly from 'blockly/core';

import Snackbar from '../Snackbar';
import Dialog from '../Dialog';

import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

import { faUpload } from "@fortawesome/free-solid-svg-icons";
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


class OpenProject extends Component {

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      title: '',
      content: '',
      open: false,
      snackbar: false,
      type: '',
      key: '',
      message: ''
    };
  }

  toggleDialog = () => {
    this.setState({ open: !this.state, title: '', content: '' });
  }

  uploadXmlFile = (xmlFile) => {
    if (xmlFile.type !== 'text/xml') {
      this.setState({ open: true, title: 'Unzulässiger Dateityp', content: 'Die übergebene Datei entsprach nicht dem geforderten Format. Es sind nur XML-Dateien zulässig.' });
    }
    else {
      var reader = new FileReader();
      reader.readAsText(xmlFile);
      reader.onloadend = () => {
        var xmlDom = null;
        try {
          xmlDom = Blockly.Xml.textToDom(reader.result);
          const workspace = Blockly.getMainWorkspace();
          var xmlBefore = this.props.xml;
          workspace.clear();
          this.props.clearStats();
          Blockly.Xml.domToWorkspace(xmlDom, workspace);
          if (workspace.getAllBlocks().length < 1) {
            Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xmlBefore), workspace)
            this.setState({ open: true, title: 'Keine Blöcke', content: 'Es wurden keine Blöcke detektiert. Bitte überprüfe den XML-Code und versuche es erneut.' });
          }
          else {
            if (!this.props.assessment) {
              var extensionPosition = xmlFile.name.lastIndexOf('.');
              this.props.workspaceName(xmlFile.name.substr(0, extensionPosition));
            }
            this.setState({ snackbar: true, type: 'success', key: Date.now(), message: 'Das Projekt aus gegebener XML-Datei wurde erfolgreich eingefügt.' });
          }
        } catch (err) {
          this.setState({ open: true, title: 'Ungültige XML', content: 'Die XML-Datei konnte nicht in Blöcke zerlegt werden. Bitte überprüfe den XML-Code und versuche es erneut.' });
        }
      };
    }
  }

  render() {
    return (
      <div>
        <div ref={this.inputRef} style={{ width: 'max-content', height: '40px', marginRight: '5px' }}>
          <input
            style={{ display: 'none' }}
            accept="text/xml"
            onChange={(e) => { this.uploadXmlFile(e.target.files[0]) }}
            id="open-blocks"
            type="file"
          />
          <label htmlFor="open-blocks">
            <Tooltip title={Blockly.Msg.tooltip_open_project} arrow style={this.props.style}>
              <div className={this.props.classes.button} style={{
                borderRadius: '50%', cursor: 'pointer', display: 'table-cell',
                verticalAlign: 'middle',
                textAlign: 'center'
              }}>
                <FontAwesomeIcon icon={faUpload} style={{ width: '18px', height: '18px' }} />
              </div>
            </Tooltip>
          </label>
        </div>

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
  };
}

OpenProject.propTypes = {
  clearStats: PropTypes.func.isRequired,
  workspaceName: PropTypes.func.isRequired,
  xml: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  xml: state.workspace.code.xml,
  name: state.workspace.name
});

export default connect(mapStateToProps, { clearStats, workspaceName })(withStyles(styles, { withTheme: true })(OpenProject));
