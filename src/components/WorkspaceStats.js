import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as Blockly from 'blockly/core';

import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

import { faPuzzlePiece, faTrash, faPlus, faPen, faArrowsAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const styles = (theme) => ({
  stats: {
    backgroundColor: theme.palette.primary.main,
    display: 'inline',
    marginLeft: '50px',
    padding: '3px 10px',
    // borderRadius: '25%'
  }
});

class WorkspaceStats extends Component {

  render() {
    const workspace = Blockly.getMainWorkspace();
    const remainingBlocksInfinity = workspace ? workspace.remainingCapacity() !== Infinity : null;
    return (
      <div style={{ marginBottom: '20px' }}>
        <Tooltip title="Anzahl aktueller Blöcke" >
          <Chip
            style={{ marginRight: '1rem' }}
            color="primary"
            avatar={<Avatar><FontAwesomeIcon icon={faPuzzlePiece} /></Avatar>}
            label={workspace ? workspace.getAllBlocks().length : 0}>
          </Chip>
        </Tooltip>
        <Tooltip title="Anzahl neuer Blöcke" >
          <Chip
            style={{ marginRight: '1rem' }}
            color="primary"
            avatar={<Avatar><FontAwesomeIcon icon={faPlus} /></Avatar>}
            label={this.props.create > 0 ? this.props.create : 0}> {/* initialXML is created automatically, Block is not part of the statistics */}
          </Chip>
        </Tooltip>
        <Tooltip title="Anzahl veränderter Blöcke" >
          <Chip
            style={{ marginRight: '1rem' }}
            color="primary"
            avatar={<Avatar><FontAwesomeIcon icon={faPen} /></Avatar>}
            label={this.props.change}>
          </Chip>
        </Tooltip>
        <Tooltip title="Anzahl bewegter Blöcke" >
          <Chip
            style={{ marginRight: '1rem' }}
            color="primary"
            avatar={<Avatar><FontAwesomeIcon icon={faArrowsAlt} /></Avatar>}
            label={this.props.move > 0 ? this.props.move : 0}> {/* initialXML is moved automatically, Block is not part of the statistics */}
          </Chip>
        </Tooltip>
        <Tooltip title="Anzahl gelöschter Blöcke" >
          <Chip
            style={{ marginRight: '1rem' }}
            color="primary"
            avatar={<Avatar><FontAwesomeIcon icon={faTrash} /></Avatar>}
            label={this.props.delete}>
          </Chip>
        </Tooltip>
        {remainingBlocksInfinity ?
          <Tooltip title="Verbleibende Blöcke" >
            <Chip
              style={{ marginRight: '1rem' }}
              color="primary"
              label={workspace.remainingCapacity()}>
            </Chip>
          </Tooltip> : null}
      </div>
    );
  };
}

WorkspaceStats.propTypes = {
  create: PropTypes.number.isRequired,
  change: PropTypes.number.isRequired,
  delete: PropTypes.number.isRequired,
  move: PropTypes.number.isRequired,
  workspaceChange: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  create: state.workspace.stats.create,
  change: state.workspace.stats.change,
  delete: state.workspace.stats.delete,
  move: state.workspace.stats.move,
  workspaceChange: state.workspace.change
});

export default connect(mapStateToProps, null)(withStyles(styles, { withTheme: true })(WorkspaceStats));
