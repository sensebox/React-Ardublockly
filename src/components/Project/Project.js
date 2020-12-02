import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { workspaceName } from '../../actions/workspaceActions';

import axios from 'axios';
import { createNameId } from 'mnemonic-id';

import Home from '../Home';
import Breadcrumbs from '../Breadcrumbs';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';


class Project extends Component {

  state = {
    project: {},
    progress: false,
    type: ''
  }

  componentDidMount() {
    this.getProject();
  }

  componentDidUpdate(props) {
    if(props.location.path !== this.props.location.path){
      this.getProject();
    }
  }

  getProject = () => {
    var param = this.props.match.params.shareId ? 'share' : this.props.match.params.galleryId ? 'gallery' : 'project';
    this.setState({ type: param, progress: true });
    var id = this.props.match.params[`${param}Id`];
    axios.get(`${process.env.REACT_APP_BLOCKLY_API}/${param}/${id}`)
      .then(res => {
        var data = param === 'share' ? 'content' : param;
        if(res.data[data]){
          this.props.workspaceName(res.data[data].title);
          this.setState({ project: res.data[data], progress: false });
        }
        else {
          this.props.workspaceName(createNameId());
          this.setState({ progress: false });
          this.props.history.push('/');
        }
      })
      .catch(err => {
        // TODO:
        this.setState({ progress: false, snackbar: true, key: Date.now(), message: `Fehler beim Aufrufen des angeforderten Programms. Versuche es noch einmal.`, type: 'error' });
        this.props.workspaceName(createNameId());
        this.props.history.push('/');
        window.scrollTo(0, 0);
      });
  }

  render() {
    var data = this.state.type === 'project' ? 'Projekte' : 'Galerie';
    return (
      this.state.progress ?
        <Backdrop open invisible>
          <CircularProgress color="primary" />
        </Backdrop>
      :
        <div>
          {this.state.type !== 'share' ?
            <Breadcrumbs content={[{ link: `/${this.state.type}`, title: data },{ link: this.props.location.path, title: this.state.project.title }]} />
          : null}
          <Home project={this.state.project.xml}/>
        </div>
    );
  };
}

Project.propTypes = {
  workspaceName: PropTypes.func.isRequired
};


export default connect(null, { workspaceName })(Project);
