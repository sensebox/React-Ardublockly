import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

function PrivateRoute({ children, isAuthenticated, progress }) {
  const location = useLocation();

  if (progress) {
    return null; // oder <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/user/login" replace state={{ from: location }} />;
  }

  return children;
}

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool,
  progress: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  progress: state.auth.progress,
});

export default connect(mapStateToProps)(PrivateRoute);
