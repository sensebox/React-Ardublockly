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

  compile = () => {
    const data = {
      "board": process.env.REACT_APP_BOARD,
      "sketch": this.props.arduino
    };

    fetch(`${process.env.REACT_APP_COMPILER_URL}/compile`, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.download(data.data.id)
      });
  }

  download = (id) => {
    const filename = 'sketch'
    window.open(`${process.env.REACT_APP_COMPILER_URL}/download?id=${id}&board=${process.env.REACT_APP_BOARD}&filename=${filename}`, '_self');
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
        <Button style={{ float: 'right', color: 'white' }} variant="contained" color="primary" onClick={() => this.compile()}>
          Compile
        </Button>
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
