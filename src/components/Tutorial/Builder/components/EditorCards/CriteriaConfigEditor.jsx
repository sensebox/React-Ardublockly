import { Box, TextField, Typography } from "@mui/material";
import {
  DEFAULT_CRITERIA_TITLE,
  getCriteriaConfig,
} from "../../../Viewer/helpers/evaluationUtils";

const LIMIT_MIN = 1;
const LIMIT_MAX = 10;

const clamp = (value) =>
  Math.min(LIMIT_MAX, Math.max(LIMIT_MIN, Number(value) || LIMIT_MIN));

const CriteriaConfigEditor = ({ step, setCriteriaConfig }) => {
  const config = getCriteriaConfig(step);
  const { minCriteria, maxCriteria, title, subtitle } = config;

  const updateText = (field, value) =>
    setCriteriaConfig({ ...config, [field]: value });

  const update = (field, value) => {
    const next = { ...config, [field]: clamp(value) };
    // keep min <= max, adjusting the field that was not edited
    if (next.minCriteria > next.maxCriteria) {
      if (field === "minCriteria") next.maxCriteria = next.minCriteria;
      else next.minCriteria = next.maxCriteria;
    }
    setCriteriaConfig(next);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" fontWeight={600} color="primary" gutterBottom>
        Bewertungskriterien
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Die Lernenden legen in diesem Schritt eigene Kriterien fest, die sie in
        späteren Bewertungs-Schritten verwenden.
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          label="Titel"
          placeholder={DEFAULT_CRITERIA_TITLE}
          value={title}
          onChange={(e) => updateText("title", e.target.value)}
        />
        <TextField
          fullWidth
          size="small"
          label="Untertitel"
          placeholder="Leer lassen, um die erlaubte Anzahl an Kriterien anzuzeigen"
          value={subtitle}
          onChange={(e) => updateText("subtitle", e.target.value)}
        />
      </Box>
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          type="number"
          size="small"
          label="Mindestanzahl"
          value={minCriteria}
          inputProps={{ min: LIMIT_MIN, max: LIMIT_MAX }}
          onChange={(e) => update("minCriteria", e.target.value)}
        />
        <TextField
          type="number"
          size="small"
          label="Höchstanzahl"
          value={maxCriteria}
          inputProps={{ min: LIMIT_MIN, max: LIMIT_MAX }}
          onChange={(e) => update("maxCriteria", e.target.value)}
        />
      </Box>
    </Box>
  );
};

export default CriteriaConfigEditor;
