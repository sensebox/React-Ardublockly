import {
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
  Divider,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import QuestionEditor from "./QuestionEditor";

const QuestionList = ({ questions, setQuestions }) => {
  const theme = useTheme();
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", answers: [], h5pLink: "", type: "normal" },
    ]);
  };

  const updateQuestion = (index, newData) => {
    const updated = [...questions];
    updated[index] = newData;
    setQuestions(updated);
  };

  const deleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" fontWeight={600} color="primary" gutterBottom>
        Fragen / Quizzes
      </Typography>

      {questions.map((q, index) => (
        <Box
          key={index}
          sx={{
            position: "relative",
            p: 2,
            mt: 2,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.secondary,
              mb: 1,
            }}
          >
            Frage {index + 1}
          </Typography>

          <QuestionEditor
            questionData={q}
            setQuestionData={(newData) => updateQuestion(index, newData)}
          />

          <IconButton
            size="small"
            onClick={() => deleteQuestion(index)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: theme.palette.error.main,
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}

      <Divider sx={{ my: 3 }} />

      <Button
        variant="outlined"
        startIcon={<AddCircleOutlineIcon />}
        onClick={addQuestion}
      >
        Neue Frage hinzufügen
      </Button>
    </Box>
  );
};

export default QuestionList;
