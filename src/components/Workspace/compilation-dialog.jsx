"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";
import {
  Dialog,
  DialogContent,
  Button,
  Box,
  Typography,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { CodeCompilationIcon } from "./code-compilation-icon";
import DownloadAnimation from "./download-animation";
import { DragDropIcon } from "./drag-drop-icon";
import { connect } from "react-redux";
import * as Blockly from "blockly/core";

function CompilationDialog({ open, onClose }) {
  const [errorDetailsOpen, setErrorDetailsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      errorDetailsOpen={errorDetailsOpen}
    >
      <DialogContent>
        <Box display="flex" justifyContent="center" alignItems="center">
          {activeStep === 0 && (
            <div style={{ textAlign: "center" }}>
              <span
                style={{
                  fontSize: "1.5rem",
                  color: "#4EAF47",
                  marginBottom: "1rem",
                  fontWeight: "bold",
                }}
              >
                {Blockly.Msg.compile_overlay_compile}{" "}
              </span>
              <CodeCompilationIcon
                style={{ width: 100, height: 100 }}
                color="primary"
              />
            </div>
          )}
          {activeStep === 1 && <DownloadAnimation />}
          {activeStep === 2 && <DragDropIcon />}
        </Box>
        <Stepper activeStep={activeStep} alternativeLabel>
          <Step key={1}>
            <StepLabel>Kompilieren</StepLabel>
          </Step>
          <Step key={2}>
            <StepLabel>Herunterladen</StepLabel>
          </Step>
          <Step key={3}>
            <StepLabel>Übertragen</StepLabel>
          </Step>
        </Stepper>
      </DialogContent>
    </Dialog>
  );
}

CompilationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedBoard: PropTypes.string.isRequired,
  onCompileComplete: PropTypes.func,
  compiler: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
  platform: PropTypes.bool.isRequired,
  appLink: PropTypes.string,
  language: PropTypes.string.isRequired, // Globale Sprache aus Redux
};

CompilationDialog.defaultProps = {
  compiler: "demo",
  code: "// Demo code",
  filename: "sketch",
  platform: false,
  onCompileComplete: () => {},
};

const mapStateToProps = (state) => ({
  language: state.general.language,
});

export default connect(mapStateToProps)(CompilationDialog);
