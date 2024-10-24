import React, { Component } from "react";

import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import MaterialUIDialog from "@mui/material/Dialog";

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
          {this.props.actions ? (
            this.props.actions
          ) : (
            <Button
              onClick={this.props.onClick}
              disabled={this.props.disabled}
              color="primary"
            >
              {this.props.button}
            </Button>
          )}
        </DialogActions>
      </MaterialUIDialog>
    );
  }
}

export default Dialog;
