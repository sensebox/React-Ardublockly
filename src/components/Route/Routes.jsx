import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { visitPage, setPlatform } from "@/actions/generalActions";
import { Route, Routes, useLocation } from "react-router-dom";

import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import IsLoggedRoute from "./IsLoggedRoute";

import Home from "@/components/Pages/Home";
import NotFound from "@/components/Pages/NotFound";
import Settings from "@/components/Settings/Settings";
import Impressum from "@/components/Pages/Impressum";
import Privacy from "@/components/Pages/Privacy";
import Login from "@/components/User/Login";
import Account from "@/components/User/Account";
import News from "@/components/Pages/News";
import Faq from "@/components/Pages/Faq";
import CodeEditor from "@/components/Pages/CodeEditor/CodeEditor";
import GalleryHome from "@/components/Pages/Gallery/GalleryHome";
import Register from "@/components/User/Register";
import RegisterSuccess from "@/components/User/RegisterSuccess";
import PasswordReset from "@/components/User/PasswordReset";
import BuilderPage from "@/components/Tutorial/Builder/Builder.page";
import TutorialPage from "@/components/Tutorial/Viewer/Tutorial.page";
import Project from "@/components/Pages/Project/Project";
import ProjectHome from "@/components/Pages/Project/ProjectHome";
import TutorialHome from "../Tutorial/Overview/TutorialHome";
import TeachableMachine from "@/components/Pages/TeachableMachine/TeachableMachine";
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
              <BuilderPage />
            </PrivateRoute>
          }
        />

        <Route path="/tutorial/:tutorialId" element={<TutorialPage />} />

        <Route
          path="/tutorial/:tutorialId/edit"
          element={
            <PrivateRoute>
              <BuilderPage />
            </PrivateRoute>
          }
        />

        {/* Code Editor */}
        <Route path="/codeeditor" element={<CodeEditor />} />
        
        {/* Teachable Machine */}
        <Route
          path="/teachable-machine"
          element={
            <PublicRoute>
              <TeachableMachine />
            </PublicRoute>
          }
        />
        
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
