import React from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";

/**
 * EmbeddedRoute - A route component that bypasses authentication
 * Used specifically for the embedded Blockly interface
 */
class EmbeddedRoute extends React.Component {
  render() {
    return <Route {...this.props} render={() => this.props.children} />;
  }
}

EmbeddedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default EmbeddedRoute;
