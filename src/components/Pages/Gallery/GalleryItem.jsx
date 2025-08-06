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
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { deleteProject } from "@/actions/projectActions";
import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
const GalleryItem = ({ project }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [openDialog, setOpenDialog] = useState(false);
  const getProjectImage = (project) => {
    return project.imageUrl || "/placeholder-image.png";
  };

  const handleDeleteProject = () => {
    dispatch(deleteProject("gallery", project._id));
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
        <Box
          sx={{
            p: 2,
            pt: 0,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <Button
            component={Link}
            to={`/gallery/${project._id}`}
            fullWidth
            startIcon={<FontAwesomeIcon icon={faEye} />}
            sx={{
              background: theme.palette.background.white,
              color: theme.palette.primary.main,
              borderRadius: "50px",
              fontWeight: "bold",
              borderColor: theme.palette.primary.main,
              border: "1px solid",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.background.white,
              },
            }}
          >
            {Blockly.Msg.show_in_blockly}
          </Button>
          {user && user.email === project.creator && (
            <Button
              onClick={() => setOpenDialog(true)}
              fullWidth
              color="error"
              startIcon={<FontAwesomeIcon icon={faTrash} />}
              sx={{
                background: theme.palette.background.white,
                color: theme.palette.primary.error,
                borderRadius: "50px",
                fontWeight: "bold",
                border: `1px solid ${theme.palette.primary.error}`,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: theme.palette.primary.error,
                  color: theme.palette.background.white,
                },
              }}
            >
              {Blockly.Msg.tooltip_delete_project}
            </Button>
          )}
        </Box>
      </Card>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          {Blockly.Msg.tooltip_delete_project}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bist du sicher, dass du dieses Projekt löschen möchtest?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Abbrechen
          </Button>
          <Button
            onClick={() => {
              handleDeleteProject();
              setOpenDialog(false);
            }}
            color="error"
            variant="contained"
          >
            Löschen
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default GalleryItem;
