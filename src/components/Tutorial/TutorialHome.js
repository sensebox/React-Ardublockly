import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getTutorials,
  getAllTutorials,
  getUserTutorials,
  resetTutorial,
  tutorialProgress,
} from "../../actions/tutorialActions";
import { progress } from "../../actions/tutorialBuilderActions";

import { clearMessages } from "../../actions/messageActions";

import clsx from "clsx";

import Breadcrumbs from "../Breadcrumbs";

import { Link } from "react-router-dom";
import { alpha } from "@mui/material/styles";
import withStyles from '@mui/styles/withStyles';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import {
  faCheck,
  faTimes,
  faShareAlt,
  faEye,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Blockly from "blockly";
import ReactStars from "react-rating-stars-component";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Snackbar from "../Snackbar";
import Divider from "@mui/material/Divider";
import DeviceSelection from "../DeviceSelection";

const styles = (theme) => ({
  outerDiv: {
    position: "absolute",
    right: "-30px",
    bottom: "-30px",
    width: "160px",
    height: "160px",
    color: alpha(theme.palette.secondary.main, 0.6),
  },
  outerDivError: {
    stroke: alpha(theme.palette.error.dark, 0.6),
    color: alpha(theme.palette.error.dark, 0.6),
  },
  outerDivSuccess: {
    stroke: alpha(theme.palette.primary.main, 0.6),
    color: alpha(theme.palette.primary.main, 0.6),
  },
  outerDivOther: {
    stroke: alpha(theme.palette.secondary.main, 0.6),
  },
  innerDiv: {
    width: "inherit",
    height: "inherit",
    display: "table-cell",
    verticalAlign: "middle",
    textAlign: "center",
  },
  button: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    width: "40px",
    height: "40px",
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
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

class TutorialHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userTutorials: [],
      tutorials: [],
      snackbar: false,
    };
  }

  componentDidMount() {
    this.props.tutorialProgress();
    // retrieve tutorials only if a potential user is loaded - authentication
    // is finished (success or failed)
    // if (!this.props.progress) {
    //   if (this.props.user) {
    //     if (this.props.user.blocklyRole === "admin") {
    //       this.props.getAllTutorials();
    //     }
    //     if (this.props.user.blocklyRole === "creator") {
    //       this.props.getUserTutorials();
    //       this.props.getTutorials();
    //       console.log("get user tutorials");
    //       console.log(this.props.userTutorials);
    //     }
    //   } else {
    //     this.props.getTutorials();
    //   }
    // }
    if (!this.props.authProgress) {
      if (this.props.user) {
        if (this.props.user.role === "admin") {
          this.props.getAllTutorials();
        } else {
          this.props.getUserTutorials();
          //this.props.getTutorials();
        }
      } else {
        this.props.getTutorials();
      }
    }
  }

  componentDidUpdate(props, state) {
    if (
      props.authProgress !== this.props.authProgress &&
      !this.props.authProgress
    )
      if (this.props.user) {
        if (this.props.user.role === "admin") {
          // authentication is completed
          this.props.getAllTutorials();
        } else {
          this.props.getUserTutorials();
        }
      } else {
        this.props.getTutorials();
      }

    if (this.props.message.id === "GET_TUTORIALS_FAIL") {
      alert(this.props.message.msg);
    }
  }

  componentWillUnmount() {
    this.props.resetTutorial();
    if (this.props.message.msg) {
      this.props.clearMessages();
    }
  }

  render() {
    var userTutorials = [];
    const publicTutorials = this.props.tutorials.filter(
      (tutorial) => tutorial.public === true
    );
    if (this.props.user && this.props.user.blocklyRole === "admin") {
      userTutorials = this.props.tutorials;
    }
    if (this.props.user && this.props.user.blocklyRole === "creator") {
      userTutorials = this.props.tutorials.filter(
        (tutorial) => tutorial.creator === this.props.user.email
      );
    }
    return this.props.isLoading ? null : (
      <div>
        <Breadcrumbs content={[{ link: "/tutorial", title: "Tutorial" }]} />
        <h1>{Blockly.Msg.tutorials_home_head}</h1>
        <h2>Alle Tutorials</h2>
        <Grid container spacing={2}>
          {publicTutorials.map((tutorial, i) => {
            var status = this.props.status.filter(
              (status) => status._id === tutorial._id
            )[0];
            var tasks = status.tasks;
            var error =
              status.tasks.filter((task) => task.type === "error").length > 0;
            var success =
              status.tasks.filter((task) => task.type === "success").length /
              tasks.length;
            var tutorialStatus =
              success === 1 ? "Success" : error ? "Error" : "Other";
            const firstExample = {
              size: 30,
              value: tutorial.difficulty,
              edit: false,
              isHalf: true,
            };
            return (
              <Grid item xs={12} sm={6} md={4} xl={3} key={i} style={{}}>
                <Link
                  to={`/tutorial/${tutorial._id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Paper
                    style={{
                      height: "150px",
                      padding: "10px",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {tutorial.title}
                    <ReactStars {...firstExample} />
                    <div
                      className={clsx(this.props.classes.outerDiv)}
                      style={{ width: "160px", height: "160px", border: 0 }}
                    >
                      <svg style={{ width: "100%", height: "100%" }}>
                        {error || success === 1 ? (
                          <circle
                            className={
                              error
                                ? this.props.classes.outerDivError
                                : this.props.classes.outerDivSuccess
                            }
                            style={{
                              transform: "rotate(-44deg)",
                              transformOrigin: "50% 50%",
                            }}
                            r="75"
                            cx="50%"
                            cy="50%"
                            fill="none"
                            stroke-width="10"
                          ></circle>
                        ) : (
                          <circle
                            className={this.props.classes.outerDivOther}
                            style={{
                              transform: "rotate(-44deg)",
                              transformOrigin: "50% 50%",
                            }}
                            r="75"
                            cx="50%"
                            cy="50%"
                            fill="none"
                            stroke-width="10"
                            stroke-dashoffset={`${75 * 2 * Math.PI * (1 - (50 / 100 + success / 2))
                              }`}
                            stroke-dasharray={`${75 * 2 * Math.PI * (1 - (50 / 100 - success / 2))
                              } ${75 * 2 * Math.PI * (1 - (50 / 100 + success / 2))
                              }`}
                          ></circle>
                        )}
                        {success < 1 && !error ? (
                          <circle
                            className={this.props.classes.outerDivSuccess}
                            style={{
                              transform: "rotate(-44deg)",
                              transformOrigin: "50% 50%",
                            }}
                            r="75"
                            cx="50%"
                            cy="50%"
                            fill="none"
                            stroke-width="10"
                            stroke-dashoffset={`${75 * 2 * Math.PI * (1 - (50 / 100 + success / 2))
                              }`}
                            stroke-dasharray={`${75 * 2 * Math.PI}`}
                          ></circle>
                        ) : null}
                      </svg>
                    </div>
                    <div
                      className={clsx(
                        this.props.classes.outerDiv,
                        tutorialStatus === "Error"
                          ? this.props.classes.outerDivError
                          : tutorialStatus === "Success"
                            ? this.props.classes.outerDivSuccess
                            : null
                      )}
                    >
                      <div className={this.props.classes.innerDiv}>
                        {error || success === 1 ? (
                          <FontAwesomeIcon
                            size="4x"
                            icon={
                              tutorialStatus === "Success" ? faCheck : faTimes
                            }
                          />
                        ) : (
                          <Typography
                            variant="h3"
                            className={
                              success > 0
                                ? this.props.classes.outerDivSuccess
                                : {}
                            }
                          >
                            {Math.round(success * 100)}%
                          </Typography>
                        )}
                      </div>
                    </div>
                  </Paper>
                </Link>
              </Grid>
            );
          })}
        </Grid>
        <DeviceSelection />
        {this.props.user ? (
          <div>
            <h2>User Tutorials</h2>
            <Grid container spacing={2}>
              {userTutorials.map((tutorial, i) => {
                var status = this.props.status.filter(
                  (status) => status._id === tutorial._id
                )[0];
                var tasks = status.tasks;
                var error =
                  status.tasks.filter((task) => task.type === "error").length >
                  0;
                var success =
                  status.tasks.filter((task) => task.type === "success")
                    .length / tasks.length;
                var tutorialStatus =
                  success === 1 ? "Success" : error ? "Error" : "Other";
                const firstExample = {
                  size: 30,
                  value: tutorial.difficulty,
                  edit: false,
                  isHalf: true,
                };
                return (
                  <Grid item xs={12} sm={6} md={4} xl={3} key={i} style={{}}>
                    <Paper
                      style={{
                        height: "150",
                        padding: "10px",
                        position: "relative",
                        overflow: "hidden",
                        backgroundColor: tutorial.review
                          ? "lightyellow"
                          : "white",
                      }}
                    >
                      <Link
                        to={`/tutorial/${tutorial._id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {tutorial.title}
                        <ReactStars {...firstExample} />
                      </Link>
                      <Divider
                        style={{
                          marginTop: "10px",
                          marginBottom: "10px",
                        }}
                      />
                      <p>
                        Creator:{tutorial.creator} <br />
                        <div style={this.props.style}>
                          <Tooltip
                            title={Blockly.Msg.tooltip_share_tutorial}
                            arrow
                          >
                            <IconButton
                              className={`shareTutorial ${this.props.classes.button}`}
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `${window.location.origin}/tutorial/${tutorial._id}`
                                );
                                this.setState({
                                  snackbar: true,
                                  key: Date.now(),
                                  message:
                                    Blockly.Msg.messages_copylink_success,
                                  type: "success",
                                });
                              }}
                              size="large">
                              <FontAwesomeIcon icon={faShareAlt} size="xs" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip
                            title={Blockly.Msg.tooltip_share_tutorial}
                            arrow
                          >
                            <IconButton
                              className={`publicTutorial ${this.props.classes.button}`}
                              disabled={!tutorial.public}
                              size="large">
                              <FontAwesomeIcon icon={faEye} size="xs" />
                            </IconButton>
                          </Tooltip>
                          {tutorial.review ? (
                            <Tooltip
                              title={Blockly.Msg.tooltip_share_tutorial}
                              arrow
                            >
                              <IconButton
                                className={`publicTutorial ${this.props.classes.button}`}
                                disabled={!tutorial.review}
                                size="large">
                                <FontAwesomeIcon icon={faUserCheck} size="xs" />
                              </IconButton>
                            </Tooltip>
                          ) : null}
                          <Snackbar
                            open={this.state.snackbar}
                            message={Blockly.Msg.messages_copylink_success}
                            type={this.state.type}
                            key={this.state.key}
                          />
                        </div>
                      </p>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </div>
        ) : null}
      </div>
    );
  }
}

TutorialHome.propTypes = {
  getTutorials: PropTypes.func.isRequired,
  getAllTutorials: PropTypes.func.isRequired,
  getUserTutorials: PropTypes.func.isRequired,
  resetTutorial: PropTypes.func.isRequired,
  tutorialProgress: PropTypes.func.isRequired,
  clearMessages: PropTypes.func.isRequired,
  status: PropTypes.array.isRequired,
  change: PropTypes.number.isRequired,
  tutorials: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  message: PropTypes.object.isRequired,
  progress: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  authProgress: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  change: state.tutorial.change,
  status: state.tutorial.status,
  tutorials: state.tutorial.tutorials,
  userTutorials: state.tutorial.userTutorials,
  isLoading: state.tutorial.progress,
  message: state.message,
  progress: state.auth.progress,
  user: state.auth.user,
  authProgress: state.auth.progress,
});

export default connect(mapStateToProps, {
  getTutorials,
  progress,
  getUserTutorials,
  getAllTutorials,
  resetTutorial,
  clearMessages,
  tutorialProgress,
})(withStyles(styles, { withTheme: true })(TutorialHome));
