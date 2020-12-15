import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as Blockly from 'blockly/core';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

import { faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const styles = (theme) => ({
  closeTrash: {
    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.primary.main,
    }
  },
  deleteTrash: {
    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.primary.main,
    }
  }
});


class TrashcanButtons extends Component {

  state = {
    closeTrashFlyout: false
  }

  componentDidUpdate(previousProps, previousState) {
    const workspace = Blockly.getMainWorkspace();
    const contentsIsOpen = workspace.trashcan.contentsIsOpen();
    if (previousState.closeTrashFlyout !== contentsIsOpen) {
      this.setState({ closeTrashFlyout: contentsIsOpen });
    }
  }

  closeTrashcan = () => {
    this.setState({ closeTrashFlyout: false });
    const workspace = Blockly.getMainWorkspace();
    // https://github.com/google/blockly/blob/master/core/blockly.js#L314
    workspace.trashcan.flyout.hide();
  };

  clearTrashcan = () => {
    this.setState({ closeTrashFlyout: false });
    const workspace = Blockly.getMainWorkspace();
    // https://developers.google.com/blockly/reference/js/Blockly.Trashcan#emptyContents
    workspace.trashcan.emptyContents();
  }

  render() {
    return (
      this.state.closeTrashFlyout ?
        <div>
          <Tooltip title={Blockly.Msg.tooltip_trashcan_hide}>
            <IconButton
              className={this.props.classes.closeTrash}
              style={{ width: '40px', height: '40px', position: 'absolute', bottom: 10, right: 10, zIndex: 21 }}
              onClick={() => this.closeTrashcan()}
            >
              <FontAwesomeIcon icon={faTimes} size="xs" />
            </IconButton>
          </Tooltip>
          <Tooltip title={Blockly.Msg.tooltip_trashcan_delete}>
            <IconButton
              className={this.props.classes.deleteTrash}
              style={{ width: '40px', height: '40px', position: 'absolute', bottom: 10, right: 50, zIndex: 21 }}
              onClick={() => this.clearTrashcan()}
            >
              <FontAwesomeIcon icon={faTrash} size="xs" />
            </IconButton>
          </Tooltip>
        </div>
        : null
    );
  };
}

TrashcanButtons.propTypes = {
  workspaceChange: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  workspaceChange: state.workspace.change
});

export default connect(mapStateToProps, null)(withStyles(styles, { withTheme: true })(TrashcanButtons));
