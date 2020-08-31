import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';

class MyBreadcrumbs extends Component {
  render() {
    return (
      this.props.content && this.props.content.length > 1 ?
        <Breadcrumbs separator="›">
          {this.props.content.splice(0, this.props.content.length-1).map((content, i) => (
            <Link to={content.link} style={{textDecoration: 'none'}} key={i}>
              <Typography color="secondary">{content.title}</Typography>
            </Link>
          ))}
          <Typography color="textPrimary">{this.props.content.slice(-1)[0].title}</Typography>
        </Breadcrumbs>
      : null
    );
  };
}

export default MyBreadcrumbs;
