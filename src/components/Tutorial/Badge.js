import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { assigneBadge } from '../../actions/tutorialActions';

import Dialog from '../Dialog';

import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import * as Blockly from 'blockly';

const styles = (theme) => ({
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.primary.main,
      textDecoration: 'underline'
    }
  }
});


class Badge extends Component {

  state = {
    open: false,
    title: '',
    content: ''
  };

  componentDidUpdate(props) {
    if (this.props.message.id === 'TUTORIAL_CHECK_SUCCESS') {
      if (this.props.tutorial.badge) {
        // is connected to MyBadges?
        if (this.props.isAuthenticated && this.props.user && this.props.user.badge) {
          if (this.props.user.badges && !this.props.user.badges.includes(this.props.tutorial.badge)) {
            if (this.isSuccess()) {
              this.props.assigneBadge(this.props.tutorial.badge);
            }
          }
        }
      }
    }
    if (props.message !== this.props.message) {
      if (this.props.message.id === 'ASSIGNE_BADGE_SUCCESS') {
        this.setState({ title: `Badge: ${this.props.message.msg.name}`, content: `${Blockly.Msg.badges_ASSIGNE_BADGE_SUCCESS_01} ${this.props.message.msg.name} ${Blockly.Msg.badges_ASSIGNE_BADGE_SUCCESS_02}`, open: true });
      }
    }
  }

  isSuccess = () => {
    var tutorialId = this.props.tutorial._id;
    var status = this.props.status.filter(status => status._id === tutorialId)[0];
    var tasks = status.tasks;
    var success = tasks.filter(task => task.type === 'success').length / tasks.length;
    if (success === 1) {
      return true;
    }
    return false;
  }

  toggleDialog = () => {
    this.setState({ open: !this.state, title: '', content: '' });
  }

  render() {
    return (
      <Dialog
        style={{ zIndex: 99999999 }}
        open={this.state.open}
        title={this.state.title}
        content={this.state.content}
        onClose={() => { this.toggleDialog(); }}
        onClick={() => { this.toggleDialog(); }}
        button={Blockly.Msg.button_close}
      >
        <div style={{ marginTop: '10px' }}>
          <Paper style={{ textAlign: 'center' }}>
            {this.props.message.msg.image && this.props.message.msg.image.path ?
              <Avatar src={`${process.env.REACT_APP_MYBADGES}/media/${this.props.message.msg.image.path}`} style={{ width: '200px', height: '200px', marginLeft: 'auto', marginRight: 'auto' }} />
              : <Avatar style={{ width: '200px', height: '200px', marginLeft: 'auto', marginRight: 'auto' }}></Avatar>}
            <Typography variant='h6' style={{ display: 'flex', cursor: 'default', paddingBottom: '6px' }}>
              <div style={{ flexGrow: 1, marginLeft: '10px', marginRight: '10px' }}>{this.props.message.msg.name}</div>
            </Typography>
          </Paper>
          <Typography style={{ marginTop: '10px' }}>
            {Blockly.Msg.badges_explaination}<Link to={'/user/badge'} className={this.props.classes.link}>{Blockly.Msg.labels_here}</Link>.
          </Typography>
        </div>
      </Dialog>
    );
  };
}

Badge.propTypes = {
  assigneBadge: PropTypes.func.isRequired,
  status: PropTypes.array.isRequired,
  change: PropTypes.number.isRequired,
  tutorial: PropTypes.object.isRequired,
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool.isRequired,
  message: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  change: state.tutorial.change,
  status: state.tutorial.status,
  tutorial: state.tutorial.tutorials[0],
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
  message: state.message
});

export default connect(mapStateToProps, { assigneBadge })(withStyles(styles, { withTheme: true })(Badge));
