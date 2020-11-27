import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { tutorialStep } from '../../actions/tutorialActions';

import { withRouter } from 'react-router-dom';

import clsx from 'clsx';

import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Tooltip from '@material-ui/core/Tooltip';

const styles = (theme) => ({
  verticalStepper: {
    padding: 0,
    width: '30px',
  },
  stepIcon: {
    borderStyle: `solid`,
    // borderWidth: '2px',
    borderRadius: '50%',
    borderColor: theme.palette.secondary.main,
    width: '12px',
    height: '12px',
    margin: '0 auto',
  },
  stepIconLarge: {
    width: '24px',
    height: '24px'
  },
  stepIconLargeSuccess: {
    borderColor: theme.palette.primary.main,
  },
  stepIconLargeError: {
    borderColor: theme.palette.error.dark,
  },
  stepIconActiveOther: {
    backgroundColor: theme.palette.secondary.main
  },
  stepIconActiveSuccess: {
    backgroundColor: fade(theme.palette.primary.main, 0.6)
  },
  stepIconActiveError: {
    backgroundColor: fade(theme.palette.error.dark, 0.6)
  },
  connector: {
    height: '10px',
    borderLeft: `2px solid black`,
    margin: 'auto'
  }
});

class StepperVertical extends Component {

  componentDidMount(){
    this.props.tutorialStep(0);
  }

  componentDidUpdate(props){
    if (props.tutorial._id !== this.props.match.params.tutorialId) {
      this.props.tutorialStep(0);
    }
  }

  render() {
    var steps = this.props.steps;
    var activeStep = this.props.activeStep;
    var tutorialStatus = this.props.status.filter(status => status._id === this.props.tutorial._id)[0];
    return (
      <div style={{marginRight: '10px'}}>
        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          connector={<div className={this.props.classes.connector}></div>}
          classes={{root: this.props.classes.verticalStepper}}
        >
          {steps.map((step, i) => {
            var tasksIndex = tutorialStatus.tasks.findIndex(task => task._id === step._id);
            var taskType = tasksIndex > -1 ? tutorialStatus.tasks[tasksIndex].type : null;
            var taskStatus = taskType === 'success' ? 'Success' : taskType === 'error' ? 'Error' : 'Other';
            return (
              <Step key={i}>
                <Tooltip title={step.headline} placement='right' arrow >
                  <div style={i === activeStep ? {padding: '5px 0'} : {padding: '5px 0', cursor: 'pointer'}} onClick={i === activeStep ? null : () => {console.log(i); this.props.tutorialStep(i)}}>
                    <StepLabel
                      StepIconComponent={'div'}
                      classes={{
                        root: step.type === 'task' ?
                                i === activeStep ?
                                  clsx(this.props.classes.stepIcon, this.props.classes.stepIconLarge, this.props.classes['stepIconLarge'+taskStatus], this.props.classes['stepIconActive'+taskStatus])
                                : clsx(this.props.classes.stepIcon, this.props.classes.stepIconLarge, this.props.classes['stepIconLarge'+taskStatus])
                              : i === activeStep ?
                                  clsx(this.props.classes.stepIcon, this.props.classes.stepIconActiveOther)
                                : clsx(this.props.classes.stepIcon)
                      }}
                    >
                    </StepLabel>
                  </div>
                </Tooltip>
              </Step>
          )})}
        </Stepper>
      </div>
    );
  };
}


StepperVertical.propTypes = {
  status: PropTypes.array.isRequired,
  change: PropTypes.number.isRequired,
  activeStep: PropTypes.number.isRequired,
  tutorialStep: PropTypes.func.isRequired,
  tutorial: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  change: state.tutorial.change,
  status: state.tutorial.status,
  activeStep: state.tutorial.activeStep,
  tutorial: state.tutorial.tutorials[0]
});

export default connect(mapStateToProps, { tutorialStep })(withRouter(withStyles(styles, {withTheme: true})(StepperVertical)));
