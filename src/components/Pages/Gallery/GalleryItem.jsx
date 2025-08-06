import * as Blockly from "blockly";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
  Avatar,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const GalleryItem = ({ project }) => {
  const theme = useTheme();

  const getProjectImage = (project) => {
    return project.imageUrl || "/placeholder-image.png";
  };

  const getNameFromEmail = (email) => {
    const namePart = email?.split("@")[0];
    return namePart
      ?.replace(".", " ")
      .replace("_", " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
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
        <CardActionArea sx={{ textAlign: "left", cursor: "default" }}>
          <Box
            sx={{
              height: 160,
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

          {/* 📄 Inhalt: Titel, Beschreibung, Tags */}
          <CardContent sx={{ flexGrow: 1 }}>
            {/* Titel */}
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: "bold",
                textTransform: "capitalize",
                color: theme.palette.primary.main,
                textAlign: "center",
                fontWeight: 900,
                height: "5vh",
                alignContent: "center",
                mb: 1,
              }}
            >
              {project.title}
            </Typography>
            <hr
              style={{
                color: "#eee",
                width: "80%",
                marginBottom: "10px",
              }}
            ></hr>
            {/* Beschreibung */}
            <Typography variant="h7" color="text.main">
              {project.description}
            </Typography>

            {/* Tags */}
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

        {/* 👇 Button unten */}
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
