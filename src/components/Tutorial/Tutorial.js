import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { workspaceName } from '../../actions/workspaceActions';
import { clearMessages } from '../../actions/messageActions';
import { getTutorial, resetTutorial, tutorialStep,tutorialProgress } from '../../actions/tutorialActions';

import { withRouter } from 'react-router-dom';

import Breadcrumbs from '../Breadcrumbs';
import StepperHorizontal from './StepperHorizontal';
import StepperVertical from './StepperVertical';
import Instruction from './Instruction';
import Assessment from './Assessment';
import Badge from './Badge';
import NotFound from '../NotFound';
import * as Blockly from 'blockly'
import { detectWhitespacesAndReturnReadableResult } from '../../helpers/whitespace';


import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';

class Tutorial extends Component {

  componentDidMount() {
    this.props.tutorialProgress();
    // retrieve tutorial only if a potential user is loaded - authentication
    // is finished (success or failed)
    if(!this.props.progress){
      console.log(this.props);
      this.props.getTutorial(this.props.match.params.tutorialId);
    }
  }

  componentDidUpdate(props, state) {
    if(props.progress !== this.props.progress && !this.props.progress){
      // authentication is completed
      this.props.getTutorial(this.props.match.params.tutorialId);
    }
    else if(this.props.tutorial && !this.props.isLoading && this.props.tutorial._id !== this.props.match.params.tutorialId) {
      this.props.getTutorial(this.props.match.params.tutorialId);
    }
    if (this.props.message.id === 'GET_TUTORIAL_FAIL') {
      alert(this.props.message.msg);
    }
  }

  componentWillUnmount() {
    this.props.resetTutorial();
    this.props.workspaceName(null);
    if (this.props.message.msg) {
      this.props.clearMessages();
    }
  }

  render() {
    return (
      <div>
        {this.props.isLoading ? null :
          !this.props.tutorial ?
            this.props.message.id === 'GET_TUTORIAL_FAIL' ? <NotFound button={{ title: Blockly.Msg.messages_GET_TUTORIAL_FAIL, link: '/tutorial' }} /> : null
            : (() => {
              var tutorial = this.props.tutorial;
              var steps = this.props.tutorial.steps;
              var step = steps[this.props.activeStep];
              var name = `${detectWhitespacesAndReturnReadableResult(tutorial.title)}_${detectWhitespacesAndReturnReadableResult(step.headline)}`;
              return (
                <div>
                  <Breadcrumbs content={[{ link: '/tutorial', title: 'Tutorial' }, { link: `/tutorial/${this.props.tutorial._id}`, title: tutorial.title }]} />

                  <StepperHorizontal />
                  <Badge />

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
              )
            })()
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
  tutorialProgress: PropTypes.func.isRequired,
  workspaceName: PropTypes.func.isRequired,
  status: PropTypes.array.isRequired,
  change: PropTypes.number.isRequired,
  activeStep: PropTypes.number.isRequired,
  tutorial: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  message: PropTypes.object.isRequired,
  progress: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  change: state.tutorial.change,
  status: state.tutorial.status,
  activeStep: state.tutorial.activeStep,
  tutorial: state.tutorial.tutorials[0],
  isLoading: state.tutorial.progress,
  message: state.message,
  progress: state.auth.progress
});

export default connect(mapStateToProps, { getTutorial, resetTutorial, tutorialStep, tutorialProgress, clearMessages, workspaceName })(withRouter(Tutorial));
