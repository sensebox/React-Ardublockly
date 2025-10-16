import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  IconButton,
  Button,
  Radio,
  useTheme,
} from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import { useState } from "react";

const QuestionEditor = ({ questionData, setQuestionData }) => {
  const theme = useTheme();
  const [tab, setTab] = useState(
    questionData?.h5pLink ? "h5p" : "normal", // falls vorhanden → gleich H5P auswählen
  );

  const handleAddAnswer = () => {
    setQuestionData({
      ...questionData,
      answers: [...(questionData.answers || []), { text: "", correct: false }],
    });
  };

  const handleDeleteAnswer = (index) => {
    const updated = [...questionData.answers];
    updated.splice(index, 1);
    setQuestionData({ ...questionData, answers: updated });
  };

  const handleAnswerChange = (index, value) => {
    const updated = [...questionData.answers];
    updated[index].text = value;
    setQuestionData({ ...questionData, answers: updated });
  };

  const handleCorrectSelect = (index) => {
    const updated = questionData.answers.map((a, i) => ({
      ...a,
      correct: i === index,
    }));
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
          <TextField
            fullWidth
            label="Frage"
            value={questionData.question || ""}
            onChange={(e) =>
              setQuestionData({ ...questionData, question: e.target.value })
            }
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Antwortmöglichkeiten
          </Typography>

          {(questionData.answers || []).map((answer, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1,
              }}
            >
              <Radio
                checked={answer.correct}
                onChange={() => handleCorrectSelect(index)}
                color="primary"
              />
              <TextField
                fullWidth
                value={answer.text}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder={`Antwort ${index + 1}`}
              />
              <IconButton
                onClick={() => handleDeleteAnswer(index)}
                color="error"
              >
                <Delete />
              </IconButton>
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
