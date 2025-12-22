import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { visitPage, setPlatform } from "@/actions/generalActions";
import { Routes, Route, useLocation } from "react-router-dom";

import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import IsLoggedRoute from "./IsLoggedRoute";

import Home from "../Pages/Home";
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
import BuilderPage from "../Tutorial/Builder/Builder.page";
import TutorialPage from "../Tutorial/Viewer/Tutorial.page";
import TutorialHome from "../Tutorial/Overview/TutorialHome";

function AppRoutes({ platform, visitPage, setPlatform }) {
  const location = useLocation();

  // entspricht componentDidMount
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const mode = query.get("mode");

    if (!platform && mode?.toLowerCase() === "tablet") {
      setPlatform(true);
    }
  }, [location.search, platform, setPlatform]);

  // entspricht componentDidUpdate
  useEffect(() => {
    visitPage();
  }, [location.pathname, visitPage]);

  return (
    <div style={{ margin: "0 22px" }}>
      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />

        {/* Tutorials */}
        <Route
          path="/tutorial"
          element={
            <PublicRoute>
              <TutorialHome />
            </PublicRoute>
          }
        />

        <Route
          path="/tutorial/builder"
          element={
            <PrivateRoute>
              <Builder />
            </PrivateRoute>
          }
        />

        <Route path="/tutorial/:tutorialId" element={<Tutorial />} />

        <Route
          path="/tutorial/:tutorialId/edit"
          element={
            <PrivateRoute>
              <Builder />
            </PrivateRoute>
          }
        />

        {/* Code Editor */}
        <Route path="/CodeEditor" element={<CodeEditor />} />

        {/* Sharing */}
        <Route
          path="/share/:shareId"
          element={
            <PublicRoute>
              <Project />
            </PublicRoute>
          }
        />

        {/* Gallery */}
        <Route
          path="/gallery"
          element={
            <PublicRoute>
              <GalleryHome />
            </PublicRoute>
          }
        />

        <Route
          path="/gallery/:galleryId"
          element={
            <PublicRoute>
              <Project />
            </PublicRoute>
          }
        />

        {/* User Projects */}
        <Route
          path="/project"
          element={
            <PrivateRoute>
              <ProjectHome />
            </PrivateRoute>
          }
        />

        <Route
          path="/project/:projectId"
          element={
            <PrivateRoute>
              <Project />
            </PrivateRoute>
          }
        />

        {/* User */}
        <Route
          path="/user/login"
          element={
            <IsLoggedRoute>
              <Login />
            </IsLoggedRoute>
          }
        />

        <Route
          path="/user/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/user/register/success"
          element={
            <PublicRoute>
              <RegisterSuccess />
            </PublicRoute>
          }
        />

        <Route
          path="/user/reset-password"
          element={
            <PublicRoute>
              <PasswordReset />
            </PublicRoute>
          }
        />

        <Route
          path="/user"
          element={
            <PrivateRoute>
              <Account />
            </PrivateRoute>
          }
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={
            <PublicRoute>
              <Settings />
            </PublicRoute>
          }
        />

        {/* Legal */}
        <Route
          path="/impressum"
          element={
            <PublicRoute>
              <Impressum />
            </PublicRoute>
          }
        />

        <Route
          path="/privacy"
          element={
            <PublicRoute>
              <Privacy />
            </PublicRoute>
          }
        />

        <Route
          path="/news"
          element={
            <PublicRoute>
              <News />
            </PublicRoute>
          }
        />

        <Route
          path="/faq"
          element={
            <PublicRoute>
              <Faq />
            </PublicRoute>
          }
        />

        {/* Not Found */}
        <Route
          path="*"
          element={
            <PublicRoute>
              <NotFound />
            </PublicRoute>
          }
        />
      </Routes>
    </div>
  );
}

AppRoutes.propTypes = {
  visitPage: PropTypes.func,
  platform: PropTypes.bool.isRequired,
  setPlatform: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  platform: state.general.platform,
});

export default connect(mapStateToProps, { visitPage, setPlatform })(AppRoutes);
