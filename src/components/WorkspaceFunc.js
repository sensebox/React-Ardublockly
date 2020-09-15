import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { clearStats, onChangeCode } from '../actions/workspaceActions';

import * as Blockly from 'blockly/core';

import { saveAs } from 'file-saver';

import { initialXml } from './Blockly/initialXml.js';

import Compile from './Compile';
import SolutionCheck from './Tutorial/SolutionCheck';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import { faSave, faUpload, faShare } from "@fortawesome/free-solid-svg-icons";
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


class WorkspaceFunc extends Component {

  constructor(props){
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      title: '',
      content: '',
      open: false
    };
  }

  toggleDialog = () => {
    this.setState({ open: !this.state });
  }

  saveXmlFile = (code) => {
    // saveTextFileAs
    var fileName = 'todo.xml'
    var blob = new Blob([code], { type: 'text/xml' });
    saveAs(blob, fileName);
  }

  uploadXmlFile = (xmlFile) => {
    console.log(xmlFile);
    if(xmlFile.type !== 'text/xml'){
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
          if(workspace.getAllBlocks().length < 1){
            Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xmlBefore), workspace)
            this.setState({ open: true, title: 'Keine Blöcke', content: 'Es wurden keine Blöcke detektiert. Bitte überprüfe den XML-Code und versuche es erneut.' });
          }
        } catch(err){
          this.setState({ open: true, title: 'Ungültige XML', content: 'Die XML-Datei konnte nicht in Blöcke zerlegt werden. Bitte überprüfe den XML-Code und versuche es erneut.' });
        }
      };
    }
  }

  resetWorkspace = () => {
    const workspace = Blockly.getMainWorkspace();
    Blockly.Events.disable(); // https://groups.google.com/forum/#!topic/blockly/m7e3g0TC75Y
    // if events are disabled, then the workspace will be cleared AND the blocks are not in the trashcan
    const xmlDom = Blockly.Xml.textToDom(initialXml)
    Blockly.Xml.clearWorkspaceAndLoadFromXml(xmlDom, workspace);
    Blockly.Events.enable();
    workspace.options.maxBlocks = Infinity;
    this.props.onChangeCode();
    this.props.clearStats();
  }

  render() {
    return (
      <div style={{width: 'max-content', display: 'flex'}}>
        {this.props.solutionCheck ? <SolutionCheck /> : <Compile iconButton />}
        <Tooltip title='Blöcke speichern' arrow style={{marginRight: '5px'}}>
          <IconButton
            className={this.props.classes.button}
            onClick={() => this.saveXmlFile(this.props.xml)}
          >
            <FontAwesomeIcon icon={faSave} size="xs"/>
          </IconButton>
        </Tooltip>
        <div ref={this.inputRef} style={{width: 'max-content', height: '40px', marginRight: '5px'}}>
          <input
            style={{display: 'none'}}
            accept="text/xml"
            onChange={(e) => {this.uploadXmlFile(e.target.files[0])}}
            id="open-blocks"
            type="file"
          />
          <label htmlFor="open-blocks">
            <Tooltip title='Blöcke öffnen' arrow style={{marginRight: '5px'}}>
              <div className={this.props.classes.button} style={{borderRadius: '50%', cursor: 'pointer', display: 'table-cell',
              verticalAlign: 'middle',
              textAlign: 'center'}}>
                <FontAwesomeIcon icon={faUpload} style={{width: '18px', height: '18px'}}/>
              </div>
            </Tooltip>
          </label>
        </div>
        <Tooltip title='Workspace zurücksetzen' arrow>
          <IconButton
            className={this.props.classes.button}
            onClick={() => this.resetWorkspace()}
          >
            <FontAwesomeIcon icon={faShare} size="xs" flip='horizontal'/>
          </IconButton>
        </Tooltip>
        <Dialog onClose={this.toggleDialog} open={this.state.open}>
          <DialogTitle>{this.state.title}</DialogTitle>
          <DialogContent dividers>
            {this.state.content}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.toggleDialog} color="primary">
              Schließen
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };
}

WorkspaceFunc.propTypes = {
  arduino: PropTypes.string.isRequired,
  xml: PropTypes.string.isRequired,
  clearStats: PropTypes.func.isRequired,
  onChangeCode: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  arduino: state.workspace.code.arduino,
  xml: state.workspace.code.xml
});

export default connect(mapStateToProps, { clearStats, onChangeCode })(withStyles(styles, {withTheme: true})(WorkspaceFunc));
