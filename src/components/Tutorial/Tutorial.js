import React, { Component } from 'react';

import { withRouter, Link } from 'react-router-dom';

import Breadcrumbs from '../Breadcrumbs';
import BlocklyWindow from '../Blockly/BlocklyWindow';
import CodeViewer from '../CodeViewer';

import tutorials from './tutorials.json';

import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';


const styles = (theme) => ({
  stepper: {
    backgroundColor: fade(theme.palette.primary.main, 0.6),
    width: 'calc(100% - 40px)',
    // opacity: 0.6,
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

class Tutorial extends Component {

  state={
    value: 'introduction'
  }

  onChange = (e, value) => {
    this.setState({ value: value });
  }

  render() {
    return (
      <div>
        <Breadcrumbs content={[{link: '/', title: 'Home'},{link: '/tutorial', title: 'Tutorial'}, {link: `/tutorial/${this.props.match.params.tutorialId}`, title: this.props.match.params.tutorialId}]}/>

        {/* Stepper */}
        <div className={this.props.classes.stepper}>
          <Button
            disabled={parseInt(this.props.match.params.tutorialId)-1 === 0}
            onClick={() => {this.props.history.push(`/tutorial/${parseInt(this.props.match.params.tutorialId)-1}`)}}
          >
            {'<'}
          </Button>
          <Stepper activeStep={this.props.match.params.tutorialId} orientation="horizontal"
                   style={{padding: 0}} classes={{root: this.props.classes.color}}>
            <Step expanded completed={false}>
              <StepLabel icon={``}>
                <h1 style={{margin: 0}}>Tutorial {this.props.match.params.tutorialId}</h1>
              </StepLabel>
            </Step>
          </Stepper>
          <Button
            disabled={parseInt(this.props.match.params.tutorialId)+1 > tutorials.length}
            onClick={() => {this.props.history.push(`/tutorial/${parseInt(this.props.match.params.tutorialId)+1}`)}}
          >
            {'>'}
          </Button>
        </div>


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
      </div>
    );
  };
}

export default withRouter(withStyles(styles, {withTheme: true})(Tutorial));
