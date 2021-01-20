import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { clearStats, workspaceName } from '../actions/workspaceActions';

import * as Blockly from 'blockly/core';
import { createNameId } from 'mnemonic-id';

import WorkspaceStats from './Workspace/WorkspaceStats';
import WorkspaceFunc from './Workspace/WorkspaceFunc';
import BlocklyWindow from './Blockly/BlocklyWindow';
import CodeViewer from './CodeViewer';
import TrashcanButtons from './Workspace/TrashcanButtons';
import HintTutorialExists from './Tutorial/HintTutorialExists';
import Snackbar from './Snackbar';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

import { faCode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TooltipViewer from './TooltipViewer';


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
    codeOn: true,
    snackbar: false,
    type: '',
    key: '',
    message: ''
  }

  componentDidMount() {
    this.setState({ stats: window.localStorage.getItem('stats') });
    if (!this.props.project) {
      this.props.workspaceName(createNameId());
    }
    if (this.props.message && this.props.message.id === 'GET_SHARE_FAIL') {
      this.setState({ snackbar: true, key: Date.now(), message: `Das angefragte geteilte Projekt konnte nicht gefunden werden.`, type: 'error' });
    }
  }

  componentDidUpdate(props) {
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
        {this.props.statistics ?
          <div style={{ float: 'left', height: '40px', position: 'relative' }}><WorkspaceStats /></div>
          : null
        }
        <div className='workspaceFunc' style={{ float: 'right', height: '40px', marginBottom: '20px' }}>
          <WorkspaceFunc project={this.props.project} projectType={this.props.projectType} />
        </div>
        <Grid container spacing={2}>
          <Grid item xs={12} md={this.state.codeOn ? 8 : 12} style={{ position: 'relative' }}>
            <Tooltip title={this.state.codeOn ? 'Code ausblenden' : 'Code anzeigen'} >
              <IconButton
                className={`showCode ${this.state.codeOn ? this.props.classes.codeOn : this.props.classes.codeOff}`}
                style={{ width: '40px', height: '40px', position: 'absolute', top: -12, right: 8, zIndex: 21 }}
                onClick={() => this.onChange()}
              >
                <FontAwesomeIcon icon={faCode} size="xs" />
              </IconButton>
            </Tooltip>
            <TrashcanButtons />
            <div className='blocklyWindow'>
              {this.props.project ?
                < BlocklyWindow blocklyCSS={{ height: '80vH' }} initialXml={this.props.project.xml} />
                : < BlocklyWindow blocklyCSS={{ height: '80vH' }} />
              }
            </div>
          </Grid>
          {this.state.codeOn ?
            <Grid item xs={12} md={4}>
              <CodeViewer />
              <TooltipViewer />
            </Grid>
            : null}
        </Grid>
        <HintTutorialExists />
        <Snackbar
          open={this.state.snackbar}
          message={this.state.message}
          type={this.state.type}
          key={this.state.key}
        />
      </div>
    );
  };
}

Home.propTypes = {
  clearStats: PropTypes.func.isRequired,
  workspaceName: PropTypes.func.isRequired,
  message: PropTypes.object.isRequired,
  statistics: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  message: state.message,
  statistics: state.general.statistics
});


export default connect(mapStateToProps, { clearStats, workspaceName })(withStyles(styles, { withTheme: true })(Home));
