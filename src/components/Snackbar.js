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

  constructor(props){
    super(props);
    this.state = {
      open: props.open
    };
    this.timeout = null;
  }

  componentDidMount(){
    if(this.state.open){
      this.autoHideDuration();
    }
  }

  componentDidUpdate(){
    if(!this.state.open){
      clearTimeout(this.timeout);
    }
  }

  componentWillUnmount(){
    if(this.state.open){
      clearTimeout(this.timeout);
    }
  }

  onClose = () => {
    this.setState({open: false});
  }

  autoHideDuration = () => {
    this.timeout = setTimeout(() => {
      this.onClose();
    }, 5000);
  }

  render() {
    return (
      <MaterialUISnackbar
        anchorOrigin={{vertical: 'bottom', horizontal: 'left' }}
        open={this.state.open}
        key={this.props.key}
        style={{left: '22px', bottom: '40px', width: '300px', zIndex: '100'}}
      >
        <SnackbarContent
          style={{flexWrap: 'nowrap'}}
          className={this.props.type === 'error' ? this.props.classes.error : this.props.classes.success}
          action={
            <IconButton onClick={this.onClose} style={{color: 'inherit'}}>
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
