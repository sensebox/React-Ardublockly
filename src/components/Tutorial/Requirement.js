import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import clsx from 'clsx';
import { withRouter, Link } from 'react-router-dom';

import tutorials from './tutorials.json';

import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import Tooltip from '@material-ui/core/Tooltip';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

const styles = theme => ({
  outerDiv: {
    width: '50px',
    height: '50px',
    position: 'absolute',
    color: fade(theme.palette.secondary.main, 0.6)
  },
  outerDivError: {
    stroke: fade(theme.palette.error.dark, 0.2),
    color: fade(theme.palette.error.dark, 0.2)
  },
  outerDivSuccess: {
    stroke: fade(theme.palette.primary.main, 0.2),
    color: fade(theme.palette.primary.main, 0.2)
  },
  outerDivOther: {
    stroke: fade(theme.palette.secondary.main, 0.2)
  },
  innerDiv: {
    width: 'inherit',
    height: 'inherit',
    display: 'table-cell',
    verticalAlign: 'middle',
    textAlign: 'center'
  },
  link: {
    color: theme.palette.text.primary,
    position: 'relative',
    height: '50px',
    display: 'flex',
    margin: '5px 0 5px 10px',
    textDecoration: 'none'
  },
  hoverLink: {
    '&:hover': {
      background: fade(theme.palette.secondary.main, 0.5),
      borderRadius: '0 25px 25px 0 '
    }
  }
});


class Requirement extends Component {

  render() {
    var tutorialIds = this.props.tutorialIds;
    return (
      <div style={{marginTop: '20px', marginBottom: '5px'}}>
        <Typography>Es bietet sich an folgende Tutorials vorab erfolgreich gelöst zu haben:</Typography>
        <List component="div">
          {tutorialIds.map((tutorialId, i) => {
            var title = tutorials.filter(tutorial => tutorial.id === tutorialId)[0].title;
            var status = this.props.status.filter(status => status.id === tutorialId)[0];
            var tasks = status.tasks;
            var error = status.tasks.filter(task => task.type === 'error').length > 0;
            var success = status.tasks.filter(task => task.type === 'success').length/tasks.length
            var tutorialStatus = success === 1 ? 'Success' : error ? 'Error' : 'Other';
            return(
              <Link to={`/tutorial/${tutorialId}`} className={this.props.classes.link}>
                <Tooltip style={{height: '50px', width: '50px', position: 'absolute', background: 'white', zIndex: 1, borderRadius: '25px'}} title={error ? `Mind. eine Aufgabe im Tutorial wurde nicht richtig gelöst.` : success === 1 ? `Das Tutorial wurde bereits erfolgreich abgeschlossen.` : `Das Tutorial ist zu ${success * 100}% abgeschlossen.`} arrow>
                  <div>
                    <div className={clsx(this.props.classes.outerDiv)} style={{width: '50px', height: '50px', border: 0}}>
                      <svg style={{width: '100%', height: '100%'}}>
                        {error || success === 1 ?
                          <circle className={error ? this.props.classes.outerDivError : this.props.classes.outerDivSuccess} r="22.5" cx="50%" cy="50%" fill="none" stroke-width="5"></circle>
                        : <circle className={this.props.classes.outerDivOther} r="22.5" cx="50%" cy="50%" fill="none" stroke-width="5"></circle>}
                        {success < 1 && !error ?
                          <circle className={this.props.classes.outerDivSuccess} style={{transform: 'rotate(-90deg)', transformOrigin: "50% 50%"}} r="22.5" cx="50%" cy="50%" fill="none" stroke-width="5" stroke-dashoffset={`${(22.5*2*Math.PI)*(1-success)}`} stroke-dasharray={`${(22.5*2*Math.PI)}`}>
                          </circle>
                        : null}
                      </svg>
                    </div>
                    <div className={clsx(this.props.classes.outerDiv, tutorialStatus === 'Error' ? this.props.classes.outerDivError : tutorialStatus === 'Success' ? this.props.classes.outerDivSuccess : null)}>
                      <div className={this.props.classes.innerDiv}>
                        {error || success === 1 ?
                          <FontAwesomeIcon icon={tutorialStatus === 'Success' ? faCheck : faTimes}/>
                        : <Typography variant='h7' className={success > 0 ? this.props.classes.outerDivSuccess : {}}>{Math.round(success*100)}%</Typography>
                        }
                      </div>
                    </div>
                  </div>
                </Tooltip>
                <div style={{height: '50px', width: 'calc(100% - 25px)', transform: 'translate(25px)'}} className={this.props.classes.hoverLink}>
                  <Typography style={{margin: 0, position: 'absolute', top: '50%', transform: 'translate(45px, -50%)', maxHeight: '50px', overflow: 'hidden', maxWidth: 'calc(100% - 45px)'/*, textOverflow: 'ellipsis', whiteSpace: 'pre-line', overflowWrap: 'anywhere'*/}}>{title}</Typography>
                </div>
              </Link>
            )}
          )}
        </List>
      </div>
    );
  };
}

Requirement.propTypes = {
  status: PropTypes.array.isRequired,
  change: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  change: state.tutorial.change,
  status: state.tutorial.status
});

export default connect(mapStateToProps, null)(withStyles(styles, {withTheme: true})(withRouter(Requirement)));