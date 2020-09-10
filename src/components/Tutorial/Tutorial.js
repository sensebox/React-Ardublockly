import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { tutorialId, setTutorialLevel } from '../../actions/tutorialActions';

import Breadcrumbs from '../Breadcrumbs';
import StepperHorizontal from './StepperHorizontal';
import StepperVertical from './StepperVertical';
import Instruction from './Instruction';
import BlocklyWindow from '../Blockly/BlocklyWindow';
import SolutionCheck from './SolutionCheck';
import CodeViewer from '../CodeViewer';
import NotFound from '../NotFound';

import { tutorials } from './tutorials';

import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';

class Tutorial extends Component {

  componentDidMount(){
    this.props.tutorialId(Number(this.props.match.params.tutorialId)-1);
  }

  componentDidUpdate(props, state){
    if(props.currentTutorialId+1 !== Number(this.props.match.params.tutorialId)){
      this.props.tutorialId(Number(this.props.match.params.tutorialId)-1);
      this.props.setTutorialLevel('instruction');
    }
  }

  componentWillUnmount(){
    this.props.tutorialId(null);
  }

  onChange = (e, value) => {
    this.props.setTutorialLevel(value);
  }

  render() {
    var currentTutorialId = this.props.currentTutorialId;
    return (
      !Number.isInteger(currentTutorialId) || currentTutorialId+1 < 1 || currentTutorialId+1 > tutorials.length ?
        <NotFound button={{title: 'Zurück zur Tutorials-Übersicht', link: '/tutorial'}}/>
      :
        <div>
          <Breadcrumbs content={[{link: '/', title: 'Home'},{link: '/tutorial', title: 'Tutorial'}, {link: `/tutorial/${currentTutorialId+1}`, title: tutorials[currentTutorialId].title}]}/>

          <StepperHorizontal />

          <div style={{display: 'flex'}}>
            <StepperVertical />

            {/* width of vertical stepper is 30px*/}
            <Card style={{width: isWidthUp('sm', this.props.width) ? 'calc(100% - 30px)' : '100%', padding: '10px'}}>
              <Tabs
                value={this.props.level}
                indicatorColor="primary"
                textColor="inherit"
                variant='fullWidth'
                onChange={this.onChange}
              >
                <Tab label="Anleitung" value='instruction' disableRipple/>
                <Tab label="Aufgabe" value='assessment' disableRipple/>
              </Tabs>

              <div style={{marginTop: '20px'}}>
                {this.props.level === 'instruction' ?
                  <Instruction /> : null }
                {this.props.level === 'assessment' ?
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={8} style={{ position: 'relative' }}>
                      <SolutionCheck />
                      <BlocklyWindow initialXml={this.props.status[currentTutorialId].xml ? this.props.status[currentTutorialId].xml : null}/>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <Card style={{height: 'calc(50% - 30px)', padding: '10px', marginBottom: '10px'}}>
                        Hier könnte die Problemstellung stehen.
                      </Card>
                      <div style={{height: '50%'}}>
                        <CodeViewer />
                      </div>
                    </Grid>
                  </Grid>
                : null }
              </div>
            </Card>
          </div>
        </div>
    );
  };
}

Tutorial.propTypes = {
  tutorialId: PropTypes.func.isRequired,
  setTutorialLevel: PropTypes.func.isRequired,
  currentTutorialId: PropTypes.number,
  status: PropTypes.array.isRequired,
  change: PropTypes.number.isRequired,
  level: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  change: state.tutorial.change,
  status: state.tutorial.status,
  currentTutorialId: state.tutorial.currentId,
  level: state.tutorial.level
});

export default connect(mapStateToProps, { tutorialId, setTutorialLevel })(withWidth()(Tutorial));
