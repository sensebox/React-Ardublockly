import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Stepper,
  Step,
  StepLabel,
  IconButton,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "./wizardAnimations.css";

/**
 * Streamlined multi-step wizard dialog.
 *
 * Renders one step at a time. Steps advance themselves automatically once their
 * work is done by calling the `goNext` callback they receive as a prop, so there
 * is no manual "next" button – the flow feels guided and continuous. A subtle
 * stepper at the bottom shows the overall progress.
 *
 * Each step is described by an object: `{ label, Component }`, where `Component`
 * is a React component rendered for that step and receives the navigation
 * helpers `{ goNext, goBack, onClose, isFirstStep, isLastStep }`.
 */
function CompileAndUploadDialog({ open, onClose, steps, title }) {
  const [activeStep, setActiveStep] = useState(0);

  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === steps.length - 1;
  const ActiveStepComponent = steps[activeStep]?.Component;

  const handleClose = () => {
    onClose();
    // Reset to first step once the close animation has had time to start.
    setActiveStep(0);
  };

  const goNext = () => {
    setActiveStep((step) => Math.min(steps.length - 1, step + 1));
  };

  const goBack = () => {
    setActiveStep((step) => Math.max(0, step - 1));
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: {
          width: "600px",
          minHeight: "60vh",
          maxHeight: "70vh",
          borderRadius: "16px",
        },
      }}
    >
      <DialogTitle
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {title}
        <IconButton onClick={handleClose} size="small" aria-label="Close">
          <FontAwesomeIcon icon={faXmark} />
        </IconButton>
      </DialogTitle>

      <DialogContent
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box
          // Remount on step change so the entrance animation replays.
          key={activeStep}
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "auto",
          }}
        >
          {ActiveStepComponent && (
            <ActiveStepComponent
              goNext={goNext}
              goBack={goBack}
              onClose={handleClose}
              isFirstStep={isFirstStep}
              isLastStep={isLastStep}
            />
          )}
        </Box>

        <Box style={{ flexShrink: 0, paddingTop: "1rem", marginTop: "1rem" }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((step) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

CompileAndUploadDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      Component: PropTypes.elementType.isRequired,
    }),
  ).isRequired,
};

export default CompileAndUploadDialog;
