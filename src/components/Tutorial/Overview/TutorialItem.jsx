import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
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
import Snackbar from "../../Snackbar";
import TutorialItemSummary from "./TutorialtemSummary";
import {
  resetTutorialProgress,
  startTutorial,
} from "../services/tutorial.service";
import TutorialProgressStatus from "./TutorialProgressBar";
import { resetTutorialProgressLocal } from "@/actions/tutorialProgressActions";

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
  const navigate = useNavigate();
  const tutorialProgress = useSelector(
    (state) => state.tutorialProgress.byTutorialId[tutorial._id],
  );
  const tutorialProgressById = useSelector(
    (state) => state.tutorialProgress.byTutorialId,
  );
  const progressInfo = getTutorialProgressStatus(
    tutorial,
    tutorialProgressById,
  );
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [snackbar, setSnackbar] = useState(false);
  const [snackInfo, setSnackInfo] = useState({
    type: "success",
    key: 0,
    message: "",
  });
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

  function getTutorialProgressStatus(tutorial, progressById) {
    const progress = progressById?.[tutorial._id];
    const steps = tutorial.steps ?? [];
    const totalSteps = steps.length;

    // 🔹 Kein Progress
    if (!progress || totalSteps === 0) {
      return {
        status: "not_started",
        completedSteps: 0,
        totalSteps,
        progressText: `0 / ${totalSteps}`,
        progressRatio: 0,
      };
    }

    const progressSteps = progress.steps ?? {};

    let completedSteps = 0;

    steps.forEach((step) => {
      const stepId = step._id;
      const progressStep = progressSteps[stepId];

      // 🔹 Step nie gesehen
      if (!progressStep?.seen) return;

      // 🔹 Kein Question-Step → gesehen reicht
      if (step.type !== "question") {
        completedSteps++;
        return;
      }

      // 🔹 Question-Step → alle Fragen korrekt?
      const questions = step.questionData ?? [];
      const answeredQuestions = progressStep.questions ?? {};

      const allCorrect = questions.every((q) => {
        const result = answeredQuestions[q._id];
        return result?.correct === true;
      });

      if (allCorrect) {
        completedSteps++;
      }
    });

    let status = "in_progress";
    if (completedSteps === 0) status = "not_started";
    if (completedSteps === totalSteps) status = "completed";

    return {
      status,
      completedSteps,
      totalSteps,
      progressText: `${completedSteps} / ${totalSteps}`,
      progressRatio: totalSteps > 0 ? completedSteps / totalSteps : 0,
    };
  }

  const handleResetProgress = async () => {
    dispatch(resetTutorialProgressLocal(tutorial._id));

    try {
      await resetTutorialProgress({
        tutorialId: tutorial._id,
        token,
      });
      setSnackInfo({
        type: "success",
        key: Date.now(),
        message: "Fortschritt erfolgreich zurückgesetzt!",
      });
      setSnackbar(true);
    } catch (err) {
      console.error("Failed to reset progress", err);
    }
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

  const handleStartTutorial = async () => {
    if (user) {
      try {
        await startTutorial({ tutorialId: tutorial._id, token: token });
      } catch (e) {
        console.error("Failed to start tutorial", e);
      }
    }

    navigate(`/tutorial/${tutorial._id}`);
  };

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
            onClick={handleStartTutorial}
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
              <TutorialItemSummary tutorial={tutorial} />
              {progressInfo && user && (
                <TutorialProgressStatus
                  progressInfo={progressInfo}
                  canReset={!!user}
                  onReset={handleResetProgress}
                />
              )}
            </CardContent>
          </CardActionArea>

          {user && tutorial.creator === user.email && (
            <Box sx={{ p: 2, pt: 0, gap: 2, display: "flex" }}>
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
      <Snackbar
        open={snackbar}
        message={snackInfo.message}
        type={snackInfo.type}
        key={snackInfo.key}
        onClose={() => setSnackbar(false)}
      />{" "}
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
