import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getProjects, resetProject } from "../../actions/projectActions";
import { clearMessages } from "../../actions/messageActions";

import { Link, withRouter } from "react-router-dom";

import Breadcrumbs from "../Breadcrumbs";
import BlocklyWindow from "../Blockly/BlocklyWindow";
import Snackbar from "../Snackbar";
import WorkspaceFunc from "../Workspace/WorkspaceFunc";

import withStyles from '@mui/styles/withStyles';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import DeviceSelection from "../DeviceSelection";

const styles = (theme) => ({
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      color: theme.palette.primary.main,
      textDecoration: "underline",
    },
  },
});

class ProjectHome extends Component {
  state = {
    snackbar: false,
    type: "",
    key: "",
    message: "",
  };

  componentDidMount() {
    const type = this.props.location.pathname.replace("/", "");
    if (type === "project" && this.props.user && !this.props.classroomUser) {
      this.props.getProjects(type);
    } else if (type === "gallery") {
      this.props.getProjects(type);
    }
    this.handleMessages(this.props.message, type);
  }

<<<<<<< Updated upstream
  componentDidUpdate(props) {
    if (props.location.pathname !== this.props.location.pathname) {
=======
  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
>>>>>>> Stashed changes
      this.setState({ snackbar: false });
      this.props.getProjects(this.props.location.pathname.replace("/", ""));
    }
    if (prevProps.message !== this.props.message) {
      this.handleMessages(this.props.message, this.props.location.pathname.replace("/", ""));
    }
  }

  componentWillUnmount() {
    this.props.resetProject();
    this.props.clearMessages();
  }

  handleMessages(message, type) {
    if (message) {
      if (message.id === "PROJECT_DELETE_SUCCESS") {
        this.setState({
          snackbar: true,
          key: Date.now(),
          message: `Dein Projekt wurde erfolgreich gelöscht.`,
          type: "success",
        });
      } else if (message.id === "GALLERY_DELETE_SUCCESS") {
        this.setState({
          snackbar: true,
          key: Date.now(),
          message: `Dein Galerie-Projekt wurde erfolgreich gelöscht.`,
          type: "success",
        });
      } else if (message.id === "GET_PROJECT_FAIL") {
        this.setState({
          snackbar: true,
          key: Date.now(),
          message: `Dein angefragtes ${type === "gallery" ? "Galerie-" : ""}Projekt konnte nicht gefunden werden.`,
          type: "error",
        });
      }
    }
  }

  renderProjects(projects, data) {
    return projects.map((project, i) => (
      <Grid item xs={12} sm={6} md={4} xl={3} key={i}>
        <Paper style={{ padding: "1rem", position: "relative", overflow: "hidden" }}>
          <Link to={`/${data === "Projekte" ? "project" : "gallery"}/${project._id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <h3 style={{ marginTop: 0 }}>{project.title}</h3>
            <Divider style={{ marginTop: "1rem", marginBottom: "10px" }} />
            <Typography variant="body2" style={{ fontStyle: "italic", margin: 0, marginTop: "-10px" }}>
              {project.description}
            </Typography>
          </Link>
          {this.props.user && this.props.user.email === project.creator && (
            <div>
              <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
              <div style={{ float: "right" }}>
                <WorkspaceFunc multiple project={project} projectType={this.props.location.pathname.replace("/", "")} />
              </div>
            </div>
          )}
        </Paper>
      </Grid>
    ));
  }

  render() {
    const data = this.props.location.pathname === "/project" ? "Projekte" : "Galerie";
    const { user, projects, classroomUser, classroomProjects, progress } = this.props;
    
    return (
      <div>
        <Breadcrumbs content={[{ link: this.props.location.pathname, title: data }]} />

        <h1>{data}</h1>
        <DeviceSelection />
        {progress ? (
          <Backdrop open invisible>
            <CircularProgress color="primary" />
          </Backdrop>
        ) : (
          <div>
            {!classroomUser && user && projects.length > 0 && (
              <Grid container spacing={2}>
                {this.renderProjects(projects, data)}
              </Grid>
            )}
            {classroomUser && classroomProjects.length > 0 && (
              <Grid container spacing={2}>
                {this.renderProjects(classroomProjects, data)}
              </Grid>
            )}
            {(!classroomUser && projects.length === 0) || (classroomUser && classroomProjects.length === 0) ? (
              <div>
                <Typography style={{ marginBottom: "10px" }}>
                  Es sind aktuell keine Projekte vorhanden.
                </Typography>
                {this.props.location.pathname.replace("/", "") === "project" && (
                  <Typography>
                    Erstelle jetzt dein{" "}
                    <Link to={"/"} className={this.props.classes.link}>
                      eigenes Projekt
                    </Link>{" "}
                    oder lasse dich von Projektbeispielen in der{" "}
                    <Link to={"/gallery"} className={this.props.classes.link}>
                      Galerie
                    </Link>{" "}
                    inspirieren.
                  </Typography>
                )}
              </div>
            ) : null}
          </div>
        )}
        <Snackbar open={this.state.snackbar} message={this.state.message} type={this.state.type} key={this.state.key} />
      </div>
    );
  }
}

ProjectHome.propTypes = {
  getProjects: PropTypes.func.isRequired,
  resetProject: PropTypes.func.isRequired,
  clearMessages: PropTypes.func.isRequired,
  projects: PropTypes.array.isRequired,
  classroomProjects: PropTypes.array,
  progress: PropTypes.bool.isRequired,
  user: PropTypes.object,
  message: PropTypes.object.isRequired,
  classroomUser: PropTypes.object,
};

const mapStateToProps = (state) => ({
  projects: state.project.projects,
  classroomProjects: state.classroomAuth.classroomUser ? state.classroomAuth.classroomUser.projects : [],
  progress: state.project.progress,
  user: state.auth.user,
  message: state.message,
  classroomUser: state.classroomAuth.classroomUser,
});

export default connect(mapStateToProps, {
  getProjects,
  resetProject,
  clearMessages,
})(withStyles(styles, { withTheme: true })(withRouter(ProjectHome)));
