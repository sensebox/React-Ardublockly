import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { visitPage, setPlatform } from "@/actions/generalActions";
import { Route, Switch, withRouter } from "react-router-dom";

import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import PrivateRouteCreator from "./PrivateRouteCreator";
import IsLoggedRoute from "./IsLoggedRoute";

import Home from "../Pages/Home";
import Tutorial from "../Tutorial/Tutorial";
import TutorialHome from "../Tutorial/TutorialHome";
import Builder from "../Tutorial/Builder/Builder";
import NotFound from "../Pages/NotFound";
import Settings from "../Settings/Settings";
import Impressum from "../Pages/Impressum";
import Privacy from "../Pages/Privacy";
import Login from "../User/Login";
import Account from "../User/Account";
import News from "../Pages/News";
import Faq from "../Pages/Faq";
import CodeEditor from "../Pages/CodeEditor/CodeEditor";
import GalleryHome from "../Pages/Gallery/GalleryHome";
import Project from "@/components/Pages/Project/Project";
import ProjectHome from "@/components/Pages/Project/ProjectHome";
import Register from "../User/Register";
import RegisterSuccess from "../User/RegisterSuccess";
import PasswordReset from "../User/PasswordReset";

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
          <PrivateRoute path="/tutorial/builder" exact>
            <Builder />
          </PrivateRoute>
          <Route path="/tutorial/:tutorialId" exact>
            <Tutorial />
          </Route>
          <PrivateRoute path="/tutorial/:tutorialId/edit" exact>
            <Builder />
          </PrivateRoute>

          <Route path="/CodeEditor" exact>
            <CodeEditor />
          </Route>
          {/* Sharing */}
          <PublicRoute path="/share/:shareId" exact>
            <Project />
          </PublicRoute>
          {/* Gallery-Projects */}
          <PublicRoute path="/gallery" exact>
            <GalleryHome />
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
          <PublicRoute path="/user/register" exact>
            <Register />
          </PublicRoute>
          <PublicRoute path="/user/register/success" exact>
            <RegisterSuccess />
          </PublicRoute>
          <PublicRoute path="/user/reset-password" exact>
            <PasswordReset />
          </PublicRoute>
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

Routes.propTypes = {
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
