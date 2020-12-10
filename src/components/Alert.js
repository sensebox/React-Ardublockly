import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';

import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  alert: {
    marginBottom: '20px',
    border: `1px solid ${theme.palette.primary.main}`,
    padding: '10px 20px',
    borderRadius: '4px',
    background: fade(theme.palette.primary.main, 0.3),
    color: 'rgb(70,70,70)'
  }
});


export class Alert extends Component {

  render(){
    return(
      <div className={this.props.classes.alert}>
        <Typography>
          {this.props.children}
        </Typography>
      </div>
    );
  }
}


export default withStyles(styles, { withTheme: true })(Alert);
