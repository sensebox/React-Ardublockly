import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Route, Redirect, withRouter } from 'react-router-dom';


class PrivateRouteAdmin extends Component {

  render() {
    return (
      !this.props.progress ?
      <Route
        {...this.props.exact}
        render={({ location }) =>
          this.props.isAuthenticated &&
          this.props.user &&
          this.props.user.blocklyRole === 'admin' ? (
            this.props.children
          ) : (()=>{
            return (
              <Redirect
                to={{
                  pathname: "/",
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

PrivateRouteAdmin.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.object,
  progress: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  progress: state.auth.progress
});

export default connect(mapStateToProps, null)(withRouter(PrivateRouteAdmin));
