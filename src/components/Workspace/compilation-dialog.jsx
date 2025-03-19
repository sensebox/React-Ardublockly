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
} from "@mui/material";
import { CodeCompilationIcon } from "./code-compilation-icon";
import DownloadAnimation from "./download-animation";
import { DragDropIcon } from "./drag-drop-icon";
import { connect } from "react-redux";
import { ErrorView } from "../CodeEditor/ErrorView";
// import Drawer from "@mui/material/Drawer";
// import Divider from "@mui/material/Divider";

// Styled Dialog mit angepasster Größe
const StyledDialog = styled(Dialog)(({ theme, errorDetailsOpen }) => ({
  "& .MuiDialog-paper": {
    minHeight: "600px",
    minWidth: "500px",
    backgroundColor: theme.palette.background.paper,
    borderRadius: "12px",
    overflow: "hidden",
    transition:
      "width 0.3s ease, height 0.3s ease, max-width 0.3s ease, max-height 0.3s ease",
    maxHeight: errorDetailsOpen ? "90vh" : "600px",
    maxWidth: errorDetailsOpen ? "800px" : "500px",
  },
}));

// Texte für verschiedene Sprachen
const texts = {
  de: {
    steps: [
      "Kompilierung läuft...",
      "Download wird vorbereitet...",
      "Übertrage die Datei auf deine senseBox",
      "Ein Fehler ist aufgetreten",
    ],
    appTransfer: "App-Übertragung wird vorbereitet...",
    codeCompiled: "Code erfolgreich kompiliert!",
    startTransfer: "Starte Übertragung",
    close: "Schließen",
  },
  en: {
    steps: [
      "Compilation in progress...",
      "Preparing download...",
      "Transfer the file to your senseBox",
      "An error has occurred",
    ],
    appTransfer: "Preparing app transfer...",
    codeCompiled: "Code successfully compiled!",
    startTransfer: "Start transfer",
    close: "Close",
  },
};

