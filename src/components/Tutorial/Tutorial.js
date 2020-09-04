import React, { Component } from 'react';

import * as Blockly from 'blockly/core';

import Breadcrumbs from '../Breadcrumbs';
import StepperHorizontal from './StepperHorizontal';
import StepperVertical from './StepperVertical';
import BlocklyWindow from '../Blockly/BlocklyWindow';
import CodeViewer from '../CodeViewer';
import NotFound from '../NotFound';

import tutorials from './tutorials.json';
import { initialXml } from '../Blockly/initialXml.js';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';

class Tutorial extends Component {

  state={
    value: 'introduction',
    tutorialId: Number(this.props.match.params.tutorialId)
  }

  componentDidUpdate(props, state){
    if(state.tutorialId !== Number(this.props.match.params.tutorialId)){
      this.setState({tutorialId: Number(this.props.match.params.tutorialId)});
      // clear workspace
      const workspace = Blockly.getMainWorkspace();
      Blockly.Events.disable(); // https://groups.google.com/forum/#!topic/blockly/m7e3g0TC75Y
      // if events are disabled, then the workspace will be cleared AND the blocks are not in the trashcan
      const xmlDom = Blockly.Xml.textToDom(initialXml)
      Blockly.Xml.clearWorkspaceAndLoadFromXml(xmlDom, workspace);
      Blockly.Events.enable();
    }
  }

  onChange = (e, value) => {
    console.log(value);
    this.setState({ value: value });
  }

  render() {
    var tutorialId = this.state.tutorialId;
    return (
      !Number.isInteger(tutorialId) || tutorialId < 1 || tutorialId > tutorials.length ?
        <NotFound button={{title: 'Zurück zur Tutorials-Übersicht', link: '/tutorial'}}/>
      :
        <div>
          <Breadcrumbs content={[{link: '/', title: 'Home'},{link: '/tutorial', title: 'Tutorial'}, {link: `/tutorial/${tutorialId}`, title: tutorials[tutorialId-1].title}]}/>

          <StepperHorizontal />

          <div style={{display: 'flex'}}>
            <StepperVertical />

            {/* width of vertical stepper is 30px*/}
            <Card style={{width: 'calc(100% - 30px)', padding: '10px'}}>
              <Tabs
                value={this.state.value}
                indicatorColor="primary"
                textColor="inherit"
                variant='fullWidth'
                onChange={this.onChange}
              >
                <Tab label="Anleitung" value='introduction' disableRipple/>
                <Tab label="Aufgabe" value='assessment' disableRipple/>
              </Tabs>

              <div style={{marginTop: '20px'}}>
                {this.state.value === 'introduction' ?
                  'Hier könnte eine Anleitung stehen.': null }
                {this.state.value === 'assessment' ?
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={8}>
                      <BlocklyWindow />
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

export default Tutorial;
