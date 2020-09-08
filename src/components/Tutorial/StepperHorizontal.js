import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';

import tutorials from './tutorials.json';

import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

const styles = (theme) => ({
  stepper: {
    backgroundColor: fade(theme.palette.primary.main, 0.6),
    width: 'calc(100% - 40px)',
    borderRadius: '25px',
    padding: '0 20px',
    margin: '20px 0',
    display: 'flex',
    justifyContent: 'space-between'
  },
  color: {
    backgroundColor: 'transparent '
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
    return (
      <div className={this.props.classes.stepper}>
        <Button
          disabled={tutorialId-1 === 0}
          onClick={() => {this.props.history.push(`/tutorial/${tutorialId-1}`)}}
        >
          {'<'}
        </Button>
        <Stepper activeStep={tutorialId} orientation="horizontal"
                 style={{padding: 0}} classes={{root: this.props.classes.color}}>
          <Step expanded completed={false}>
            <StepLabel icon={``}>
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

export default withRouter(withStyles(styles, {withTheme: true})(StepperHorizontal));
