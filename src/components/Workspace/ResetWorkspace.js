import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { clearStats, onChangeCode, workspaceName } from '../../actions/workspaceActions';

import * as Blockly from 'blockly/core';

import { createNameId } from 'mnemonic-id';
import { initialXml } from '../Blockly/initialXml.js';

import Snackbar from '../Snackbar';

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const styles = (theme) => ({
  button: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    width: '40px',
    height: '40px',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    }
  }
});



class ResetWorkspace extends Component {

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      snackbar: false,
      type: '',
      key: '',
      message: '',
    };
  }

  resetWorkspace = () => {
    const workspace = Blockly.getMainWorkspace();
    Blockly.Events.disable(); // https://groups.google.com/forum/#!topic/blockly/m7e3g0TC75Y
    // if events are disabled, then the workspace will be cleared AND the blocks are not in the trashcan
    const xmlDom = Blockly.Xml.textToDom(initialXml)
    Blockly.Xml.clearWorkspaceAndLoadFromXml(xmlDom, workspace);
    Blockly.Events.enable();
    workspace.options.maxBlocks = Infinity;
    this.props.onChangeCode();
    this.props.clearStats();
    if (!this.props.assessment) {
      this.props.workspaceName(createNameId());
    }
    this.setState({ snackbar: true, type: 'success', key: Date.now(), message: Blockly.Msg.messages_reset_workspace_success });
  }



  render() {
    return (
      <div style={this.props.style}>
        <Tooltip title={Blockly.Msg.tooltip_reset_workspace} arrow>
          <IconButton
            className={this.props.classes.button}
            onClick={() => this.resetWorkspace()}
          >
            <FontAwesomeIcon icon={faShare} size="xs" flip='horizontal' />
          </IconButton>
        </Tooltip>

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

ResetWorkspace.propTypes = {
  clearStats: PropTypes.func.isRequired,
  onChangeCode: PropTypes.func.isRequired,
  workspaceName: PropTypes.func.isRequired
};

export default connect(null, { clearStats, onChangeCode, workspaceName })(withStyles(styles, { withTheme: true })(ResetWorkspace));
