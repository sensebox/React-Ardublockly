import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Route } from 'react-router-dom';


class PublicRoute extends Component {

  render() {
    return (
      !this.props.progress ?
        <Route
          {...this.props.exact}
          render={({ location }) =>
            this.props.children
          }
        />
      : null
    );
  }
}

PublicRoute.propTypes = {
  progress: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  progress: state.auth.progress
});

export default connect(mapStateToProps, null)(PublicRoute);
