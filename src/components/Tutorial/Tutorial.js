import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { tutorialId, tutorialStep } from '../../actions/tutorialActions';

import Breadcrumbs from '../Breadcrumbs';
import StepperHorizontal from './StepperHorizontal';
import StepperVertical from './StepperVertical';
import Instruction from './Instruction';
import Assessment from './Assessment';
import NotFound from '../NotFound';

import tutorials from './tutorials.json';

import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';

class Tutorial extends Component {

  componentDidMount(){
    this.props.tutorialId(Number(this.props.match.params.tutorialId));
  }

  componentDidUpdate(props, state){
    if(props.currentTutorialId !== Number(this.props.match.params.tutorialId)){
      this.props.tutorialId(Number(this.props.match.params.tutorialId));
    }
  }

  componentWillUnmount(){
    this.props.tutorialId(null);
  }

  render() {
    var currentTutorialId = this.props.currentTutorialId;
    var tutorial = tutorials.filter(tutorial => tutorial.id === currentTutorialId)[0];
    var steps = tutorial ? tutorial.steps : null;
    var step = steps ? steps[this.props.activeStep] : null;
    return (
      !Number.isInteger(currentTutorialId) || currentTutorialId < 1 || currentTutorialId > tutorials.length ?
        <NotFound button={{title: 'Zurück zur Tutorials-Übersicht', link: '/tutorial'}}/>
      :
      <div>
        <Breadcrumbs content={[{link: '/', title: 'Home'},{link: '/tutorial', title: 'Tutorial'}, {link: `/tutorial/${currentTutorialId}`, title: tutorial.title}]}/>

        <StepperHorizontal steps={steps}/>

        <div style={{display: 'flex'}}>
          <StepperVertical steps={steps}/>
                                  {/* calc(Card-padding: 10px + Button-height: 35px + Button-marginTop: 15px)*/}
          <Card style={{padding: '10px 10px 60px 10px', display: 'block', position: 'relative', height: 'max-content', width: '100%'}}>
            {step ?
              step.type === 'instruction' ?
                <Instruction step={step}/>
              : <Assessment steps={steps} step={step}/> // if step.type === 'assessment'
             : null}

            <div style={{marginTop: '20px', position: 'absolute', bottom: '10px'}}>
              <Button style={{marginRight: '10px', height: '35px'}} variant='contained' disabled={this.props.activeStep === 0} onClick={() => this.props.tutorialStep(this.props.activeStep-1)}>Zurück</Button>
              <Button style={{height: '35px'}}variant='contained' color='primary' disabled={this.props.activeStep === tutorial.steps.length-1} onClick={() => this.props.tutorialStep(this.props.activeStep+1)}>Weiter</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  };
}

Tutorial.propTypes = {
  tutorialId: PropTypes.func.isRequired,
  tutorialStep: PropTypes.func.isRequired,
  currentTutorialId: PropTypes.number,
  status: PropTypes.array.isRequired,
  change: PropTypes.number.isRequired,
  activeStep: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  change: state.tutorial.change,
  status: state.tutorial.status,
  currentTutorialId: state.tutorial.currentId,
  activeStep: state.tutorial.activeStep
});

export default connect(mapStateToProps, { tutorialId, tutorialStep })(Tutorial);
