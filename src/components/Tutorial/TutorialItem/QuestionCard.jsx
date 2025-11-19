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
  useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Cancel, HelpOutline } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { setQuestionAnswered } from "@/actions/tutorialActions";

const QuestionCard = ({ questionData, setNextStepDisabled }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  if (!questionData)
    return (
      <Typography variant="body2" color="text.secondary">
        Keine Frage verfügbar.
      </Typography>
    );

  const { question, answers = [], multipleChoice } = questionData;

  // Cookie prüfen, ob die Frage schon richtig beantwortet wurde
  useEffect(() => {
    const cookieName = `${questionData._id}=true`;
    const alreadyCorrect = document.cookie.includes(cookieName);

    if (alreadyCorrect) {
      setIsCorrect(true);
      setSubmitted(true);
      setSelected(
        answers.filter((a) => a.correct).map((a) => a.text), // richtige Antworten automatisch markieren
      );
    }
  }, [questionData, answers]);

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

  const handleSubmit = () => {
    const correctAnswers = answers
      .filter((a) => a.correct)
      .map((a) => a.text)
      .sort();

    const selectedAnswers = [...selected].sort();

    const correct =
      correctAnswers.length === selectedAnswers.length &&
      correctAnswers.every((val, i) => val === selectedAnswers[i]);

    setIsCorrect(correct);
    // set cookie
    if (correct) {
      document.cookie = `${questionData._id}=true; path=/; max-age=31536000`;
    }
    dispatch(setQuestionAnswered(questionData._id, correct));
    setSubmitted(true);
  };

  const resetQuestion = () => {
    setSelected([]);
    setSubmitted(false);
    setIsCorrect(false);

    const id = questionData?._id;
    // reset the cookie also
    if (id) {
      document.cookie = `${id}=false; path=/; max-age=31536000`;
    }
  };

  // Sammle Feedbacks der ausgewählten Antworten (falls vorhanden)
  const selectedFeedbacks = answers
    .filter((a) => selected.includes(a.text) && a.feedback)
    .map((a) => a.feedback);

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

        {multipleChoice && (
          <Typography
            variant="body2"
            sx={{ mb: 2, color: theme.palette.text.secondary }}
          >
            (Mehrere Antworten möglich)
          </Typography>
        )}

        {/* Antwortmöglichkeiten */}
        <Box>
          {answers.map((a, i) => {
            const isAnswerCorrect = a.correct;
            const isSelected = selected.includes(a.text);

            let bgColor = "transparent";
            let borderColor = theme.palette.divider;

            if (submitted) {
              if (isAnswerCorrect && isSelected) {
                bgColor = theme.palette.success.light;
                borderColor = theme.palette.success.main;
              } else if (!isAnswerCorrect && isSelected) {
                bgColor = theme.palette.error.light;
                borderColor = theme.palette.error.main;
              } else if (isAnswerCorrect) {
                bgColor = theme.palette.success.light;
                borderColor = theme.palette.success.main;
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
                      backgroundColor: !submitted && theme.palette.action.hover,
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

        {/* Gesamtfeedback nach Abgabe */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
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
                      Richtig beantwortet!
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

              {/* 🧠 Custom Feedback der gewählten Antworten */}
              {selectedFeedbacks.length > 0 && (
                <Box sx={{ mt: 1.5, pl: 4 }}>
                  {selectedFeedbacks.map((fb, idx) => (
                    <Typography
                      key={idx}
                      variant="body2"
                      sx={{
                        color: isCorrect
                          ? theme.palette.success.dark
                          : theme.palette.error.dark,
                        fontStyle: "italic",
                        mb: 0.5,
                      }}
                    >
                      💡 {fb}
                    </Typography>
                  ))}
                </Box>
              )}
            </motion.div>
          )}
        </AnimatePresence>

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
              disabled={selected.length === 0}
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