function CompilationDialog({
  open,
  onClose,
  selectedBoard,
  onCompileComplete,
  compiler,
  code,
  filename,
  platform,
  appLink,
  language, // Prop für die Sprachwahl (z. B. "de_DE" oder "en_US")
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [compilationId, setCompilationId] = useState(null);
  const [errorDetailsOpen, setErrorDetailsOpen] = useState(false);

  // Referenz für Cleanup
  const progressIntervalRef = useRef();
  const mounted = useRef(true);

  // Konvertiere die Redux-Sprachvariable in das Format, das wir verwenden
  const currentLanguage = language === "de_DE" ? "de" : "en";

  // Texte für die aktuelle Sprache
  const t = texts[currentLanguage] || texts.de;

  // Sichere setState Funktion
  const safeSetState = useCallback((setter) => {
    if (mounted.current) {
      setter();
    }
  }, []);
  const handleErrorDetailsToggle = useCallback((isOpen) => {
    setErrorDetailsOpen(isOpen);
  }, []);

  const startCompilation = useCallback(async () => {
    console.log("Starting compilation...");
    safeSetState(() => {
      setProgress(0);
      setCurrentStep(0);
    });

    const requestData = {
      board:
        selectedBoard === "mcu" || selectedBoard === "mini"
          ? "sensebox-mcu"
          : "sensebox-esp32s2",
      sketch: code,
    };

    progressIntervalRef.current = setInterval(() => {
      safeSetState(() => {
        setProgress((prev) => Math.min(prev + 2, 95));
      });
    }, 100);

    try {
      console.log("Sending compilation request:", requestData);
      const response = await fetch(`${compiler}/compile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      const result = await response.json();
      clearInterval(progressIntervalRef.current);

      if (result.code === "Internal Server Error") {
        safeSetState(() => {
          setError(result.message);
          setCurrentStep(3); // Fehler-Schritt
          setProgress(false);
        });

        // onClose();
        // // Und zeige den alten Drawer an – das kann z. B. durch eine Redux-Aktion geschehen:
        // setDrawerOpen(true);
        return;
      }

      safeSetState(() => {
        console.log(
          "Compilation successful, setting compilationId:",
          result.data.id,
        );
        setCompilationId(result.data.id);
        setProgress(100);
      });

      const timeout = setTimeout(() => {
        safeSetState(() => {
          console.log("Moving to download step...");
          setCurrentStep(1);
        });
      }, 2000);

      return () => clearTimeout(timeout);
    } catch (err) {
      if (!mounted.current) return;
      clearInterval(progressIntervalRef.current);
      safeSetState(() => {
        setError("Kompilierung fehlgeschlagen");
        setCurrentStep(3);
      });
      console.error(err);
    }
  }, [selectedBoard, code, compiler, safeSetState]);

  const startDownload = useCallback(() => {
    console.log("Starting download with compilationId:", compilationId);
    if (!compilationId) {
      console.log("No compilationId available!");
      return;
    }

    const downloadUrl = `${compiler}/download?id=${compilationId}&board=${import.meta.env.VITE_BOARD}&filename=${filename}`;
    console.log("Download URL:", downloadUrl);
    window.open(downloadUrl, "_self");
    setCurrentStep(1);
    setTimeout(() => {
      setCurrentStep(2);
    }, 5000);
  }, [compiler, compilationId, selectedBoard, filename]);

  useEffect(() => {
    console.log("Current step changed to:", currentStep);
    if (currentStep === 1) {
      console.log("Download animation step active");
    }
  }, [currentStep]);

  useEffect(() => {
    return () => {
      mounted.current = false;
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (open) {
      startCompilation();
    }
  }, [open, startCompilation]);

  useEffect(() => {
    console.log("Current step changed to:", currentStep);
    if (currentStep === 1) {
      console.log("Current step is 1, starting download...");
      startDownload();
    }
  }, [currentStep, startDownload]);

  // Hier werden nun die Texte aus dem t-Objekt verwendet
  const steps = [
    {
      title: t.steps[0],
      component: <CodeCompilationIcon />,
    },
    {
      title: platform ? t.appTransfer : t.steps[1],
      component: platform ? (
        <Box sx={{ textAlign: "center", p: 3 }}>
          <Typography variant="h6">{t.codeCompiled}</Typography>
          <Button
            variant="contained"
            href={appLink}
            sx={{ mt: 2 }}
            onClick={onClose}
          >
            {t.startTransfer}
          </Button>
        </Box>
      ) : (
        <DownloadAnimation />
      ),
    },
    {
      title: t.steps[2],
      component: <DragDropIcon />,
    },
    {
      title: "",
      component: (
        <ErrorView error={error} onDetailsToggle={handleErrorDetailsToggle} />
      ),
      // title: t.steps[3],
      // component: (
      //   <Box sx={{ color: "error.main", textAlign: "center", p: 3 }}>
      //     <Typography variant="body1">{error}</Typography>
      //   </Box>
      // ),
    },
  ];

  return (
    <>
      <StyledDialog
        open={open}
        onClose={onClose}
        maxWidth={false}
        errorDetailsOpen={errorDetailsOpen}
      >
        <DialogContent
          sx={{
            p: 0,
            height: "100%",
            bgcolor: "white",
            overflowX: "hidden",
            overflowY: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            msOverflowStyle: "none",
          }}
        >
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 32,
                padding: 32,
                textAlign: "center",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  alignItems: "center",
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 600, color: "primary.main" }}
                  >
                    {steps[currentStep].title}
                  </Typography>
                </motion.div>

                {currentStep === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Box sx={{ position: "relative", display: "inline-flex" }}>
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: "absolute",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: "bold" }}
                        >
                          {/* {Math.round(progress)}% */}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                )}
              </Box>

              {steps[currentStep].component}
              {currentStep === 0 && (
                <Box sx={{ width: "50%" }}>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: "rgba(78, 175, 71, 0.2)",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 6,
                        backgroundColor: "#4EAF47",
                      },
                    }}
                  />
                </Box>
              )}
            </motion.div>
          </Box>

          <Box
            sx={{
              position: "absolute",
              bottom: 24,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              onClick={onClose}
              sx={{
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              {t.close}
            </Button>
          </Box>
        </DialogContent>
      </StyledDialog>
      {/* <Drawer
      //   anchor="bottom"
      //   open={drawerOpen}
      //   onClose={() => setDrawerOpen(false)}
      // >
      //   <div style={{ padding: "1rem" }}>
      //     <h2 style={{ color: "#4EAF47" }}>
      //       {Blockly.Msg.drawer_ideerror_head}
      //     </h2>
      //     <p style={{ color: "#4EAF47" }}>{Blockly.Msg.drawer_ideerror_text}</p>
      //     <Divider style={{ backgroundColor: "white" }} />
      //     <div
      //       style={{
      //         backgroundColor: "black",
      //         color: "#E47128",
      //         padding: "1rem",
      //       }}
      //     >
      //       {error}
      //     </div>
      //   </div>
      // </Drawer> */}
    </>
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
  language: PropTypes.string.isRequired, // Für die Sprachwahl
};

CompilationDialog.defaultProps = {
  compiler: "demo",
  code: "// Demo code",
  filename: "sketch",
  platform: false,
  onCompileComplete: () => {},
};

// Verbinde die Komponente mit Redux, um auf die Spracheinstellung zuzugreifen
const mapStateToProps = (state) => ({
  language: state.general.language, // Hole die Spracheinstellung aus dem Redux-Store
});

export default connect(mapStateToProps)(CompilationDialog);
