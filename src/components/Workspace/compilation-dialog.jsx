"use client";

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
} from "@mui/material";
import { CodeCompilationIcon } from "./code-compilation-icon";
import DownloadAnimation from "./download-animation";
import { DragDropIcon } from "./drag-drop-icon";
import { connect, useSelector } from "react-redux";
import * as Blockly from "blockly/core";

const headerStyle = {
  fontSize: "1.5rem",
  color: "#4EAF47",
  margin: "1rem",
  fontWeight: "bold",
};
function CompilationDialog({ open, code, selectedBoard, filename }) {
  const [activeStep, setActiveStep] = useState(0);
  const [sketchId, setSketchId] = useState(null);
  const myRef = React.createRef();
  const compilerUrl = useSelector((state) => state.general.compiler);

  useEffect(() => {
    if (open) {
      handleCompile();
    }
  }, [open]);

  useEffect(() => {
    let timeoutId;
    if (activeStep === 1) {
      handleDownloadURL();
      timeoutId = setTimeout(() => {
        setActiveStep(2);
      }, 5000);
    }
    return () => clearTimeout(timeoutId);
  }, [activeStep]);

  const handleCompile = async () => {
    try {
      const board =
        selectedBoard == "mcu" || selectedBoard == "mini"
          ? "sensebox-mcu"
          : "sensebox-esp32s2";

      const response = await fetch(`${compilerUrl}/compile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sketch: code,
          board,
        }),
      });
      const data = await response.json();
      if (data.data.id) {
        setSketchId(data.data.id);
      }
      setActiveStep(1);
    } catch (error) {
      console.error("Compilation failed", error);
    }
  };
  const handleDownloadURL = () => {
    const downloadUrl = `${compilerUrl}/download?id=${sketchId}&board=sensebox-mcu&filename=${filename}`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${filename}.bin`;
    link.click();
  };

  const handleClose = () => {
    setActiveStep(0);
    setSketchId(null);
  };

  return (
    <Dialog ref={myRef} open={open} onClose={handleClose}>
      <DialogContent
        style={{
          padding: "2rem",
          minHeight: "500px",
          minWidth: "400px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {activeStep === 0 && (
            <div style={{ textAlign: "center" }}>
              <span style={headerStyle}>
                {Blockly.Msg.compile_overlay_compile}{" "}
              </span>
              <CodeCompilationIcon
                style={{ width: 100, height: 100 }}
                color="primary"
              />
            </div>
          )}
          {activeStep === 1 && (
            <div>
              <span style={headerStyle}>
                {" "}
                {Blockly.Msg.compile_overlay_download}
              </span>
              <DownloadAnimation />
            </div>
          )}
          {activeStep === 2 && (
            <div style={{ textAlign: "center" }}>
              <span style={headerStyle}>
                {Blockly.Msg.compile_overlay_transfer}
              </span>
              <DragDropIcon />
              <Button
                style={{ marginTop: "1rem" }}
                variant="contained"
                color="primary"
                onClick={handleClose}
              >
                {Blockly.Msg.dialog_close}
              </Button>
            </div>
          )}
        </Box>
        <Box
          style={{
            flexShrink: 0,
            paddingTop: "1rem",
            marginTop: "1rem",
          }}
        >
          <Stepper activeStep={activeStep} alternativeLabel>
            <Step key={1}>
              <StepLabel>{Blockly.Msg.compile} </StepLabel>
            </Step>
            <Step key={2}>
              <StepLabel>{Blockly.Msg.download}</StepLabel>
            </Step>
            <Step key={3}>
              <StepLabel>{Blockly.Msg.transfer}</StepLabel>
            </Step>
          </Stepper>
        </Box>
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
