import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Radio,
  Checkbox,
  FormControlLabel,
  Button,
  TextField,
  useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Cancel, HelpOutline } from "@mui/icons-material";

const QuestionCard = ({
  questionData,
  setNextStepDisabled,
  stepId,
  questionIndex = 0,
  tutorialId,
}) => {
  const theme = useTheme();
  const [selected, setSelected] = useState([]);
  const [freetextValue, setFreetextValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const questionKey = `${stepId}_q${questionIndex}`;

  useEffect(() => {
    if (stepId && tutorialId) {
      try {
        const savedAnswers =
          JSON.parse(
            window.localStorage.getItem(`tutorial_answers_${tutorialId}`),
          ) || [];
        const savedAnswer = savedAnswers.find((a) => a._id === questionKey);
        if (savedAnswer) {
          if (savedAnswer.freetextAnswer) {
            setFreetextValue(savedAnswer.freetextAnswer);
            setSubmitted(true);
            setIsCorrect(savedAnswer.type === "success");
            if (savedAnswer.type === "success") {
              setNextStepDisabled(false);
            }
          } else if (savedAnswer.answers) {
            setSelected(savedAnswer.answers);
            setSubmitted(true);
            setIsCorrect(savedAnswer.type === "success");
            if (savedAnswer.type === "success") {
              setNextStepDisabled(false);
            }
          }
        }
      } catch (e) {
        console.warn("Failed to load saved answer", e);
      }
    }
  }, [questionKey, tutorialId, setNextStepDisabled]);

  if (!questionData)
    return (
      <Typography variant="body2" color="text.secondary">
        Keine Frage verfügbar.
      </Typography>
    );

  // Provide defaults for new properties if they're missing
  const {
    question,
    answers = [],
    multipleChoice = false,
    freetext = false,
  } = questionData;

  const handleSelect = (value) => {
    if (multipleChoice) {
      setSelected((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value],
      );
    } else {
      setSelected([value]);
    }
  };

  const hasCorrectAnswerDefined = answers.some((a) => a.correct);

  const handleSubmit = () => {
    let correct = false;

    if (freetext) {
      // For freetext questions with reference answers, compare user input to reference
      if (answers.length > 0 && answers[0]?.text) {
        const referenceAnswer = answers[0].text
          .trim()
          .toLowerCase()
          .replace(/\s+/g, " ");
        const userAnswer = freetextValue
          .trim()
          .toLowerCase()
          .replace(/\s+/g, " ");
        correct = userAnswer === referenceAnswer;
      } else {
        // For freetext questions without reference answers, any non-empty content is accepted
        correct = freetextValue.trim().length > 0;
      }

      setIsCorrect(correct);
      if (correct) setNextStepDisabled(false);
      setSubmitted(true);

      if (stepId && tutorialId) {
        try {
          const savedAnswers =
            JSON.parse(
              window.localStorage.getItem(`tutorial_answers_${tutorialId}`),
            ) || [];
          const taskIndex = savedAnswers.findIndex(
            (t) => t._id === questionKey,
          );
          if (taskIndex >= 0) {
            savedAnswers[taskIndex].freetextAnswer = freetextValue;
            savedAnswers[taskIndex].type = correct ? "success" : "error";
          } else {
            savedAnswers.push({
              _id: questionKey,
              freetextAnswer: freetextValue,
              type: correct ? "success" : "error",
            });
          }
          window.localStorage.setItem(
            `tutorial_answers_${tutorialId}`,
            JSON.stringify(savedAnswers),
          );
        } catch (e) {
          console.warn("Failed to save answer to localStorage", e);
        }
      }
    } else {
      // Multiple choice logic
      if (hasCorrectAnswerDefined) {
        const correctAnswers = answers
          .filter((a) => a.correct)
          .map((a) => a.text)
          .sort();
        const selectedAnswers = [...selected].sort();

        correct =
          correctAnswers.length === selectedAnswers.length &&
          correctAnswers.every((val, i) => val === selectedAnswers[i]);
      } else {
        correct = true;
      }

      setIsCorrect(correct);
      if (correct) setNextStepDisabled(false);
      setSubmitted(true);

      if (stepId && tutorialId) {
        try {
          const savedAnswers =
            JSON.parse(
              window.localStorage.getItem(`tutorial_answers_${tutorialId}`),
            ) || [];
          const taskIndex = savedAnswers.findIndex(
            (t) => t._id === questionKey,
          );
          if (taskIndex >= 0) {
            savedAnswers[taskIndex].answers = selected;
            savedAnswers[taskIndex].type = correct ? "success" : "error";
          } else {
            savedAnswers.push({
              _id: questionKey,
              answers: selected,
              type: correct ? "success" : "error",
            });
          }
          window.localStorage.setItem(
            `tutorial_answers_${tutorialId}`,
            JSON.stringify(savedAnswers),
          );
        } catch (e) {
          console.warn("Failed to save answer to localStorage", e);
        }
      }
    }
  };

  const resetQuestion = () => {
    setSelected([]);
    setFreetextValue("");
    setSubmitted(false);
    setIsCorrect(false);
  };

  const allFeedbacks = !freetext
    ? answers
        .filter((a) => selected.includes(a.text) && a.feedback)
        .map((a) => ({ text: a.feedback, correct: a.correct }))
    : [];

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        border: `1px solid ${theme.palette.divider}`,
        overflow: "hidden",
        position: "relative",
        width: "100%",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
          <HelpOutline
            sx={{
              mr: 1,
              color: theme.palette.primary.main,
              verticalAlign: "middle",
            }}
          />
          <Typography variant="h6" fontWeight={600}>
            {question}
          </Typography>
        </Box>

        {multipleChoice && !freetext && (
          <Typography
            variant="body2"
            sx={{ mb: 2, color: theme.palette.text.secondary }}
          >
            (Mehrere Antworten möglich)
          </Typography>
        )}

        {/* Freetext Input */}
        {freetext && (
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              multiline
              minRows={4}
              maxRows={8}
              placeholder="Antwort..."
              value={freetextValue}
              onChange={(e) => setFreetextValue(e.target.value)}
              disabled={submitted}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            {submitted && (
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mt: 1,
                  color: theme.palette.text.secondary,
                }}
              >
                Deine Antwort wurde gespeichert.
              </Typography>
            )}
          </Box>
        )}

        {/* Multiple Choice Answers */}
        {!freetext && (
          <Box>
            {answers.map((a, i) => {
              const isAnswerCorrect = a.correct;
              const isSelected = selected.includes(a.text);

              let bgColor = "transparent";
              let borderColor = theme.palette.divider;

              if (submitted) {
                if (hasCorrectAnswerDefined) {
                  if (isAnswerCorrect && isSelected) {
                    bgColor = theme.palette.success.light;
                    borderColor = theme.palette.success.main;
                  } else if (!isAnswerCorrect && isSelected) {
                    bgColor = theme.palette.error.light;
                    borderColor = theme.palette.error.main;
                  }
                } else {
                  if (isSelected) {
                    bgColor = theme.palette.success.light;
                    borderColor = theme.palette.success.main;
                  }
                }
              }

              return (
                <motion.div
                  key={i}
                  animate={{ scale: submitted && isSelected ? 1.03 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Box
                    sx={{
                      border: `2px solid ${borderColor}`,
                      borderRadius: 2,
                      mb: 1,
                      p: 1.2,
                      transition: "all 0.25s ease",
                      backgroundColor: bgColor,
                      "&:hover": {
                        backgroundColor:
                          !submitted && theme.palette.action.hover,
                      },
                    }}
                  >
                    <FormControlLabel
                      control={
                        multipleChoice ? (
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleSelect(a.text)}
                            disabled={submitted}
                          />
                        ) : (
                          <Radio
                            checked={isSelected}
                            onChange={() => handleSelect(a.text)}
                            disabled={submitted}
                          />
                        )
                      }
                      label={
                        <Typography
                          sx={{
                            fontWeight: 500,
                            color: theme.palette.text.primary,
                          }}
                        >
                          {a.text}
                        </Typography>
                      }
                    />
                  </Box>
                </motion.div>
              );
            })}
          </Box>
        )}

        {/* Feedback */}
        {!freetext && (
          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Show error message if answer is incorrect */}
                {hasCorrectAnswerDefined && !isCorrect && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 2,
                      mb: 1.5,
                    }}
                  >
                    <Cancel
                      sx={{ color: theme.palette.error.main, fontSize: 28 }}
                    />
                    <Typography color="error.main" fontWeight={600}>
                      Leider nicht ganz richtig.
                    </Typography>
                  </Box>
                )}

                {/* Show feedbacks if they exist */}
                {allFeedbacks.length > 0 && (
                  <Box sx={{ mt: 1.5, pl: 4 }}>
                    {allFeedbacks.map((fb, idx) => (
                      <Typography
                        key={idx}
                        variant="body2"
                        sx={{
                          color: fb.correct
                            ? theme.palette.success.dark
                            : theme.palette.error.dark,
                          fontStyle: "italic",
                          mb: 0.5,
                        }}
                      >
                        💡 {fb.text}
                      </Typography>
                    ))}
                  </Box>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Freetext Feedback */}
        {freetext && submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Only show detailed feedback if a reference answer is defined */}
            {answers.length > 0 && answers[0]?.text ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 2,
                  }}
                >
                  {isCorrect ? (
                    <>
                      <CheckCircle
                        sx={{ color: theme.palette.success.main, fontSize: 28 }}
                      />
                      <Typography color="success.main" fontWeight={600}>
                        {"Richtig beantwortet!"}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Cancel
                        sx={{ color: theme.palette.error.main, fontSize: 28 }}
                      />
                      <Typography color="error.main" fontWeight={600}>
                        Leider nicht ganz richtig.
                      </Typography>
                    </>
                  )}
                </Box>

                {/* Show reference answer for comparison if answer was wrong */}
                {!isCorrect && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: theme.palette.action.hover,
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      gutterBottom
                    >
                      Richtig gewesen wäre:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      {answers[0].text}
                    </Typography>
                  </Box>
                )}
              </>
            ) : (
              <>
                {/* No reference answer defined: show feedback if exists, otherwise show "Antwort gespeichert!" */}
                {answers.length > 0 && answers[0]?.feedback ? (
                  <Typography color="success.main" fontWeight={600}>
                    {answers[0].feedback}
                  </Typography>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 2,
                    }}
                  >
                    <CheckCircle
                      sx={{
                        color: theme.palette.success.main,
                        fontSize: 28,
                      }}
                    />
                    <Typography color="success.main" fontWeight={600}>
                      Antwort gespeichert!
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </motion.div>
        )}

        {/* Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
            mt: 3,
          }}
        >
          {!submitted ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={
                freetext
                  ? freetextValue.trim().length === 0
                  : selected.length === 0
              }
            >
              Antwort bestätigen
            </Button>
          ) : (
            <Button variant="outlined" onClick={resetQuestion}>
              Neu versuchen
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
