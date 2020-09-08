import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withRouter, Link } from 'react-router-dom';

import clsx from 'clsx';

import { tutorials } from './tutorials';

import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import Button from '@material-ui/core/Button';
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
    width: '12px',
    height: '12px',
    margin: '0 auto'
  },
  stepIconMedium: {
    width: '18px',
    height: '18px',
  },
  stepIconLarge: {
    width: '24px',
    height: '24px'
  },
  stepIconTransparent: {
    borderColor: `transparent`,
    cursor: 'default'
  },
  stepIconSuccess: {
    borderColor: theme.palette.primary.main,
  },
  stepIconError: {
    borderColor: theme.palette.error.dark,
  },
  stepIconOther: {
    borderColor: theme.palette.secondary.main,
  },
  stepIconActiveSuccess: {
    backgroundColor: fade(theme.palette.primary.main, 0.6)
  },
  stepIconActiveError: {
    backgroundColor: fade(theme.palette.error.dark, 0.6)
  },
  stepIconActiveOther: {
    backgroundColor: fade(theme.palette.secondary.main, 0.6)
  },
  progress: {
    position: 'absolute',
    top: 0,
    right: 0,
    marginRight: '5px',
    width: '3px',
  },
  progressForeground: {
    backgroundColor: theme.palette.primary.main
  },
  progressBackground: {
    backgroundColor: fade(theme.palette.primary.main, 0.2),
    height: '100%',
    borderRadius: '2px'
  }
});

class StepperVertical extends Component {

  constructor(props){
    super(props);
    this.state = {
      tutorialArray: props.currentTutorialId === 0 ?
                      tutorials.slice(props.currentTutorialId, props.currentTutorialId+5)
                      : props.currentTutorialId === 1 ?
                          tutorials.slice(props.currentTutorialId-1, props.currentTutorialId+4)
                          : props.currentTutorialId === tutorials.length-1 ?
                                tutorials.slice(props.currentTutorialId-4, props.currentTutorialId+5)
                              : props.currentTutorialId === tutorials.length-2 ?
                                    tutorials.slice(props.currentTutorialId-3, props.currentTutorialId+4)
                                  : tutorials.slice(props.currentTutorialId-2, props.currentTutorialId+3),
      selectedVerticalTutorialId: props.currentTutorialId
    };
  }

  componentDidUpdate(props){
    if(props.currentTutorialId !== this.props.currentTutorialId){
      this.setState({
        tutorialArray: props.currentTutorialId === 0 ?
                        tutorials.slice(props.currentTutorialId, props.currentTutorialId+5)
                        : props.currentTutorialId === 1 ?
                            tutorials.slice(props.currentTutorialId-1, props.currentTutorialId+4)
                            : props.currentTutorialId === tutorials.length-1 ?
                                  tutorials.slice(props.currentTutorialId-4, props.currentTutorialId+5)
                                : props.currentTutorialId === tutorials.length-2 ?
                                      tutorials.slice(props.currentTutorialId-3, props.currentTutorialId+4)
                                    : tutorials.slice(props.currentTutorialId-2, props.currentTutorialId+3),
        selectedVerticalTutorialId: props.currentTutorialId
      });
    }
  }

  verticalStepper = (step) => {
    var newTutorialId = this.state.selectedVerticalTutorialId + step;
    var tutorialArray = newTutorialId === 0 ?
                          tutorials.slice(newTutorialId, newTutorialId+5)
                          : newTutorialId === 1 ?
                                tutorials.slice(newTutorialId-1, newTutorialId+4)
                              : newTutorialId === tutorials.length-1 ?
                                    tutorials.slice(newTutorialId-4, newTutorialId+5)
                                  : newTutorialId === tutorials.length-2 ?
                                        tutorials.slice(newTutorialId-3, newTutorialId+4)
                                      : tutorials.slice(newTutorialId-2, newTutorialId+3);
    this.setState({ tutorialArray: tutorialArray, selectedVerticalTutorialId: newTutorialId });
  }

