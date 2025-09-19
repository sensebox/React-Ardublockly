import React from "react";
import PropTypes from "prop-types";
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

const TutorialFooter = ({
  activeStep,
  tutorialSteps,
  setCurrentStep,
  hardwareComponents,
}) => {
  const theme = useTheme();
  const progress = (activeStep / tutorialSteps.length) * 100;

  return (
    <Box
      component="footer"
      sx={{
        borderTop: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        backdropFilter: "blur(4px)",
        mt: 4,
        py: 3,
      }}
    >
      <Box sx={{ maxWidth: "960px", mx: "auto", px: 2 }}>
        {/* Progress Bar mit Steps */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography variant="body2" fontWeight="500">
              Tutorial Fortschritt
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Schritt {activeStep} von {tutorialSteps.length}
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
              {tutorialSteps.map((step, index) => {
                const isCurrent = step.id === activeStep;
                const isCompleted = step.completed;

                return (
                  <Box
                    key={step.id}
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
                    onClick={() => setCurrentStep(step.id)}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
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
                      ) : (
                        step.id
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

        {/* Navigation Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: "960px",
            mx: "auto",
          }}
        >
          <Button
            variant="outlined"
            disabled={activeStep === 0}
            startIcon={<ChevronLeftIcon />}
            onClick={() => setactiveStep(Math.max(activeStep - 1, 1))}
          >
            Zurück
          </Button>

          <Button
            variant="contained"
            endIcon={<ChevronRightIcon />}
            onClick={() =>
              setactiveStep(Math.min(activeStep + 1, tutorialSteps.length))
            }
          >
            Weiter
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

TutorialFooter.propTypes = {
  activeStep: PropTypes.number.isRequired,
  tutorialSteps: PropTypes.array.isRequired,
  setactiveStep: PropTypes.func.isRequired,
  hardwareComponents: PropTypes.array.isRequired,
};

export default TutorialFooter;
