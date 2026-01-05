// src/components/Route/PublicRoute.jsx
import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

function PublicRoute({ children, progress }) {
  if (progress) {
    return null; // oder Loader
  }

  return children;
}

PublicRoute.propTypes = {
  progress: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

const mapStateToProps = (state) => ({
  progress: state.auth.progress,
});

export default connect(mapStateToProps)(PublicRoute);
