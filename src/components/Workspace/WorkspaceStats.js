import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as Blockly from 'blockly/core';

import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Popover from '@material-ui/core/Popover';

import { faPuzzlePiece, faTrash, faPlus, faPen, faArrowsAlt, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const styles = (theme) => ({
  stats: {
    backgroundColor: theme.palette.primary.main,
    display: 'inline',
    marginLeft: '50px',
    padding: '3px 10px',
    // borderRadius: '25%'
  },
  menu: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    width: '40px',
    height: '40px',
    '&:hover': {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.primary.main,
    }
  }
});

class WorkspaceStats extends Component {

  state = {
    anchor: null
  }

  handleClose = () => {
    this.setState({ anchor: null });
  }

  handleClick = (event) => {
    this.setState({ anchor: event.currentTarget });
  };

  render() {

    const bigDisplay = !isWidthDown('sm', this.props.width);
    const workspace = Blockly.getMainWorkspace();
    const remainingBlocksInfinity = workspace ? workspace.remainingCapacity() !== Infinity : null;
    const stats = <div style={bigDisplay ? { display: 'flex' } : { display: 'inline' }}>
      <Tooltip title="Anzahl aktueller Blöcke" arrow>
        <Chip
          style={bigDisplay ? { marginRight: '1rem' } : { marginRight: '1rem', marginBottom: '5px' }}
          color="primary"
          avatar={<Avatar><FontAwesomeIcon icon={faPuzzlePiece} /></Avatar>}
          label={workspace ? workspace.getAllBlocks().length : 0}>
        </Chip>
      </Tooltip>
      <Tooltip title="Anzahl neuer Blöcke" arrow>
        <Chip
          style={bigDisplay ? { marginRight: '1rem' } : { marginRight: '1rem', marginBottom: '5px' }}
          color="primary"
          avatar={<Avatar><FontAwesomeIcon icon={faPlus} /></Avatar>}
          label={this.props.create > 0 ? this.props.create : 0}> {/* initialXML is created automatically, Block is not part of the statistics */}
        </Chip>
      </Tooltip>
      <Tooltip title="Anzahl veränderter Blöcke" arrow>
        <Chip
          style={bigDisplay ? { marginRight: '1rem' } : { marginRight: '1rem', marginBottom: '5px' }}
          color="primary"
          avatar={<Avatar><FontAwesomeIcon icon={faPen} /></Avatar>}
          label={this.props.change}>
        </Chip>
      </Tooltip>
      <Tooltip title="Anzahl bewegter Blöcke" arrow>
        <Chip
          style={bigDisplay ? { marginRight: '1rem' } : { marginRight: '1rem', marginBottom: '5px' }}
          color="primary"
          avatar={<Avatar><FontAwesomeIcon icon={faArrowsAlt} /></Avatar>}
          label={this.props.move > 0 ? this.props.move : 0}> {/* initialXML is moved automatically, Block is not part of the statistics */}
        </Chip>
      </Tooltip>
      <Tooltip title="Anzahl gelöschter Blöcke" arrow>
        <Chip
          style={remainingBlocksInfinity ? bigDisplay ? { marginRight: '1rem' } : { marginRight: '1rem', marginBottom: '5px' } : {}}
          color="primary"
          avatar={<Avatar><FontAwesomeIcon icon={faTrash} /></Avatar>}
          label={this.props.delete}>
        </Chip>
      </Tooltip>
      {remainingBlocksInfinity ?
        <Tooltip title="Verbleibende Blöcke" arrow>
          <Chip
            style={bigDisplay ? { marginRight: '1rem' } : { marginRight: '1rem', marginBottom: '5px' }}
            color="primary"
            label={workspace.remainingCapacity()}>
          </Chip>
        </Tooltip> : null}
    </div>
    return (
      bigDisplay ?
        <div style={{ bottom: 0, position: 'absolute' }}>
          {stats}
        </div>
        :
        <div>
          <Tooltip title='Statistiken anzeigen' arrow>
            <IconButton
              className={this.props.classes.menu}
              onClick={(event) => this.handleClick(event)}
            >
              <FontAwesomeIcon icon={faEllipsisH} size="xs" />
            </IconButton>
          </Tooltip>
          <Popover
            open={Boolean(this.state.anchor)}
            anchorEl={this.state.anchor}
            onClose={this.handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            PaperProps={{
              style: { margin: '5px' }
            }}
          >
            <div style={{ margin: '10px' }}>
              {stats}
            </div>
          </Popover>
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

export default connect(mapStateToProps, null)(withStyles(styles, { withTheme: true })(withWidth()(WorkspaceStats)));
