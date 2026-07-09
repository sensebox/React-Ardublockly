import React from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useTutorialViewer } from "../hooks/useTutorialViewer";

const FloatingNavigation = ({ tutorialId }) => {
  const [allStepsFinished, setAllStepsFinished] = React.useState(true);

  const { tutorial, currentStep, activeStep, nextStep, previousStep } =
    useTutorialViewer(tutorialId);

  if (!currentStep || !tutorial?.steps) {
    return null;
  }

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
        <span>
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
        </span>
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
        <span>
          <IconButton
            onClick={nextStep}
            disabled={isLastStep}
            aria-label="Nächster Schritt"
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 200ms ease-out",
              bgcolor: isLastStep ? "grey.300" : "primary.main",
              color: isLastStep ? "grey.500" : "white",
              boxShadow: isLastStep ? "none" : 2,
              "&:hover": {
                boxShadow: isLastStep ? "none" : 3,
                transform: isLastStep ? "none" : "scale(1.1)",
                bgcolor: isLastStep ? "grey.300" : "primary.dark",
              },
              cursor: isLastStep ? "not-allowed" : "pointer",
            }}
          >
            <ChevronRight sx={{ fontSize: 20 }} />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
};

export default FloatingNavigation;
