import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateProject, setDescription } from '../../actions/projectActions';
import { postClassroomProject } from '../../actions/classroomActions';

import axios from 'axios';
import { withRouter } from 'react-router-dom';

import Snackbar from '../Snackbar';
import Dialog from '../Dialog';

import withStyles from '@mui/styles/withStyles';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { faSave } from "@fortawesome/free-solid-svg-icons";
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
  }
});

class SaveProject extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      title: '',
      content: '',
      open: false,
      description: props.description,
      snackbar: false,
      type: '',
      key: '',
      message: '',
      menuOpen: false,
      anchor: '',
      projectType: props.projectType
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.projectType !== this.props.projectType) {
      this.setState({ projectType: this.props.projectType });
    }
    if (prevProps.description !== this.props.description) {
      this.setState({ description: this.props.description });
    }
    if (this.props.message !== prevProps.message) {
      if (this.props.message.id === 'PROJECT_UPDATE_SUCCESS') {
        this.setState({ snackbar: true, key: Date.now(), message: Blockly.Msg.messages_PROJECT_UPDATE_SUCCESS, type: 'success' });
      }
      else if (this.props.message.id === 'GALLERY_UPDATE_SUCCESS') {
        this.setState({ snackbar: true, key: Date.now(), message: Blockly.Msg.messages_GALLERY_UPDATE_SUCCESS, type: 'success' });
      }
      else if (this.props.message.id === 'PROJECT_UPDATE_FAIL') {
        this.setState({ snackbar: true, key: Date.now(), message: Blockly.Msg.messages_PROJECT_UPDATE_FAIL, type: 'error' });
      }
      else if (this.props.message.id === 'GALLERY_UPDATE_FAIL') {
        this.setState({ snackbar: true, key: Date.now(), message: Blockly.Msg.messages_GALLERY_UPDATE_FAIL, type: 'error' });
      }
      else if (this.props.message.id === 'SAVE_CLASSROOM_PROJECT_SUCCESS') {
        this.setState({ snackbar: true, key: Date.now(), message: 'Classroom project saved successfully', type: 'success' });
      }
      else if (this.props.message.id === 'SAVE_CLASSROOM_PROJECT_FAIL') {
        this.setState({ snackbar: true, key: Date.now(), message: 'Failed to save classroom project', type: 'error' });
      }
    }
  }

  toggleMenu = (e) => {
    this.setState({ menuOpen: !this.state.menuOpen, anchor: e.currentTarget });
  };

  toggleDialog = () => {
    this.setState({ open: !this.state.open, title: '', content: '' });
  }

  saveProject = () => {
    const { user, classroomUser } = this.props;
    const projectData = {
      xml: this.props.xml,
      title: this.props.name
    };

    if (this.state.projectType === 'gallery') {
      projectData.description = this.state.description;
    }

    if (user && !classroomUser) {
      const config = {
        success: res => {
          const project = res.data[this.state.projectType];
          this.props.history.push(`/${this.state.projectType}/${project._id}`);
        },
        error: err => {
          this.setState({ snackbar: true, key: Date.now(), message: `${Blockly.Msg.messages_gallery_save_fail_1} ${this.state.projectType === 'gallery' ? 'Galerie-' : ''} ${Blockly.Msg.messages_gallery_save_fail_2}`, type: 'error' });
          window.scrollTo(0, 0);
        }
      };
      axios.post(`${process.env.REACT_APP_BLOCKLY_API}/${this.state.projectType}`, projectData, config)
        .then(res => {
          res.config.success(res);
        })
        .catch(err => {
          err.config.error(err);
        });
    } else if (classroomUser) {
      projectData.nickname = classroomUser.nickname;
      this.props.postClassroomProject(classroomUser.classroomId, projectData);
    }
  }

  setDescription = (e) => {
    this.setState({ description: e.target.value });
  }

  workspaceDescription = () => {
    this.props.setDescription(this.state.description);
    this.setState({ projectType: 'gallery' },
      () => this.saveProject()
    );
  }

  render() {
    return (
      <div style={this.props.style}>
        <Tooltip title={this.state.projectType === 'project' ? Blockly.Msg.tooltip_update_project : Blockly.Msg.tooltip_save_project} arrow>
          <IconButton
            className={this.props.classes.button}
            onClick={this.props.user.blocklyRole !== 'user' && (!this.props.project || this.props.user.email === this.props.project.creator) ? (e) => this.toggleMenu(e) : this.state.projectType === 'project' ? () => this.props.updateProject(this.state.projectType, this.props.project._id) : () => { this.setState({ projectType: 'project' }, () => this.saveProject()) }}
            size="large">
            <FontAwesomeIcon icon={faSave} size="xs" />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={this.state.anchor}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={this.state.menuOpen}
          onClose={this.toggleMenu}
        >
          <MenuItem
            onClick={this.state.projectType === 'project' ? (e) => { this.toggleMenu(e); this.props.updateProject(this.state.projectType, this.props.project._id) } : (e) => { this.toggleMenu(e); this.setState({ projectType: 'project' }, () => this.saveProject()) }}
          >
            {this.state.projectType === 'project' ? Blockly.Msg.tooltip_update_project : Blockly.Msg.tooltip_create_project}
          </MenuItem>
          <MenuItem
            onClick={this.state.projectType === 'gallery' ? (e) => { this.toggleMenu(e); this.props.updateProject(this.state.projectType, this.props.project._id) } : (e) => { this.toggleMenu(e); this.setState({ open: true, title: 'Projekbeschreibung ergänzen', content: 'Bitte gib eine Beschreibung für das Galerie-Projekt ein und bestätige deine Angabe mit einem Klick auf \'Eingabe\'.' }); }}
          >
            {this.state.projectType === 'gallery' ? 'Galerie-Projekt aktualisieren' : 'Galerie-Projekt erstellen'}
          </MenuItem>
        </Menu>

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
          onClose={() => { this.toggleDialog(); this.setState({ description: this.props.description }); }}
          onClick={() => { this.toggleDialog(); this.setState({ description: this.props.description }); }}
          button={'Abbrechen'}
        >
          <div style={{ marginTop: '10px' }}>
            <TextField
              variant="standard"
              autoFocus
              fullWidth
              multiline
              placeholder={'Projektbeschreibung'}
              value={this.state.description}
              onChange={this.setDescription}
              style={{ marginBottom: '10px' }} />
            <Button disabled={!this.state.description} variant='contained' color='primary' onClick={() => { this.workspaceDescription(); this.toggleDialog(); }}>Eingabe</Button>
          </div>
        </Dialog>
      </div>
    );
  };
}

SaveProject.propTypes = {
  updateProject: PropTypes.func.isRequired,
  setDescription: PropTypes.func.isRequired,
  postClassroomProject: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  xml: PropTypes.string.isRequired,
  message: PropTypes.object.isRequired,
  user: PropTypes.object,
  classroomUser: PropTypes.object,
};

const mapStateToProps = state => ({
  name: state.workspace.name,
  description: state.project.description,
  xml: state.workspace.code.xml,
  message: state.message,
  user: state.auth.user,
  classroomUser: state.classroomAuth.classroomUser,
});

export default connect(mapStateToProps, { updateProject, setDescription, postClassroomProject })(withStyles(styles, { withTheme: true })(withRouter(SaveProject)));
