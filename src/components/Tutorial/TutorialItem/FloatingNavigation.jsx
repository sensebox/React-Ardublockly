import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

const FloatingNavigation = ({
  currentStep,
  totalSteps,
  nextStep,
  previouStep,
}) => {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
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
        bgcolor: "transparent", // Hintergrundfarbe des Containers
      }}
    >
      {/* Vorheriger Schritt Button */}
      <IconButton
        onClick={previouStep}
        disabled={isFirstStep}
        aria-label="Vorheriger Schritt"
        sx={{
          width: 48, // 12 * 4px
          height: 48,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 200ms ease-out",
          bgcolor: isFirstStep ? "grey.300" : "common.white",
          color: isFirstStep ? "grey.500" : "text.primary",
          boxShadow: isFirstStep ? "none" : 2, // Leichter Schatten
          "&:hover": {
            boxShadow: isFirstStep ? "none" : 3, // Größerer Schatten beim Hover
            transform: isFirstStep ? "none" : "scale(1.1)", // Skalierung beim Hover
          },
          cursor: isFirstStep ? "not-allowed" : "pointer",
        }}
      >
        <ChevronLeft sx={{ fontSize: 20 }} />
      </IconButton>

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
        {currentStep + 1} / {totalSteps}
      </Typography>

      {/* Nächster Schritt Button */}
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
          bgcolor: isLastStep ? "grey.300" : "primary.main", // Grün wenn aktiv
          color: isLastStep ? "grey.500" : "common.white",
          boxShadow: isLastStep ? "none" : 2,
          "&:hover": {
            boxShadow: isLastStep ? "none" : 3,
            transform: isLastStep ? "none" : "scale(1.1)",
            bgcolor: isLastStep ? "grey.300" : "primary.dark", // Dunkleres Grün beim Hover
          },
          cursor: isLastStep ? "not-allowed" : "pointer",
        }}
      >
        <ChevronRight sx={{ fontSize: 20 }} />
      </IconButton>
    </Box>
  );
};

export default FloatingNavigation;
