import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { workspaceName } from '../../actions/workspaceActions';
import { getProject, resetProject } from '../../actions/projectActions';
import { getClassroomProject } from '../../actions/classroomActions';
import { clearMessages, returnErrors } from '../../actions/messageActions';

import { withRouter } from 'react-router-dom';

import Home from '../Home';
import Breadcrumbs from '../Breadcrumbs';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

class Project extends Component {

  componentDidMount() {
    this.props.resetProject();
    this.getProject();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname ||
      prevProps.match.params[`${this.props.type}Id`] !== this.props.match.params[`${this.props.type}Id`]) {
      if (this.props.message.msg) {
        this.props.clearMessages();
      }
      this.getProject();
    }
    if (this.props.message !== prevProps.message) {
      if (this.props.message.id === 'PROJECT_EMPTY' || this.props.message.id === 'GET_PROJECT_FAIL') {
        if (this.props.type !== 'share') {
          this.props.returnErrors('', 404, 'GET_PROJECT_FAIL');
          this.props.history.push(`/${this.props.type}`);
        } else {
          this.props.history.push('/');
          this.props.returnErrors('', 404, 'GET_SHARE_FAIL');
        }
      } else if (this.props.message.id === 'GET_PROJECT_SUCCESS')   {
        this.props.workspaceName(this.props.project.title);
      }
        else if (this.props.message.id === 'GET_CLASSROOM_PROJECT_SUCCESS') {
          this.props.workspaceName(this.props.classroomProject.title);
        }
       else if (this.props.message.id === 'PROJECT_DELETE_SUCCESS' || this.props.message.id === 'GALLERY_DELETE_SUCCESS') {
        this.props.history.push(`/${this.props.type}`);
      }
    }
  }

  componentWillUnmount() {
    this.props.resetProject();
    this.props.workspaceName(null);
  }

  getProject = () => {
    const id = this.props.location.pathname.replace(/\/[a-z]{1,}\//, '');
    const param = this.props.location.pathname.replace(`/${id}`, '').replace('/', '');
    if (this.props.user && !this.props.classroomUser) {
      this.props.getProject(param, id);
    } else if (this.props.classroomUser) {
      this.props.getClassroomProject(this.props.classroomUser.classroomId, id);
    }
  }

  render() {
    const data = this.props.type === 'project' ? 'Projekte' : 'Galerie';
    const { progress, project, type, classroomProject } = this.props;

    return (
      progress ?
        <Backdrop open invisible>
          <CircularProgress color="primary" />
        </Backdrop>
        : project ?
          <div>
            {type !== 'share' ?
              <Breadcrumbs content={[{ link: `/${type}`, title: data }, { link: this.props.location.pathname, title: project.title }]} />
              : null}
            <Home project={project} projectType={type} />
          </div> : classroomProject ?
            <div>
              <Breadcrumbs content={[{ link: `/classroom`, title: 'Klassenraum' }, { link: `/classroom/${this.props.classroomUser.classroomId}`, title: 'Projekte' }, { link: this.props.location.pathname, title: classroomProject.title }]} />
              <Home project={classroomProject} projectType={type} />
            </div> : null
    );
  }
}

Project.propTypes = {
  workspaceName: PropTypes.func.isRequired,
  getProject: PropTypes.func.isRequired,
  getClassroomProject: PropTypes.func.isRequired,
  resetProject: PropTypes.func.isRequired,
  clearMessages: PropTypes.func.isRequired,
  returnErrors: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  message: PropTypes.object.isRequired,
  progress: PropTypes.bool.isRequired,
  user: PropTypes.object,
  classroomUser: PropTypes.object,
};

const mapStateToProps = state => ({
  project: state.project.projects[0],
  classroomProject: state.classroomAuth.classroomUser.projects[0],
  progress: state.project.progress,
  type: state.project.type,
  message: state.message,
  user: state.auth.user,
  classroomUser: state.classroomAuth.classroomUser,
});

export default connect(mapStateToProps, { workspaceName, getProject, getClassroomProject, resetProject, clearMessages, returnErrors })(withRouter(Project));
