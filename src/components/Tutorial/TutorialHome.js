import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import clsx from 'clsx';

import Breadcrumbs from '../Breadcrumbs';

import tutorials from './tutorials.json';

import { Link } from 'react-router-dom';

import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const styles = (theme) => ({
  outerDiv: {
    position: 'absolute',
    right: '-29px',
    bottom: '-29px',
    width: '140px',
    height: '140px',
    borderStyle: 'solid',
    borderWidth: '10px',
    borderRadius: '50%',
    borderColor: fade(theme.palette.primary.main, 0.2),
    color: fade(theme.palette.primary.main, 0.2)
  },
  outerDivError: {
    borderColor: fade(theme.palette.error.dark, 0.2),
    color: fade(theme.palette.error.dark, 0.2)
  },
  innerDiv: {
    width: 'inherit',
    height: 'inherit',
    display: 'table-cell',
    verticalAlign: 'middle',
    textAlign: 'center'
  }
});


class TutorialHome extends Component {

  render() {
    return (
      <div>
        <Breadcrumbs content={[{link: '/', title: 'Home'},{link: '/tutorial', title: 'Tutorial'}]}/>

        <h1>Tutorial-Übersicht</h1>
        <Grid container spacing={2}>
          {tutorials.map((tutorial, i) => {
            var tutorialStatus = this.props.status[i].status === 'success' ? 'Success' :
                                  this.props.status[i].status === 'error' ? 'Error' : 'Other';
            return (
              <Grid item xs={12} sm={6} md={4} xl={3} key={i} style={{}}>
                <Link to={`/tutorial/${tutorial.id}`} style={{textDecoration: 'none', color: 'inherit'}}>
                  <Paper style={{height: '150px', padding: '10px', position:'relative', overflow: 'hidden'}}>
                    {tutorial.title}
                    {tutorialStatus !== 'Other' ?
                      <div className={clsx(this.props.classes.outerDiv, tutorialStatus === 'Error' ? this.props.classes.outerDivError : null)}>
                        <div className={this.props.classes.innerDiv}>
                          <FontAwesomeIcon size='4x' icon={tutorialStatus === 'Success' ? faCheck : faTimes}/>
                        </div>
                      </div>
                      : null
                    }
                  </Paper>
                </Link>
              </Grid>
          )})}
        </Grid>
      </div>
    );
  };
}

TutorialHome.propTypes = {
  status: PropTypes.array.isRequired,
  change: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  change: state.tutorial.change,
  status: state.tutorial.status
});

export default connect(mapStateToProps, null)(withStyles(styles, {withTheme: true})(TutorialHome));
