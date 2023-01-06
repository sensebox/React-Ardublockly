import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import * as Blockly from "blockly/core";

import withStyles from '@mui/styles/withStyles';
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Popover from "@mui/material/Popover";

import {
  faPuzzlePiece,
  faTrash,
  faPlus,
  faPen,
  faArrowsAlt,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isWidthDown } from "../../helpers/handleBreakpoints";

// FIXME checkout https://mui.com/components/use-media-query/#migrating-from-withwidth
const withWidth = () => (WrappedComponent) => (props) => <WrappedComponent {...props} width="xs" />;

const styles = (theme) => ({
  stats: {
    backgroundColor: theme.palette.primary.main,
    display: "inline",
    marginLeft: "50px",
    padding: "3px 10px",
    // borderRadius: '25%'
  },
  menu: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    width: "40px",
    height: "40px",
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.primary.main,
    },
  },
});

class WorkspaceStats extends Component {
  state = {
    anchor: null,
  };

  handleClose = () => {
    this.setState({ anchor: null });
  };

  handleClick = (event) => {
    this.setState({ anchor: event.currentTarget });
  };

  render() {
    const bigDisplay = !isWidthDown("sm", this.props.width);
    const workspace = Blockly.getMainWorkspace();
    const remainingBlocksInfinity = workspace
      ? workspace.remainingCapacity() !== Infinity
      : null;
    const stats = (
      <div style={bigDisplay ? { display: "flex" } : { display: "inline" }}>
        <Tooltip title={Blockly.Msg.tooltip_statistics_current} arrow>
          <Chip
            style={
              bigDisplay
                ? { marginRight: "1rem" }
                : { marginRight: "1rem", marginBottom: "5px" }
            }
            color="primary"
            avatar={
              <Avatar>
                <FontAwesomeIcon icon={faPuzzlePiece} />
              </Avatar>
            }
            label={workspace ? workspace.getAllBlocks().length : 0}
          ></Chip>
        </Tooltip>
        <Tooltip title={Blockly.Msg.tooltip_statistics_new} arrow>
          <Chip
            style={
              bigDisplay
                ? { marginRight: "1rem" }
                : { marginRight: "1rem", marginBottom: "5px" }
            }
            color="primary"
            avatar={
              <Avatar>
                <FontAwesomeIcon icon={faPlus} />
              </Avatar>
            }
            label={this.props.create > 0 ? this.props.create : 0}
          >
            {" "}
            {/* initialXML is created automatically, Block is not part of the statistics */}
          </Chip>
        </Tooltip>
        <Tooltip title={Blockly.Msg.tooltip_statistics_changed} arrow>
          <Chip
            style={
              bigDisplay
                ? { marginRight: "1rem" }
                : { marginRight: "1rem", marginBottom: "5px" }
            }
            color="primary"
            avatar={
              <Avatar>
                <FontAwesomeIcon icon={faPen} />
              </Avatar>
            }
            label={this.props.change}
          ></Chip>
        </Tooltip>
        <Tooltip title={Blockly.Msg.tooltip_statistics_moved} arrow>
          <Chip
            style={
              bigDisplay
                ? { marginRight: "1rem" }
                : { marginRight: "1rem", marginBottom: "5px" }
            }
            color="primary"
            avatar={
              <Avatar>
                <FontAwesomeIcon icon={faArrowsAlt} />
              </Avatar>
            }
            label={this.props.move > 0 ? this.props.move : 0}
          >
            {" "}
            {/* initialXML is moved automatically, Block is not part of the statistics */}
          </Chip>
        </Tooltip>
        <Tooltip title={Blockly.Msg.tooltip_statistics_deleted} arrow>
          <Chip
            style={
              remainingBlocksInfinity
                ? bigDisplay
                  ? { marginRight: "1rem" }
                  : { marginRight: "1rem", marginBottom: "5px" }
                : {}
            }
            color="primary"
            avatar={
              <Avatar>
                <FontAwesomeIcon icon={faTrash} />
              </Avatar>
            }
            label={this.props.delete}
          ></Chip>
        </Tooltip>
        {remainingBlocksInfinity ? (
          <Tooltip title={Blockly.Msg.tooltip_statistics_remaining} arrow>
            <Chip
              style={
                bigDisplay
                  ? { marginRight: "1rem" }
                  : { marginRight: "1rem", marginBottom: "5px" }
              }
              color="primary"
              label={workspace.remainingCapacity()}
            ></Chip>
          </Tooltip>
        ) : null}
      </div>
    );
    return bigDisplay ? (
      <div style={{ bottom: 0, position: "absolute" }}>{stats}</div>
    ) : (
      <div>
        <Tooltip title={Blockly.Msg.tooltip_statistics_show} arrow>
          <IconButton
            className={this.props.classes.menu}
            onClick={(event) => this.handleClick(event)}
            size="large">
            <FontAwesomeIcon icon={faEllipsisH} size="xs" />
          </IconButton>
        </Tooltip>
        <Popover
          open={Boolean(this.state.anchor)}
          anchorEl={this.state.anchor}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          PaperProps={{
            style: { margin: "5px" },
          }}
        >
          <div style={{ margin: "10px" }}>{stats}</div>
        </Popover>
      </div>
    );
  }
}

WorkspaceStats.propTypes = {
  create: PropTypes.number.isRequired,
  change: PropTypes.number.isRequired,
  delete: PropTypes.number.isRequired,
  move: PropTypes.number.isRequired,
  workspaceChange: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  create: state.workspace.stats.create,
  change: state.workspace.stats.change,
  delete: state.workspace.stats.delete,
  move: state.workspace.stats.move,
  workspaceChange: state.workspace.change,
});

export default connect(
  mapStateToProps,
  null
)(withStyles(styles, { withTheme: true })(withWidth()(WorkspaceStats)));
