import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';

class Tutorial extends Component {
  render() {
    console.log(this.props);
    return (
      <h1>Tutorial {this.props.match.params.tutorialId}</h1>
    );
  };
}

export default withRouter(Tutorial);
