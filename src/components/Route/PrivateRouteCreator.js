import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Route, Redirect, withRouter } from 'react-router-dom';


class PrivateRoute extends Component {

  render() {
    return (
      <Route
        {...this.props.exact}
        render={({ location }) =>
          this.props.isAuthenticated &&
          this.props.user &&
          this.props.user.blocklyRole !== 'user' ? (
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
      />
    );
  }
}

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.object
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user
});

export default connect(mapStateToProps, null)(withRouter(PrivateRoute));
