import React, { Component } from 'react';

import WorkspaceStats from './WorkspaceStats';
import WorkspaceFunc from './WorkspaceFunc';

class Home extends Component {
  render() {
    return (
      <div>
        <WorkspaceStats />
        <WorkspaceFunc />
      </div>
    );
  };
}

export default Home;
