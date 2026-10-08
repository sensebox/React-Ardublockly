import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DEFAULT_EVALUATION_TITLE,
  getEvaluationConfig,
  getStepKey,
  newId,
} from "../../../Viewer/helpers/evaluationUtils";

// Select sentinel for "no explicit source" (stored as "" in the config).
// An empty-string value would leave the select looking unselected.
const AUTO_SOURCE = "auto";

const EvaluationConfigEditor = ({
  step,
  steps,
  activeStep,
  setEvaluationConfig,
}) => {
  const theme = useTheme();
  const config = getEvaluationConfig(step);
  const { sourceStepId, evaluations, allowLearnerEvaluations } = config;

  const preparationSteps = steps
    .map((s, index) => ({ step: s, index }))
    .filter(
      ({ step: s, index }) =>
        s.type === "evaluationPreparation" && index < activeStep,
    );

  const update = (fields) => setEvaluationConfig({ ...config, ...fields });

  const updateTitle = (id, title) =>
    update({
      evaluations: evaluations.map((e) => (e.id === id ? { ...e, title } : e)),
    });

  const addEvaluation = () =>
    update({ evaluations: [...evaluations, { id: newId(), title: "" }] });

  const removeEvaluation = (id) =>
    update({ evaluations: evaluations.filter((e) => e.id !== id) });

  const sourceIsValid =
    !sourceStepId ||
    preparationSteps.some(({ step: s }) => getStepKey(s) === sourceStepId);

  return (
    <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6" fontWeight={600} color="primary">
        Bewertung
      </Typography>

      {preparationSteps.length === 0 ? (
        <Alert severity="warning">
          Vor diesem Schritt gibt es keinen Schritt vom Typ „Bewertungskriterien
          festlegen“. Die Lernenden haben sonst keine Kriterien zum Bewerten.
        </Alert>
      ) : (
        <FormControl size="small" fullWidth>
          <InputLabel id="criteria-source-label">Kriterien aus</InputLabel>
          <Select
            labelId="criteria-source-label"
            label="Kriterien aus"
            value={sourceIsValid && sourceStepId ? sourceStepId : AUTO_SOURCE}
            onChange={(e) =>
              update({
                sourceStepId:
                  e.target.value === AUTO_SOURCE ? "" : e.target.value,
              })
            }
          >
            <MenuItem value={AUTO_SOURCE}>
              Automatisch (letzter Kriterien-Schritt davor)
            </MenuItem>
            {preparationSteps.map(({ step: s, index }) => (
              <MenuItem key={getStepKey(s)} value={getStepKey(s)}>
                {`Schritt ${index + 1}${s.title ? `: ${s.title}` : ""}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <Typography variant="subtitle2" fontWeight={600}>
        Vorgegebene Bewertungen
      </Typography>
      {evaluations.map((evaluation, index) => (
        <Box key={evaluation.id} sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            label={`Titel der Bewertung ${index + 1}`}
            value={evaluation.title}
            onChange={(e) => updateTitle(evaluation.id, e.target.value)}
          />
          <IconButton
            size="small"
            onClick={() => removeEvaluation(evaluation.id)}
            sx={{ color: theme.palette.error.main }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
      <Box>
        <Button
          variant="outlined"
          startIcon={<AddCircleOutlineIcon />}
          onClick={addEvaluation}
        >
          Bewertung hinzufügen
        </Button>
      </Box>

      <FormControlLabel
        control={
          <Switch
            checked={allowLearnerEvaluations}
            onChange={(e) =>
              update({ allowLearnerEvaluations: e.target.checked })
            }
          />
        }
        label="Lernende dürfen eigene Bewertungen hinzufügen"
      />

      {evaluations.length === 0 && !allowLearnerEvaluations && (
        <Alert severity="info">
          Lege mindestens eine Bewertung an oder erlaube den Lernenden, eigene
          Bewertungen hinzuzufügen.
        </Alert>
      )}
    </Box>
  );
};

export default EvaluationConfigEditor;
