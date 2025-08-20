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
  Typography,
  IconButton,
} from "@mui/material";
import { CodeCompilationIcon } from "./CodeCompilationIcon";
import DownloadAnimation from "./DownloadAnimation";
import { DragDropIcon } from "./DragDropIcon";
import { useSelector } from "react-redux";
import * as Blockly from "blockly/core";
import { ErrorView } from "../ErrorView/ErrorView";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faXmark } from "@fortawesome/free-solid-svg-icons";

const headerStyle = {
  fontSize: "1.5rem",
  color: "#4EAF47",
  margin: "1rem",
  fontWeight: "bold",
};

function CompilationDialog({
  open,
  code,
  selectedBoard,
  filename,
  onClose,
  platform,
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [sketchId, setSketchId] = useState(null);
  const [error, setError] = useState(null);
  const compilerUrl = useSelector((state) => state.general.compiler);

  useEffect(() => {
    if (open) {
      handleCompile();
    }
    if (!open) {
      setActiveStep(0);
      setSketchId(null);
      setError(null);
    }
    console.log("selected board:", selectedBoard);
  }, [open]);

  useEffect(() => {
    let timeoutId;
    if (activeStep === 1 && !platform) {
      handleDownloadURL();
      timeoutId = setTimeout(() => {
        setActiveStep(2);
      }, 5000);
    }
    return () => clearTimeout(timeoutId);
  }, [activeStep]);

  useEffect(() => {
    console.log(platform);
  }, []);

  const handleCompile = async () => {
    try {
      const board =
        selectedBoard === "mcu" || selectedBoard === "mini"
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
      if (!response.ok) {
        setError(data.message);
        return;
      }
      if (data.data.id) {
        setSketchId(data.data.id);
        setActiveStep(1);
      }
    } catch (err) {
      console.error("Compilation failed", err);
    }
  };

  const handleDownloadURL = () => {
    const downloadUrl = `${compilerUrl}/download?id=${sketchId}&board=sensebox-mcu&filename=${filename}`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${filename}.bin`;
    link.click();
  };

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      onClose();
      setActiveStep(0);
      setSketchId(null);
      setError(null);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableEscapeKeyDown
      // Feste Größe über PaperProps: Breite und Höhe passen für alle Steps
      PaperProps={{
        style: { width: "600px", minHeight: "600px", maxHeight: "600px" },
      }}
    >
      <DialogContent
        style={{
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "auto", // Falls der Inhalt größer wird als der Container
          }}
        >
          {error && <ErrorView error={error} />}
          {activeStep === 0 && !error && (
            <div style={{ textAlign: "center" }}>
              <span style={headerStyle}>
                {Blockly.Msg.compile_overlay_compile}
              </span>
              <CodeCompilationIcon
                style={{ width: 100, height: 100 }}
                color="primary"
              />
            </div>
          )}
          {activeStep === 1 && !error && !platform && (
            <div style={{ textAlign: "center" }}>
              <span style={headerStyle}>
                {Blockly.Msg.compile_overlay_download}
              </span>
              <DownloadAnimation />
            </div>
          )}
          {activeStep === 1 && !error && platform && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <span style={headerStyle}> {Blockly.Msg.goToApp_title} </span>
              <span style={{ margin: "1rem" }}>{Blockly.Msg.goToApp_text}</span>
              <a
                href={`blocklyconnect-app://sketch/${filename}/${sketchId}/${selectedBoard}`}
              >
                <Button
                  style={{ color: "white", margin: "1rem" }}
                  variant="contained"
                >
                  <FontAwesomeIcon
                    style={{ marginRight: "5px" }}
                    icon={faLink}
                  />
                  {Blockly.Msg.goToApp}
                </Button>
              </a>
            </div>
          )}
          {activeStep === 2 && !error && (
            <div style={{ position: "relative" }}>
              <IconButton
                onClick={handleClose}
                style={{
                  position: "absolute",
                  top: "-31px",
                  right: "-50px",
                  fontSize: "2rem",
                  color: "#4EAF47",
                  fontWeight: "bold",
                  cursor: "pointer",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FontAwesomeIcon icon={faXmark} />
              </IconButton>

              <div style={{ textAlign: "center" }}>
                <span style={headerStyle}>
                  {Blockly.Msg.compile_overlay_transfer}
                </span>
                <DragDropIcon />
                <div style={{ marginTop: "1rem" }}>
                  Übertrage den Sketch per Drag & Drop auf deine MCU.
                </div>
                <span>
                  Benötigst du mehr Hilfe, dann schau in{" "}
                  <a href="https://blockly.sensebox.de/faq">unser FAQ</a>
                </span>
              </div>
            </div>
          )}
        </Box>
        <Box style={{ flexShrink: 0, paddingTop: "1rem", marginTop: "1rem" }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            <Step key={1}>
              <StepLabel
                error={error}
                optional={
                  error && (
                    <Typography variant="caption" color="error">
                      {Blockly.Msg.compile_overlay_error}
                    </Typography>
                  )
                }
              >
                {Blockly.Msg.compile}
              </StepLabel>
            </Step>
            <Step key={2}>
              {!platform && <StepLabel>{Blockly.Msg.download}</StepLabel>}
              {platform && <StepLabel>{Blockly.Msg.transfer}</StepLabel>}
            </Step>
            {!platform && (
              <Step key={3}>
                <StepLabel>{Blockly.Msg.transfer}</StepLabel>
              </Step>
            )}
          </Stepper>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

CompilationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedBoard: PropTypes.string,
  onCompileComplete: PropTypes.func,
  compiler: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  filename: PropTypes.string,
  platform: PropTypes.bool.isRequired,
  appLink: PropTypes.string,
};

CompilationDialog.defaultProps = {
  compiler: "demo",
  code: "// Demo code",
  filename: "sketch",
  platform: false,
  onCompileComplete: () => {},
};

export default CompilationDialog;
