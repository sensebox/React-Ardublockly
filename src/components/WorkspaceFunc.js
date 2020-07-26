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

  getArduinoCode = () => {
    this.setState({ title: 'Adurino Code', content: this.props.arduino, open: true });
  }

  getXMLCode = () => {
    this.setState({ title: 'XML Code', content: this.props.xml, open: true });
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
        <Button style={{ marginRight: '10px', color: 'white' }} variant="contained" color="primary" onClick={() => this.getArduinoCode()}>
          Get Adurino Code
        </Button>
        <Button style={{ marginRight: '10px', color: 'white' }} variant="contained" color="primary" onClick={() => this.getXMLCode()}>
          Get XML Code
        </Button>
        <MaxBlocks />
      </div>
    );
  };
}

WorkspaceFunc.propTypes = {
  arduino: PropTypes.string.isRequired,
  xml: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  arduino: state.workspace.code.arduino,
  xml: state.workspace.code.xml
});

export default connect(mapStateToProps, null)(WorkspaceFunc);
