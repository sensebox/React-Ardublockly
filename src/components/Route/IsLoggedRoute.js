import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Route, Redirect } from 'react-router-dom';


class IsLoggedRoute extends Component {

  render() {
    return (
      !this.props.progress ?
      <Route
        {...this.props.exact}
        render={({ location }) =>
          !this.props.isAuthenticated ? (
            this.props.children
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: location }
              }}
            />
          )
        }
      /> : null
    );
  }
}

IsLoggedRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  progress: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  progress: state.auth.progress
});

export default connect(mapStateToProps, null)(IsLoggedRoute);
