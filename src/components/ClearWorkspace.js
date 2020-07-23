import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { clearStats, workspaceChange } from '../actions/workspaceActions';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { faTrashRestore } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class ClearWorkspace extends Component {

  clearWorkspace = () => {
    if(this.props.workspace){
      this.props.workspace.clear();
      this.props.workspace.options.maxBlocks = Infinity;
      this.props.workspaceChange();
      this.props.clearStats();
    }
    else {
      alert()
    }
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
  workspace: PropTypes.object.isRequired,
  clearStats: PropTypes.func.isRequired,
  workspaceChange: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  workspace: state.workspace.workspace
});

export default connect(mapStateToProps, { clearStats, workspaceChange })(ClearWorkspace);
