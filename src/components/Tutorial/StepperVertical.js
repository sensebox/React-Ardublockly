import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { tutorialStep } from '../../actions/tutorialActions';

import { withRouter, Link } from 'react-router-dom';

import clsx from 'clsx';

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
  stepIconActive: {
    backgroundColor: theme.palette.secondary.main
  },
  connector: {
    height: '10px',
    borderLeft: `3px solid ${theme.palette.primary.main}`,
    margin: '5px auto'
  }
});

class StepperVertical extends Component {

  componentDidMount(){
    this.props.tutorialStep(0);
  }

  componentDidUpdate(props){
    if(props.currentTutorialId !== Number(this.props.match.params.tutorialId)){
      this.props.tutorialStep(0);
    }
  }

  render() {
    var steps = this.props.steps;
    var activeStep = this.props.activeStep;
    return (
      <div style={{marginRight: '10px'}}>
        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          connector={<div className={this.props.classes.connector}></div>}
          classes={{root: this.props.classes.verticalStepper}}
        >
          {steps.map((step, i) => {
            // var tutorialStatus = this.props.status[verticalTutorialId-1].status === 'success' ? 'Success' :
                                  // this.props.status[verticalTutorialId-1].status === 'error' ? 'Error' : 'Other';
            return (
              <Step key={i}>
                <Tooltip title={step.headline} placement='right' arrow >
                  <Link onClick={() => {this.props.tutorialStep(i)}}>
                    <StepLabel
                      StepIconComponent={'div'}
                      classes={{
                        root: step.type === 'task' ?
                                i === activeStep ?
                                  clsx(this.props.classes.stepIcon, this.props.classes.stepIconLarge, this.props.classes.stepIconActive)
                                : clsx(this.props.classes.stepIcon, this.props.classes.stepIconLarge)
                              : i === activeStep ?
                                  clsx(this.props.classes.stepIcon, this.props.classes.stepIconActive)
                                : clsx(this.props.classes.stepIcon)
                      }}
                    >
                    </StepLabel>
                  </Link>
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
  currentTutorialId: PropTypes.number.isRequired,
  activeStep: PropTypes.number.isRequired,
  tutorialStep: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  change: state.tutorial.change,
  status: state.tutorial.status,
  currentTutorialId: state.tutorial.currentId,
  activeStep: state.tutorial.activeStep
});

export default connect(mapStateToProps, { tutorialStep })(withRouter(withStyles(styles, {withTheme: true})(StepperVertical)));
