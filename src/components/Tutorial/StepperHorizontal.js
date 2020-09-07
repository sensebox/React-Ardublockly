import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';

import clsx from 'clsx';

import { tutorials } from './tutorials';

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

  state={
    tutorialId: Number(this.props.match.params.tutorialId),
  }

  componentDidUpdate(props, state){
    if(state.tutorialId !== Number(this.props.match.params.tutorialId)){
      this.setState({tutorialId: Number(this.props.match.params.tutorialId)})
    }
  }

  render() {
    var tutorialId = this.state.tutorialId;
    var tutorialStatus = this.props.status[tutorialId-1].status === 'success' ? 'Success' :
                          this.props.status[tutorialId-1].status === 'error' ? 'Error' : 'Other';
    return (
      <div className={clsx(this.props.classes.stepper, this.props.classes['stepper'+tutorialStatus])}>
        <Button
          disabled={tutorialId-1 === 0}
          onClick={() => {this.props.history.push(`/tutorial/${tutorialId-1}`)}}
        >
          {'<'}
        </Button>
        <Stepper activeStep={tutorialId} orientation="horizontal"
                 style={{padding: 0}} classes={{root: this.props.classes.color}}>
          <Step expanded completed={false}>
            <StepLabel icon={tutorialStatus !== 'Other' ? <div className={clsx(tutorialStatus === 'Error' ? this.props.classes.iconDivError: this.props.classes.iconDivSuccess)}><FontAwesomeIcon className={this.props.classes.icon} icon={tutorialStatus === 'Success' ? faCheck : faTimes}/></div> : ''}>
              <h1 style={{margin: 0}}>{tutorials[tutorialId-1].title}</h1>
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
    );
  };
}

StepperHorizontal.propTypes = {
  status: PropTypes.array.isRequired,
  change: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  change: state.tutorial.change,
  status: state.tutorial.status
});

export default connect(mapStateToProps, null)(withRouter(withStyles(styles, {withTheme: true})(StepperHorizontal)));
