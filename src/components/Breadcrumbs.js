import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import clsx from 'clsx';

import { withStyles } from '@material-ui/core/styles';
import MaterialUIBreadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';

import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const styles = (theme) => ({
  home: {
    color: theme.palette.secondary.main,
    width: '20px !important',
    height: '20px',
    marginTop: '2px'
  },
  hover: {
    '&:hover': {
      color: theme.palette.primary.main
    }
  }
});

class Breadcrumbs extends Component {
  render() {
    return (
      this.props.content && this.props.content.length > 0 ?
        <MaterialUIBreadcrumbs separator="›" style={{marginBottom: '20px'}}>
          <Link to={'/'} style={{textDecoration: 'none'}}>
            <FontAwesomeIcon className={clsx(this.props.classes.home, this.props.classes.hover)} icon={faHome} size="xs"/>
          </Link>
          {this.props.content.splice(0, this.props.content.length-1).map((content, i) => (
            <Link to={content.link} style={{textDecoration: 'none'}} key={i}>
              <Typography className={this.props.classes.hover} color="secondary">{content.title}</Typography>
            </Link>
          ))}
          <Typography color="textPrimary" style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px'}}>
            {this.props.content.slice(-1)[0].title}
          </Typography>
        </MaterialUIBreadcrumbs>
      : null
    );
  };
}

export default withStyles(styles, {withTheme: true})(Breadcrumbs);
