import React, { Component } from 'react';

import { withRouter, Link } from 'react-router-dom';

import clsx from 'clsx';

import tutorials from './tutorials.json';

import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Tooltip from '@material-ui/core/Tooltip';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = (theme) => ({
  verticalStepper: {
    padding: 0,
    width: '30px',
  },
  stepIconSmall: {
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: '50%',
    width: '12px',
    height: '12px',
    margin: '0 auto'
  },
  stepIconMedium: {
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    margin: '0 auto'
  },
  stepIconLarge: {
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: '50%',
    width: '24px',
    height: '24px'
  },
  stepIconTransparent: {
    border: `2px solid transparent`,
    cursor: 'default'
  },
  stepIconActive: {
    backgroundColor: fade(theme.palette.primary.main, 0.6)
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
    height: '100%'
  }
});

class StepperVertical extends Component {

  state={
    tutorialArray: Number(this.props.match.params.tutorialId) === 1 ?
                    tutorials.slice(Number(this.props.match.params.tutorialId)-1, Number(this.props.match.params.tutorialId)+4)
                    : Number(this.props.match.params.tutorialId) === 2 ?
                        tutorials.slice(Number(this.props.match.params.tutorialId)-1-1, Number(this.props.match.params.tutorialId)+3)
                        : Number(this.props.match.params.tutorialId) === tutorials.length ?
                              tutorials.slice(Number(this.props.match.params.tutorialId)-4-1, Number(this.props.match.params.tutorialId)+4)
                            : Number(this.props.match.params.tutorialId) === tutorials.length-1 ?
                                  tutorials.slice(Number(this.props.match.params.tutorialId)-3-1, Number(this.props.match.params.tutorialId)+3)
                                : tutorials.slice(Number(this.props.match.params.tutorialId)-2-1,Number(this.props.match.params.tutorialId)+2),
    tutorialId: Number(this.props.match.params.tutorialId),
    verticalTutorialId: Number(this.props.match.params.tutorialId)
  }

  componentDidUpdate(props, state){
    if(state.tutorialId !== Number(this.props.match.params.tutorialId)){
      this.setState({
        tutorialArray: Number(this.props.match.params.tutorialId) === 1 ?
                        tutorials.slice(Number(this.props.match.params.tutorialId)-1, Number(this.props.match.params.tutorialId)+4)
                        : Number(this.props.match.params.tutorialId) === 2 ?
                            tutorials.slice(Number(this.props.match.params.tutorialId)-1-1, Number(this.props.match.params.tutorialId)+3)
                            : Number(this.props.match.params.tutorialId) === tutorials.length ?
                                  tutorials.slice(Number(this.props.match.params.tutorialId)-4-1, Number(this.props.match.params.tutorialId)+4)
                                : Number(this.props.match.params.tutorialId) === tutorials.length-1 ?
                                      tutorials.slice(Number(this.props.match.params.tutorialId)-3-1, Number(this.props.match.params.tutorialId)+3)
                                    : tutorials.slice(Number(this.props.match.params.tutorialId)-2-1,Number(this.props.match.params.tutorialId)+2),
        tutorialId: Number(this.props.match.params.tutorialId),
        verticalTutorialId: Number(this.props.match.params.tutorialId)
      })
    }
  }

  verticalStepper = (step) => {
    var newTutorialId = this.state.verticalTutorialId + step;
    var tutorialArray = Number(newTutorialId) === 1 ?
                          tutorials.slice(newTutorialId-1, newTutorialId+4)
                          : newTutorialId === 2 ?
                                tutorials.slice(newTutorialId-1-1, newTutorialId+3)
                              : newTutorialId === tutorials.length ?
                                    tutorials.slice(newTutorialId-4-1, newTutorialId+4)
                                  : newTutorialId === tutorials.length-1 ?
                                        tutorials.slice(newTutorialId-3-1, newTutorialId+3)
                                      : tutorials.slice(newTutorialId-2-1, newTutorialId+2);
    this.setState({ tutorialArray: tutorialArray, verticalTutorialId: newTutorialId });
  }

  render() {
    var tutorialId = this.state.tutorialId;
    var verticalTutorialId = this.state.verticalTutorialId;
    return (
      <div style={{marginRight: '10px'}}>
          <Button
            style={{minWidth: '30px', margin: 'auto', minHeight: '25px', padding: '0', writingMode: 'vertical-rl'}}
            disabled={this.state.verticalTutorialId === 1}
            onClick={() => {this.verticalStepper(-1)}}
          >
            {'<'}
          </Button>
          <div style={{display: 'flex', height: 'calc(100% - 25px - 25px)', width: 'max-content'}}>
            <div style={{position: 'relative'}}>
              <div
                className={clsx(this.props.classes.progress, this.props.classes.progressForeground)}
                style={{ zIndex: 1, borderRadius: `${verticalTutorialId/tutorials.length === 1 ? '2px' : '2px 2px 0 0'}`, height: `${(verticalTutorialId/tutorials.length)*100}%`}}>
              </div>
              <div
                className={clsx(this.props.classes.progress, this.props.classes.progressBackground)}
                style={{borderRadius: `${verticalTutorialId/tutorials.length === 1 ? '2px' : '2px 2px 0 0'}`}}>
              </div>
            </div>
            <Stepper
              activeStep={tutorialId}
              orientation="vertical"
              connector={<div style={{height: '10px'}}></div>}
              classes={{root: this.props.classes.verticalStepper}}
            >
              {this.state.tutorialArray.map((tutorial, i) => {
                var index = this.state.tutorialArray.indexOf(tutorials[verticalTutorialId-1]);
                return (
                  <Step key={i}>
                    <Tooltip title={Object.keys(tutorial).length > 0 ? tutorial.title : ''} placement='right' arrow >
                      <Link to={`/tutorial/${i === index ? verticalTutorialId : verticalTutorialId - index + i}`}>
                        <StepLabel
                          StepIconComponent={'div'}
                          classes={{
                            root: tutorial === tutorials[verticalTutorialId-1] ?
                                    tutorial === tutorials[tutorialId-1] ?
                                      clsx(this.props.classes.stepIconLarge, this.props.classes.stepIconActive)
                                    : this.props.classes.stepIconLarge
                                  : tutorial === tutorials[verticalTutorialId-2] || tutorial === tutorials[verticalTutorialId] ?
                                      tutorial === tutorials[tutorialId-1] ?
                                        clsx(this.props.classes.stepIconMedium, this.props.classes.stepIconActive)
                                      : this.props.classes.stepIconMedium
                                  : tutorial === tutorials[tutorialId-1] ?
                                      clsx(this.props.classes.stepIconSmall, this.props.classes.stepIconActive)
                                    : this.props.classes.stepIconSmall
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
            disabled={this.state.verticalTutorialId === tutorials.length}
            onClick={() => {this.verticalStepper(1)}}
          >
            {'>'}
          </Button>

      </div>
    );
  };
}

export default withRouter(withStyles(styles, {withTheme: true})(StepperVertical));
