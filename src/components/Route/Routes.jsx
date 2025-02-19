import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { visitPage, setPlatform } from "../../actions/generalActions";

import { Route, Switch, withRouter } from "react-router-dom";

import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import PrivateRouteCreator from "./PrivateRouteCreator";
import IsLoggedRoute from "./IsLoggedRoute";

import Home from "../Home";
import Tutorial from "../Tutorial/Tutorial";
import TutorialHome from "../Tutorial/TutorialHome";
import Builder from "../Tutorial/Builder/Builder";
import NotFound from "../NotFound";
import ProjectHome from "../Project/ProjectHome";
import Project from "../Project/Project";
import Settings from "../Settings/Settings";
import Impressum from "../Impressum";
import Privacy from "../Privacy";
import Login from "../User/Login";
import Account from "../User/Account";
import News from "../News";
import Faq from "../Faq";
import CodeEditor from "../CodeEditor/CodeEditor";

class Routes extends Component {
  componentDidMount() {
    const { location } = this.props;
    const query = new URLSearchParams(location.search, [location.search]);
    const mode = query.get("mode");

    if (!this.props.platform && mode) {
      switch (mode.toLowerCase()) {
        case "tablet":
          this.props.setPlatform(true);
          break;
        default:
          break;
      }
    }
  }

  componentDidUpdate() {
    this.props.visitPage();
  }

  render() {
    return (
      <div style={{ margin: "0 22px" }}>
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
          <Route path="/CodeEditor" exact>
            <CodeEditor />
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
  visitPage: PropTypes.func,
  platform: PropTypes.bool.isRequired,
  setPlatform: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  platform: state.general.platform,
});

export default connect(mapStateToProps, { visitPage, setPlatform })(
  withRouter(Routes),
);
