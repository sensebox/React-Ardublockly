// "use client";

// import { useEffect, useState, useCallback, useRef } from "react";
// import PropTypes from "prop-types";
// import { motion } from "framer-motion";
// import { styled } from "@mui/material/styles";
// import {
//   Dialog,
//   DialogContent,
//   Button,
//   Box,
//   Typography,
//   CircularProgress,
// } from "@mui/material";
// import { CodeCompilationIcon } from "./code-compilation-icon";
// import { DownloadAnimation } from "./download-animation";
// import { DragDropIcon } from "./drag-drop-icon";

// // Styled Dialog mit angepasster Größe
// const StyledDialog = styled(Dialog)(({ theme }) => ({
//   "& .MuiDialog-paper": {
//     minHeight: "600px",
//     minWidth: "500px",
//     backgroundColor: theme.palette.background.paper,
//     borderRadius: "12px",
//     overflow: "hidden",
//   },
// }));

// function CompilationDialog({
//   open,
//   onClose,
//   selectedBoard,
//   onCompileComplete,
//   compiler,
//   code,
//   filename,
//   platform,
//   appLink,
// }) {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [progress, setProgress] = useState(0);
//   const [error, setError] = useState(null);
//   const [compilationId, setCompilationId] = useState(null);

//   // Referenz für Cleanup
//   const progressIntervalRef = useRef();
//   const mounted = useRef(true);

//   // Sichere setState Funktion
//   const safeSetState = useCallback((setter) => {
//     if (mounted.current) {
//       setter();
//     }
//   }, []);

//   // Kompilierungsprozess
//   const startCompilation = useCallback(async () => {
//     console.log("Starting compilation...");
//     safeSetState(() => {
//       setProgress(0);
//       setCurrentStep(0);
//     });

//     // Simuliere Fortschritt während der Kompilierung
//     progressIntervalRef.current = setInterval(() => {
//       safeSetState(() => {
//         setProgress((prev) => Math.min(prev + 2, 95));
//       });
//     }, 100);

//     try {
//       // Simuliere API-Aufruf wenn kein echter Compiler verfügbar
//       if (!compiler || compiler === "demo") {
//         console.log("Using demo compiler");
//         await new Promise((resolve) => setTimeout(resolve, 2000)); // Simuliere Netzwerkverzögerung
//         const result = {
//           data: {
//             id: "demo-compilation-" + Date.now(),
//           },
//         };

//         if (!mounted.current) return;

//         clearInterval(progressIntervalRef.current);

//         safeSetState(() => {
//           setCompilationId(result.data.id);
//           setProgress(100);
//         });

//         // Warte kurz bevor zum Download-Schritt gewechselt wird
//         const timeout = setTimeout(() => {
//           safeSetState(() => {
//             setCurrentStep(1);
//           });
//         }, 2000);

//         return () => clearTimeout(timeout);
//       }

//       // Echter API-Aufruf
//       const data = {
//         board:
//           selectedBoard === "mcu" || selectedBoard === "mini"
//             ? "sensebox-mcu"
//             : "sensebox-esp32s2",
//         sketch: code,
//       };

//       console.log("Sending compilation request:", data);
//       const response = await fetch(`${compiler}/compile`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });

//       const result = await response.json();

//       if (!mounted.current) return;

//       clearInterval(progressIntervalRef.current);

//       if (result.code === "Internal Server Error") {
//         safeSetState(() => {
//           setError(result.message);
//           setCurrentStep(3);
//         });
//         return;
//       }

//       safeSetState(() => {
//         console.log(
//           "Compilation successful, setting compilationId:",
//           result.data.id,
//         );
//         setCompilationId(result.data.id);
//         setProgress(100);
//       });

//       // Warte kurz bevor zum Download-Schritt gewechselt wird
//       const timeout = setTimeout(() => {
//         safeSetState(() => {
//           console.log("Moving to download step...");
//           setCurrentStep(1);
//         });
//       }, 2000);

//       return () => clearTimeout(timeout);
//     } catch (err) {
//       if (!mounted.current) return;
//       clearInterval(progressIntervalRef.current);
//       safeSetState(() => {
//         setError("Kompilierung fehlgeschlagen");
//         setCurrentStep(3);
//       });
//     }
//   }, [selectedBoard, code, compiler, safeSetState]);

