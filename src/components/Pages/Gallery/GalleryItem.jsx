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
  useTheme,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProject,
  updateProject,
  setDescription,
} from "@/actions/projectActions"; // ⬅️ setDescription importieren
import { useState } from "react";
import { Edit } from "@mui/icons-material";
import { workspaceName } from "@/actions/workspaceActions";

const GalleryItem = ({ project }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // delete dialog
  const [openDelete, setOpenDelete] = useState(false);

  // rename dialog
  const [openRename, setOpenRename] = useState(false);
  const [titleInput, setTitleInput] = useState(project.title ?? "");
  const [descriptionInput, setDescriptionInput] = useState(
    project.description ?? "",
  );

  const [optimisticTitle, setOptimisticTitle] = useState(null);
  const [optimisticDesc, setOptimisticDesc] = useState(null);

  const displayTitle = optimisticTitle ?? project.title;
  const displayDesc = optimisticDesc ?? project.description;

  const getProjectImage = (p) => p.imageUrl || "/placeholder-image.png";

  const handleDeleteProject = () => {
    dispatch(deleteProject("gallery", project._id));
  };

  const handleOpenRename = () => {
    setTitleInput(project.title ?? "");
    setDescriptionInput(project.description ?? ""); // ⬅️ neu
    setOpenRename(true);
  };

  const handleSubmitRename = () => {
    const t = titleInput.trim();
    const d = descriptionInput.trim();

    // sofort anzeigen
    setOptimisticTitle(t);
    setOptimisticDesc(d);

    // Redux-State befüllen, dann speichern
    dispatch(workspaceName(t));
    dispatch(setDescription(d));
    dispatch(updateProject("gallery", project._id));

    setOpenRename(false);
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
          "&:hover": { boxShadow: 6 },
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
                padding: 15,
              }}
            />
          </Box>

          <CardContent sx={{ flexGrow: 1 }}>
            {/* Title + edit pencil */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                mb: 1.5,
              }}
            >
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontWeight: 900,
                  textTransform: "capitalize",
                  color: theme.palette.primary.main,
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                {displayTitle}
              </Typography>

              {user && user.email === project.creator && (
                <IconButton
                  onClick={handleOpenRename}
                  aria-label="Titel und Beschreibung bearbeiten"
                  sx={{
                    backgroundColor: "#f0f0f0",
                    color: theme.palette.primary.main,
                    borderRadius: "50%",
                    width: 35,
                    height: 35,
                    "&:hover": { backgroundColor: "#e0e0e0" },
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
              )}
            </Box>

            <hr style={{ color: "#eee", width: "80%", marginBottom: 10 }} />

            <Typography variant="body2" color="text.main">
              {displayDesc}{" "}
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

        <Box
          sx={{ p: 2, pt: 0, display: "flex", flexDirection: "column", gap: 1 }}
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
              onClick={() => setOpenDelete(true)}
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

      {/* Delete dialog */}
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          {Blockly.Msg.tooltip_delete_project}
        </DialogTitle>
        <DialogContent>
          <Typography>{Blockly.Msg.delete_project}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>
            {Blockly.Msg.button_cancel}
          </Button>
          <Button
            onClick={() => {
              handleDeleteProject();
              setOpenDelete(false);
            }}
            color="error"
            variant="contained"
          >
            {Blockly.Msg.delete}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rename dialog */}
      <Dialog
        open={openRename}
        onClose={() => setOpenRename(false)}
        aria-labelledby="rename-dialog-title"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="rename-dialog-title">
          {Blockly.Msg.edit_project}{" "}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Titel"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Beschreibung"
            value={descriptionInput}
            onChange={(e) => setDescriptionInput(e.target.value)}
            multiline
            minRows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRename(false)}>
            {" "}
            {Blockly.Msg.button_cancel}
          </Button>
          <Button onClick={handleSubmitRename} variant="contained">
            {Blockly.Msg.confirm}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default GalleryItem;
