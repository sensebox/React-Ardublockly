import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import { faPuzzlePiece, faTrash, faPlus, faPen } from "@fortawesome/free-solid-svg-icons";
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
    // var check = Object.keys(this.props.newWorkspace).length > 0 && this.props.create - this.props.delete !== this.props.newWorkspace.getAllBlocks().length ?  <h1>FEHLER!</h1> : null;
    return (
      <div style={{marginBottom: '20px'}}>
        <Tooltip title="Anzahl aktueller Blöcke" style={{marginLeft: 0}} className={this.props.classes.stats}>
          <div>
            <FontAwesomeIcon icon={faPuzzlePiece} />
            <Typography style={{display: 'inline'}}> {Object.keys(this.props.newWorkspace).length > 0 ? this.props.newWorkspace.getAllBlocks().length : 0}</Typography>
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
        <Tooltip title="Anzahl gelöschter Blöcke" className={this.props.classes.stats}>
          <div>
            <FontAwesomeIcon icon={faTrash} style={{marginRight: '5px'}}/>
            <FontAwesomeIcon icon={faPuzzlePiece} />
            <Typography style={{display: 'inline'}}> {this.props.delete}</Typography>
          </div>
        </Tooltip>
        {Object.keys(this.props.newWorkspace).length > 0 ? this.props.newWorkspace.remainingCapacity() !== Infinity ?
          <Tooltip title="verbleibende Blöcke" className={this.props.classes.stats}>
            <Typography style={{display: 'inline'}}>{this.props.delete} verbleibende Blöcke</Typography>
          </Tooltip> : null : null}
      </div>
    );
  };
}

WorkspaceStats.propTypes = {
  newWorkspace: PropTypes.object.isRequired,
  create: PropTypes.number.isRequired,
  change: PropTypes.number.isRequired,
  delete: PropTypes.number.isRequired,
  test: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  newWorkspace: state.workspace.new,
  create: state.workspace.stats.create,
  change: state.workspace.stats.change,
  delete: state.workspace.stats.delete,
  test: state.workspace.test
});

export default connect(mapStateToProps, null)(withStyles(styles, {withTheme: true})(WorkspaceStats));
