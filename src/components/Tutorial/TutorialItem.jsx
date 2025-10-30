import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { deleteTutorial } from "@/actions/tutorialActions";
import DifficultyLabel from "./DifficultyLabel";
import { motion } from "framer-motion";
import Dialog from "@/components/ui/Dialog";
import { CheckCircle, Error as ErrorIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import Snackbar from "../Snackbar";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import TutorialOverview from "./TutorialOverview";

function getDifficultyLevel(value) {
  if (value <= 1) return 1;
  if (value <= 2) return 2;
  if (value <= 3) return 3;
  if (value <= 4) return 4;
  return 5;
}

function TutorialItem({ tutorial, level }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.auth.user);

  // Modal states
  const [dialogState, setDialogState] = useState("idle");
  // idle | confirm | loading | success | error

  const labels = ["Sehr leicht", "Leicht", "Mittel", "Schwer", "Sehr schwer"];
  const getTutorialImage = (t) => t.imageUrl || "/placeholder-image.png";
  const getDifficultyLabel = (value) => {
    const idx = Math.max(
      0,
      Math.min(labels.length - 1, getDifficultyLevel(value) - 1),
    );
    return labels[idx].toLocaleUpperCase();
  };

  const handleDelete = async () => {
    setDialogState("loading");
    try {
      await dispatch(deleteTutorial(tutorial._id));
    } catch (err) {
      console.error("Fehler beim Löschen:", err);
      setDialogState("error");
    }
  };

  const handleCloseModal = () => setDialogState("idle");

  return (
    <>
      <Grid item xs={12} sm={6} md={4} xl={3} key={tutorial._id}>
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
          <CardActionArea
            onClick={() => history.push(`/tutorial/${tutorial._id}`)}
            sx={{
              textAlign: "left",
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                p: "8px",
              }}
            >
              <TutorialOverview tutorial={tutorial} />
            </CardContent>
          </CardActionArea>

          {user && tutorial.creator === user.email && (
            <Box sx={{ p: 2, pt: 0, gap: 2, display: "flex" }}>
              {/* <Button
              component={Link}
              to={`/tutorial/${tutorial._id}`}
              fullWidth
              startIcon={<FontAwesomeIcon icon={faEye} />}
              sx={{
                background: theme.palette.background.white,
                color: theme.palette.primary.main,
                borderRadius: "5px",
                fontWeight: "bold",
                border: "1px solid",
                borderColor: theme.palette.primary.main,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.background.white,
                },
              }}
            >
              Anzeigen
            </Button> */}

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexGrow: 1,
                  flexDirection: "column",
                }}
              >
                <Button
                  component={Link}
                  id={`edit${tutorial._id}`}
                  to={`/tutorial/${tutorial._id}/edit`}
                  fullWidth
                  startIcon={<FontAwesomeIcon icon={faPencil} />}
                  sx={{
                    background: theme.palette.background.white,
                    color: theme.palette.primary.main,
                    borderRadius: "5px",
                    fontWeight: "bold",
                    border: "1px solid",
                    borderColor: theme.palette.primary.main,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.background.white,
                    },
                  }}
                >
                  Bearbeiten
                </Button>

                <Button
                  fullWidth
                  id={`delete${tutorial._id}`}
                  startIcon={<FontAwesomeIcon icon={faTrash} />}
                  sx={{
                    background: theme.palette.background.white,
                    color: "red",
                    borderRadius: "5px",
                    fontWeight: "bold",
                    border: "1px solid",
                    borderColor: "red",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "red",
                      color: theme.palette.background.white,
                    },
                  }}
                  onClick={() => setDialogState("confirm")}
                >
                  Löschen
                </Button>
              </Box>
            </Box>
          )}
        </Card>
      </Grid>

      {/* 🧱 Modal für alle Zustände */}
      <Dialog
        open={dialogState !== "idle"}
        fullWidth
        maxWidth="xs"
        onClose={handleCloseModal}
        title={
          dialogState === "confirm"
            ? "Tutorial löschen?"
            : dialogState === "loading"
              ? "Tutorial wird gelöscht..."
              : dialogState === "success"
                ? "Erfolgreich gelöscht!"
                : "Fehler beim Löschen"
        }
        content={
          <Box
            sx={{
              textAlign: "center",
              py: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            {/* CONFIRM */}
            {dialogState === "confirm" && (
              <>
                <Typography variant="body1">
                  Möchtest du <strong>{tutorial.title}</strong> wirklich
                  löschen?
                </Typography>
                <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                  <Button variant="outlined" onClick={handleCloseModal}>
                    Abbrechen
                  </Button>
                  <Button
                    id="confirmDelete"
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                  >
                    Löschen
                  </Button>
                </Box>
              </>
            )}

            {/* LOADING */}
            {dialogState === "loading" && (
              <>
                <CircularProgress color="primary" />
                <Typography variant="body2" color="text.secondary">
                  Bitte warten, das Tutorial wird gelöscht...
                </Typography>
              </>
            )}

            {/* SUCCESS */}
            {dialogState === "success" && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 120 }}
                >
                  <CheckCircle sx={{ fontSize: 64, color: "success.main" }} />
                </motion.div>
                <Typography variant="body1" fontWeight={600}>
                  Tutorial erfolgreich gelöscht!
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCloseModal}
                >
                  OK
                </Button>
              </>
            )}

            {/* ERROR */}
            {dialogState === "error" && (
              <>
                <ErrorIcon sx={{ fontSize: 64, color: "error.main" }} />
                <Typography variant="body1" fontWeight={600}>
                  Beim Löschen ist ein Fehler aufgetreten.
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleCloseModal}
                >
                  Schließen
                </Button>
              </>
            )}
          </Box>
        }
        button={null}
      />
    </>
  );
}

TutorialItem.propTypes = {
  tutorial: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    imageUrl: PropTypes.string,
  }).isRequired,
};

export default TutorialItem;
