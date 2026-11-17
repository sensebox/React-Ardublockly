import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  IconButton,
  Button,
  Radio,
  Checkbox,
  Switch,
  FormControlLabel,
  useTheme,
} from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import { useState } from "react";

const QuestionEditor = ({ questionData, setQuestionData }) => {
  const theme = useTheme();
  const [tab, setTab] = useState(
    questionData?.freetext
      ? "freetext"
      : questionData?.h5pLink
        ? "h5p"
        : "normal",
  );
  const [isMultipleChoice, setIsMultipleChoice] = useState(
    questionData?.multipleChoice || false,
  );

  const [hasOptionalAnswer, setHasOptionalAnswer] = useState(
    questionData?.answers && questionData?.answers.length > 0,
  );

  const handleAddAnswer = () => {
    setQuestionData({
      ...questionData,
      answers: [
        ...(questionData.answers || []),
        { text: "", correct: false, feedback: "" },
      ],
    });
  };

  const handleDeleteAnswer = (index) => {
    const updated = [...questionData.answers];
    updated.splice(index, 1);
    setQuestionData({ ...questionData, answers: updated });
  };

  const handleAnswerChange = (index, key, value) => {
    const updated = [...questionData.answers];
    updated[index][key] = value;
    setQuestionData({ ...questionData, answers: updated });
  };

  const handleCorrectSelect = (index) => {
    let updated;

    if (isMultipleChoice) {
      updated = questionData.answers.map((a, i) =>
        i === index ? { ...a, correct: !a.correct } : a,
      );
    } else {
      updated = questionData.answers.map((a, i) => ({
        ...a,
        correct: i === index,
      }));
    }

    setQuestionData({ ...questionData, answers: updated });
  };

  return (
    <Box
      sx={{
        mt: 3,
        p: 3,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        bgcolor: theme.palette.background.paper,
      }}
    >
      <Tabs
        value={tab}
        onChange={(e, val) => {
          setTab(val);
          // Update question type based on selected tab
          if (val === "freetext") {
            setQuestionData({
              ...questionData,
              freetext: true,
              h5pLink: undefined,
              multipleChoice: false,
              answers: questionData.answers || [],
            });
          } else if (val === "h5p") {
            setQuestionData({
              ...questionData,
              freetext: false,
              multipleChoice: false,
              h5pLink: questionData?.h5pLink || "",
            });
          } else {
            // normal tab
            setQuestionData({
              ...questionData,
              freetext: false,
              h5pLink: undefined,
              answers: questionData.answers || [],
            });
          }
        }}
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 2 }}
      >
        <Tab value="normal" label="Normale Frage" />
        <Tab value="freetext" label="Freitext Frage" />
        <Tab value="h5p" label="H5P Quiz" />
      </Tabs>

      {tab === "normal" && (
        <Box>
          {/* Frage */}
          <TextField
            fullWidth
            label="Frage"
            value={questionData.question || ""}
            onChange={(e) =>
              setQuestionData({ ...questionData, question: e.target.value })
            }
            sx={{ mb: 2 }}
          />

          {/* Multiple Choice Umschalter */}
          <FormControlLabel
            control={
              <Switch
                checked={isMultipleChoice}
                onChange={(e) => {
                  const value = e.target.checked;
                  setIsMultipleChoice(value);
                  setQuestionData({ ...questionData, multipleChoice: value });
                }}
                color="primary"
              />
            }
            label="Mehrere richtige Antworten erlauben"
            sx={{ mb: 2 }}
          />

          {/* Antworten */}
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Antwortmöglichkeiten & Feedback
          </Typography>

          {(questionData.answers || []).map((answer, index) => (
            <Box
              key={index}
              sx={{
                mb: 2,
                p: 2,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1,
                }}
              >
                {isMultipleChoice ? (
                  <Checkbox
                    checked={answer.correct}
                    onChange={() => handleCorrectSelect(index)}
                    color="primary"
                  />
                ) : (
                  <Radio
                    checked={answer.correct}
                    onChange={() => handleCorrectSelect(index)}
                    color="primary"
                  />
                )}
                <TextField
                  fullWidth
                  label={`Antwort ${index + 1}`}
                  value={answer.text}
                  onChange={(e) =>
                    handleAnswerChange(index, "text", e.target.value)
                  }
                />
                <IconButton
                  onClick={() => handleDeleteAnswer(index)}
                  color="error"
                >
                  <Delete />
                </IconButton>
              </Box>

              {/* 🆕 Feedback-Feld */}
              <TextField
                fullWidth
                multiline
                minRows={2}
                label="Feedback zu dieser Antwort (optional)"
                value={answer.feedback || ""}
                onChange={(e) =>
                  handleAnswerChange(index, "feedback", e.target.value)
                }
                placeholder="z. B. 'Richtig, weil der Sensor die Temperatur misst.'"
              />
            </Box>
          ))}

          <Button
            startIcon={<AddCircleOutline />}
            onClick={handleAddAnswer}
            variant="outlined"
            sx={{ mt: 1 }}
          >
            Antwort hinzufügen
          </Button>
        </Box>
      )}

      {tab === "freetext" && (
        <Box>
          {/* Frage */}
          <TextField
            fullWidth
            label="Frage"
            value={questionData.question || ""}
            onChange={(e) =>
              setQuestionData({ ...questionData, question: e.target.value })
            }
            sx={{ mb: 2 }}
          />

          {/* Optional Answer Toggle */}
          <FormControlLabel
            control={
              <Switch
                checked={hasOptionalAnswer}
                onChange={(e) => {
                  const value = e.target.checked;
                  setHasOptionalAnswer(value);
                  if (!value) {
                    setQuestionData({ ...questionData, answers: [] });
                  } else {
                    setQuestionData({
                      ...questionData,
                      answers: [{ text: "", feedback: "" }],
                    });
                  }
                }}
                color="primary"
              />
            }
            label="Richtige Antwort vorgeben (optional)"
            sx={{ mb: 2 }}
          />

          {hasOptionalAnswer && (
            <Box>
              {(questionData.answers || []).map((answer, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 2,
                    p: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                  }}
                >
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label="Beispielantwort"
                    value={answer.text || ""}
                    onChange={(e) =>
                      handleAnswerChange(index, "text", e.target.value)
                    }
                    placeholder="z. B. 'Der Sensor misst die Raumtemperatur.'"
                  />
                </Box>
              ))}
            </Box>
          )}

          {!hasOptionalAnswer && (
            <Box
              sx={{
                p: 2,
                bgcolor: theme.palette.action.hover,
                borderRadius: 2,
                border: `1px dashed ${theme.palette.divider}`,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                ✓ Nutzer können freien Text eingeben, ohne dass eine bestimmte
                Antwort erforderlich ist.
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* H5P */}
      {tab === "h5p" && (
        <Box>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            H5P-Embed Link
          </Typography>
          <TextField
            fullWidth
            placeholder="https://your-h5p-link.com/embed/..."
            value={questionData.h5pLink || ""}
            onChange={(e) =>
              setQuestionData({ ...questionData, h5pLink: e.target.value })
            }
          />
        </Box>
      )}
    </Box>
  );
};

export default QuestionEditor;
