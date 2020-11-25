import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { visitPage } from '../actions/generalActions';

import { Route, Switch, withRouter } from 'react-router-dom';

import Home from './Home';
import Tutorial from './Tutorial/Tutorial';
import TutorialHome from './Tutorial/TutorialHome';
import Builder from './Tutorial/Builder/Builder';
import NotFound from './NotFound';
import GalleryHome from './Gallery/GalleryHome';
import Settings from './Settings/Settings';
import Impressum from './Impressum';
import Privacy from './Privacy';


class Routes extends Component {

  componentDidUpdate() {
    this.props.visitPage();
  }

  render() {
    return (
      <div style={{ margin: '0 22px' }}>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/tutorial" exact component={TutorialHome} />
          <Route path="/settings" exact component={Settings} />
          <Route path="/gallery" exact component={GalleryHome} />
          <Route path="/gallery/:galleryId" exact component={Home} />
          <Route path="/impressum" exact component={Impressum} />
          <Route path="/privacy" exact component={Privacy} />
          <Route path="/share/:shareId" exact component={Home} />
          <Route path="/tutorial/builder" exact component={Builder} />
          <Route path="/tutorial/:tutorialId" exact component={Tutorial} />
          <Route component={NotFound} />
        </Switch>
      </div>
    );
  }
}

Home.propTypes = {
  visitPage: PropTypes.func.isRequired
};

export default connect(null, { visitPage })(withRouter(Routes));
