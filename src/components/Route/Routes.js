import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { visitPage } from '../../actions/generalActions';

import { Route, Switch, withRouter } from 'react-router-dom';

import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import PrivateRouteCreator from './PrivateRouteCreator';
import IsLoggedRoute from './IsLoggedRoute';

import Home from '../Home';
import Tutorial from '../Tutorial/Tutorial';
import TutorialHome from '../Tutorial/TutorialHome';
import Builder from '../Tutorial/Builder/Builder';
import NotFound from '../NotFound';
import ProjectHome from '../Project/ProjectHome';
import Project from '../Project/Project';
import Settings from '../Settings/Settings';
import Impressum from '../Impressum';
import Privacy from '../Privacy';
import Login from '../User/Login';
import Account from '../User/Account';
import MyBadges from '../User/MyBadges';
import News from '../News'
import Faq from '../Faq'

class Routes extends Component {

  componentDidUpdate() {
    this.props.visitPage();
  }

  render() {
    return (
      <div style={{ margin: '0 22px' }}>
        <Switch>
          <PublicRoute path="/" exact>
            <Home />
          </PublicRoute>
          {/* Tutorials */}
          <PublicRoute path="/tutorial" exact>
            <TutorialHome />
          </PublicRoute>
          <PrivateRouteCreator path="/tutorial/builder" exact>
            <Builder />
          </PrivateRouteCreator>
          <Route path="/tutorial/:tutorialId" exact>
            <Tutorial />
          </Route>
          {/* Sharing */}
          <PublicRoute path="/share/:shareId" exact>
            <Project />
          </PublicRoute>
          {/* Gallery-Projects */}
          <PublicRoute path="/gallery" exact>
            <ProjectHome />
          </PublicRoute>
          <PublicRoute path="/gallery/:galleryId" exact>
            <Project />
          </PublicRoute>
          {/* User-Projects */}
          <PrivateRoute path="/project" exact>
            <ProjectHome />
          </PrivateRoute>
          <PrivateRoute path="/project/:projectId" exact>
            <Project />
          </PrivateRoute>
          {/* User */}
          <IsLoggedRoute path="/user/login" exact>
            <Login />
          </IsLoggedRoute>
          <PrivateRoute path="/user" exact>
            <Account />
          </PrivateRoute>
          <PrivateRoute path="/user/badge" exact>
            <MyBadges />
          </PrivateRoute>
          {/* settings */}
          <PublicRoute path="/settings" exact>
            <Settings />
          </PublicRoute>
          {/* privacy */}
          <PublicRoute path="/impressum" exact>
            <Impressum />
          </PublicRoute>
          <PublicRoute path="/privacy" exact>
            <Privacy />
          </PublicRoute>
          <PublicRoute path="/news" exact>
            <News />
          </PublicRoute>
          <PublicRoute path="/faq" exact>
            <Faq />
          </PublicRoute>
          {/* Not Found */}
          <PublicRoute>
            <NotFound />
          </PublicRoute>

        </Switch>
      </div>
    );
  }
}

Home.propTypes = {
  visitPage: PropTypes.func.isRequired
};

export default connect(null, { visitPage })(withRouter(Routes));
