import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { clearStats, workspaceChange } from '../actions/workspaceActions';

import * as Blockly from 'blockly/core';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { faTrashRestore } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class ClearWorkspace extends Component {

  clearWorkspace = () => {
    const workspace = Blockly.getMainWorkspace();
    workspace.clear();
    workspace.options.maxBlocks = Infinity;
    this.props.workspaceChange();
    this.props.clearStats();
  }

  render() {
    return (
      <ListItem button onClick={() => {this.clearWorkspace(); this.props.onClick();}}>
        <ListItemIcon><FontAwesomeIcon icon={faTrashRestore} /></ListItemIcon>
        <ListItemText primary='Zurücksetzen' />
      </ListItem>
    );
  };
}

ClearWorkspace.propTypes = {
  clearStats: PropTypes.func.isRequired,
  workspaceChange: PropTypes.func.isRequired
};


export default connect(null, { clearStats, workspaceChange })(ClearWorkspace);
