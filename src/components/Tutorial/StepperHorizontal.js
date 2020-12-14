import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';

import clsx from 'clsx';

// import tutorials from '../../data/tutorials';

import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';

import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const styles = (theme) => ({
  stepper: {
    width: 'calc(100% - 40px)',
    height: '40px',
    borderRadius: '25px',
    padding: '0 20px',
    margin: '20px 0',
    display: 'flex',
    justifyContent: 'space-between'
  },
  stepperSuccess: {
    backgroundColor: fade(theme.palette.primary.main, 0.6),
  },
  stepperError: {
    backgroundColor: fade(theme.palette.error.dark, 0.6),
  },
  stepperOther: {
    backgroundColor: fade(theme.palette.secondary.main, 0.6),
  },
  color: {
    backgroundColor: 'transparent '
  },
  iconDivSuccess: {
    color: theme.palette.primary.main
  },
  iconDivError: {
    color: theme.palette.error.dark
  }
});

class StepperHorizontal extends Component {

  render() {
    var tutorialId = this.props.tutorial._id;
    var status = this.props.status.filter(status => status._id === tutorialId)[0];
    var tasks = status.tasks;
    var error = tasks.filter(task => task.type === 'error').length > 0;
    var success = tasks.filter(task => task.type === 'success').length / tasks.length;
    var tutorialStatus = success === 1 ? 'Success' : error ? 'Error' : 'Other';
    var title = this.props.tutorial.title;
    return (
      <div style={{ position: 'relative' }}>
        {error || success > 0 ?
          <div style={{ zIndex: -1, width: error ? 'calc(100% - 40px)' : `calc(${success * 100}% - 40px)`, borderRadius: success === 1 || error ? '25px' : '25px 0 0 25px', position: 'absolute', margin: 0, left: 0 }} className={clsx(this.props.classes.stepper, error ? this.props.classes.stepperError : this.props.classes.stepperSuccess)}>
          </div>
          : null}
        {success < 1 && !error ?
          <div style={{ zIndex: -2, width: `calc(${(1 - success) * 100}% - 40px)`, borderRadius: success === 0 ? '25px' : '0px 25px 25px 0', position: 'absolute', margin: 0, right: 0 }} className={clsx(this.props.classes.stepper, this.props.classes.stepperOther)}>
          </div>
          : null}
        <div className={this.props.classes.stepper}>
          <Button
            disabled//={tutorialIndex === 0}
          //onClick={() => { this.props.history.push(`/tutorial/${tutorials[tutorialIndex - 1].id}`) }}
          >
            {'<'}
          </Button>
          <Tooltip style={{ display: 'flex', width: 'calc(100% - 64px - 64px)', justifyContent: 'center' }} title={title} arrow>
            <div>
              {tutorialStatus !== 'Other' ? <div className={tutorialStatus === 'Success' && success === 1 ? this.props.classes.iconDivSuccess : this.props.classes.iconDivError} style={{ margin: 'auto 10px auto 0' }}><FontAwesomeIcon className={this.props.classes.icon} icon={tutorialStatus === 'Success' ? faCheck : faTimes} /></div> : null}
              <Typography variant='body2' style={{ fontWeight: 'bold', fontSize: '1.75em', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'rgba(0, 0, 0, 0.54)' }}>{title}</Typography>
            </div>
          </Tooltip>
          <Button
            disabled//={tutorialIndex + 1 === tutorials.length}
          //onClick={() => { this.props.history.push(`/tutorial/${tutorials[tutorialIndex + 1].id}`) }}
          >
            {'>'}
          </Button>
        </div>
      </div>
    );
  };
}

StepperHorizontal.propTypes = {
  status: PropTypes.array.isRequired,
  change: PropTypes.number.isRequired,
  currentTutorialIndex: PropTypes.number.isRequired,
  tutorial: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  change: state.tutorial.change,
  status: state.tutorial.status,
  currentTutorialIndex: state.tutorial.currentIndex,
  tutorial: state.tutorial.tutorials[0]
});

export default connect(mapStateToProps, null)(withRouter(withStyles(styles, { withTheme: true })(StepperHorizontal)));
