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
  const [tab, setTab] = useState(questionData?.h5pLink ? "h5p" : "normal");

  // ✅ Multiple Choice Toggle
  const [isMultipleChoice, setIsMultipleChoice] = useState(
    questionData?.multipleChoice || false,
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
        onChange={(e, val) => setTab(val)}
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 2 }}
      >
        <Tab value="normal" label="Normale Frage" />
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
