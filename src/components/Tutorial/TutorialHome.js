import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import clsx from 'clsx';

import Breadcrumbs from '../Breadcrumbs';

import tutorials from '../../data/tutorials.json';

import { Link } from 'react-router-dom';

import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const styles = (theme) => ({
  outerDiv: {
    position: 'absolute',
    right: '-30px',
    bottom: '-30px',
    width: '160px',
    height: '160px',
    color: fade(theme.palette.secondary.main, 0.6)
  },
  outerDivError: {
    stroke: fade(theme.palette.error.dark, 0.6),
    color: fade(theme.palette.error.dark, 0.6)
  },
  outerDivSuccess: {
    stroke: fade(theme.palette.primary.main, 0.6),
    color: fade(theme.palette.primary.main, 0.6)
  },
  outerDivOther: {
    stroke: fade(theme.palette.secondary.main, 0.6)
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
            var status = this.props.status.filter(status => status.id === tutorial.id)[0];
            var tasks = status.tasks;
            var error = status.tasks.filter(task => task.type === 'error').length > 0;
            var success = status.tasks.filter(task => task.type === 'success').length/tasks.length
            var tutorialStatus = success === 1 ? 'Success' : error ? 'Error' : 'Other';
            return (
              <Grid item xs={12} sm={6} md={4} xl={3} key={i} style={{}}>
                <Link to={`/tutorial/${tutorial.id}`} style={{textDecoration: 'none', color: 'inherit'}}>
                  <Paper style={{height: '150px', padding: '10px', position:'relative', overflow: 'hidden'}}>
                    {tutorial.title}
                    <div className={clsx(this.props.classes.outerDiv)} style={{width: '160px', height: '160px', border: 0}}>
                      <svg style={{width: '100%', height: '100%'}}>
                        {error || success === 1 ?
                          <circle className={error ? this.props.classes.outerDivError : this.props.classes.outerDivSuccess} style={{transform: 'rotate(-44deg)', transformOrigin: "50% 50%"}} r="75" cx="50%" cy="50%" fill="none" stroke-width="10"></circle>
                        : <circle className={this.props.classes.outerDivOther} style={{transform: 'rotate(-44deg)', transformOrigin: "50% 50%"}} r="75" cx="50%" cy="50%" fill="none" stroke-width="10" stroke-dashoffset={`${(75*2*Math.PI)*(1-(50/100+success/2))}`} stroke-dasharray={`${(75*2*Math.PI)*(1-(50/100-success/2))} ${(75*2*Math.PI)*(1-(50/100+success/2))}`}></circle>}
                        {success < 1 && !error ?
                          <circle className={this.props.classes.outerDivSuccess} style={{transform: 'rotate(-44deg)', transformOrigin: "50% 50%"}} r="75" cx="50%" cy="50%" fill="none" stroke-width="10" stroke-dashoffset={`${(75*2*Math.PI)*(1-(50/100+success/2))}`} stroke-dasharray={`${(75*2*Math.PI)}`}>
                          </circle>
                        : null}
                      </svg>
                    </div>
                    <div className={clsx(this.props.classes.outerDiv, tutorialStatus === 'Error' ? this.props.classes.outerDivError : tutorialStatus === 'Success' ? this.props.classes.outerDivSuccess : null)}>
                      <div className={this.props.classes.innerDiv}>
                        {error || success === 1 ?
                          <FontAwesomeIcon size='4x' icon={tutorialStatus === 'Success' ? faCheck : faTimes}/>
                        : <Typography variant='h3' className={success > 0 ? this.props.classes.outerDivSuccess : {}}>{Math.round(success*100)}%</Typography>
                        }
                      </div>
                    </div>
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