//   // Download-Prozess
//   const startDownload = useCallback(() => {
//     console.log("Starting download with compilationId:", compilationId);
//     if (!compilationId) {
//       console.log("No compilationId available!");
//       return;
//     }

//     const downloadUrl = `${compiler}/download?id=${compilationId}&board=${selectedBoard}&filename=${filename}`;
//     console.log("Download URL:", downloadUrl);

//     // Bei ESP32 zeigen wir die Drag & Drop Animation
//     if (selectedBoard === "esp32") {
//       console.log("ESP32 board detected, showing drag & drop animation");
//       safeSetState(() => {
//         setCurrentStep(2);
//       });
//     } else {
//       console.log("Starting direct download");
//       window.open(downloadUrl, "_self");
//       onClose();
//     }
//   }, [compiler, compilationId, selectedBoard, filename, onClose, safeSetState]);

//   // Cleanup bei Unmount
//   useEffect(() => {
//     return () => {
//       mounted.current = false;
//       if (progressIntervalRef.current) {
//         clearInterval(progressIntervalRef.current);
//       }
//     };
//   }, []);

//   // Starte Kompilierung wenn Dialog geöffnet wird
//   useEffect(() => {
//     if (open) {
//       startCompilation();
//     }
//   }, [open, startCompilation]);

//   // Starte Download wenn Kompilierung abgeschlossen
//   useEffect(() => {
//     console.log("Current step changed to:", currentStep);
//     if (currentStep === 1) {
//       console.log("Current step is 1, starting download...");
//       startDownload();
//     }
//   }, [currentStep, startDownload]);

//   const steps = [
//     {
//       title: "Kompilierung läuft...",
//       component: <CodeCompilationIcon />,
//     },
//     {
//       title: platform
//         ? "App-Übertragung wird vorbereitet..."
//         : "Download wird vorbereitet...",
//       component: platform ? (
//         <Box sx={{ textAlign: "center", p: 3 }}>
//           <Typography variant="h6">Code erfolgreich kompiliert!</Typography>
//           <Button
//             variant="contained"
//             href={appLink}
//             sx={{ mt: 2 }}
//             onClick={onClose}
//           >
//             Starte Übertragung
//           </Button>
//         </Box>
//       ) : (
//         <DownloadAnimation />
//       ),
//     },
//     {
//       title: "Übertrage die Datei auf deine senseBox",
//       component: <DragDropIcon />,
//     },
//     {
//       title: "Ein Fehler ist aufgetreten",
//       component: (
//         <Box sx={{ color: "error.main", textAlign: "center", p: 3 }}>
//           <Typography variant="body1">{error}</Typography>
//         </Box>
//       ),
//     },
//   ];

//   return (
//     <StyledDialog open={open} onClose={onClose} maxWidth={false}>
//       <DialogContent sx={{ p: 0, height: "100%", bgcolor: "white" }}>
//         <Box
//           sx={{
//             height: "100%",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             position: "relative", // Hinzugefügt
//           }}
//         >
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             transition={{ duration: 0.5 }}
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: 32,
//               padding: 32,
//               textAlign: "center",
//               width: "100%", // Hinzugefügt
//             }}
//           >
//             {steps[currentStep].component}

//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: 3,
//                 alignItems: "center",
//               }}
//             >
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3 }}
//               >
//                 <Typography
//                   variant="h5"
//                   sx={{
//                     fontWeight: 600,
//                     color: "primary.main",
//                   }}
//                 >
//                   {steps[currentStep].title}
//                 </Typography>
//               </motion.div>

//               {currentStep === 0 && (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.4 }}
//                 >
//                   <Box sx={{ position: "relative", display: "inline-flex" }}>
//                     <CircularProgress
//                       size={40}
//                       value={progress}
//                       variant="determinate"
//                     />
//                     <Box
//                       sx={{
//                         top: 0,
//                         left: 0,
//                         bottom: 0,
//                         right: 0,
//                         position: "absolute",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <Typography variant="caption" sx={{ fontWeight: "bold" }}>
//                         {Math.round(progress)}%
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </motion.div>
//               )}
//             </Box>
//           </motion.div>
//         </Box>

