
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BlocklyWindow from "../Blockly/BlocklyWindow";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

const ProjectList = ({ projects }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);

  const handleMenuClick = (event, project) => {
    setAnchorEl(event.currentTarget);
    setCurrentProject(project);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentProject(null);
  };

  const handleOpenProject = () => {
    if (currentProject) {
      console.log(`Open project ${currentProject.title}`);
      handleMenuClose();
    }
  };

  const handleDeleteProject = () => {
    if (currentProject) {
      console.log(`Delete project ${currentProject.title}`);
      handleMenuClose();
    }
  };

  return (
    <div>
      <h2>Projects: {projects.length}</h2>
      <Grid container spacing={2}>
        {projects.map((project, i) => (
          <Grid item xs={12} sm={6} md={4} xl={3} key={i}>
            <Paper
              style={{
                padding: "1rem",
                position: "relative",
                overflow: "hidden",
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
                <div style={{ position: 'relative' }}>
                  <BlocklyWindow
                    svg
                    blockDisabled
                    initialXml={project.xml}
                  />
                  <IconButton
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: '#fff',
                      padding: '8px',
                      borderRadius: '50%',
                    }}
                    onClick={(e) => handleMenuClick(e, project)}
                  >
                    <FontAwesomeIcon icon={faGear} />
                  </IconButton>
                </div>
                <h3 style={{ marginTop: 0 }}>{project.title}</h3>
                <Divider style={{ marginTop: "1rem", marginBottom: "10px" }} />
                <Typography
                  variant="body2"
                  style={{
                    fontStyle: "italic",
                    margin: 0,
                    marginTop: "-10px",
                  }}
                >
                  {project.description}
                </Typography>

              <div style={{ marginTop: '1rem' }}>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={`/project/${project._id}/edit`}
                >
                  Bearbeiten
                </Button>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
                  <Avatar src="/img/avatar.png" style={{ marginRight: '0.5rem' }} />
                  <Typography variant="body2">
                    {project.author || 'Unbekannt'}
                  </Typography>
                </div>
                <Typography variant="body2" color="textSecondary" style={{ marginTop: '0.5rem' }}>
                  Erstellt am: {new Date(project.createdAt).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Zuletzt bearbeitet: {new Date(project.updatedAt).toLocaleDateString()}
                </Typography>
              </div>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Menu for project options */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleOpenProject}>Projekt öffnen</MenuItem>
        <MenuItem onClick={handleDeleteProject}>Projekt löschen</MenuItem>
      </Menu>


const ProjectList = ({ projects }) => {
  return (
    <div>
      <h2>Projects: {projects.reduce((acc, project) => acc + 1, 0)}</h2>
      <Grid container spacing={2}>
      {projects.map((project, i) => (
       <Grid item xs={12} sm={6} md={4} xl={3} key={i}>
          <Paper
                        style={{
                          padding: "1rem",
                          position: "relative",
                          overflow: "hidden",
                        }}
                        onClick={() => console.log("clicked")}
                      >
                        <Link
                          to={`/project/${project._id}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <h3 style={{ marginTop: 0 }}>{project.title}</h3>
                          <Divider
                            style={{ marginTop: "1rem", marginBottom: "10px" }}
                          />
                            <Typography
                            variant="body2"
                            style={{
                              fontStyle: "italic",
                              margin: 0,
                              marginTop: "-10px",
                            }}
                          >
                            {project.description}
                          </Typography>
          <BlocklyWindow
            svg
            blockDisabled
            initialXml={project.xml}
          />
        </Link>
        </Paper>
        </Grid>

      ))}
      </Grid>
    </div>
  );
};

ProjectList.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
      xml: PropTypes.string.isRequired,
      author: PropTypes.string, // Optional: Author name
    })
  ).isRequired,
};

export default ProjectList;
