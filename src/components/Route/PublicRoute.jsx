import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

function PublicRoute({ children, progress }) {
  if (progress) {
    return null;
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
