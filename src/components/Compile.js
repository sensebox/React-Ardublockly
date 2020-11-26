import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { workspaceName } from '../actions/workspaceActions';

import { detectWhitespacesAndReturnReadableResult } from '../helpers/whitespace';

import Dialog from './Dialog';
import * as Blockly from 'blockly'
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';

import { faCogs } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const styles = (theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
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


class Compile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      progress: false,
      open: false,
      file: false,
      title: '',
      content: '',
      name: props.name
    };
  }

  componentDidUpdate(props) {
    if (props.name !== this.props.name) {
      this.setState({ name: this.props.name });
    }
  }


  compile = () => {
    this.setState({ progress: true });
    const data = {
      "board": process.env.REACT_APP_BOARD,
      "sketch": this.props.arduino
    };
    fetch(`${process.env.REACT_APP_COMPILER_URL}/compile`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.setState({ id: data.data.id }, () => {
          this.createFileName();
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ progress: false, file: false, open: true, title: 'Fehler', content: 'Etwas ist beim Kompilieren schief gelaufen. Versuche es nochmal.' });
      });
  }

  download = () => {
    const id = this.state.id;
    const filename = detectWhitespacesAndReturnReadableResult(this.state.name);
    this.toggleDialog();
    this.props.workspaceName(this.state.name);
    window.open(`${process.env.REACT_APP_COMPILER_URL}/download?id=${id}&board=${process.env.REACT_APP_BOARD}&filename=${filename}`, '_self');
    this.setState({ progress: false });
  }

  toggleDialog = () => {
    this.setState({ open: !this.state, progress: false });
  }

  createFileName = () => {
    if (this.state.name) {
      this.download();
    }
    else {
      this.setState({ file: true, open: true, title: 'Blöcke kompilieren', content: 'Bitte gib einen Namen für die Bennenung des zu kompilierenden Programms ein und bestätige diesen mit einem Klick auf \'Eingabe\'.' });
    }
  }

  setFileName = (e) => {
    this.setState({ name: e.target.value });
  }

  render() {
    return (
      <div style={{}}>
        {this.props.iconButton ?
          <Tooltip title={Blockly.Msg.tooltip_compile_code} arrow style={{ marginRight: '5px' }}>
            <IconButton
              className={`compileBlocks ${this.props.classes.button}`}
              onClick={() => this.compile()}
            >
              <FontAwesomeIcon icon={faCogs} size="xs" />
            </IconButton>
          </Tooltip>
          :
          <Button style={{ float: 'right', color: 'white' }} variant="contained" color="primary" onClick={() => this.compile()}>
            <FontAwesomeIcon icon={faCogs} style={{ marginRight: '5px' }} /> {Blockly.Msg.button_compile}
          </Button>
        }
        <Backdrop className={this.props.classes.backdrop} open={this.state.progress}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Dialog
          open={this.state.open}
          title={this.state.title}
          content={this.state.content}
          onClose={this.toggleDialog}
          onClick={this.state.file ? () => { this.toggleDialog(); this.setState({ name: this.props.name }) } : this.toggleDialog}
          button={this.state.file ? Blockly.Msg.button_cancel : Blockly.Msg.button_close}
        >
          {this.state.file ?
            <div style={{ marginTop: '10px' }}>
              <TextField autoFocus placeholder='Dateiname' value={this.state.name} onChange={this.setFileName} style={{ marginRight: '10px' }} />
              <Button disabled={!this.state.name} variant='contained' color='primary' onClick={() => this.download()}>{Blockly.Msg.button_accept}</Button>
            </div>
            : null}
        </Dialog>
      </div>
    );
  };
}

Compile.propTypes = {
  arduino: PropTypes.string.isRequired,
  name: PropTypes.string,
  workspaceName: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  arduino: state.workspace.code.arduino,
  name: state.workspace.name
});


export default connect(mapStateToProps, { workspaceName })(withStyles(styles, { withTheme: true })(Compile));
