"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Button,
  Collapse,
  Divider,
  Alert,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import FlashToolMini from "./FlashToolMini";
import TutorialCard from "./TutorialCard";

export default function FlashToolMiniWithTutorial() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [supported, setSupported] = useState(true);
  const serial = navigator.serial;

  useEffect(() => {
    if (!("serial" in navigator)) {
      setSupported(false);
    }
  }, []);

  return (
    <Paper
      elevation={6}
      sx={{
        p: 2,
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {supported && (
        <>
          <TutorialCard />
          <FlashToolMini />
        </>
      )}

      {!supported && (
        <Alert severity="warning" sx={{ mb: 2, textAlign: "left" }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Dein Browser unterstützt die WebSerial API nicht.
          </Typography>
          <Typography sx={{ mt: 1 }}>
            Um eine senseBox oder einen ESP32 direkt über USB zu flashen,
            benötigst du einen modernen Browser.
          </Typography>

          <Typography sx={{ mt: 1, fontWeight: 600 }}>
            Empfohlene Browser:
          </Typography>
          <ul>
            <li>Google Chrome (Desktop)</li>
            <li>Microsoft Edge (Desktop)</li>
            <li>Opera</li>
          </ul>

          <Typography sx={{ mt: 1 }}>
            Safari und Firefox unterstützen WebSerial derzeit nicht.
          </Typography>
        </Alert>
      )}

      {/* Wenn WebSerial fehlt → nichts weiter anzeigen */}
      {!supported && (
        <Typography sx={{ opacity: 0.6 }}>
          WebSerial wird benötigt, um direkt mit Boards zu kommunizieren.
        </Typography>
      )}
    </Paper>
  );
}