//         <Box
//           sx={{
//             position: "absolute",
//             bottom: 24,
//             left: 0,
//             right: 0,
//             display: "flex",
//             justifyContent: "center",
//           }}
//         >
//           <Button
//             variant="contained"
//             onClick={onClose}
//             sx={{
//               "&:hover": {
//                 backgroundColor: "primary.dark",
//               },
//             }}
//           >
//             {currentStep === 2 ? "Fertigstellen" : "Schließen"}
//           </Button>
//         </Box>
//       </DialogContent>
//     </StyledDialog>
//   );
// }

// CompilationDialog.propTypes = {
//   open: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   selectedBoard: PropTypes.string.isRequired,
//   onCompileComplete: PropTypes.func,
//   compiler: PropTypes.string.isRequired,
//   code: PropTypes.string.isRequired,
//   filename: PropTypes.string.isRequired,
//   platform: PropTypes.bool.isRequired,
//   appLink: PropTypes.string,
// };

// CompilationDialog.defaultProps = {
//   compiler: "demo", // Fallback für Demo-Modus
//   code: "// Demo code",
//   filename: "sketch",
//   platform: false,
//   onCompileComplete: () => {},
// };

// export default CompilationDialog;
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
  CircularProgress,
} from "@mui/material";
import { CodeCompilationIcon } from "./code-compilation-icon";
import DownloadAnimation from "./download-animation";
import { DragDropIcon } from "./drag-drop-icon";

