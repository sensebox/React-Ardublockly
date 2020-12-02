import React, { Component } from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';

import Breadcrumbs from '../Breadcrumbs';
import BlocklyWindow from '../Blockly/BlocklyWindow';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';


class ProjectHome extends Component {

  state = {
    projects: []
  }

  componentDidMount() {
    this.getProjects();
  }

  componentDidUpdate(props) {
    if(props.match.path !== this.props.match.path){
      this.setState({projects: []});
      this.getProjects();
    }
  }

  getProjects = () => {
    var data = this.props.match.path === '/project' ? 'projects' : 'galleries';
    axios.get(`${process.env.REACT_APP_BLOCKLY_API}${this.props.match.path}`)
      .then(res => {
        this.setState({ projects: res.data[data] });
      })
      .catch(err => {
        // TODO:
      });
  }

  render() {
    var data = this.props.match.path === '/project' ? 'Projekte' : 'Galerie';
    return (
      <div>
        <Breadcrumbs content={[{ link: this.props.match.path, title: data }]} />

        <h1>{data}</h1>
        <Grid container spacing={2}>
          {this.state.projects.map((project, i) => {
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
        </Grid>
      </div>
    );
  };
}

export default ProjectHome;
