import { getProjects } from "@/actions/projectActions";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom/cjs/react-router-dom";

const ProjectTitle = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
  textTransform: "capitalize",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const GalleryHome = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.project.projects);
  useEffect(() => {
    dispatch(getProjects("gallery"));
  }, []);

  const getProjectImage = (project) => {
    if (project.imageUrl) {
      return project.imageUrl;
    }
    return "/placeholder-image.png";
  };

  return (
    <div>
      <h1>Gallery Projects</h1>
      {projects.length === 0 ? (
        <p>No projects found in the gallery.</p>
      ) : (
        <Grid container spacing={2}>
          {projects.map((project, i) => (
            <Grid item xs={12} sm={6} md={4} xl={3} key={i}>
              <Card
                elevation={3}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px) scale(1.03)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardActionArea
                  component={Link}
                  to={`/gallery/${project._id}`}
                  sx={{ flexGrow: 1, textAlign: "left" }}
                >
                  <CardHeader
                    sx={{ backgroundColor: "primary.main" }}
                    title={
                      <ProjectTitle
                        variant="h6"
                        component="h3"
                        sx={{
                          fontWeight: "normal",
                          backgroundColor: "primary.main",
                          color: "white",
                        }}
                        gutterBottom
                      >
                        {project.title}
                      </ProjectTitle>
                    }
                  />
                  <Box
                    sx={{
                      height: 140,
                      backgroundColor: "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={getProjectImage(project)}
                      alt={project.title}
                      style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                  <CardContent
                    sx={{
                      flexGrow: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontStyle: "italic", mb: 1 }}
                    >
                      {project.description}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {(project.tags || []).map((tag, idx) => {
                        const isActive = this.state.tagFilters.includes(tag);
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
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default GalleryHome;
