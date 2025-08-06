import { getProjects } from "@/actions/projectActions";
import { Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GalleryItem from "./GalleryItem";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import * as Blockly from "blockly";

const GalleryHome = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.project.projects);
  const allowedAuthors = [
    "mario.pesch@uni-muenster.de",
    "p_scha35@uni-muenster.de",
    "e.c-schneider@reedu.de",
    "verena.witte@yahoo.de",
  ];
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    dispatch(getProjects("gallery"));
  }, []);

  const filteredProjects = projects
    .filter((project) => allowedAuthors.includes(project.creator))
    .filter((project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  return (
    <div>
      <Breadcrumbs content={[{ link: "/Gallery", title: "Gallerie" }]} />

      <h1>{Blockly.Msg.gallery_home_head}</h1>
      <TextField
        fullWidth
        label="Suche nach Projekttitel"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
      />
      {projects.length === 0 ? (
        <p>No projects found in the gallery.</p>
      ) : (
        <Grid container spacing={2}>
          {filteredProjects.map((project, i) => (
            <GalleryItem project={project} key={i} />
          ))}
        </Grid>
      )}
    </div>
  );
};

export default GalleryHome;