  render() {
    var tutorialId = this.props.currentTutorialId;
    var selectedVerticalTutorialId = this.state.selectedVerticalTutorialId;
    return (
      isWidthUp('sm', this.props.width) ?
        <div style={{marginRight: '10px'}}>
            <Button
              style={{minWidth: '30px', margin: 'auto', minHeight: '25px', padding: '0', writingMode: 'vertical-rl'}}
              disabled={selectedVerticalTutorialId === 0}
              onClick={() => {this.verticalStepper(-1)}}
            >
              {'<'}
            </Button>
            <div style={{display: 'flex', height: 'max-content', width: 'max-content'}}>
              <div style={{position: 'relative'}}>
                <div
                  className={clsx(this.props.classes.progress, this.props.classes.progressForeground)}
                  style={{ zIndex: 1, borderRadius: `${selectedVerticalTutorialId/(tutorials.length-1) === 1 ? '2px' : '2px 2px 0 0'}`, height: `${((selectedVerticalTutorialId+1)/tutorials.length)*100}%`}}>
                </div>
                <div className={clsx(this.props.classes.progress, this.props.classes.progressBackground)}>
                </div>
              </div>
              <Stepper
                activeStep={tutorialId+1}
                orientation="vertical"
                connector={<div style={{height: '10px'}}></div>}
                classes={{root: this.props.classes.verticalStepper}}
              >
                {this.state.tutorialArray.map((tutorial, i) => {
                  var index = this.state.tutorialArray.indexOf(tutorials[selectedVerticalTutorialId]);
                  var verticalTutorialId = i === index ? selectedVerticalTutorialId+1 : selectedVerticalTutorialId+1 - index + i;
                  var tutorialStatus = this.props.status[verticalTutorialId-1].status === 'success' ? 'Success' :
                                        this.props.status[verticalTutorialId-1].status === 'error' ? 'Error' : 'Other';
                  return (
                    <Step key={i}>
                      <Tooltip title={Object.keys(tutorial).length > 0 ? tutorial.title : ''} placement='right' arrow >
                        <Link to={`/tutorial/${verticalTutorialId}`}>
                          <StepLabel
                            StepIconComponent={'div'}
                            classes={{
                              root: tutorial === tutorials[selectedVerticalTutorialId] ?
                                      tutorial === tutorials[tutorialId] ?
                                         clsx(this.props.classes.stepIcon, this.props.classes.stepIconLarge, this.props.classes['stepIcon'+tutorialStatus], this.props.classes['stepIconActive'+tutorialStatus])
                                      : clsx(this.props.classes.stepIcon, this.props.classes.stepIconLarge, this.props.classes['stepIcon'+tutorialStatus])
                                    : tutorial === tutorials[selectedVerticalTutorialId-1] || tutorial === tutorials[selectedVerticalTutorialId+1] ||
                                      tutorial === tutorials[verticalTutorialId-2] ?
                                        tutorial === tutorials[tutorialId] ?
                                          clsx(this.props.classes.stepIcon, this.props.classes.stepIconMedium, this.props.classes['stepIcon'+tutorialStatus], this.props.classes['stepIconActive'+tutorialStatus])
                                        : clsx(this.props.classes.stepIcon, this.props.classes.stepIconMedium, this.props.classes['stepIcon'+tutorialStatus])
                                    : tutorial === tutorials[tutorialId] ?
                                        clsx(this.props.classes.stepIcon, this.props.classes['stepIcon'+tutorialStatus], this.props.classes['stepIconActive'+tutorialStatus])
                                      : clsx(this.props.classes.stepIcon, this.props.classes['stepIcon'+tutorialStatus])
                            }}
                          >
                          </StepLabel>
                        </Link>
                      </Tooltip>
                    </Step>
                )})}
              </Stepper>
            </div>
            <Button
              style={{minWidth: '30px', minHeight: '25px', padding: '0', writingMode: 'vertical-rl'}}
              disabled={selectedVerticalTutorialId === tutorials.length-1}
              onClick={() => {this.verticalStepper(1)}}
            >
              {'>'}
            </Button>
        </div>
      : null
    );
  };
}


StepperVertical.propTypes = {
  status: PropTypes.array.isRequired,
  change: PropTypes.number.isRequired,
  currentTutorialId: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  change: state.tutorial.change,
  status: state.tutorial.status,
  currentTutorialId: state.tutorial.currentId
});

export default connect(mapStateToProps, null)(withRouter(withStyles(styles, {withTheme: true})(withWidth()(StepperVertical))));
