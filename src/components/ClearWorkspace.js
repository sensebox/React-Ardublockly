import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { clearStats } from '../actions/workspaceActions';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { faTrashRestore } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class ClearWorkspace extends Component {

  clearWorkspace = () => {
    this.props.newWorkspace.clear();
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
  newWorkspace: PropTypes.object.isRequired,
  clearStats: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  newWorkspace: state.workspace.new
});

export default connect(mapStateToProps, { clearStats })(ClearWorkspace);
