import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';

import Breadcrumbs from '../Breadcrumbs';

class Tutorial extends Component {
  render() {
    return (
      <div>
        <Breadcrumbs content={[{link: '/', title: 'Home'},{link: '/tutorial', title: 'Tutorial'}, {link: `/tutorial/${this.props.match.params.tutorialId}`, title: this.props.match.params.tutorialId}]}/>

        <h1>Tutorial {this.props.match.params.tutorialId}</h1>
      </div>
    );
  };
}

export default withRouter(Tutorial);
