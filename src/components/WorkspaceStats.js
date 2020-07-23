import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as Blockly from 'blockly/core';

import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import { faPuzzlePiece, faTrash, faPlus, faPen, faArrowsAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const styles = (theme) => ({
  stats: {
    backgroundColor: theme.palette.primary.main,
    display: 'inline',
    marginLeft: '50px',
    padding: '3px 10px',
    borderRadius: '25%'
  }
});

class WorkspaceStats extends Component {

  render() {
    const workspace = Blockly.getMainWorkspace();
    const remainingBlocksInfinity = workspace ? workspace.remainingCapacity() !== Infinity : null;
    return (
      <div style={{marginBottom: '20px'}}>
        <Tooltip title="Anzahl aktueller Blöcke" style={{marginLeft: 0}} className={this.props.classes.stats}>
          <div>
            <FontAwesomeIcon icon={faPuzzlePiece} />
            <Typography style={{display: 'inline'}}> {workspace ? workspace.getAllBlocks().length : 0}</Typography>
          </div>
        </Tooltip>
        <Tooltip title="Anzahl neuer Blöcke" className={this.props.classes.stats}>
          <div>
            <FontAwesomeIcon icon={faPlus} style={{marginRight: '5px'}}/>
            <FontAwesomeIcon icon={faPuzzlePiece} />
            <Typography style={{display: 'inline'}}> {this.props.create}</Typography>
          </div>
        </Tooltip>
        <Tooltip title="Anzahl veränderter Blöcke" className={this.props.classes.stats}>
          <div>
            <FontAwesomeIcon icon={faPen} style={{marginRight: '5px'}}/>
            <FontAwesomeIcon icon={faPuzzlePiece} />
            <Typography style={{display: 'inline'}}> {this.props.change}</Typography>
          </div>
        </Tooltip>
        <Tooltip title="Anzahl bewegter Blöcke" className={this.props.classes.stats}>
          <div>
            <FontAwesomeIcon icon={faArrowsAlt} style={{marginRight: '5px'}}/>
            <FontAwesomeIcon icon={faPuzzlePiece} />
            <Typography style={{display: 'inline'}}> {this.props.move}</Typography>
          </div>
        </Tooltip>
        <Tooltip title="Anzahl gelöschter Blöcke" className={this.props.classes.stats}>
          <div>
            <FontAwesomeIcon icon={faTrash} style={{marginRight: '5px'}}/>
            <FontAwesomeIcon icon={faPuzzlePiece} />
            <Typography style={{display: 'inline'}}> {this.props.delete}</Typography>
          </div>
        </Tooltip>
        {remainingBlocksInfinity ?
          <Tooltip title="verbleibende Blöcke" className={this.props.classes.stats}>
            <Typography style={{display: 'inline'}}>{workspace.remainingCapacity()} verbleibende Blöcke</Typography>
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
  worskpaceChange: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  create: state.workspace.stats.create,
  change: state.workspace.stats.change,
  delete: state.workspace.stats.delete,
  move: state.workspace.stats.move,
  worskpaceChange: state.workspace.change
});

export default connect(mapStateToProps, null)(withStyles(styles, {withTheme: true})(WorkspaceStats));
