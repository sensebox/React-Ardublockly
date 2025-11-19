import React, { useEffect, useState } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";

import { ChevronLeft } from "@mui/icons-material";

import NextButtonIcon from "./NextButtonIcon";
import { computeNavigationState } from "./useNavigationState";
import { useSelector } from "react-redux";

const FloatingNavigation = ({ currentStep, steps, nextStep, previouStep }) => {
  const [nav, setNav] = useState({
    isFirst: false,
    isLast: false,
    isBeforeLast: false,
    allFinished: false,
  });
  const { isFirst, isLast, isBeforeLast, allFinished } = nav;

  const answeredQuestions = useSelector(
    (state) => state.tutorial.answeredQuestions,
  );
  const id = steps[currentStep]?.questionData?.[0]?._id;
  const isQuestion = !!id;
  const isAnswered = id && answeredQuestions?.[id] === true;
  const needsWarning = isQuestion && !isAnswered && !isLast; // Frage + nicht beantwortet

  useEffect(() => {
    setNav(computeNavigationState(currentStep, steps));
  }, [currentStep, steps]);

  // Tooltip-Text
  const nextTooltip = isLast
    ? "Kein weiterer Schritt"
    : isBeforeLast && !allFinished
      ? "Bitte schließe alle Schritte ab, bevor du das Tutorial beendest."
      : "Zum nächsten Schritt";

  // Button-Styles
  const nextBtnStyles = {
    width: 48,
    height: 48,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 200ms ease-out",

    // ❗ Letzter Step → grau & disabled
    ...(isLast && {
      bgcolor: "grey.300",
      color: "grey.600",
      cursor: "not-allowed",
      boxShadow: "none",
      "&:hover": { transform: "none", boxShadow: "none" },
    }),

    // ❗ Frage NICHT beantwortet → Gelb (Warning)
    ...(needsWarning && {
      bgcolor: "feedback.warning",
      color: "white",
      boxShadow: 2,
      cursor: "pointer",
      "&:hover": {
        transform: "scale(1.1)",
        bgcolor: "feedback.warningDark",
      },
    }),

    // ✅ Normaler Step → Blau (Primary)
    ...(!isLast &&
      !needsWarning && {
        bgcolor: "primary.main",
        color: "white",
        boxShadow: 2,
        cursor: "pointer",
        "&:hover": {
          transform: "scale(1.1)",
          bgcolor: "primary.dark",
        },
      }),
  };

  // Button-Aktion
  const handleNextClick = () => {
    if (isLast) return; // deaktiviert
    if (isBeforeLast && !allFinished) return; // Warnung → kein Fortschritt
    nextStep();
  };

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 24,
        right: 16,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: 3,
        mt: 5,
        pr: 2,
      }}
    >
      {/* ← Vorheriger Schritt */}
      <Tooltip title="Zum vorherigen Schritt" placement="top">
        <IconButton
          disabled={isFirst}
          onClick={previouStep}
          sx={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            bgcolor: isFirst ? "grey.300" : "common.white",
            color: isFirst ? "grey.500" : "text.primary",
            boxShadow: isFirst ? "none" : 2,
            "&:hover": !isFirst && {
              transform: "scale(1.1)",
              boxShadow: 3,
            },
          }}
        >
          <ChevronLeft sx={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>

      {/* Schrittzähler */}
      <Typography
        variant="body2"
        sx={{
          textAlign: "center",
          minWidth: "60px",
          fontWeight: "fontWeightMedium",
        }}
      >
        {currentStep + 1} / {steps.length}
      </Typography>

      {/* → Nächster Schritt */}
      <Tooltip title={nextTooltip} placement="top">
        <IconButton
          disabled={isLast}
          onClick={handleNextClick}
          sx={nextBtnStyles}
        >
          <NextButtonIcon
            step={steps[currentStep]}
            answered={answeredQuestions}
            isLast={isLast}
            isWarning={isBeforeLast && !allFinished}
          />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default FloatingNavigation;
