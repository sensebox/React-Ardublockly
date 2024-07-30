import React from 'react';
import PropTypes from 'prop-types';
import BlocklyWindow from "../Blockly/BlocklyWindow";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import Dialog from '../Dialog';

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
      title: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
      xml: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ProjectList;