import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { clearStats, workspaceName } from '../actions/workspaceActions';

import * as Blockly from 'blockly/core';

import WorkspaceStats from './WorkspaceStats';
import WorkspaceFunc from './WorkspaceFunc';
import BlocklyWindow from './Blockly/BlocklyWindow';
import CodeViewer from './CodeViewer';
import TrashcanButtons from './TrashcanButtons';
import { createNameId } from 'mnemonic-id';
import HintTutorialExists from './Tutorial/HintTutorialExists';

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
    codeOn: false,
    gallery: [],
    share: [],
    projectToLoad: undefined,
    stats: window.localStorage.getItem('stats'),
  }

  componentDidMount() {
    this.setState({ stats: window.localStorage.getItem('stats') })
    this.props.workspaceName(createNameId());
    fetch(process.env.REACT_APP_BLOCKLY_API + this.props.location.pathname)
      .then(res => res.json())
      .then((data) => {
        this.setState({ projectToLoad: data })
      })
  }


  componentDidUpdate() {
    /* Resize and reposition all of the workspace chrome (toolbox, trash,
    scrollbars etc.) This should be called when something changes that requires
    recalculating dimensions and positions of the trash, zoom, toolbox, etc.
    (e.g. window resize). */

    const workspace = Blockly.getMainWorkspace();
    Blockly.svgResize(workspace);
  }

  componentWillUnmount() {
    this.props.clearStats();
    this.props.workspaceName(null);
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
        {this.state.stats ?
          <div className='workspaceStats' style={{ float: 'left', height: '40px', position: 'relative' }}><WorkspaceStats /></div>
          : null
        }
        <div className='workspaceFunc' style={{ float: 'right', height: '40px', marginBottom: '20px' }}><WorkspaceFunc /></div>
        <Grid container spacing={2}>
          <Grid item xs={12} md={this.state.codeOn ? 8 : 12} style={{ position: 'relative' }}>
            <Tooltip title={this.state.codeOn ? Blockly.Msg.tooltip_hide_code : Blockly.Msg.tooltip_show_code} >
              <IconButton
                className={this.state.codeOn ? this.props.classes.codeOn : this.props.classes.codeOff}
                style={{ width: '40px', height: '40px', position: 'absolute', top: -12, right: 8, zIndex: 21 }}
                onClick={() => this.onChange()}
              >
                <FontAwesomeIcon icon={faCode} size="xs" />
              </IconButton>
            </Tooltip>
            <TrashcanButtons />
            <div className='blocklyWindow'>
              {this.state.projectToLoad ?
                < BlocklyWindow blocklyCSS={{ height: '80vH' }} initialXml={this.state.projectToLoad.xml} /> : < BlocklyWindow blocklyCSS={{ height: '80vH' }} />
              }</div>

          </Grid>
          {this.state.codeOn ?
            <Grid item xs={12} md={4}>
              <CodeViewer />
            </Grid>
            : null}
        </Grid>
        <HintTutorialExists />
      </div>
    );
  };
}

Home.propTypes = {
  clearStats: PropTypes.func.isRequired,
  workspaceName: PropTypes.func.isRequired
};


export default connect(null, { clearStats, workspaceName })(withStyles(styles, { withTheme: true })(Home));
