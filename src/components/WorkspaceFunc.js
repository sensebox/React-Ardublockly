import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { clearStats, onChangeCode, workspaceName } from '../actions/workspaceActions';
import { updateProject } from '../actions/projectActions';

import * as Blockly from 'blockly/core';

import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { saveAs } from 'file-saver';

import { detectWhitespacesAndReturnReadableResult } from '../helpers/whitespace';
import { initialXml } from './Blockly/initialXml.js';

import Compile from './Compile';
import SolutionCheck from './Tutorial/SolutionCheck';
import Snackbar from './Snackbar';
import Dialog from './Dialog';

import { Link } from 'react-router-dom';

import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { faPen, faSave, faUpload, faFileDownload, faCamera, faShare, faShareAlt, faCopy } from "@fortawesome/free-solid-svg-icons";
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
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.primary.main,
      textDecoration: 'underline'
    }
  }
});



class WorkspaceFunc extends Component {

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      title: '',
      content: '',
      open: false,
      file: false,
      saveFile: false,
      share: false,
      name: props.name,
      snackbar: false,
      type: '',
      key: '',
      message: '',
      id: ''
    };
  }

  componentDidUpdate(props) {
    if (props.name !== this.props.name) {
      this.setState({ name: this.props.name });
    }
    if(this.props.message !== props.message){
      if(this.props.message.id === 'PROJECT_UPDATE_SUCCESS'){
        this.setState({ snackbar: true, key: Date.now(), message: `Das Projekt wurde erfolgreich aktualisiert.`, type: 'success' });
      }
      else if (this.props.message.id === 'PROJECT_UPDATE_FAIL'){
        this.setState({ snackbar: true, key: Date.now(), message: `Fehler beim Aktualisieren des Projektes. Versuche es noch einmal.`, type: 'error' });
      }
    }
  }

  toggleDialog = () => {
    this.setState({ open: !this.state, share: false, file: false, saveFile: false, title: '', content: '' });
  }

  saveProject = () => {
    var body = {
      xml: this.props.xml,
      title: this.props.name
    };
    axios.post(`${process.env.REACT_APP_BLOCKLY_API}/project`, body)
      .then(res => {
        var project = res.data.project;
        this.props.history.push(`/project/${project._id}`);
      })
      .catch(err => {
        this.setState({ snackbar: true, key: Date.now(), message: `Fehler beim Speichern des Projektes. Versuche es noch einmal.`, type: 'error' });
        window.scrollTo(0, 0);
      });
  }

  downloadXmlFile = () => {
    var code = this.props.xml;
    this.toggleDialog();
    var fileName = detectWhitespacesAndReturnReadableResult(this.state.name);
    this.props.workspaceName(this.state.name);
    fileName = `${fileName}.xml`
    var blob = new Blob([code], { type: 'text/xml' });
    saveAs(blob, fileName);
  }

  shareBlocks = () => {
    var body = {
      name: this.state.name,
      xml: this.props.xml
    };
    axios.post(`${process.env.REACT_APP_BLOCKLY_API}/share`, body)
      .then(res => {
        var shareContent = res.data.content;
        this.setState({ share: true, open: true, title: 'Programm teilen', id: shareContent.link });
      })
      .catch(err => {
        this.setState({ snackbar: true, key: Date.now(), message: `Fehler beim Erstellen eines Links zum Teilen deines Programmes. Versuche es noch einmal.`, type: 'error' });
        window.scrollTo(0, 0);
      });
  }

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
      var fileName = detectWhitespacesAndReturnReadableResult(this.state.name);
      this.props.workspaceName(this.state.name);
      fileName = `${fileName}.svg`
      var blob = new Blob([xml], { type: 'image/svg+xml;base64' });
      saveAs(blob, fileName);
    }
  }

  createFileName = (filetype) => {
    this.setState({ file: filetype }, () => {
      if (this.state.name) {
        this.state.file === 'xml' ? this.downloadXmlFile() : this.getSvg()
      }
      else {
        this.setState({ saveFile: true, file: filetype, open: true, title: this.state.file === 'xml' ? 'Projekt herunterladen' : 'Screenshot erstellen', content: `Bitte gib einen Namen für die Bennenung der ${this.state.file === 'xml' ? 'XML' : 'SVG'}-Datei ein und bestätige diesen mit einem Klick auf 'Eingabe'.` });
      }
    });
  }

  setFileName = (e) => {
    this.setState({ name: e.target.value });
  }

  uploadXmlFile = (xmlFile) => {
    if (xmlFile.type !== 'text/xml') {
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
          if (workspace.getAllBlocks().length < 1) {
            Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xmlBefore), workspace)
            this.setState({ open: true, file: false, title: 'Keine Blöcke', content: 'Es wurden keine Blöcke detektiert. Bitte überprüfe den XML-Code und versuche es erneut.' });
          }
          else {
            if (!this.props.assessment) {
              var extensionPosition = xmlFile.name.lastIndexOf('.');
              this.props.workspaceName(xmlFile.name.substr(0, extensionPosition));
            }
            this.setState({ snackbar: true, type: 'success', key: Date.now(), message: 'Das Projekt aus gegebener XML-Datei wurde erfolgreich eingefügt.' });
          }
        } catch (err) {
          this.setState({ open: true, file: false, title: 'Ungültige XML', content: 'Die XML-Datei konnte nicht in Blöcke zerlegt werden. Bitte überprüfe den XML-Code und versuche es erneut.' });
        }
      };
    }
  }

  renameWorkspace = () => {
    this.props.workspaceName(this.state.name);
    this.toggleDialog();
    this.setState({ snackbar: true, type: 'success', key: Date.now(), message: `Das Projekt wurde erfolgreich in '${this.state.name}' umbenannt.` });
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
    if (!this.props.assessment) {
      this.props.workspaceName(null);
    }
    this.setState({ snackbar: true, type: 'success', key: Date.now(), message: 'Das Projekt wurde erfolgreich zurückgesetzt.' });
  }



  render() {
    return (
      <div style={{ width: 'max-content', display: 'flex' }}>
        {!this.props.assessment ?
          <Tooltip title={`Name des Projektes${this.props.name ? `: ${this.props.name}` : ''}`} arrow style={{ marginRight: '5px' }}>
            <div className={this.props.classes.workspaceName} onClick={() => { this.setState({ file: true, open: true, saveFile: false, title: 'Projekt benennen', content: 'Bitte gib einen Namen für das Projekt ein und bestätige diesen mit einem Klick auf \'Eingabe\'.' }) }}>
              {this.props.name && !isWidthDown('xs', this.props.width) ? <Typography style={{ margin: 'auto -3px auto 12px' }}>{this.props.name}</Typography> : null}
              <div style={{ width: '40px', display: 'flex' }}>
                <FontAwesomeIcon icon={faPen} style={{ height: '18px', width: '18px', margin: 'auto' }} />
              </div>
            </div>
          </Tooltip>
          : null}
        {this.props.assessment ? <SolutionCheck /> : <Compile iconButton />}
        <Tooltip title={this.props.projectType === 'project'? 'Projekt aktualisieren':'Projekt speichern'} arrow style={{ marginRight: '5px' }}>
          <IconButton
            className={this.props.classes.button}
            onClick={this.props.projectType === 'project' ? () => this.props.updateProject() : () => this.saveProject()}
          >
            <FontAwesomeIcon icon={faSave} size="xs" />
          </IconButton>
        </Tooltip>
        <Tooltip title='Projekt herunterladen' arrow style={{ marginRight: '5px' }}>
          <IconButton
            className={this.props.classes.button}
            onClick={() => { this.createFileName('xml'); }}
          >
            <FontAwesomeIcon icon={faFileDownload} size="xs" />
          </IconButton>
        </Tooltip>
        {!this.props.assessment?
          <div ref={this.inputRef} style={{ width: 'max-content', height: '40px', marginRight: '5px' }}>
            <input
              style={{ display: 'none' }}
              accept="text/xml"
              onChange={(e) => { this.uploadXmlFile(e.target.files[0]) }}
              id="open-blocks"
              type="file"
            />
            <label htmlFor="open-blocks">
              <Tooltip title='Projekt öffnen' arrow style={{ marginRight: '5px' }}>
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
        : null}
        {!this.props.assessment?
          <Tooltip title='Screenshot erstellen' arrow style={{ marginRight: '5px' }}>
            <IconButton
              className={this.props.classes.button}
              onClick={() => { this.createFileName('svg'); }}
            >
              <FontAwesomeIcon icon={faCamera} size="xs" />
            </IconButton>
          </Tooltip>
        : null}
        <Tooltip title='Workspace zurücksetzen' arrow style={this.props.assessment ? null : { marginRight: '5px' }}>
          <IconButton
            className={this.props.classes.button}
            onClick={() => this.resetWorkspace()}
          >
            <FontAwesomeIcon icon={faShare} size="xs" flip='horizontal' />
          </IconButton>
        </Tooltip>
        {!this.props.assessment?
          <Tooltip title='Projekt teilen' arrow>
            <IconButton
              className={this.props.classes.button}
              onClick={() => this.shareBlocks()}
            >
              <FontAwesomeIcon icon={faShareAlt} size="xs" flip='horizontal' />
            </IconButton>
          </Tooltip>
        :null}

        <Dialog
          open={this.state.open}
          title={this.state.title}
          content={this.state.content}
          onClose={this.toggleDialog}
          onClick={this.state.file ? () => { this.toggleDialog(); this.setState({ name: this.props.name }) } : this.toggleDialog}
          button={this.state.file ? 'Abbrechen' : 'Schließen'}
        >
          {this.state.file ?
            <div style={{ marginTop: '10px' }}>
              <TextField autoFocus placeholder={this.state.saveXml ? 'Dateiname' : 'Projektname'} value={this.state.name} onChange={this.setFileName} style={{ marginRight: '10px' }} />
              <Button disabled={!this.state.name} variant='contained' color='primary' onClick={() => { this.state.saveFile ? this.state.file === 'xml' ? this.downloadXmlFile() : this.getSvg() : this.renameWorkspace(); this.toggleDialog(); }}>Eingabe</Button>
            </div>
          : this.state.share ?
            <div style={{ marginTop: '10px' }}>
              <Typography>Über den folgenden Link kannst du dein Programm teilen:</Typography>
              <Link to={`/share/${this.state.id}`} onClick={() => this.toggleDialog()} className={this.props.classes.link}>{`${window.location.origin}/share/${this.state.id}`}</Link>
              <Tooltip title='Link kopieren' arrow style={{ marginRight: '5px' }}>
                <IconButton
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/share/${this.state.id}`);
                    this.setState({ snackbar: true, key: Date.now(), message: 'Link erfolgreich in Zwischenablage gespeichert.', type: 'success' });
                  }}
                >
                  <FontAwesomeIcon icon={faCopy} size="xs" />
                </IconButton>
              </Tooltip>
            </div>
          : null}
        </Dialog>

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

WorkspaceFunc.propTypes = {
  clearStats: PropTypes.func.isRequired,
  onChangeCode: PropTypes.func.isRequired,
  workspaceName: PropTypes.func.isRequired,
  updateProject: PropTypes.func.isRequired,
  arduino: PropTypes.string.isRequired,
  xml: PropTypes.string.isRequired,
  name: PropTypes.string,
  projectType: PropTypes.string.isRequired,
  message: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  arduino: state.workspace.code.arduino,
  xml: state.workspace.code.xml,
  name: state.workspace.name,
  projectType: state.project.type,
  message: state.message
});

export default connect(mapStateToProps, { clearStats, onChangeCode, workspaceName, updateProject })(withStyles(styles, { withTheme: true })(withWidth()(withRouter(WorkspaceFunc))));
