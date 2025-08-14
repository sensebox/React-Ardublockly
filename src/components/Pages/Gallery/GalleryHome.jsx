import { getProjects } from "@/actions/projectActions";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Pagination,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GalleryItem from "./GalleryItem";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import * as Blockly from "blockly";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const PROJECTS_PER_PAGE = 12;

const GalleryHome = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const projects = useSelector((state) => state.project.projects);
  const user = useSelector((state) => state.auth.user);

  const allowedAuthors = [
    ...import.meta.env.VITE_PROJECTS_ALLOWED_AUTHORS.split(","),
    user && user.email ? user.email : null,
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [onlyMyProjects, setOnlyMyProjects] = useState(false);

  useEffect(() => {
    dispatch(getProjects("gallery"));
  }, []);

  const filteredProjects = projects
    .filter((project) => {
      const isAllowed = allowedAuthors.includes(project.creator);
      const isOwn = !onlyMyProjects || (user && project.creator === user.email);
      return isAllowed && isOwn;
    })
    .filter((project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);

  const currentProjects = filteredProjects.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE,
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Breadcrumbs
        content={[{ link: "/Gallery", title: Blockly.Msg.gallery_home_head }]}
      />

      <Typography variant="h4" gutterBottom>
        {Blockly.Msg.gallery_home_head}
      </Typography>
      {/* Start der Menüleiste - hier später Kategorie und Schwierigkeit hin  */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "nowrap",
          mb: 3,
          gap: 2,
        }}
      >
        <TextField
          fullWidth
          label={Blockly.Msg.searchQuery_placeholder}
          variant="outlined"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          sx={{ flex: "0 1 80%" }}
        />

        {user && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2 }}>
            <FormControl variant="standard">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={onlyMyProjects}
                    onChange={(e) => {
                      setOnlyMyProjects(e.target.checked);
                      setCurrentPage(1); // Seite zurücksetzen
                    }}
                  />
                }
                label={Blockly.Msg.my_projects}
              />
            </FormControl>
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            gap: 1,
          }}
        >
          <IconButton
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            <ArrowBackIos fontSize="inherit" />
          </IconButton>

          <Typography
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "50%",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
            }}
          >
            {currentPage}
          </Typography>
          <IconButton
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            <ArrowForwardIos fontSize="inherit" />
          </IconButton>
        </Box>
      </Box>

      {filteredProjects.length === 0 ? (
        <Typography>{Blockly.Msg.no_projects_found} </Typography>
      ) : (
        <Grid container spacing={2}>
          {currentProjects.map((project, i) => (
            <GalleryItem project={project} key={project._id} />
          ))}
        </Grid>
      )}

      {/* ⬇️ Pagination unten */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default GalleryHome;
