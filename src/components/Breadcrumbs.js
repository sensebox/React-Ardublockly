import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@mui/styles';
import MaterialUIBreadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles((theme) => ({
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
}));

const Breadcrumbs = ({ content }) => {
  const classes = useStyles();

  if (!content || content.length === 0) return null;

  const breadcrumbItems = content.slice(0, -1).map((content, i) => (
    <Link to={content.link} style={{ textDecoration: 'none' }} key={i}>
      <Typography className={classes.hover} color="secondary">{content.title}</Typography>
    </Link>
  ));

  const lastItem = content[content.length - 1];

  return (
    <MaterialUIBreadcrumbs separator="›" style={{ marginBottom: '20px' }}>
      <Link to={'/'} style={{ textDecoration: 'none' }}>
        <FontAwesomeIcon className={clsx(classes.home, classes.hover)} icon={faHome} size="xs" />
      </Link>
      {breadcrumbItems}
      <Typography
        color="textPrimary"
        style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}
      >
        {lastItem.title}
      </Typography>
    </MaterialUIBreadcrumbs>
  );
};

export default Breadcrumbs;
