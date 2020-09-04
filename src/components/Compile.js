import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

const styles = (theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  }
});


class Compile extends Component {

  state = {
    progress: false,
    open: false
  }

  compile = () => {
    const data = {
      "board": process.env.REACT_APP_BOARD,
      "sketch": this.props.arduino
    };
    this.setState({ progress: true });
    fetch(`${process.env.REACT_APP_COMPILER_URL}/compile`, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      this.download(data.data.id)
    })
    .catch(err => {
      console.log(err);
      this.setState({ progress: false, open: true });
    });
  }

  download = (id) => {
    const filename = 'sketch'
    window.open(`${process.env.REACT_APP_COMPILER_URL}/download?id=${id}&board=${process.env.REACT_APP_BOARD}&filename=${filename}`, '_self');
    this.setState({ progress: false });
  }

  toggleDialog = () => {
    this.setState({ open: !this.state });
  }

  render() {
    return (
      <div style={{display: 'inline'}}>
        <Button style={{ float: 'right', color: 'white' }} variant="contained" color="primary" onClick={() => this.compile()}>
          Kompilieren
        </Button>
        <Backdrop className={this.props.classes.backdrop} open={this.state.progress}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Dialog onClose={this.toggleDialog} open={this.state.open}>
          <DialogTitle>Fehler</DialogTitle>
          <DialogContent dividers>
            Etwas ist beim Kompilieren schief gelaufen. Versuche es nochmal.
          </DialogContent>
          <DialogActions>
            <Button onClick={this.toggleDialog} color="primary">
              Schließen
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };
}

Compile.propTypes = {
  arduino: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  arduino: state.workspace.code.arduino
});

export default connect(mapStateToProps, null)(withStyles(styles, {withTheme: true})(Compile));
