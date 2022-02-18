import React, { Component } from "react";

import Dialog from "../Dialog";

import hardware from "../../data/hardware.json";

import { withStyles } from "@material-ui/core/styles";
import withWidth, { isWidthDown } from "@material-ui/core/withWidth";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ImageList from "@material-ui/core/ImageList";
import ImageListTile from "@material-ui/core/ImageList";
import ImageListTileBar from "@material-ui/core/ImageListItemBar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpandAlt } from "@fortawesome/free-solid-svg-icons";
import * as Blockly from "blockly";
const styles = (theme) => ({
  expand: {
    "&:hover": {
      color: theme.palette.primary.main,
    },
    "&:active": {
      color: theme.palette.primary.main,
    },
    color: theme.palette.text.primary,
  },
  multiImageListTile: {
    background: theme.palette.primary.main,
    opacity: 0.9,
    height: "30px",
  },
  multiImageListTileTitle: {
    color: theme.palette.text.primary,
  },
});

class Hardware extends Component {
  state = {
    open: false,
    hardwareInfo: {},
  };

  handleClickOpen = (hardwareInfo) => {
    this.setState({ open: true, hardwareInfo });
  };

  handleClose = () => {
    this.setState({ open: false, hardwareInfo: {} });
  };

  render() {
    var cols = isWidthDown("md", this.props.width)
      ? isWidthDown("sm", this.props.width)
        ? isWidthDown("xs", this.props.width)
          ? 2
          : 3
        : 4
      : 6;
    return (
      <div style={{ marginTop: "10px", marginBottom: "5px" }}>
        <Typography>{Blockly.Msg.tutorials_hardware_head}</Typography>

        <ImageList rowHeight={100} cols={cols} spacing={10}>
          {this.props.picture.map((picture, i) => {
            var hardwareInfo = hardware.filter(
              (hardware) => hardware.id === picture
            )[0];
            return (
              <ImageListTile key={i}>
                <div style={{ margin: "auto", width: "max-content" }}>
                  <img
                    src={`/media/hardware/${hardwareInfo.src}`}
                    alt={hardwareInfo.name}
                    height={100}
                    style={{ cursor: "pointer" }}
                    onClick={() => this.handleClickOpen(hardwareInfo)}
                  />
                </div>
                <ImageListTileBar
                  classes={{ root: this.props.classes.multiImageListTile }}
                  title={
                    <div
                      style={{ overflow: "hidden", textOverflow: "ellipsis" }}
                      className={this.props.classes.multiImageListTileTitle}
                    >
                      {hardwareInfo.name}
                    </div>
                  }
                  actionIcon={
                    <IconButton
                      className={this.props.classes.expand}
                      aria-label="Vollbild"
                      onClick={() => this.handleClickOpen(hardwareInfo)}
                    >
                      <FontAwesomeIcon icon={faExpandAlt} size="xs" />
                    </IconButton>
                  }
                />
              </ImageListTile>
            );
          })}
        </ImageList>

        <Dialog
          style={{ zIndex: 1500 }}
          open={this.state.open}
          title={`Hardware: ${this.state.hardwareInfo.name}`}
          content={this.state.content}
          onClose={this.handleClose}
          onClick={this.handleClose}
          button={Blockly.Msg.button_close}
        >
          <div>
            <img
              src={`/media/hardware/${this.state.hardwareInfo.src}`}
              width="100%"
              alt={this.state.hardwareInfo.name}
            />
            {Blockly.Msg.tutorials_hardware_moreInformation}{" "}
            <Link
              rel="noreferrer"
              target="_blank"
              href={this.state.hardwareInfo.url}
              color="primary"
            >
              {Blockly.Msg.tutorials_hardware_here}
            </Link>
            .
          </div>
        </Dialog>
      </div>
    );
  }
}

export default withWidth()(withStyles(styles, { withTheme: true })(Hardware));
