import { getProjects } from "@/actions/projectActions";
import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GalleryItem from "./GalleryItem";

const GalleryHome = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.project.projects);
  const allowedAuthors = [
    "mario.pesch@uni-muenster.de",
    "p_scha35@uni-muenster.de",
    "e.c-schneider@reedu.de",
    "verena.witte@yahoo.de",
  ];
  useEffect(() => {
    dispatch(getProjects("gallery"));
  }, []);

  return (
    <div>
      <h1>Gallery Projects</h1>
      {projects.length === 0 ? (
        <p>No projects found in the gallery.</p>
      ) : (
        <Grid container spacing={2}>
          {projects
            .filter((project) => allowedAuthors.includes(project.creator))
            .map((project, i) => (
              <GalleryItem project={project} key={i} />
            ))}
        </Grid>
      )}
    </div>
  );
};

export default GalleryHome;
