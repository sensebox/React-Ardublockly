import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteProject } from '../../actions/projectActions';

import { withRouter } from 'react-router-dom';

import Snackbar from '../Snackbar';

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Blockly from 'blockly/core';

const styles = (theme) => ({
  buttonTrash: {
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.primary.contrastText,
    width: '40px',
    height: '40px',
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
      color: theme.palette.primary.contrastText,
    }
  }
});



class DeleteProject extends Component {

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      snackbar: false,
      type: '',
      key: '',
      message: ''
    };
  }

  componentDidUpdate(props) {
    if (this.props.message !== props.message) {
      if (this.props.message.id === 'PROJECT_DELETE_SUCCESS') {
        this.props.history.push(`/${this.props.projectType}`);
      }
      else if (this.props.message.id === 'PROJECT_DELETE_FAIL') {
        this.setState({ snackbar: true, key: Date.now(), message: Blockly.Msg.messages_delete_project_failed, type: 'error' });
      }
    }
  }

  render() {
    return (
      <div>
        <Tooltip title={Blockly.Msg.tooltip_delete_project} arrow>
          <IconButton
            className={this.props.classes.buttonTrash}
            onClick={() => this.props.deleteProject(this.props.projectType, this.props.project._id)}
          >
            <FontAwesomeIcon icon={faTrashAlt} size="xs" />
          </IconButton>
        </Tooltip>

        <Snackbar
          open={this.state.snackbar}
          message={this.state.message}
          type={this.state.type}
          key={this.state.key}
        />
      </div>
    );
  };
}

DeleteProject.propTypes = {
  deleteProject: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  message: state.message,
});


export default connect(mapStateToProps, { deleteProject })(withStyles(styles, { withTheme: true })(withRouter(DeleteProject)));
