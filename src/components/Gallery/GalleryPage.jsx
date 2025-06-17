import { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getProjects, resetProject } from "../../actions/projectActions";
import { clearMessages } from "../../actions/messageActions";
import Breadcrumbs from "../Breadcrumbs";
import Snackbar from "../Snackbar";
import WorkspaceFunc from "../Workspace/WorkspaceFunc";
import withStyles from "@mui/styles/withStyles";
import {
  Grid,
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CardActionArea,
  Avatar,
  Typography,
  Chip,
  Stack,
  TextField,
  MenuItem,
  Skeleton,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  determineLevelFromXML,
  extractTagsFromProject,
} from "../../components/projectUtils";

const styles = (theme) => ({
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": { textDecoration: "underline" },
  },
  filterRow: {
    display: "flex",
    gap: theme.spacing(2),
    flexWrap: "wrap",
    marginBottom: theme.spacing(2),
    alignItems: "center",
  },
  filterField: {
    flex: "1 1 200px",
    minWidth: 160,
  },
  card: {
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
      transform: "scale(1.03)",
      boxShadow: theme.shadows[6],
    },
  },
});

class GalleryPage extends Component {
  state = {
    snackbar: false,
    type: "",
    key: "",
    message: "",
    searchText: "",
    dateFrom: null,
    dateTo: null,
    sortOption: "newest",
    tagFilters: [],
    levelFilter: "all",
  };

  async componentDidMount() {
    await this.props.getProjects("gallery");
    this.handleMessage(this.props.message);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.message !== this.props.message) {
      this.handleMessage(this.props.message);
    }
  }

  componentWillUnmount() {
    this.props.resetProject();
    this.props.clearMessages();
  }

  handleMessage = (message) => {
    if (!message) return;
    if (message.id === "GALLERY_DELETE_SUCCESS") {
      this.setState({
        snackbar: true,
        key: Date.now(),
        message: "Dein Galerie-Projekt wurde erfolgreich gelöscht.",
        type: "success",
      });
    } else if (message.id === "GET_PROJECT_FAIL") {
      this.setState({
        snackbar: true,
        key: Date.now(),
        message:
          "Dein angefragtes Galerie-Projekt konnte nicht gefunden werden.",
        type: "error",
      });
    }
  };

  handleSearchChange = (e) => this.setState({ searchText: e.target.value });
  handleSortChange = (e) => this.setState({ sortOption: e.target.value });
  handleTagFilterChange = (e) => this.setState({ tagFilters: e.target.value });
  handleLevelFilterChange = (e) =>
    this.setState({ levelFilter: e.target.value });
  handleResetFilters = () =>
    this.setState({
      searchText: "",
      dateFrom: null,
      dateTo: null,
      sortOption: "newest",
      tagFilters: [],
      levelFilter: "all",
    });

  applyFilters(projects) {
    const { searchText, dateFrom, dateTo, tagFilters, levelFilter } =
      this.state;

    return projects.filter((proj) => {
      const matchesSearch =
        proj.title.toLowerCase().includes(searchText.toLowerCase()) ||
        (proj.description || "")
          .toLowerCase()
          .includes(searchText.toLowerCase());

      let matchesDate = true;
      if (proj.createdAt) {
        const created = new Date(proj.createdAt);
        if (dateFrom && created < dateFrom) matchesDate = false;
        if (dateTo && created > dateTo) matchesDate = false;
      }

      const matchesTags =
        tagFilters.length === 0 ||
        (proj.tags || []).some((tag) => tagFilters.includes(tag));

      const matchesLevel =
        levelFilter === "all" || proj.level === Number(levelFilter);

      return matchesSearch && matchesDate && matchesTags && matchesLevel;
    });
  }

  applySort(projects) {
    const { sortOption } = this.state;
    return projects.sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortOption === "az") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }

  render() {
    const { classes, progress, user } = this.props;
    const rawProjects = this.props.projects || [];
    const projects = rawProjects.map((p) => ({
      ...p,
      level: determineLevelFromXML(p.xml),
      tags: extractTagsFromProject(p),
    }));

    const { searchText, tagFilters, snackbar, message, type, key } = this.state;

    const filtered = this.applyFilters(projects);
    const sorted = this.applySort(filtered.slice());
    const tags = Array.from(new Set(projects.flatMap((p) => p.tags || [])));

    return (
      <Box>
        <Breadcrumbs content={[{ link: "/gallery", title: "Galerie" }]} />
        <Typography variant="h4" gutterBottom>
          Galerie
        </Typography>

        <Box className={classes.filterRow}>
          <TextField
            className={classes.filterField}
            label="Suche"
            variant="outlined"
            size="small"
            value={searchText}
            onChange={this.handleSearchChange}
          />
          <TextField
            className={classes.filterField}
            select
            label="Tags"
            variant="outlined"
            size="small"
            SelectProps={{ multiple: true }}
            value={tagFilters}
            onChange={this.handleTagFilterChange}
          >
            {tags.map((tag) => (
              <MenuItem key={tag} value={tag}>
                {tag}
              </MenuItem>
            ))}
          </TextField>

          <Button
            className={classes.filterField}
            variant="text"
            size="small"
            onClick={this.handleResetFilters}
          >
            Filter zurücksetzen
          </Button>
        </Box>

        {progress ? (
          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, idx) => (
              <Grid item xs={12} sm={6} md={4} xl={3} key={idx}>
                <Card>
                  <Skeleton
                    variant="rectangular"
                    height={140}
                    animation="wave"
                  />
                  <CardContent>
                    <Skeleton width="60%" />
                    <Skeleton width="80%" />
                    <Skeleton width="40%" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box mt={2}>
            {sorted.length > 0 ? (
              <Grid container spacing={3}>
                {sorted.map((project, i) => (
                  <Grid item xs={12} sm={6} md={4} xl={3} key={i}>
                    <Card
                      className={classes.card}
                      elevation={3}
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <CardActionArea
                        component={Link}
                        to={`/gallery/${project._id}`}
                        sx={{ flexGrow: 1, textAlign: "left" }}
                      >
                        <CardHeader
                          avatar={
                            <Avatar>
                              {project.title.charAt(0).toUpperCase()}
                            </Avatar>
                          }
                          title={project.title}
                          subheader={project.creator}
                        />
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
                            Vorschau folgt
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
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            {(project.tags || []).map((tag, idx) => {
                              const isActive =
                                this.state.tagFilters.includes(tag);
                              return (
                                <Chip
                                  key={idx}
                                  label={tag}
                                  size="small"
                                  variant={isActive ? "filled" : "primary"}
                                  color={isActive ? "primary" : "default"}
                                />
                              );
                            })}
                            {project.category && (
                              <Chip
                                label={project.category}
                                size="small"
                                color="primary"
                              />
                            )}
                          </Stack>
                        </CardContent>
                      </CardActionArea>
                      <CardActions
                        disableSpacing
                        sx={{ justifyContent: "space-between" }}
                      >
                        {user && user.email === project.creator && (
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

        <Snackbar open={snackbar} message={message} type={type} key={key} />
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
