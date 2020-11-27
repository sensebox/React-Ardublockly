import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { workspaceName } from '../../actions/workspaceActions';
import { clearMessages } from '../../actions/messageActions';
import { getTutorial, resetTutorial, tutorialStep } from '../../actions/tutorialActions';

import Breadcrumbs from '../Breadcrumbs';
import StepperHorizontal from './StepperHorizontal';
import StepperVertical from './StepperVertical';
import Instruction from './Instruction';
import Assessment from './Assessment';
import NotFound from '../NotFound';

import { detectWhitespacesAndReturnReadableResult } from '../../helpers/whitespace';

// import tutorials from '../../data/tutorials';

import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';

class Tutorial extends Component {

  componentDidMount() {
    this.props.getTutorial(this.props.match.params.tutorialId);
    // this.props.tutorialId(Number(this.props.match.params.tutorialId));
  }

  componentDidUpdate(props, state) {
    if (props.tutorial.id && !props.isLoading && Number(props.tutorial.id) !== Number(this.props.match.params.tutorialId)) {
      this.props.getTutorial(this.props.match.params.tutorialId);
      // this.props.tutorialId(Number(this.props.match.params.tutorialId));
    }
    if(this.props.message.id === 'GET_TUTORIAL_FAIL'){
      alert(this.props.message.msg);
      this.props.clearMessages();
    }
  }

  componentWillUnmount() {
    this.props.resetTutorial();
    this.props.workspaceName(null);
    if(this.props.message.msg){
      this.props.clearMessages();
    }
  }

  render() {
    return (
      <div>
        {this.props.isLoading ? <LinearProgress /> :
          Object.keys(this.props.tutorial).length === 0 ? <NotFound button={{ title: 'Zurück zur Tutorials-Übersicht', link: '/tutorial' }} />
            : (() => {
                var tutorial = this.props.tutorial;
                var steps = this.props.tutorial.steps;
                var step = steps[this.props.activeStep];
                var name = `${detectWhitespacesAndReturnReadableResult(tutorial.title)}_${detectWhitespacesAndReturnReadableResult(step.headline)}`;
                return(
                  <div>
                    <Breadcrumbs content={[{ link: '/tutorial', title: 'Tutorial' }, { link: `/tutorial/${this.props.tutorial.id}`, title: tutorial.title }]} />

                    <StepperHorizontal />

                    <div style={{ display: 'flex' }}>
                      <StepperVertical steps={steps} />
                      {/* calc(Card-padding: 10px + Button-height: 35px + Button-marginTop: 15px)*/}
                      <Card style={{ padding: '10px 10px 60px 10px', display: 'block', position: 'relative', height: 'max-content', width: '100%' }}>
                        {step ?
                          step.type === 'instruction' ?
                            <Instruction step={step} />
                            : <Assessment step={step} name={name} /> // if step.type === 'assessment'
                          : null}

                        <div style={{ marginTop: '20px', position: 'absolute', bottom: '10px' }}>
                          <Button style={{ marginRight: '10px', height: '35px' }} variant='contained' disabled={this.props.activeStep === 0} onClick={() => this.props.tutorialStep(this.props.activeStep - 1)}>Zurück</Button>
                          <Button style={{ height: '35px' }} variant='contained' color='primary' disabled={this.props.activeStep === tutorial.steps.length - 1} onClick={() => this.props.tutorialStep(this.props.activeStep + 1)}>Weiter</Button>
                        </div>
                      </Card>
                    </div>
                  </div>
              )})()
        }
      </div>
    );
  };
}

Tutorial.propTypes = {
  getTutorial: PropTypes.func.isRequired,
  resetTutorial: PropTypes.func.isRequired,
  clearMessages: PropTypes.func.isRequired,
  tutorialStep: PropTypes.func.isRequired,
  workspaceName: PropTypes.func.isRequired,
  status: PropTypes.array.isRequired,
  change: PropTypes.number.isRequired,
  activeStep: PropTypes.number.isRequired,
  tutorial: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  message: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  change: state.tutorial.change,
  status: state.tutorial.status,
  activeStep: state.tutorial.activeStep,
  tutorial: state.tutorial.tutorial,
  isLoading: state.tutorial.progress,
  message: state.message
});

export default connect(mapStateToProps, { getTutorial, resetTutorial, tutorialStep, clearMessages, workspaceName })(Tutorial);
