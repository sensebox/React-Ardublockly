import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

function PrivateRoute({ children, isAuthenticated, user, progress }) {
  const location = useLocation();

  if (progress) {
    return null; // oder <LoadingSpinner />
  }

  const hasAccess = isAuthenticated && user && user.blocklyRole !== "user";

  if (!hasAccess) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.object,
  progress: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  progress: state.auth.progress,
});

export default connect(mapStateToProps)(PrivateRoute);
