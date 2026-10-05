import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { AddCircleOutline, Delete, Checklist } from "@mui/icons-material";
import { loadAnswers, upsertAnswer } from "../helpers/tutorialStorageUtils";
import {
  criteriaAnswerId,
  DEFAULT_CRITERIA_TITLE,
  getCriteriaConfig,
  isCriteriaComplete,
  newId,
} from "../helpers/evaluationUtils";

const emptyCriteria = (count) =>
  Array.from({ length: count }, () => ({ id: newId(), text: "" }));

/**
 * Learner defines between minCriteria and maxCriteria free text criteria.
 * Saved on every change, later evaluation steps use them as labels.
 */
const CriteriaCard = ({ step, tutorialId, onStatusChange }) => {
  const theme = useTheme();
  const { minCriteria, maxCriteria, title, subtitle } =
    getCriteriaConfig(step);
  const answerId = criteriaAnswerId(step);

  const [criteria, setCriteria] = useState(() => {
    const saved = tutorialId
      ? loadAnswers(tutorialId).find((a) => a._id === answerId)
      : null;
    return saved?.criteria?.length ? saved.criteria : emptyCriteria(minCriteria);
  });

  const complete = isCriteriaComplete(criteria, step);

  useEffect(() => {
    onStatusChange(complete);
  }, [complete, onStatusChange]);

  const save = (updated) => {
    setCriteria(updated);
    if (tutorialId) {
      upsertAnswer(tutorialId, answerId, {
        criteria: updated,
        type: isCriteriaComplete(updated, step) ? "success" : "error",
      });
    }
  };

  const updateCriterion = (id, text) =>
    save(criteria.map((c) => (c.id === id ? { ...c, text } : c)));

  const addCriterion = () => save([...criteria, { id: newId(), text: "" }]);

  const removeCriterion = (id) => save(criteria.filter((c) => c.id !== id));

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        border: `1px solid ${theme.palette.divider}`,
        width: "100%",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Checklist sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" fontWeight={600}>
            {title?.trim() || DEFAULT_CRITERIA_TITLE}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{ mb: 2, color: theme.palette.text.secondary }}
        >
          {subtitle?.trim() ||
            (minCriteria === maxCriteria
              ? `Lege ${minCriteria} Kriterien fest.`
              : `Lege zwischen ${minCriteria} und ${maxCriteria} Kriterien fest.`)}
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {criteria.map((c, index) => (
            <Box key={c.id} sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                label={`Kriterium ${index + 1}`}
                value={c.text}
                onChange={(e) => updateCriterion(c.id, e.target.value)}
              />
              {criteria.length > minCriteria && (
                <IconButton
                  onClick={() => removeCriterion(c.id)}
                  sx={{ color: theme.palette.error.main }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              )}
            </Box>
          ))}
        </Box>

        {criteria.length < maxCriteria && (
          <Button
            variant="outlined"
            startIcon={<AddCircleOutline />}
            onClick={addCriterion}
            sx={{ mt: 2 }}
          >
            Kriterium hinzufügen
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default CriteriaCard;
