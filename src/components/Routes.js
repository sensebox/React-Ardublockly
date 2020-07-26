import React, { Component } from 'react';

import { Route, Switch } from 'react-router-dom';

import Home from './Home';
import NotFound from './NotFound';

class Routes extends Component {

  render() {
    return (
      <div style={{ margin: '0 22px' }}>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route component={NotFound} />
        </Switch>
      </div>
    );
  }
}

export default Routes;
