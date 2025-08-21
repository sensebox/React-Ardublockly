import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { shareProject } from "../../../actions/projectActions";
import { clearMessages } from "../../../actions/messageActions";
import QRCode from "qrcode.react";
import { createId } from "mnemonic-id";

import moment from "moment";

import Dialog from "../../ui/Dialog";
import Snackbar from "../../Snackbar";

// import { Link } from "react-router-dom";

import GridLoader from "react-spinners/GridLoader";
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  EmailIcon,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import withStyles from "@mui/styles/withStyles";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import {
  faShareAlt,
  faCopy,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as Blockly from "blockly/core";

const styles = (theme) => ({
  iconButton: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    width: "40px",
    height: "40px",
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  },
  button: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    borderRadius: 20,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      color: theme.palette.primary.main,
      textDecoration: "underline",
    },
  },
});

class ShareProject extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      snackbar: false,
      type: "",
      key: "",
      message: "",
      title: "",
      content: "",
      open: false,
      id: "",
      shortLink: "",
      isFetching: false,
      loading: false,
    };
  }

  componentDidUpdate(props) {
    if (this.props.message !== props.message) {
      if (
        this.props.message.id === "SHARE_SUCCESS" &&
        (!this.props.multiple ||
          this.props.message.status === this.props.project._id)
      ) {
        this.createShortlink(this.props.message.status);
        this.setState({
          share: true,
          open: true,
          title: Blockly.Msg.messages_SHARE_SUCCESS,
          id: this.props.message.status,
        });
      } else if (
        this.props.message.id === "SHARE_FAIL" &&
        (!this.props.multiple ||
          this.props.message.status === this.props.project._id)
      ) {
        this.setState({
          snackbar: true,
          key: Date.now(),
          message: Blockly.Msg.messages_SHARE_FAIL,
          type: "error",
        });
        window.scrollTo(0, 0);
      }
    }
  }

  componentWillUnmount() {
    this.props.clearMessages();
  }

  toggleDialog = () => {
    this.setState({ open: !this.state, title: "", content: "" });
  };

  shareBlocks = () => {
    if (this.props.projectType === "project" && this.props.project.shared) {
      // project is already shared
      this.setState({
        open: true,
        title: Blockly.Msg.messages_SHARE_SUCCESS,
        id: this.props.project._id,
      });
    } else {
      this.props.shareProject(
        this.props.name || this.props.project.title,
        this.props.projectType,
        this.props.project ? this.props.project._id : undefined,
      );
    }
  };

  createShortlink(id) {
    this.setState({ isFetching: true, loading: true });
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: `blockly-${createId(5)}`,
        url: `${window.location.origin}/share/${id}`,
      }),
    };
    fetch("https://www.snsbx.de/api/shorty", requestOptions)
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          shortLink: data[0].link,
          isFetching: false,
          loading: false,
        }),
      );
  }

  downloadQRCode = () => {
    // Generate download with use canvas and stream
    const canvas = document.getElementById("qr-gen");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${this.state.shortLink}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  render() {
    return (
      <div style={this.props.style}>
        <Tooltip title={Blockly.Msg.tooltip_share_project} arrow>
          <IconButton
            className={`shareBlocks ${this.props.classes.iconButton}`}
            onClick={() => this.shareBlocks()}
            size="large"
          >
            <FontAwesomeIcon icon={faShareAlt} size="xs" />
          </IconButton>
        </Tooltip>

        <Snackbar
          open={this.state.snackbar}
          message={this.state.message}
          type={this.state.type}
          key={this.state.key}
        />
        <Dialog
          open={this.state.open}
          title={this.state.title}
          content={this.state.content}
          onClose={this.toggleDialog}
          onClick={this.toggleDialog}
          button={Blockly.Msg.button_close}
        >
          {this.state.isFetching ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <GridLoader
                color={"#4EAF47"}
                loading={this.state.loading}
                size={50}
              />
            </div>
          ) : (
            <div style={{ marginTop: "10px" }}>
              <Typography>
                Über den folgenden Link kannst du dein Programm teilen:
              </Typography>
              <div style={{ textAlign: "center" }}>
                <a
                  href={this.state.shortLink}
                  onClick={() => this.toggleDialog()}
                  className={this.props.classes.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {this.state.shortLink}
                </a>
                <Tooltip
                  title={Blockly.Msg.tooltip_copy_link}
                  arrow
                  style={{ marginRight: "5px" }}
                >
                  <IconButton
                    onClick={() => {
                      navigator.clipboard.writeText(this.state.shortLink);
                      this.setState({
                        snackbar: true,
                        key: Date.now(),
                        message: Blockly.Msg.messages_copylink_success,
                        type: "success",
                      });
                    }}
                    size="large"
                  >
                    <FontAwesomeIcon icon={faCopy} size="xs" />
                  </IconButton>
                </Tooltip>
              </div>
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <QRCode
                  id="qr-gen"
                  value={this.state.shortLink}
                  size={256}
                  level={"L"}
                  includeMargin={false}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <Button
                  className={`download QR Code ${this.props.classes.button}`}
                  onClick={() => this.downloadQRCode()}
                  variant="contained"
                  startIcon={<FontAwesomeIcon icon={faDownload} size="xs" />}
                >
                  Download QR code
                </Button>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <FacebookShareButton
                  url={this.state.shortLink}
                  quote={"I created this sketch for my senseBox. Have a look!"}
                  hashtag={"#senseBox"}
                >
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton
                  url={this.state.shortLink}
                  title={"I created this sketch for my senseBox. Have a look!"}
                  hashtags={["senseBox", "Blockly", "citizenScience"]}
                >
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
                <WhatsappShareButton
                  url={this.state.shortLink}
                  title={
                    "Look at my SenseBox sketch that I created with Blockly!"
                  }
                  separator={": "}
                >
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>
                <EmailShareButton
                  url={this.state.shortLink}
                  subject={"SenseBox Blockly Sketch"}
                  body={"I created this sketch for my senseBox. Have a look!"}
                  separator={": "}
                >
                  <EmailIcon size={32} round />
                </EmailShareButton>
              </div>
              {this.props.project &&
              this.props.project.shared &&
              this.props.message.id !== "SHARE_SUCCESS" ? (
                <Typography variant="body2" style={{ marginTop: "20px" }}>
                  {`Das Projekt wurde bereits geteilt. Der Link ist noch mindestens ${
                    moment(this.props.project.shared).diff(
                      moment().utc(),
                      "days",
                    ) === 0
                      ? moment(this.props.project.shared).diff(
                          moment().utc(),
                          "hours",
                        ) === 0
                        ? `${moment(this.props.project.shared).diff(
                            moment().utc(),
                            "minutes",
                          )} Minuten`
                        : `${moment(this.props.project.shared).diff(
                            moment().utc(),
                            "hours",
                          )} Stunden`
                      : `${moment(this.props.project.shared).diff(
                          moment().utc(),
                          "days",
                        )} Tage`
                  } gültig.`}
                </Typography>
              ) : (
                <Typography variant="body2" style={{ marginTop: "20px" }}>
                  {`Der Link ist nun ${import.meta.env.VITE_SHARE_LINK_EXPIRES} Tage gültig.`}
                </Typography>
              )}
            </div>
          )}
        </Dialog>
      </div>
    );
  }
}

ShareProject.propTypes = {
  shareProject: PropTypes.func.isRequired,
  clearMessages: PropTypes.func.isRequired,
  name: PropTypes.string,
  message: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  name: state.workspace.name,
  message: state.message,
});

export default connect(mapStateToProps, { shareProject, clearMessages })(
  withStyles(styles, { withTheme: true })(ShareProject),
);
