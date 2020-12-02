import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { workspaceName } from '../../actions/workspaceActions';
import { getProject, resetProject } from '../../actions/projectActions';
import { clearMessages } from '../../actions/messageActions';

import axios from 'axios';
import { createNameId } from 'mnemonic-id';

import Home from '../Home';
import Breadcrumbs from '../Breadcrumbs';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';


class Project extends Component {

  componentDidMount() {
    this.getProject();
  }

  componentDidUpdate(props) {
    if(props.location.path !== this.props.location.path ||
       props.match.params[`${this.props.type}Id`] !== this.props.match.params[`${this.props.type}Id`]){
      if(this.props.message.msg){
        this.props.clearMessages();
      }
      this.getProject();
    }
    if(this.props.message !== props.message){
      if(this.props.message.id === 'PROJECT_EMPTY' || this.props.message.id === 'GET_PROJECT_FAIL'){
        this.props.workspaceName(createNameId());
        this.props.history.push('/');
      }
      if(this.props.message.id === 'GET_PROJECT_SUCCESS'){
        this.props.workspaceName(this.props.project.title);
      }
    }
  }

  componentWillUnmount() {
    this.props.resetProject();
    this.props.workspaceName(null);
    if(this.props.message.msg){
      this.props.clearMessages();
    }
  }

  getProject = () => {
    var param = this.props.match.params.shareId ? 'share' : this.props.match.params.galleryId ? 'gallery' : 'project';
    var id = this.props.match.params[`${param}Id`];
    this.props.getProject(param, id);
  }

  render() {
    var data = this.props.type === 'project' ? 'Projekte' : 'Galerie';
    return (
      this.props.progress ?
        <Backdrop open invisible>
          <CircularProgress color="primary" />
        </Backdrop>
      : this.props.project ?
        <div>
          {this.props.type !== 'share' ?
            <Breadcrumbs content={[{ link: `/${this.props.type}`, title: data },{ link: this.props.location.path, title: this.props.project.title }]} />
          : null}
          <Home project={this.props.project.xml}/>
        </div> : null
    );
  };
}

Project.propTypes = {
  workspaceName: PropTypes.func.isRequired,
  getProject: PropTypes.func.isRequired,
  resetProject: PropTypes.func.isRequired,
  clearMessages: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  message: PropTypes.object.isRequired,
  progress: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  project: state.project.projects[0],
  progress: state.project.progress,
  type: state.project.type,
  message: state.message
});

export default connect(mapStateToProps, { workspaceName, getProject, resetProject, clearMessages })(Project);
