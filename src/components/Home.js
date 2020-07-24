import React, { Component } from 'react';

import WorkspaceStats from './WorkspaceStats';
import WorkspaceFunc from './WorkspaceFunc';
import BlocklyWindow from './Blockly/BlocklyWindow';

import Grid from '@material-ui/core/Grid';

class Home extends Component {


  render() {
    return (
      <div>
        <WorkspaceStats />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <BlocklyWindow />
          </Grid>
          <Grid item xs={12} md={6}>
            <div style={{height: '500px', border: '1px solid black'}}></div>
          </Grid>
        </Grid>
        <WorkspaceFunc />
      </div>
    );
  };
}

export default Home;
