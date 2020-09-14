import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';

import clsx from 'clsx';

import tutorials from './tutorials.json';

import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const styles = (theme) => ({
  stepper: {
    width: 'calc(100% - 40px)',
    height: '40px',
    borderRadius: '25px',
    padding: '0 20px',
    margin: '20px 0',
    display: 'flex',
    justifyContent: 'space-between'
  },
  stepperSuccess: {
    backgroundColor: fade(theme.palette.primary.main, 0.6),
  },
  stepperError: {
    backgroundColor: fade(theme.palette.error.dark, 0.6),
  },
  stepperOther: {
    backgroundColor: fade(theme.palette.secondary.main, 0.6),
  },
  color: {
    backgroundColor: 'transparent '
  },
  iconDivSuccess: {
    color: theme.palette.primary.main
  },
  iconDivError: {
    color: theme.palette.error.dark
  }
});

class StepperHorizontal extends Component {

  render() {
    var tutorialId = this.props.currentTutorialId;
    var status = this.props.status.filter(status => status.id === tutorialId)[0];
    var tasks = status.tasks;
    var error = tasks.filter(task => task.type === 'error').length > 0;
    var success = tasks.filter(task => task.type === 'success').length / tasks.length;
    var tutorialStatus = success === 1 ? 'Success' : error ? 'Error' : 'Other';
    return (
      <div style={{position: 'relative'}}>
        {error || success > 0 ?
          <div style={{zIndex: -1, width: error ? 'calc(100% - 40px)' : `calc(${success*100}% - 40px)`, borderRadius: success === 1 || error ? '25px' : '25px 0 0 25px', position: 'absolute', margin: 0, left: 0}} className={clsx(this.props.classes.stepper, error ? this.props.classes.stepperError : this.props.classes.stepperSuccess)}>
          </div>
        : null}
        {success < 1 && !error ?
          <div style={{zIndex: -2, width: `calc(${(1-success)*100}% - 40px)`, borderRadius: success === 0 ? '25px' : '0px 25px 25px 0', position: 'absolute', margin: 0, right: 0}} className={clsx(this.props.classes.stepper, this.props.classes.stepperOther)}>
          </div>
        : null}
        <div className={this.props.classes.stepper}>
          <Button
            disabled={tutorialId === 1}
            onClick={() => {this.props.history.push(`/tutorial/${tutorialId-1}`)}}
          >
            {'<'}
          </Button>
          <Stepper activeStep={tutorialId} orientation="horizontal"
                   style={{padding: 0}} classes={{root: this.props.classes.color}}>
            <Step expanded completed={false}>
              <StepLabel icon={tutorialStatus !== 'Other' ? <div className={tutorialStatus === 'Success' && success === 1 ? this.props.classes.iconDivSuccess : this.props.classes.iconDivError}><FontAwesomeIcon className={this.props.classes.icon} icon={tutorialStatus === 'Success' ? faCheck : faTimes}/></div> : ''}>
                <h1 style={{margin: 0}}>{tutorials.filter(tutorial => tutorial.id === tutorialId)[0].title}</h1>
              </StepLabel>
            </Step>
          </Stepper>
          <Button
            disabled={tutorialId+1 > tutorials.length}
            onClick={() => {this.props.history.push(`/tutorial/${tutorialId+1}`)}}
          >
            {'>'}
          </Button>
        </div>
      </div>
    );
  };
}

StepperHorizontal.propTypes = {
  status: PropTypes.array.isRequired,
  change: PropTypes.number.isRequired,
  currentTutorialId: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  change: state.tutorial.change,
  status: state.tutorial.status,
  currentTutorialId: state.tutorial.currentId
});

export default connect(mapStateToProps, null)(withRouter(withStyles(styles, {withTheme: true})(StepperHorizontal)));
