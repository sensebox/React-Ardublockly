import React, { Component } from 'react';

import * as Blockly from 'blockly/core';

import Compile from '../Compile';

import { tutorials } from './tutorials';

import { withRouter } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const styles = (theme) => ({
  compile: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    }
  }
});

class SolutionCheck extends Component {

  state={
    open: false,
    msg: ''
  }

  toggleDialog = () => {
    if(this.state.open){
      this.setState({ open: false, msg: '' });
    }
    else{
      this.setState({ open: !this.state });
    }
  }

  check = () => {
    const workspace = Blockly.getMainWorkspace();
    var msg = tutorials[this.props.tutorial].test(workspace);
    this.setState({ msg, open: true });
  }

  render() {
    return (
      tutorials[this.props.tutorial].test ?
      <div>
        <Tooltip title='Lösung kontrollieren'>
          <IconButton
            className={this.props.classes.compile}
            style={{width: '40px', height: '40px', position: 'absolute', top: 8, right: 8, zIndex: 21 }}
            onClick={() => this.check()}
          >
            <FontAwesomeIcon icon={faPlay} size="xs"/>
          </IconButton>
        </Tooltip>
        <Dialog fullWidth maxWidth={'sm'} onClose={this.toggleDialog} open={this.state.open} style={{zIndex: 9999999}}>
          <DialogTitle>{this.state.msg.type === 'error' ? 'Fehler' : 'Erfolg'}</DialogTitle>
          <DialogContent dividers>
            {this.state.msg.text}
            {this.state.msg.type === 'success' ?
            <div style={{marginTop: '20px', display: 'flex'}}>
              <Compile />
              <Button
                style={{marginLeft: '10px'}}
                variant="contained"
                color="primary"
                onClick={() => {this.toggleDialog(); this.props.history.push(`/tutorial/${this.props.tutorial+2}`)}}
              >
                nächstes Tutorial
              </Button>
              </div>
            : null}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.toggleDialog} color="primary">
              Schließen
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      : null
    );
  };
}

export default withRouter(withStyles(styles, {withTheme: true})(SolutionCheck));