// Styled Dialog mit angepasster Größe
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    minHeight: "600px",
    minWidth: "500px",
    backgroundColor: theme.palette.background.paper,
    borderRadius: "12px",
    overflow: "hidden",
  },
}));

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
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [compilationId, setCompilationId] = useState(null);

  // Referenz für Cleanup
  const progressIntervalRef = useRef();
  const mounted = useRef(true);

  // Sichere setState Funktion
  const safeSetState = useCallback((setter) => {
    if (mounted.current) {
      setter();
    }
  }, []);

  // Kompilierungsprozess
  // const startCompilation = useCallback(async () => {
  //   console.log("Starting compilation...");
  //   safeSetState(() => {
  //     setProgress(0);
  //     setCurrentStep(0);
  //   });

  //   // Simuliere Fortschritt während der Kompilierung
  //   progressIntervalRef.current = setInterval(() => {
  //     safeSetState(() => {
  //       setProgress((prev) => Math.min(prev + 2, 95));
  //     });
  //   }, 100);

  //   try {
  //     // Demo-Modus falls kein echter Compiler verfügbar ist
  //     if (!compiler || compiler === "demo") {
  //       console.log("Using demo compiler");
  //       await new Promise((resolve) => setTimeout(resolve, 2000)); // Simuliere Netzwerkverzögerung
  //       const result = {
  //         data: {
  //           id: "demo-compilation-" + Date.now(),
  //         },
  //       };

  //       if (!mounted.current) return;

  //       clearInterval(progressIntervalRef.current);

  //       safeSetState(() => {
  //         setCompilationId(result.data.id);
  //         setProgress(100);
  //       });

  //       // Warte kurz, bevor zum Download-Schritt gewechselt wird
  //       const timeout = setTimeout(() => {
  //         safeSetState(() => {
  //           setCurrentStep(1);
  //         });
  //       }, 2000);

  //       return () => clearTimeout(timeout);
  //     }

  //     // Echter API-Aufruf
  //     const data = {
  //       board:
  //         selectedBoard === "mcu" || selectedBoard === "mini"
  //           ? "sensebox-mcu"
  //           : "sensebox-esp32s2",
  //       sketch: code,
  //     };

  //     console.log("Sending compilation request:", data);
  //     const response = await fetch(`${compiler}/compile`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(data),
  //     });

  //     const result = await response.json();

  //     if (!mounted.current) return;

  //     clearInterval(progressIntervalRef.current);

  //     if (result.code === "Internal Server Error") {
  //       safeSetState(() => {
  //         setError(result.message);
  //         setCurrentStep(3);
  //       });
  //       return;
  //     }

  //     safeSetState(() => {
  //       console.log(
  //         "Compilation successful, setting compilationId:",
  //         result.data.id,
  //       );
  //       setCompilationId(result.data.id);
  //       setProgress(100);
  //     });

  //     // Warte kurz, bevor zum Download-Schritt gewechselt wird
  //     const timeout = setTimeout(() => {
  //       safeSetState(() => {
  //         console.log("Moving to download step...");
  //         setCurrentStep(1);
  //       });
  //     }, 2000);

  //     return () => clearTimeout(timeout);
  //   } catch (err) {
  //     if (!mounted.current) return;
  //     clearInterval(progressIntervalRef.current);
  //     safeSetState(() => {
  //       setError("Kompilierung fehlgeschlagen");
  //       setCurrentStep(3);
  //     });
  //   }
  // }, [selectedBoard, code, compiler, safeSetState]);

  const startCompilation = useCallback(async () => {
    console.log("Starting compilation...");
    // Setze den Fortschritt auf 0 und den aktuellen Schritt auf 0
    safeSetState(() => {
      setProgress(0);
      setCurrentStep(0);
    });

    // Bereite die Daten vor:
    const requestData = {
      board:
        selectedBoard === "mcu" || selectedBoard === "mini"
          ? "sensebox-mcu"
          : "sensebox-esp32s2",
      sketch: code, // code entspricht this.props.arduino
    };

    // Setze ein Intervall, um den Fortschritt zu simulieren:
    progressIntervalRef.current = setInterval(() => {
      safeSetState(() => {
        setProgress((prev) => Math.min(prev + 2, 95));
      });
    }, 100);

    try {
      // Führe den echten API-Aufruf aus:
      console.log("Sending compilation request:", requestData);
      const response = await fetch(`${compiler}/compile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      const result = await response.json();

      // Stoppe das Fortschritts-Intervall:
      clearInterval(progressIntervalRef.current);

      // Falls der Server einen Fehler zurückgibt:
      if (result.code === "Internal Server Error") {
        safeSetState(() => {
          setError(result.message);
          setCurrentStep(3); // Schritt 3 für Fehleranzeige
          setProgress(false);
        });
        return;
      }

      // Kompilierung war erfolgreich:
      safeSetState(() => {
        console.log(
          "Compilation successful, setting compilationId:",
          result.data.id,
        );
        setCompilationId(result.data.id);
        setProgress(100);
      });

      // Warte kurz, bevor du zum Download-Schritt wechselst
      const timeout = setTimeout(() => {
        safeSetState(() => {
          console.log("Moving to download step...");
          setCurrentStep(1);
        });
      }, 2000);

      return () => clearTimeout(timeout);
    } catch (err) {
      // Stoppe das Fortschritts-Intervall und setze den Fehler
      if (!mounted.current) return;
      clearInterval(progressIntervalRef.current);
      safeSetState(() => {
        setError("Kompilierung fehlgeschlagen");
        setCurrentStep(3);
      });
      console.error(err);
    }
  }, [selectedBoard, code, compiler, safeSetState]);

  // Download-Prozess

  // Erstelle die Download-URL, hier verwenden wir selectedBoard direkt

  // const startDownload = useCallback(() => {
  //   console.log("Starting download with compilationId:", compilationId);
  //   if (!compilationId) {
  //     console.log("No compilationId available!");
  //     return;
  //   }

  //   const downloadUrl = `${compiler}/download?id=${compilationId}&board=${import.meta.env.VITE_BOARD}&filename=${filename}`;
  //   console.log("Download URL:", downloadUrl);

  //   // if (selectedBoard === "esp32") {
  //   //   console.log("ESP32 board detected: triggering download");
  //   // Startet den Download im aktuellen Fenster:
  //   window.open(downloadUrl, "_self");

  //   // Setze Schritt 1: Download Animation
  //   setCurrentStep(1);

  //   // Nach 3 Sekunden wechsle zu Schritt 2: Drag & Drop
  //   setTimeout(() => {
  //     setCurrentStep(2);
  //   }, 5000);
  //   // } else {
  //   console.log("Starting direct download for non-ESP32 board");
  //   window.open(downloadUrl, "_self");
  //   onClose();
  //   // }
  // }, [compiler, compilationId, selectedBoard, filename, onClose]);

  const startDownload = useCallback(() => {
    console.log("Starting download with compilationId:", compilationId);
    if (!compilationId) {
      console.log("No compilationId available!");
      return;
    }

    // Erstelle die Download-URL, hier wird selectedBoard verwendet
    const downloadUrl = `${compiler}/download?id=${compilationId}&board=${import.meta.env.VITE_BOARD}&filename=${filename}`;
    console.log("Download URL:", downloadUrl);

    // Starte den Download im aktuellen Fenster
    window.open(downloadUrl, "_self");

    // Setze den aktuellen Schritt auf 1: Download-Animation anzeigen
    setCurrentStep(1);

    // Nach 3 Sekunden wechsle zu Schritt 2: Drag & Drop-Grafik anzeigen
    setTimeout(() => {
      setCurrentStep(2);
    }, 5000);
  }, [compiler, compilationId, selectedBoard, filename]);

  // Im useEffect: wenn currentStep 1 erreicht wird, starte startDownload
  useEffect(() => {
    console.log("Current step changed to:", currentStep);
    if (currentStep === 1) {
      console.log("Download animation step active");
      // Hier passiert nichts weiter, da wir den Timeout in startDownload nutzen,
      // um nach 3 Sekunden zu Schritt 2 zu wechseln.
    }
    // Falls currentStep === 0 oder 3, wird entsprechend der Kompilierungsprozess oder Fehleranzeige dargestellt.
  }, [currentStep]);

  // Cleanup bei Unmount
  useEffect(() => {
    return () => {
      mounted.current = false;
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Starte Kompilierung, wenn Dialog geöffnet wird
  useEffect(() => {
    if (open) {
      startCompilation();
    }
  }, [open, startCompilation]);

  // Starte Download, wenn Kompilierung abgeschlossen
  useEffect(() => {
    console.log("Current step changed to:", currentStep);
    if (currentStep === 1) {
      console.log("Current step is 1, starting download...");
      startDownload();
    }
  }, [currentStep, startDownload]);

  // const steps = [
  //   {
  //     title: "Kompilierung läuft...",
  //     component: <CodeCompilationIcon />,
  //   },
  //   {
  //     title: platform
  //       ? "App-Übertragung wird vorbereitet..."
  //       : "Download wird vorbereitet...",
  //     component: platform ? (
  //       <Box sx={{ textAlign: "center", p: 3 }}>
  //         <Typography variant="h6">Code erfolgreich kompiliert!</Typography>
  //         <Button
  //           variant="contained"
  //           href={appLink}
  //           sx={{ mt: 2 }}
  //           onClick={onClose}
  //         >
  //           Starte Übertragung
  //         </Button>
  //       </Box>
  //     ) : (
  //       <DownloadAnimation />
  //     ),
  //   },
  //   {
  //     title: "Übertrage die Datei auf deine senseBox",
  //     component: <DragDropIcon />,
  //   },
  //   {
  //     title: "Ein Fehler ist aufgetreten",
  //     component: (
  //       <Box sx={{ color: "error.main", textAlign: "center", p: 3 }}>
  //         <Typography variant="body1">{error}</Typography>
  //       </Box>
  //     ),
  //   },
  // ];

  const steps = [
    {
      title: "Kompilierung läuft...",
      component: <CodeCompilationIcon />,
    },
    {
      title: platform
        ? "App-Übertragung wird vorbereitet..."
        : "Download wird vorbereitet...",
      component: platform ? (
        <Box sx={{ textAlign: "center", p: 3 }}>
          <Typography variant="h6">Code erfolgreich kompiliert!</Typography>
          <Button
            variant="contained"
            href={appLink}
            sx={{ mt: 2 }}
            onClick={onClose}
          >
            Starte Übertragung
          </Button>
        </Box>
      ) : (
        <DownloadAnimation />
      ),
    },
    {
      title: "Übertrage die Datei auf deine senseBox",
      component: <DragDropIcon />,
    },
    {
      title: "Ein Fehler ist aufgetreten",
      component: (
        <Box sx={{ color: "error.main", textAlign: "center", p: 3 }}>
          <Typography variant="body1">{error}</Typography>
        </Box>
      ),
    },
  ];

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth={false}>
      <DialogContent sx={{ p: 0, height: "100%", bgcolor: "white" }}>
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
            {steps[currentStep].component}

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
                    <CircularProgress
                      size={40}
                      value={progress}
                      variant="determinate"
                    />
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
                      <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                        {Math.round(progress)}%
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              )}
            </Box>
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
            {currentStep === 2 ? "Schließen" : "Schließen"}
          </Button>
        </Box>
      </DialogContent>
    </StyledDialog>
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
};

CompilationDialog.defaultProps = {
  compiler: "demo",
  code: "// Demo code",
  filename: "sketch",
  platform: false,
  onCompileComplete: () => {},
};

export default CompilationDialog;
