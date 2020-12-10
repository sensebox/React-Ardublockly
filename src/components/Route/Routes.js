import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { visitPage } from '../../actions/generalActions';

import { Route, Switch, withRouter } from 'react-router-dom';

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


class Routes extends Component {

  componentDidUpdate() {
    this.props.visitPage();
  }

  render() {
    return (
      <div style={{ margin: '0 22px' }}>
        <Switch>
          <Route path="/" exact component={Home} />
          {/* Tutorials */}
          <Route path="/tutorial" exact component={TutorialHome} />
          <PrivateRouteCreator path="/tutorial/builder" exact>
            <Builder/>
          </PrivateRouteCreator>
          <Route path="/tutorial/:tutorialId" exact component={Tutorial} />
          {/* Sharing */}
          <Route path="/share/:shareId" exact component={Project} />
          {/* Gallery-Projects */}
          <Route path="/gallery" exact component={ProjectHome} />
          <Route path="/gallery/:galleryId" exact component={Project} />
          {/* User-Projects */}
          <PrivateRoute path="/project" exact>
            <ProjectHome/>
          </PrivateRoute>
          <PrivateRoute path="/project/:projectId" exact>
            <Project/>
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
          <Route path="/settings" exact component={Settings} />
          {/* privacy */}
          <Route path="/impressum" exact component={Impressum} />
          <Route path="/privacy" exact component={Privacy} />
          {/* Not Found */}
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
