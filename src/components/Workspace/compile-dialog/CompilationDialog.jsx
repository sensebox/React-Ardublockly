"use client";

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { styled } from "@mui/material/styles";
import {
  Dialog,
  DialogContent,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { steps } from "./steps.jsx";
import { senseboxColors, dialogStyles } from "./theme";

// Styled Components
const StyledDialog = styled(Dialog)(() => ({
  "& .MuiDialog-paper": dialogStyles.paper,
}));

function CompilationDialog({ open, onClose, selectedBoard, progressValue }) {
  console.log("[CompilationDialog] Rendering with props:", {
    open,
    selectedBoard,
    progressValue,
  });

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    console.log("[CompilationDialog] Component mounted");
    return () => console.log("[CompilationDialog] Component will unmount");
  }, []);

  useEffect(() => {
    console.warn("[CompilationDialog] Progress value changed:", progressValue);
    if (progressValue >= 100) {
      console.info(
        "[CompilationDialog] Progress complete, starting step transitions",
      );

      const timer1 = setTimeout(() => {
        console.debug("[CompilationDialog] Moving to step 1");
        setCurrentStep(1);
      }, 3000);

      const timer2 = setTimeout(() => {
        console.debug("[CompilationDialog] Moving to step 2");
        setCurrentStep(2);
      }, 6000);

      return () => {
        console.debug("[CompilationDialog] Cleaning up step transition timers");
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [progressValue]);

  useEffect(() => {
    console.info("[CompilationDialog] Current step changed to:", currentStep);
  }, [currentStep]);

  const handleClose = () => {
    console.info("[CompilationDialog] Dialog closing");
    onClose();
  };

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      TransitionProps={{
        onEnter: () => console.debug("[CompilationDialog] Dialog entering"),
        onExited: () => console.debug("[CompilationDialog] Dialog exited"),
      }}
    >
      <DialogContent sx={{ p: 0, height: "100%" }}>
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
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
              }}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  damping: 15,
                  stiffness: 200,
                }}
              >
                <Box sx={{ color: senseboxColors.blue }}>
                  {steps[currentStep].icon}
                </Box>
              </motion.div>

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
                    sx={{
                      fontWeight: 600,
                      color: senseboxColors.blue,
                    }}
                  >
                    {steps[currentStep].title}
                  </Typography>
                </motion.div>

                {currentStep === 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <motion.div
                      animate={{
                        rotate: 360,
                        transition: {
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        },
                      }}
                    >
                      <CircularProgress color="success" />
                    </motion.div>
                  </motion.div>
                )}
              </Box>
            </motion.div>
          </AnimatePresence>
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
            variant="outlined"
            onClick={handleClose}
            sx={{
              borderColor: senseboxColors.blue,
              color: senseboxColors.blue,
              "&:hover": {
                borderColor: senseboxColors.blue,
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            Schließen
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
  progressValue: PropTypes.number.isRequired,
};

export default CompilationDialog;
