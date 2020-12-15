import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTutorials, resetTutorial, tutorialProgress } from '../../actions/tutorialActions';
import { clearMessages } from '../../actions/messageActions';

import clsx from 'clsx';

import Breadcrumbs from '../Breadcrumbs';

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

  componentDidMount() {
    this.props.tutorialProgress();
    // retrieve tutorials only if a potential user is loaded - authentication
    // is finished (success or failed)
    if(!this.props.progress){
      this.props.getTutorials();
    }
  }

  componentDidUpdate(props, state) {
    if(props.progress !== this.props.progress && !this.props.progress){
      // authentication is completed
      this.props.getTutorials();
    }
    if(this.props.message.id === 'GET_TUTORIALS_FAIL'){
      alert(this.props.message.msg);
    }
  }

  componentWillUnmount() {
    this.props.resetTutorial();
    if(this.props.message.msg){
      this.props.clearMessages();
    }
  }

  render() {
    return (
      this.props.isLoading ? null :
      <div>
        <Breadcrumbs content={[{ link: '/tutorial', title: 'Tutorial' }]} />

        <h1>Tutorial-Übersicht</h1>
        <Grid container spacing={2}>
          {this.props.tutorials.map((tutorial, i) => {
            var status = this.props.status.filter(status => status._id === tutorial._id)[0];
            var tasks = status.tasks;
            var error = status.tasks.filter(task => task.type === 'error').length > 0;
            var success = status.tasks.filter(task => task.type === 'success').length / tasks.length
            var tutorialStatus = success === 1 ? 'Success' : error ? 'Error' : 'Other';
            return (
              <Grid item xs={12} sm={6} md={4} xl={3} key={i} style={{}}>
                <Link to={`/tutorial/${tutorial._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Paper style={{ height: '150px', padding: '10px', position: 'relative', overflow: 'hidden' }}>
                    {tutorial.title}
                    <div className={clsx(this.props.classes.outerDiv)} style={{ width: '160px', height: '160px', border: 0 }}>
                      <svg style={{ width: '100%', height: '100%' }}>
                        {error || success === 1 ?
                          <circle className={error ? this.props.classes.outerDivError : this.props.classes.outerDivSuccess} style={{ transform: 'rotate(-44deg)', transformOrigin: "50% 50%" }} r="75" cx="50%" cy="50%" fill="none" stroke-width="10"></circle>
                          : <circle className={this.props.classes.outerDivOther} style={{ transform: 'rotate(-44deg)', transformOrigin: "50% 50%" }} r="75" cx="50%" cy="50%" fill="none" stroke-width="10" stroke-dashoffset={`${(75 * 2 * Math.PI) * (1 - (50 / 100 + success / 2))}`} stroke-dasharray={`${(75 * 2 * Math.PI) * (1 - (50 / 100 - success / 2))} ${(75 * 2 * Math.PI) * (1 - (50 / 100 + success / 2))}`}></circle>}
                        {success < 1 && !error ?
                          <circle className={this.props.classes.outerDivSuccess} style={{ transform: 'rotate(-44deg)', transformOrigin: "50% 50%" }} r="75" cx="50%" cy="50%" fill="none" stroke-width="10" stroke-dashoffset={`${(75 * 2 * Math.PI) * (1 - (50 / 100 + success / 2))}`} stroke-dasharray={`${(75 * 2 * Math.PI)}`}>
                          </circle>
                          : null}
                      </svg>
                    </div>
                    <div className={clsx(this.props.classes.outerDiv, tutorialStatus === 'Error' ? this.props.classes.outerDivError : tutorialStatus === 'Success' ? this.props.classes.outerDivSuccess : null)}>
                      <div className={this.props.classes.innerDiv}>
                        {error || success === 1 ?
                          <FontAwesomeIcon size='4x' icon={tutorialStatus === 'Success' ? faCheck : faTimes} />
                          : <Typography variant='h3' className={success > 0 ? this.props.classes.outerDivSuccess : {}}>{Math.round(success * 100)}%</Typography>
                        }
                      </div>
                    </div>
                  </Paper>
                </Link>
              </Grid>
            )
          })}
        </Grid>
      </div>
    );
  };
}

TutorialHome.propTypes = {
  getTutorials: PropTypes.func.isRequired,
  resetTutorial: PropTypes.func.isRequired,
  tutorialProgress: PropTypes.func.isRequired,
  clearMessages: PropTypes.func.isRequired,
  status: PropTypes.array.isRequired,
  change: PropTypes.number.isRequired,
  tutorials: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  message: PropTypes.object.isRequired,
  progress: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  change: state.tutorial.change,
  status: state.tutorial.status,
  tutorials: state.tutorial.tutorials,
  isLoading: state.tutorial.progress,
  message: state.message,
  progress: state.auth.progress
});

export default connect(mapStateToProps, { getTutorials, resetTutorial, clearMessages, tutorialProgress })(withStyles(styles, { withTheme: true })(TutorialHome));
