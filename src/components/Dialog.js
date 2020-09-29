import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import MaterialUIDialog from '@material-ui/core/Dialog';

class Dialog extends Component {

  render() {
    return (
      <MaterialUIDialog
        onClose={this.props.onClose}
        open={this.props.open}
        style={this.props.style}
        maxWidth={this.props.maxWidth}
        fullWidth={this.props.fullWidth}
      >
        <DialogTitle>{this.props.title}</DialogTitle>
        <DialogContent dividers>
          {this.props.content}
          {this.props.children}
        </DialogContent>
        <DialogActions>
          {this.props.actions ? this.props.actions :
            <Button onClick={this.props.onClick} color="primary">
              {this.props.button}
            </Button>
          }
        </DialogActions>
      </MaterialUIDialog>
    );
  };
}


export default Dialog;
