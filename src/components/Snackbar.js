import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MaterialUISnackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const styles = (theme) => ({
  success: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  },
  error: {
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.error.contrastText
  }
});

class Snackbar extends Component {

  render() {
    return (
      <MaterialUISnackbar
        anchorOrigin={{vertical: 'bottom', horizontal: 'left' }}
        open={this.props.open}
        onClose={this.props.onClose}
        key={Date.now()+this.props.message}
        autoHideDuration={5000}
        style={{left: '22px', bottom: '40px', width: '300px', zIndex: '100'}}
      >
        <SnackbarContent
          style={{flexWrap: 'nowrap'}}
          className={this.props.type === 'error' ? this.props.classes.error : this.props.classes.success}
          action={
            <IconButton onClick={this.props.onClose} style={{color: 'inherit'}}>
              <FontAwesomeIcon icon={faTimes} size="xs"/>
            </IconButton>
          }
          message={this.props.message}
        />
      </MaterialUISnackbar>
    );
  };
}


export default withStyles(styles, {withTheme: true})(Snackbar);
