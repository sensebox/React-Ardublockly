import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MaxBlocks from './MaxBlocks';

import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

class WorkspaceFunc extends Component {

  state = {
    title: '',
    content: '',
    open: false
  }



  getXMLCode = () => {
    var code = window.Ardublockly.generateXml();
    this.setState({ title: 'XML Code', content: code, open: true });
  }

  toggleDialog = () => {
    this.setState({ open: !this.state });
  }

  render() {
    return (
      <div style={{ marginTop: '20px' }}>
        <Dialog onClose={this.toggleDialog} open={this.state.open}>
          <DialogTitle>{this.state.title}</DialogTitle>
          <DialogContent dividers>
            {this.state.content}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.toggleDialog} color="primary">
              Schließen
            </Button>
          </DialogActions>
        </Dialog>
        <Button style={{ marginRight: '10px' }} variant="contained" color="primary" onClick={() => this.props.generateCode()}>
          Get Adurino Code
        </Button>
        <Button style={{ marginRight: '10px' }} variant="contained" color="primary" onClick={() => this.getXMLCode()}>
          Get XML Code
        </Button>
        <Button variant="contained" color="primary" onClick={() => { var blocks = this.props.newWorkspace; console.log(blocks); }}>
          Get workspace
        </Button>
        <MaxBlocks />
      </div>
    );
  };
}

WorkspaceFunc.propTypes = {
  newWorkspace: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  newWorkspace: state.workspace.new
});

export default connect(mapStateToProps, null)(WorkspaceFunc);
