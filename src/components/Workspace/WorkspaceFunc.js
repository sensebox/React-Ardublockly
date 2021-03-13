import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import WorkspaceName from './WorkspaceName';
import SaveProject from './SaveProject';
import Compile from './Compile';
import SolutionCheck from '../Tutorial/SolutionCheck';
import DownloadProject from './DownloadProject';
import OpenProject from './OpenProject';
import Screenshot from './Screenshot';
import ShareProject from './ShareProject';
import ResetWorkspace from './ResetWorkspace';
import DeleteProject from './DeleteProject';
import CopyCode from './CopyCode';

class WorkspaceFunc extends Component {

  render() {
    return (
      <div style={{ width: 'max-content', display: 'flex' }}>

        {!this.props.assessment ?
          <WorkspaceName
            style={{ marginRight: '5px' }}
            multiple={this.props.multiple}
            project={this.props.project}
            projectType={this.props.projectType}
          />
          : null}

        {this.props.assessment ?
          <SolutionCheck />
          : !this.props.multiple ?
            <Compile iconButton />
            : null}

        {!this.props.multiple ?
          <CopyCode iconButton />
          : null}


        {this.props.user && !this.props.multiple ?
          <SaveProject
            style={{ marginRight: '5px' }}
            projectType={this.props.projectType}
            project={this.props.project}
          />
          : null}

        {!this.props.multiple ?
          <DownloadProject style={{ marginRight: '5px' }} />
          : null}


        {!this.props.assessment && !this.props.multiple ?
          <OpenProject
            style={{ marginRight: '5px' }}
            assessment={this.props.assessment}
          />
          : null}

        {!this.props.assessment && !this.props.multiple ?
          <Screenshot style={{ marginRight: '5px' }} />
          : null}

        {this.props.projectType !== 'gallery' && !this.props.assessment ?
          <ShareProject
            style={{ marginRight: '5px' }}
            multiple={this.props.multiple}
            project={this.props.project}
            projectType={this.props.projectType}
          />
          : null}

        {!this.props.multiple ?
          <ResetWorkspace style={this.props.projectType === 'project' || this.props.projectType === 'gallery' ? { marginRight: '5px' } : null}
          />
          : null}

        {!this.props.assessment && (this.props.projectType === 'project' || this.props.projectType === 'gallery') && this.props.user && this.props.user.email === this.props.project.creator ?
          <DeleteProject
            project={this.props.project}
            projectType={this.props.projectType}
          />
          : null}

      </div>
    );
  };
}

WorkspaceFunc.propTypes = {
  user: PropTypes.object
};

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps, null)(WorkspaceFunc);
