// src/components/TutorialItem.jsx
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

function TutorialItem({ tutorial }) {
  return (
    <Grid item xs={12} sm={6} md={4} xl={3} key={tutorial._id}>
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
            backgroundColor: "white",
          }}
        >
          {tutorial.title}
        </Paper>
      </Link>
    </Grid>
  );
}

TutorialItem.propTypes = {
  tutorial: PropTypes.object.isRequired,
  status: PropTypes.object,
};

export default TutorialItem;
