import React, { Component } from "react";

import Dialog from "../Dialog";

import hardware from "../../data/hardware.json";

import withStyles from '@mui/styles/withStyles';
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpandAlt } from "@fortawesome/free-solid-svg-icons";
import * as Blockly from "blockly";
import { isWidthDown } from "@material-ui/core";

// FIXME checkout https://mui.com/components/use-media-query/#migrating-from-withwidth
const withWidth = () => (WrappedComponent) => (props) => <WrappedComponent {...props} width="xs" />;

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
  multiImageListItem: {
    background: theme.palette.primary.main,
    opacity: 0.9,
    height: "30px",
  },
  multiImageListItemTitle: {
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

        <ImageList rowHeight={100} cols={cols} gap={10}>
          {this.props.picture.map((picture, i) => {
            var hardwareInfo = hardware.filter(
              (hardware) => hardware.id === picture
            )[0];
            return (
              <ImageListItem key={i}>
                <div style={{ margin: "auto", width: "max-content" }}>
                  <img
                    src={`/media/hardware/${hardwareInfo.src}`}
                    alt={hardwareInfo.name}
                    height={100}
                    style={{ cursor: "pointer" }}
                    onClick={() => this.handleClickOpen(hardwareInfo)}
                  />
                </div>
                <ImageListItemBar
                  classes={{ root: this.props.classes.multiImageListItem }}
                  title={
                    <div
                      style={{ overflow: "hidden", textOverflow: "ellipsis" }}
                      className={this.props.classes.multiImageListItemTitle}
                    >
                      {hardwareInfo.name}
                    </div>
                  }
                  actionIcon={
                    <IconButton
                      className={this.props.classes.expand}
                      aria-label="Vollbild"
                      onClick={() => this.handleClickOpen(hardwareInfo)}
                      size="large">
                      <FontAwesomeIcon icon={faExpandAlt} size="xs" />
                    </IconButton>
                  }
                />
              </ImageListItem>
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
              underline="hover">
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
