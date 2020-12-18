import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { shareProject } from '../../actions/projectActions';
import { clearMessages } from '../../actions/messageActions';

import moment from 'moment';

import Dialog from '../Dialog';
import Snackbar from '../Snackbar';

import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import { faShareAlt, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as Blockly from 'blockly/core';

const styles = (theme) => ({
  button: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    width: '40px',
    height: '40px',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    }
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.primary.main,
      textDecoration: 'underline'
    }
  }
});


class WorkspaceFunc extends Component {

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      snackbar: false,
      type: '',
      key: '',
      message: '',
      title: '',
      content: '',
      open: false,
      id: '',
    };
  }

  componentDidUpdate(props) {
    if (this.props.message !== props.message) {
      if (this.props.message.id === 'SHARE_SUCCESS' && (!this.props.multiple || this.props.message.status === this.props.project._id)) {
        this.setState({ share: true, open: true, title: Blockly.Msg.messages_SHARE_SUCCESS, id: this.props.message.status });
      }
      else if (this.props.message.id === 'SHARE_FAIL' && (!this.props.multiple || this.props.message.status === this.props.project._id)) {
        this.setState({ snackbar: true, key: Date.now(), message: Blockly.Msg.messages_SHARE_FAIL, type: 'error' });
        window.scrollTo(0, 0);
      }
    }
  }

  componentWillUnmount() {
    this.props.clearMessages();
  }

  toggleDialog = () => {
    this.setState({ open: !this.state, title: '', content: '' });
  }

  shareBlocks = () => {
    if (this.props.projectType === 'project' && this.props.project.shared) {
      // project is already shared
      this.setState({ open: true, title: Blockly.Msg.messages_SHARE_SUCCESS, id: this.props.project._id });
    }
    else {
      this.props.shareProject(this.props.name || this.props.project.title, this.props.projectType, this.props.project ? this.props.project._id : undefined);
    }
  }

  render() {
    return (
      <div style={this.props.style}>
        <Tooltip title={Blockly.Msg.tooltip_share_project} arrow>
          <IconButton
            className={`shareBlocks ${this.props.classes.button}`}
            onClick={() => this.shareBlocks()}
          >
            <FontAwesomeIcon icon={faShareAlt} size="xs" />
          </IconButton>
        </Tooltip>

        <Snackbar
          open={this.state.snackbar}
          message={this.state.message}
          type={this.state.type}
          key={this.state.key}
        />
        <Dialog
          open={this.state.open}
          title={this.state.title}
          content={this.state.content}
          onClose={this.toggleDialog}
          onClick={this.toggleDialog}
          button={Blockly.Msg.button_close}
        >
          <div style={{ marginTop: '10px' }}>
            <Typography>Über den folgenden Link kannst du dein Programm teilen:</Typography>
            <Link to={`/share/${this.state.id}`} onClick={() => this.toggleDialog()} className={this.props.classes.link}>{`${window.location.origin}/share/${this.state.id}`}</Link>
            <Tooltip title={Blockly.Msg.tooltip_copy_link} arrow style={{ marginRight: '5px' }}>
              <IconButton
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/share/${this.state.id}`);
                  this.setState({ snackbar: true, key: Date.now(), message: Blockly.Msg.messages_copylink_success, type: 'success' });
                }}
              >
                <FontAwesomeIcon icon={faCopy} size="xs" />
              </IconButton>
            </Tooltip>
            {this.props.project && this.props.project.shared && this.props.message.id !== 'SHARE_SUCCESS' ?
              <Typography variant='body2' style={{ marginTop: '20px' }}>{`Das Projekt wurde bereits geteilt. Der Link ist noch mindestens ${moment(this.props.project.shared).diff(moment().utc(), 'days') === 0 ?
                moment(this.props.project.shared).diff(moment().utc(), 'hours') === 0 ?
                  `${moment(this.props.project.shared).diff(moment().utc(), 'minutes')} Minuten`
                  : `${moment(this.props.project.shared).diff(moment().utc(), 'hours')} Stunden`
                : `${moment(this.props.project.shared).diff(moment().utc(), 'days')} Tage`} gültig.`}</Typography>
              : <Typography variant='body2' style={{ marginTop: '20px' }}>{`Der Link ist nun ${process.env.REACT_APP_SHARE_LINK_EXPIRES} Tage gültig.`}</Typography>}
          </div>
        </Dialog>
      </div>
    );
  };
}

WorkspaceFunc.propTypes = {
  shareProject: PropTypes.func.isRequired,
  clearMessages: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  message: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  name: state.workspace.name,
  message: state.message
});

export default connect(mapStateToProps, { shareProject, clearMessages })(withStyles(styles, { withTheme: true })(WorkspaceFunc));
