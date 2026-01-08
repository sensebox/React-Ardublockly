import React, { useEffect } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight, QuestionMark } from "@mui/icons-material";
import { useTutorialViewer } from "../hooks/useTutorialViewer";

const FloatingNavigation = ({ tutorialId }) => {
  const [allStepsFinished, setAllStepsFinished] = React.useState(true);

  const { tutorial, currentStep, activeStep, nextStep, previousStep } =
    useTutorialViewer(tutorialId);
  const currentStepIndex = tutorial.steps.findIndex(
    (step) => step._id === currentStep._id,
  );

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === tutorial.steps.length - 1;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
        alignItems: "center",
        gap: 2,
        my: 1,
        pr: 2,
        bgcolor: "transparent", // Hintergrundfarbe des Containers
      }}
    >
      <Tooltip
        title="Zum vorherigen Schritt"
        placement="top"
        slotProps={{
          tooltip: {
            sx: {
              backgroundColor: "white",
              color: "black",
              fontSize: "0.95rem",
              fontWeight: "medium",
              padding: "10px 14px",
              borderRadius: "8px",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
              maxWidth: "280px",
              textAlign: "center",
            },
          },
        }}
      >
        <IconButton
          onClick={previousStep}
          disabled={isFirstStep}
          aria-label="Vorheriger Schritt"
          sx={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 200ms ease-out",
            bgcolor: isFirstStep ? "grey.300" : "common.white",
            color: isFirstStep ? "grey.500" : "text.primary",
            boxShadow: isFirstStep ? "none" : 2,
            "&:hover": {
              boxShadow: isFirstStep ? "none" : 3,
              transform: isFirstStep ? "none" : "scale(1.1)",
            },
            cursor: isFirstStep ? "not-allowed" : "pointer",
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
          color: "text.primary",
        }}
      >
        {currentStepIndex + 1} / {tutorial.steps.length}
      </Typography>

      <Tooltip
        placement="top"
        title={
          isLastStep && !allStepsFinished
            ? "Bitte schließe alle Schritte ab, bevor du das Tutorial beendest."
            : "Zum nächsten Schritt"
        }
        slotProps={{
          tooltip: {
            sx: {
              backgroundColor: "white",
              color: "black",
              fontSize: "0.95rem", // Größer als Standard
              fontWeight: "medium",
              padding: "10px 14px",
              borderRadius: "8px",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
              maxWidth: "280px",
              textAlign: "center",
            },
          },
        }}
      >
        <IconButton
          onClick={
            isLastStep && !allStepsFinished
              ? () => console.log("Kein Fortschritt möglich")
              : nextStep
          }
          aria-label="Nächster Schritt"
          sx={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 200ms ease-out",
            bgcolor:
              isLastStep && !allStepsFinished
                ? "feedback.warning"
                : "primary.main",
            color: "white",
            boxShadow: 2,
            "&:hover": {
              boxShadow: 3,
              transform: "scale(1.1)",
              bgcolor:
                isLastStep && !allStepsFinished
                  ? "feedback.warningDark"
                  : "primary.dark",
            },
            cursor: "pointer",
          }}
        >
          {isLastStep && !allStepsFinished ? (
            <QuestionMark sx={{ fontSize: 20 }} />
          ) : (
            <ChevronRight sx={{ fontSize: 20 }} />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default FloatingNavigation;
