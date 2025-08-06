import * as Blockly from "blockly";

import {
  Box,
  Button,
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
import { Link } from "react-router-dom/cjs/react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const ProjectTitle = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
  textTransform: "capitalize",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

const GalleryItem = ({ project, key }) => {
  const getProjectImage = (project) => {
    if (project.imageUrl) {
      return project.imageUrl;
    }
    return "/placeholder-image.png";
  };

  return (
    <Grid item xs={12} sm={6} md={4} xl={3}>
      <Card
        elevation={3}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            boxShadow: 6,
          },
        }}
      >
        <CardActionArea sx={{ flexGrow: 1, textAlign: "left" }}>
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
                  wordWrap: "break-word",
                  height: "6vh",
                  alignContent: "center",
                  textAlign: "center",
                }}
                gutterBottom
              >
                {project.title}
              </ProjectTitle>
            }
          ></CardHeader>

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
                padding: "15px",
              }}
            />
          </Box>
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: "italic", mb: 1 }}
            >
              {project.description}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
              {(project.tags || []).map((tag, idx) => (
                <Chip
                  key={idx}
                  label={tag}
                  size="small"
                  variant="outlined"
                  color="default"
                />
              ))}
              {project.category && (
                <Chip label={project.category} size="small" color="primary" />
              )}
            </Stack>
          </CardContent>
        </CardActionArea>
        <Box sx={{ p: 2, pt: 0 }}>
          <Button
            component={Link}
            to={`/gallery/${project._id}`}
            fullWidth
            startIcon={<FontAwesomeIcon icon={faEye} />}
            sx={{
              background: "#fff",
              color: "#28a745",
              borderRadius: "50px",
              fontWeight: "bold",
              borderColor: "#28a745",
              border: "1px solid",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "#28a745",
                color: "#fff",
              },
            }}
          >
            {Blockly.Msg.show_in_blockly}
          </Button>
        </Box>
      </Card>
    </Grid>
  );
};

export default GalleryItem;
