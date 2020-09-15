import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { tutorialCheck, tutorialStep } from '../../actions/tutorialActions';

import { withRouter } from 'react-router-dom';

import Compile from '../Compile';

import tutorials from './tutorials.json';
import { checkXml } from './compareXml';

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
    const tutorial = tutorials.filter(tutorial => tutorial.id === this.props.currentTutorialId)[0];
    const step = tutorial.steps[this.props.activeStep];
    var msg = checkXml(step.xml, this.props.xml);
    this.props.tutorialCheck(msg.type, step);
    this.setState({ msg, open: true });
  }

  render() {
    const steps = tutorials.filter(tutorial => tutorial.id === this.props.currentTutorialId)[0].steps;
    return (
      <div>
        <Tooltip title='Lösung kontrollieren'>
          <IconButton
            className={this.props.classes.compile}
            style={{width: '40px', height: '40px', marginRight: '5px'}}
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
                {this.props.activeStep === steps.length-1 ?
                  <Button
                    style={{marginLeft: '10px'}}
                    variant="contained"
                    color="primary"
                    onClick={() => {this.toggleDialog(); this.props.history.push(`/tutorial/`)}}
                  >
                    Tutorials-Übersicht
                  </Button>
                :
                  <Button
                    style={{marginLeft: '10px'}}
                    variant="contained"
                    color="primary"
                    onClick={() => {this.toggleDialog(); this.props.tutorialStep(this.props.activeStep + 1)}}
                  >
                    nächster Schritt
                  </Button>
                }
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
    );
  };
}


SolutionCheck.propTypes = {
  tutorialCheck: PropTypes.func.isRequired,
  tutorialStep: PropTypes.func.isRequired,
  currentTutorialId: PropTypes.number,
  activeStep: PropTypes.number.isRequired,
  xml: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  currentTutorialId: state.tutorial.currentId,
  activeStep: state.tutorial.activeStep,
  xml: state.workspace.code.xml
});

export default connect(mapStateToProps, { tutorialCheck, tutorialStep })(withStyles(styles, {withTheme: true})(withRouter(SolutionCheck)));
