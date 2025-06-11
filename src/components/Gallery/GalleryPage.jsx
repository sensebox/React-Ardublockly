// src/components/Gallery/GalleryPage.jsx
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getProjects, resetProject } from "../../actions/projectActions";
import { clearMessages } from "../../actions/messageActions";

import Breadcrumbs from "../Breadcrumbs";
import Snackbar from "../Snackbar";
import WorkspaceFunc from "../Workspace/WorkspaceFunc";
import withStyles from "@mui/styles/withStyles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import DeviceSelection from "../DeviceSelection";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Image from "@mui/material/ImageListItem";

const styles = (theme) => ({
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
});

class GalleryPage extends Component {
  state = {
    snackbar: false,
    type: "",
    key: "",
    message: "",
  };

  componentDidMount() {
    this.props.getProjects("gallery");
    if (this.props.message) {
      if (this.props.message.id === "GALLERY_DELETE_SUCCESS") {
        this.setState({
          snackbar: true,
          key: Date.now(),
          message: `Dein Galerie-Projekt wurde erfolgreich gelöscht.`,
          type: "success",
        });
      } else if (this.props.message.id === "GET_PROJECT_FAIL") {
        this.setState({
          snackbar: true,
          key: Date.now(),
          message: `Dein angefragtes Galerie-Projekt konnte nicht gefunden werden.`,
          type: "error",
        });
      }
    }
  }

  componentWillUnmount() {
    this.props.resetProject();
    this.props.clearMessages();
  }

  render() {
    return (
      <Box>
        <Breadcrumbs content={[{ link: "/gallery", title: "Galerie" }]} />

        <Typography variant="h4" gutterBottom>
          Galerie
        </Typography>
        <DeviceSelection />
        {this.props.progress ? (
          <Backdrop open invisible>
            <CircularProgress color="primary" />
          </Backdrop>
        ) : (
          <Box mt={2}>
            {this.props.projects.length > 0 ? (
              <Grid container spacing={3}>
                {this.props.projects.map((project, i) => (
                  <Grid item xs={12} sm={6} md={4} xl={3} key={i}>
                    <Card
                      elevation={3}
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <CardHeader
                        avatar={
                          <Avatar aria-label="creator">
                            {project.title.charAt(0).toUpperCase()}
                          </Avatar>
                        }
                        title={project.title}
                        subheader={project.creator}
                      />
                      {/* Vorschau Bild (Platzhalter oder project.thumbnail falls vorhanden) */}
                      <Box
                        sx={{
                          height: 140,
                          backgroundColor: "#f5f5f5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Vorschau folgt{" "}
                          {/* Optional: Bild oder generierter Screenshot */}
                        </Typography>
                      </Box>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontStyle: "italic", mb: 1 }}
                        >
                          {project.description}
                        </Typography>
                        {/* Tags / Kategorien */}
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {(project.tags || ["Experiment", "Sensor"]).map(
                            (tag, idx) => (
                              <Chip
                                key={idx}
                                label={tag}
                                size="small"
                                variant="outlined"
                              />
                            ),
                          )}
                          {project.category && (
                            <Chip
                              label={project.category}
                              size="small"
                              color="primary"
                              variant="filled"
                            />
                          )}
                        </Stack>
                      </CardContent>
                      <CardActions
                        disableSpacing
                        sx={{ justifyContent: "space-between" }}
                      >
                        <Tooltip title="Ansehen">
                          <IconButton
                            component={Link}
                            to={`/gallery/${project._id}`}
                            size="large"
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        {this.props.user &&
                          this.props.user.email === project.creator && (
                            <WorkspaceFunc
                              multiple
                              project={project}
                              projectType="gallery"
                            />
                          )}
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography>
                Es sind aktuell keine Galerie-Projekte vorhanden.
              </Typography>
            )}
          </Box>
        )}
        <Snackbar
          open={this.state.snackbar}
          message={this.state.message}
          type={this.state.type}
          key={this.state.key}
        />
      </Box>
    );
  }
}

GalleryPage.propTypes = {
  getProjects: PropTypes.func.isRequired,
  resetProject: PropTypes.func.isRequired,
  clearMessages: PropTypes.func.isRequired,
  projects: PropTypes.array.isRequired,
  progress: PropTypes.bool.isRequired,
  user: PropTypes.object,
  message: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  projects: state.project.projects,
  progress: state.project.progress,
  user: state.auth.user,
  message: state.message,
});

export default connect(mapStateToProps, {
  getProjects,
  resetProject,
  clearMessages,
})(withStyles(styles, { withTheme: true })(GalleryPage));
