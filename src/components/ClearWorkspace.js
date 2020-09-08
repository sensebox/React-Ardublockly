import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { clearStats, onChangeCode } from '../actions/workspaceActions';
import { initialXml } from './Blockly/initialXml.js';

import * as Blockly from 'blockly/core';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { faTrashRestore } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class ClearWorkspace extends Component {

  clearWorkspace = () => {
    const workspace = Blockly.getMainWorkspace();
    Blockly.Events.disable(); // https://groups.google.com/forum/#!topic/blockly/m7e3g0TC75Y
    // if events are disabled, then the workspace will be cleared AND the blocks are not in the trashcan
    const xmlDom = Blockly.Xml.textToDom(initialXml)
    Blockly.Xml.clearWorkspaceAndLoadFromXml(xmlDom, workspace);
    Blockly.Events.enable();
    workspace.options.maxBlocks = Infinity;
    this.props.onChangeCode();
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
  onChangeCode: PropTypes.func.isRequired
};


export default connect(null, { clearStats, onChangeCode })(ClearWorkspace);
