import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';

import Breadcrumbs from '../Breadcrumbs';
import BlocklyWindow from '../Blockly/BlocklyWindow';
import CodeViewer from '../CodeViewer';

import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';

const styles = () => ({
  gridHeight: {
    height: 'inherit'
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

        <h1>Tutorial {this.props.match.params.tutorialId}</h1>
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

export default withRouter(withStyles(styles)(Tutorial));
