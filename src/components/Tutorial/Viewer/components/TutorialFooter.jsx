import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  LinearProgress,
  Typography,
  useTheme,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useDispatch, useSelector } from "react-redux";

const TutorialFooter = ({ nextStepDisabled }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const activeStep = useSelector((state) => state.tutorial.activeStep);
  const tutorial = useSelector((state) => state.tutorial.tutorials[0]);
  const [disabled, setDisabled] = useState(false);
  // add one extra step for "Fertig"
  const allSteps = [...tutorial.steps];

  const progress = ((activeStep + 1) / allSteps.length) * 100;

  const changeStep = (step) => {
    dispatch({
      type: "TUTORIAL_STEP",
      payload: step,
    });
  };

  const nextStep = () => {
    if (activeStep < allSteps.length - 1) {
      changeStep(activeStep + 1);
    }
  };

  const previousStep = () => {
    if (activeStep > 0) {
      changeStep(activeStep - 1);
    }
  };

  useEffect(() => {
    const step = tutorial.steps[activeStep];
    if (step.type === "blockly") {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [activeStep]);

  return (
    <Box
      component="footer"
      sx={{
        borderTop: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        backdropFilter: "blur(4px)",
        py: 1,
        position: "sticky",
        bottom: 0,
        backgroundColor: "white",
        zIndex: 1,
      }}
    >
      <Box sx={{ maxWidth: "960px", mx: "auto", px: 2 }}>
        {/* Progress Bar */}
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2" fontWeight="500">
              Tutorial Fortschritt
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Schritt {activeStep + 1} von {allSteps.length}
            </Typography>
          </Box>

          <Box sx={{ position: "relative" }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 8, borderRadius: 5, mb: 3 }}
            />

            {/* Step Indicators */}
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              {allSteps.map((step, index) => {
                const isCurrent = index === activeStep;
                const isCompleted = index < activeStep;

                return (
                  <Box
                    key={step.id || index}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor: "pointer",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": { transform: "scale(1.05)" },
                      color: isCurrent
                        ? theme.palette.primary.main
                        : isCompleted
                          ? theme.palette.success.main
                          : theme.palette.text.secondary,
                    }}
                    // onClick={() => changeStep(index)}
                  >
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        border: "2px solid",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 500,
                        bgcolor: isCurrent
                          ? theme.palette.primary.main
                          : isCompleted
                            ? theme.palette.success.main
                            : theme.palette.background.paper,
                        color: isCurrent
                          ? theme.palette.primary.contrastText
                          : isCompleted
                            ? theme.palette.common.white
                            : theme.palette.text.secondary,
                        borderColor: isCurrent
                          ? theme.palette.primary.main
                          : isCompleted
                            ? theme.palette.success.main
                            : theme.palette.divider,
                        mb: 1,
                      }}
                    >
                      {isCompleted ? (
                        <CheckCircleIcon sx={{ fontSize: 16 }} />
                      ) : step.isCompletion ? (
                        "✓"
                      ) : (
                        index + 1
                      )}
                    </Box>
                    <Typography
                      variant="caption"
                      fontWeight="500"
                      align="center"
                      sx={{ maxWidth: 80, lineHeight: 1.2 }}
                    >
                      {step.title}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>

        {/* Navigation */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            maxWidth: "960px",
            mx: "auto",
          }}
        >
          <Button
            variant="outlined"
            disabled={activeStep === 0}
            startIcon={<ChevronLeftIcon />}
            onClick={previousStep}
          >
            Zurück
          </Button>

          {activeStep === allSteps.length - 1 ? (
            <Button
              variant="contained"
              endIcon={<CheckCircleIcon />}
              onClick={() => (window.location.href = "/tutorial")}
            >
              Zurück zur Übersicht
            </Button>
          ) : (
            <Button
              variant="contained"
              endIcon={<ChevronRightIcon />}
              disabled={nextStepDisabled}
              onClick={nextStep}
            >
              Weiter
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TutorialFooter;
