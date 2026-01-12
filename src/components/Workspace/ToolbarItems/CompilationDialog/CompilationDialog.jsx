"use client";

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faXmark } from "@fortawesome/free-solid-svg-icons";
import { ErrorView } from "../../../ui/ErrorView.jsx";
import FolderIcon from "@mui/icons-material/Folder";
import UsbIcon from "@mui/icons-material/Usb";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TransferStep from "./TransferStep";

const headerStyle = {
  fontSize: "1.5rem",
  color: "#4EAF47",
  margin: "1rem",
  fontWeight: "bold",
};

function CompilationDialog({ open, code, selectedBoard, onClose, platform, isEmbedded = false }) {
  const [activeStep, setActiveStep] = useState(0);
  const [sketchId, setSketchId] = useState(null);
  const [error, setError] = useState(null);
  const [counter, setCounter] = useState(0);
  const filename = useSelector((state) => state.workspace.name) || "sketch";
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

  const handleCompile = async () => {
    try {
      // In embedded mode, generate fresh code from workspace instead of using stale prop
      // This ensures we always have the latest code in embedded mode where CodeViewer
      // doesn't trigger frequent re-renders. Main route uses the prop as it works fine there.
      let codeToCompile = code;
      
      if (isEmbedded) {
        const workspace = Blockly.getMainWorkspace();
        if (workspace && Blockly.Generator && Blockly.Generator.Arduino) {
          try {
            codeToCompile = Blockly.Generator.Arduino.workspaceToCode(workspace);
          } catch (err) {
            console.warn("Failed to generate code from workspace, using prop:", err);
          }
        }
      }
      console.log("codeToCompile", codeToCompile);
      const board =
        selectedBoard === "MCU" || selectedBoard === "MCU:mini"
          ? "sensebox-mcu"
          : "sensebox-esp32s2";

      const response = await fetch(`${compilerUrl}/compile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sketch: codeToCompile,
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
    const timestamp = new Date();
    const downloadUrl = `${compilerUrl}/download?id=${sketchId}&board=sensebox-mcu&filename=${filename}_v${counter}`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${counter}_${timestamp}.bin`;
    setCounter(counter + 1);
    link.click();
  };

  const handleClose = (event, reason) => {
    // In embedded mode, allow closing on all steps except during compilation
    if (isEmbedded) {
      if (activeStep === 0 && !error) {
        return; // Don't allow closing during compilation
      }
      // Allow closing on all other steps in embedded mode
      onClose();
      setActiveStep(0);
      setSketchId(null);
      setError(null);
      return;
    }

    // Original logic for non-embedded mode
    const shouldClose =
      error ||
      activeStep === 2 ||
      (platform && activeStep === 1)(
        reason !== "backdropClick" && reason !== "escapeKeyDown",
      );

    if (!shouldClose) return;

    onClose();
    setActiveStep(0);
    setSketchId(null);
    setError(null);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableEscapeKeyDown={activeStep !== 2 || !error}
      // Feste Größe über PaperProps: Breite und Höhe passen für alle Steps
      PaperProps={{
        style: { width: "600px", minHeight: "700px", maxHeight: "600px" },
      }}
    >
      {isEmbedded && activeStep >= 1 && (
        <DialogTitle style={{ padding: "8px 16px" }}>
          <IconButton
            onClick={() => handleClose(null, "backdropClick")}
            style={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "#666"
            }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </IconButton>
        </DialogTitle>
      )}
      <DialogContent
        style={{
          padding: isEmbedded && activeStep >= 1 ? "1rem 2rem 2rem 2rem" : "2rem",
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
              <span style={headerStyle}> 
                {Blockly.Msg.goToApp_title} 
              </span>
              <span style={{ margin: "1rem" }}>
                {isEmbedded ? Blockly.Msg.goToApp_text_embedded : Blockly.Msg.goToApp_text}
              </span>
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
                  {isEmbedded ? Blockly.Msg.goToApp_embedded : Blockly.Msg.goToApp}
                </Button>
              </a>
            </div>
          )}
          {activeStep === 2 && !error && <TransferStep />}
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
  selectedBoard: PropTypes.string.isRequired,
  onCompileComplete: PropTypes.func,
  compiler: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
  platform: PropTypes.bool.isRequired,
  appLink: PropTypes.string,
  isEmbedded: PropTypes.bool,
};

CompilationDialog.defaultProps = {
  compiler: "demo",
  code: "// Demo code",
  filename: "sketch",
  platform: false,
  onCompileComplete: () => {},
  isEmbedded: false,
};

export default CompilationDialog;
