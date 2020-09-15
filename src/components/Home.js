import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { clearStats } from '../actions/workspaceActions';

import * as Blockly from 'blockly/core';

import WorkspaceStats from './WorkspaceStats';
import WorkspaceFunc from './WorkspaceFunc';
import BlocklyWindow from './Blockly/BlocklyWindow';
import CodeViewer from './CodeViewer';
import TrashcanButtons from './TrashcanButtons';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

import { faCode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const styles = (theme) => ({
  codeOn: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.contrastText,
      color: theme.palette.primary.main,
      border: `1px solid ${theme.palette.secondary.main}`
    }
  },
  codeOff: {
    backgroundColor: theme.palette.primary.contrastText,
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.secondary.main}`,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    }
  }
});


class Home extends Component {

  state = {
    codeOn: false
  }

  componentDidUpdate() {
    /* Resize and reposition all of the workspace chrome (toolbox, trash,
    scrollbars etc.) This should be called when something changes that requires
    recalculating dimensions and positions of the trash, zoom, toolbox, etc.
    (e.g. window resize). */
    const workspace = Blockly.getMainWorkspace();
    Blockly.svgResize(workspace);
  }

  componentWillUnmount(){
    this.props.clearStats();
  }

  onChange = () => {
    this.setState({ codeOn: !this.state.codeOn });
    const workspace = Blockly.getMainWorkspace();
    // https://github.com/google/blockly/blob/master/core/blockly.js#L314
    if (workspace.trashcan && workspace.trashcan.flyout) {
      workspace.trashcan.flyout.hide(); // in case of resize, the trash flyout does not reposition
    }
  }

  render() {
    return (
      <div>
        <div style={{float: 'left'}}><WorkspaceStats /></div>
        <div style={{float: 'right'}}><WorkspaceFunc /></div>
        <Grid container spacing={2}>
          <Grid item xs={12} md={this.state.codeOn ? 6 : 12} style={{ position: 'relative' }}>
            <Tooltip title={this.state.codeOn ? 'Code ausblenden' : 'Code anzeigen'} >
              <IconButton
                className={this.state.codeOn ? this.props.classes.codeOn : this.props.classes.codeOff}
                style={{width: '40px', height: '40px', position: 'absolute', top: -12, right: 8, zIndex: 21 }}
                onClick={() => this.onChange()}
              >
                <FontAwesomeIcon icon={faCode} size="xs"/>
              </IconButton>
            </Tooltip>
            <TrashcanButtons />
            <BlocklyWindow />
          </Grid>
          {this.state.codeOn ?
            <Grid item xs={12} md={6}>
              <CodeViewer />
            </Grid>
            : null}
        </Grid>
      </div>
    );
  };
}

Home.propTypes = {
  clearStats: PropTypes.func.isRequired
};


export default connect(null, { clearStats })(withStyles(styles, { withTheme: true })(Home));
