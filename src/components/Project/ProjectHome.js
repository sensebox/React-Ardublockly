import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProjects, resetProject } from '../../actions/projectActions';
import { clearMessages } from '../../actions/messageActions';

import axios from 'axios';
import { Link } from 'react-router-dom';

import Breadcrumbs from '../Breadcrumbs';
import BlocklyWindow from '../Blockly/BlocklyWindow';
import Snackbar from '../Snackbar';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';


class ProjectHome extends Component {

  state = {
    snackbar: false,
    type: '',
    key: '',
    message: ''
  }

  componentDidMount() {
    var type = this.props.match.path.replace('/','');
    this.props.getProjects(type);
    if(this.props.message){
      if(this.props.message.id === 'PROJECT_DELETE_SUCCESS'){
        this.setState({ snackbar: true, key: Date.now(), message: `Dein Projekt wurde erfolgreich gelöscht.`, type: 'success' });
      }
      else if(this.props.message.id === 'GALLERY_DELETE_SUCCESS'){
        this.setState({ snackbar: true, key: Date.now(), message: `Dein Galerie-Projekt wurde erfolgreich gelöscht.`, type: 'success' });
      }
      else if(this.props.message.id === 'GET_PROJECT_FAIL'){
        this.setState({ snackbar: true, key: Date.now(), message: `Dein angefragtes ${type === 'gallery' ? 'Galerie-':''}Projekt konnte nicht gefunden werden.`, type: 'error' });
      }
    }
  }

  componentDidUpdate(props) {
    if(props.match.path !== this.props.match.path){
      this.setState({snackbar: false});
      this.props.getProjects(this.props.match.path.replace('/',''));
    }
  }

  componentWillUnmount() {
    this.props.resetProject();
    this.props.clearMessages();
  }

  render() {
    var data = this.props.match.path === '/project' ? 'Projekte' : 'Galerie';
    return (
      <div>
        <Breadcrumbs content={[{ link: this.props.match.path, title: data }]} />

        <h1>{data}</h1>
        {this.props.progress ?
          <Backdrop open invisible>
            <CircularProgress color="primary" />
          </Backdrop>
        :
        <Grid container spacing={2}>
          {this.props.projects.map((project, i) => {
            return (
              <Grid item xs={12} sm={6} md={4} xl={3} key={i}>
                <Link to={`/${data === 'Projekte' ? 'project' : 'gallery'}/${project._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Paper style={{ padding: '1rem', position: 'relative', overflow: 'hidden' }}>
                    <h3 style={{marginTop: 0}}>{project.title}</h3>
                    <Divider style={{marginTop: '1rem', marginBottom: '10px'}}/>
                    <BlocklyWindow
                      svg
                      blockDisabled
                      initialXml={project.xml}
                    />
                    <Typography variant='body2' style={{fontStyle: 'italic', margin: 0, marginTop: '-30px'}}>{project.description}</Typography>
                  </Paper>
                </Link>
              </Grid>
            )
          })}
        </Grid>}
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

ProjectHome.propTypes = {
  getProjects: PropTypes.func.isRequired,
  resetProject: PropTypes.func.isRequired,
  clearMessages: PropTypes.func.isRequired,
  projects: PropTypes.array.isRequired,
  progress: PropTypes.bool.isRequired,
  message: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  projects: state.project.projects,
  progress: state.project.progress,
  message: state.message
});


export default connect(mapStateToProps, { getProjects, resetProject, clearMessages })(ProjectHome);
