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

import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
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
    var step = tutorial.steps[this.props.activeStep];

    const Tutorial2 = () => (
        <div>
          <Breadcrumbs content={[{link: '/', title: 'Home'},{link: '/tutorial', title: 'Tutorial'}, {link: `/tutorial/${currentTutorialId}`, title: tutorial.title}]}/>

          <StepperHorizontal />

          <div style={{display: 'flex'}}>
            <StepperVertical />

            <div>
              {step.type === 'instruction' ?
                <Instruction step={step}/>
              : <Assessment step={step}/>}

              <div style={{marginTop: '20px'}}>
                <Button style={{marginRight: '10px'}} variant='contained' disabled={this.props.activeStep === 0} onClick={() => this.props.tutorialStep(this.props.activeStep-1)}>Zurück</Button>
                <Button variant='contained' color='primary' disabled={this.props.activeStep === tutorial.steps.length-1} onClick={() => this.props.tutorialStep(this.props.activeStep+1)}>Weiter</Button>
              </div>
            </div>
          </div>
        </div>
      );
    return (
      !Number.isInteger(currentTutorialId) || currentTutorialId < 1 || currentTutorialId > tutorials.length ?
        <NotFound button={{title: 'Zurück zur Tutorials-Übersicht', link: '/tutorial'}}/>
      :
        <TutorialBody />
    );
  };
}

Tutorial.propTypes = {
  tutorialId: PropTypes.func.isRequired,
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

export default connect(mapStateToProps, { tutorialId, tutorialStep })(withWidth()(Tutorial));



// <StepperHorizontal />
//

//
//   {/* width of vertical stepper is 30px*/}
//   <Card style={{width: isWidthUp('sm', this.props.width) ? 'calc(100% - 30px)' : '100%', padding: '10px'}}>
//     <Tabs
//       value={this.props.level}
//       indicatorColor="primary"
//       textColor="inherit"
//       variant='fullWidth'
//       onChange={this.onChange}
//     >
//       <Tab label="Anleitung" value='instruction' disableRipple/>
//       <Tab label="Aufgabe" value='assessment' disableRipple/>
//     </Tabs>
//
//     <div style={{marginTop: '20px'}}>
//       {this.props.level === 'instruction' ?
//         <Instruction /> : null }
//       {this.props.level === 'assessment' ?
//         <Grid container spacing={2}>
//           <Grid item xs={12} md={6} lg={8} style={{ position: 'relative' }}>
//             <SolutionCheck />
//             <BlocklyWindow initialXml={this.props.status[currentTutorialId].xml ? this.props.status[currentTutorialId].xml : null}/>
//           </Grid>
//           <Grid item xs={12} md={6} lg={4}>
//             <Card style={{height: 'calc(50% - 30px)', padding: '10px', marginBottom: '10px'}}>
//               Hier könnte die Problemstellung stehen.
//             </Card>
//             <div style={{height: '50%'}}>
//               <CodeViewer />
//             </div>
//           </Grid>
//         </Grid>
//       : null }
//     </div>
//   </Card>
// </div>
