import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Route, Redirect, withRouter } from 'react-router-dom';


class PrivateRoute extends Component {

  render() {
    return (
      !this.props.progress ?
      <Route
        {...this.props.exact}
        render={({ location }) =>
          this.props.isAuthenticated ? (
            this.props.children
          ) : (()=>{
            return (
              <Redirect
                to={{
                  pathname: "/user/login",
                  state: { from: location }
                }}
              />
            )
          })()
        }
      /> : null
    );
  }
}

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  progress: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  progress: state.auth.progress
});

export default connect(mapStateToProps, null)(withRouter(PrivateRoute));
