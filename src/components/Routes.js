import React, { Component } from 'react';

import { Route, Switch } from 'react-router-dom';

import Home from './Home';
import Tutorial from './Tutorial/Tutorial';
import TutorialHome from './Tutorial/TutorialHome';
import Builder from './Tutorial/Builder/Builder';
import NotFound from './NotFound';
import GalleryHome from './Gallery/GalleryHome';


class Routes extends Component {

  render() {
    return (
      <div style={{ margin: '0 22px' }}>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/tutorial" exact component={TutorialHome} />
          <Route path="/gallery" exact component={GalleryHome} />
          <Route path="/gallery/:galleryId" exact component={Home} />
          <Route path="/tutorial/builder" exact component={Builder} />
          <Route path="/tutorial/:tutorialId" exact component={Tutorial} />
          <Route component={NotFound} />
        </Switch>
      </div>
    );
  }
}

export default Routes;
