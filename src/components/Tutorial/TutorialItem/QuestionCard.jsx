import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Cancel, HelpOutline } from "@mui/icons-material";

const QuestionCard = ({ questionData }) => {
  const theme = useTheme();
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  if (!questionData)
    return (
      <Typography variant="body2" color="text.secondary">
        Keine Frage verfügbar.
      </Typography>
    );

  const { question, answers = [], type } = questionData;

  const handleSubmit = () => {
    const correctAnswer = answers.find((a) => a.correct);
    const correct = selected === correctAnswer?.text;
    setIsCorrect(correct);
    setSubmitted(true);
  };

  const resetQuestion = () => {
    setSelected("");
    setSubmitted(false);
    setIsCorrect(false);
  };

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
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
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

        {/* Antwortmöglichkeiten */}
        <RadioGroup
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {answers.map((a, i) => {
            const isAnswerCorrect = a.correct;
            const isSelected = selected === a.text;

            // Farben nach Zustand bestimmen
            let bgColor = "transparent";
            let borderColor = theme.palette.divider;

            if (submitted) {
              if (isSelected && isCorrect) {
                bgColor = theme.palette.success.light;
                borderColor = theme.palette.success.main;
              } else if (isSelected && !isCorrect) {
                bgColor = theme.palette.error.light;
                borderColor = theme.palette.error.main;
              } else if (!isCorrect && isAnswerCorrect) {
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
                    value={a.text}
                    control={<Radio disabled={submitted} />}
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
        </RadioGroup>

        {/* Feedback Animation */}
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
                      Leider falsch – die richtige Antwort ist grün markiert.
                    </Typography>
                  </>
                )}
              </Box>
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
              disabled={!selected}
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
