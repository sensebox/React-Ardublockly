import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { clearStats, onChangeCode, workspaceName } from '../actions/workspaceActions';

import * as Blockly from 'blockly/core';

import { saveAs } from 'file-saver';

import { detectWhitespacesAndReturnReadableResult } from '../helpers/whitespace';
import { initialXml } from './Blockly/initialXml.js';

import Compile from './Compile';
import SolutionCheck from './Tutorial/SolutionCheck';
import Dialog from './Dialog';
import Snackbar from './Snackbar';

import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { faPen, faSave, faUpload, faShare } from "@fortawesome/free-solid-svg-icons";
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
  },
  workspaceName: {
    backgroundColor: theme.palette.secondary.main,
    borderRadius: '25px',
    display: 'inline-flex',
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.primary.main,
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
      open: false,
      file: false,
      saveXml: false,
      name: props.name,
      snackbar: false,
      message: ''
    };
  }

  componentDidUpdate(props){
    if(props.name !== this.props.name){
      this.setState({name: this.props.name});
    }
  }

  toggleDialog = () => {
    this.setState({ open: !this.state });
  }

  toggleSnackbar = () => {
    this.setState({ snackbar: !this.state, message: '' });
  }

  saveXmlFile = () => {
    var code = this.props.xml;
    this.toggleDialog();
    var fileName = detectWhitespacesAndReturnReadableResult(this.state.name);
    this.props.workspaceName(this.state.name);
    fileName = `${fileName}.xml`
    var blob = new Blob([code], { type: 'text/xml' });
    saveAs(blob, fileName);
  }

  createFileName = () => {
    if(this.state.name){
      this.saveXmlFile();
    }
    else{
      this.setState({ file: true, saveXml: true, open: true, title: 'Blöcke speichern', content: 'Bitte gib einen Namen für die Bennenung der XML-Datei ein und bestätige diesen mit einem Klick auf \'Eingabe\'.' });
    }
  }

  setFileName = (e) => {
    this.setState({name: e.target.value});
  }

  uploadXmlFile = (xmlFile) => {
    if(xmlFile.type !== 'text/xml'){
      this.setState({ open: true, file: false, title: 'Unzulässiger Dateityp', content: 'Die übergebene Datei entsprach nicht dem geforderten Format. Es sind nur XML-Dateien zulässig.' });
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
            this.setState({ open: true, file: false, title: 'Keine Blöcke', content: 'Es wurden keine Blöcke detektiert. Bitte überprüfe den XML-Code und versuche es erneut.' });
          }
          else {
            if(!this.props.solutionCheck){
              var extensionPosition = xmlFile.name.lastIndexOf('.');
              this.props.workspaceName(xmlFile.name.substr(0, extensionPosition));
            }
            this.setState({ snackbar: true, message: 'Das Projekt aus gegebener XML-Datei wurde erfolgreich eingefügt.' });
          }
        } catch(err){
          this.setState({ open: true, file: false, title: 'Ungültige XML', content: 'Die XML-Datei konnte nicht in Blöcke zerlegt werden. Bitte überprüfe den XML-Code und versuche es erneut.' });
        }
      };
    }
  }

  renameWorkspace = () => {
    this.props.workspaceName(this.state.name);
    this.toggleDialog();
    this.setState({ snackbar: true, message: `Das Projekt wurde erfolgreich in '${this.state.name}' umbenannt.` });
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
    if(!this.props.solutionCheck){
      this.props.workspaceName(null);
    }
    this.setState({ snackbar: true, message: 'Das Projekt wurde erfolgreich zurückgesetzt.' });
  }

  render() {
    return (
      <div style={{width: 'max-content', display: 'flex'}}>
        {!this.props.solutionCheck ?
          <Tooltip title={`Name des Projekts${this.props.name ? `: ${this.props.name}` : ''}`} arrow style={{marginRight: '5px'}}>
          <div className={this.props.classes.workspaceName} onClick={() => {this.setState({file: true, open: true, saveXml: false, title: 'Projekt benennen', content: 'Bitte gib einen Namen für das Projekt ein und bestätige diesen mit einem Klick auf \'Eingabe\'.'})}}>
            {this.props.name && !isWidthDown('xs', this.props.width) ? <Typography style={{margin: 'auto -3px auto 12px'}}>{this.props.name}</Typography> : null}
            <div style={{width: '40px', display: 'flex'}}>
              <FontAwesomeIcon icon={faPen} style={{height: '18px', width: '18px', margin: 'auto'}}/>
            </div>
          </div>
          </Tooltip>
        : null}
        {this.props.solutionCheck ? <SolutionCheck /> : <Compile iconButton />}
        <Tooltip title='Blöcke speichern' arrow style={{marginRight: '5px'}}>
          <IconButton
            className={this.props.classes.button}
            onClick={() => this.createFileName()}
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

        <Dialog
          open={this.state.open}
          title={this.state.title}
          content={this.state.content}
          onClose={this.toggleDialog}
          onClick={this.state.file ? () => {this.toggleDialog(); this.setState({name: this.props.name})} : this.toggleDialog}
          button={this.state.file ? 'Abbrechen' : 'Schließen'}
        >
          {this.state.file ?
            <div style={{marginTop: '10px'}}>
              <TextField autoFocus placeholder={this.state.saveXml ?'Dateiname' : 'Projektname'} value={this.state.name} onChange={this.setFileName} style={{marginRight: '10px'}}/>
              <Button disabled={!this.state.name} variant='contained' color='primary' onClick={() => {this.state.saveXml ? this.saveXmlFile() : this.renameWorkspace()}}>Eingabe</Button>
            </div>
          : null}
        </Dialog>

        <Snackbar
          open={this.state.snackbar}
          onClose={this.toggleSnackbar}
          message={this.state.message}
          type='success'
        />

      </div>
    );
  };
}

WorkspaceFunc.propTypes = {
  arduino: PropTypes.string.isRequired,
  xml: PropTypes.string.isRequired,
  name: PropTypes.string,
  clearStats: PropTypes.func.isRequired,
  onChangeCode: PropTypes.func.isRequired,
  workspaceName: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  arduino: state.workspace.code.arduino,
  xml: state.workspace.code.xml,
  name: state.workspace.name
});

export default connect(mapStateToProps, { clearStats, onChangeCode, workspaceName })(withStyles(styles, {withTheme: true})(withWidth()(WorkspaceFunc)));
