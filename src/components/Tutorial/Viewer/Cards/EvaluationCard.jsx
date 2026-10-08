import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { AddCircleOutline, Delete, RateReview } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { loadAnswers, upsertAnswer } from "../helpers/tutorialStorageUtils";
import {
  buildEvaluationList,
  criteriaAnswerId,
  evaluationAnswerId,
  findSourceStep,
  getEvaluationConfig,
  getFilledCriteria,
  isEvaluationComplete,
  newId,
} from "../helpers/evaluationUtils";

/**
 * Learner writes a free text per criterion (from the preparation step)
 * for every evaluation. Creator evaluations are fixed, learner-added
 * evaluations can be renamed and removed.
 */
const EvaluationCard = ({ step, tutorialId, onStatusChange }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const steps = useSelector((state) => state.tutorial.tutorials[0]?.steps);
  const { allowLearnerEvaluations } = getEvaluationConfig(step);
  const answerId = evaluationAnswerId(step);

  const sourceStep = findSourceStep(steps || [], step);

  const [criteria] = useState(() => {
    if (!sourceStep || !tutorialId) return [];
    const saved = loadAnswers(tutorialId).find(
      (a) => a._id === criteriaAnswerId(sourceStep),
    );
    return getFilledCriteria(saved);
  });

  const [evaluations, setEvaluations] = useState(() => {
    const saved = tutorialId
      ? loadAnswers(tutorialId).find((a) => a._id === answerId)
      : null;
    return buildEvaluationList(step, saved?.evaluations);
  });

  // without a preparation step the tutorial is misconfigured, don't block
  const complete =
    !sourceStep || isEvaluationComplete(step, evaluations, criteria);

  useEffect(() => {
    onStatusChange(complete);
  }, [complete, onStatusChange]);

  const save = (updated) => {
    setEvaluations(updated);
    if (tutorialId) {
      upsertAnswer(tutorialId, answerId, {
        evaluations: updated,
        type: isEvaluationComplete(step, updated, criteria)
          ? "success"
          : "error",
      });
    }
  };

  const updateEvaluation = (id, fields) =>
    save(evaluations.map((e) => (e.id === id ? { ...e, ...fields } : e)));

  const updateAnswer = (evaluation, criterionId, text) =>
    updateEvaluation(evaluation.id, {
      answers: { ...evaluation.answers, [criterionId]: text },
    });

  const addEvaluation = () =>
    save([
      ...evaluations,
      { id: newId(), title: "", learnerAdded: true, answers: {} },
    ]);

  const removeEvaluation = (id) =>
    save(evaluations.filter((e) => e.id !== id));

  const goToSourceStep = () =>
    dispatch({ type: "TUTORIAL_STEP", payload: steps.indexOf(sourceStep) });

  if (!sourceStep) {
    return (
      <Alert severity="warning">
        Für diese Bewertung wurde kein Schritt mit Bewertungskriterien
        gefunden.
      </Alert>
    );
  }

  if (criteria.length === 0) {
    return (
      <Alert
        severity="info"
        action={
          <Button color="inherit" size="small" onClick={goToSourceStep}>
            Zu den Kriterien
          </Button>
        }
      >
        Lege zuerst deine Bewertungskriterien fest.
      </Alert>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {evaluations.map((evaluation) => (
        <Card
          key={evaluation.id}
          sx={{
            borderRadius: 3,
            boxShadow: 3,
            border: `1px solid ${theme.palette.divider}`,
            width: "100%",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <RateReview sx={{ color: theme.palette.primary.main }} />
              {evaluation.learnerAdded ? (
                <>
                  <TextField
                    fullWidth
                    size="small"
                    label="Titel der Bewertung"
                    value={evaluation.title}
                    onChange={(e) =>
                      updateEvaluation(evaluation.id, {
                        title: e.target.value,
                      })
                    }
                  />
<IconButton aria-label="Bewertung löschen"
                    onClick={() => removeEvaluation(evaluation.id)}
                    sx={{ color: theme.palette.error.main }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <Typography variant="h6" fontWeight={600}>
                  {evaluation.title}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {criteria.map((criterion) => (
                <TextField
                  key={criterion.id}
                  fullWidth
                  multiline
                  minRows={2}
                  maxRows={6}
                  label={criterion.text}
                  className="evaluation-criterion-field"
                  value={evaluation.answers?.[criterion.id] || ""}
                  onChange={(e) =>
                    updateAnswer(evaluation, criterion.id, e.target.value)
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      ))}

      {allowLearnerEvaluations && (
        <Box>
          <Button
            variant="outlined"
            startIcon={<AddCircleOutline />}
            onClick={addEvaluation}
          >
            Bewertung hinzufügen
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default EvaluationCard;
