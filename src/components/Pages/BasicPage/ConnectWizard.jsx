"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  Tooltip,
  Modal,
  Paper,
  IconButton,
} from "@mui/material";
import {
  PlayArrow,
  Stop,
  Computer,
  Bluetooth,
  BluetoothDisabled,
  HelpCenter,
  Close as CloseIcon,
  HelpOutline,
} from "@mui/icons-material";
import FlashToolMini from "./FlashtoolMini";
import FlashToolMiniWithTutorial from "./FlashtoolMiniWithTutorial";

const ConnectWizard = ({
  supported,
  connected,
  onConnect,
  onDisconnect,
  onQuick,
  onSend,
}) => {
  const theme = useTheme();
  const [helpOpen, setHelpOpen] = useState(false);

  const handlePlay = async () => {
    if (!connected) return;
    try {
      await onQuick("STOP"); // Remove all previously saved lines
      // small delay to give the Arduino time to process the STOP command
      await new Promise((resolve) => setTimeout(resolve, 100));
      await onSend();
      await onQuick("RUNLOOP"); // Play the new script in a loop
    } catch (err) {
      console.error("Error during play:", err);
    }
  };

  const handleStop = async () => {
    if (!connected) return;
    try {
      await onQuick("STOP");
    } catch (err) {
      console.error("Error during stop:", err);
    }
  };

  const handleDisconnect = async () => {
    if (!connected) return;
    try {
      await onQuick("DISCONNECT");
      await onDisconnect();
    } catch (err) {
      console.error("Error during disconnect:", err);
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 64,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(6px)",
        borderRadius: "12px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        padding: "12px 24px",
        zIndex: 1000,
      }}
    >
      {/* 🔵 Verbindungssymbol */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {connected ? (
          <Bluetooth sx={{ color: theme.palette.success.main }} />
        ) : (
          <BluetoothDisabled sx={{ color: theme.palette.error.main }} />
        )}
        <Typography
          variant="body2"
          sx={{
            color: connected
              ? theme.palette.success.main
              : theme.palette.error.main,
            fontWeight: 600,
          }}
        >
          {connected ? "Connected" : "Disconnected"}
        </Typography>
      </Box>

      {/* ⚙️ Steuerbuttons */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Tooltip title="Connect to senseBox">
          <Button
            variant={connected ? "outlined" : "contained"}
            color={connected ? "error" : "primary"}
            startIcon={<Computer />}
            onClick={connected ? handleDisconnect : onConnect}
            disabled={!supported}
          >
            {connected ? "Disconnect" : "Connect"}
          </Button>
        </Tooltip>
        <Tooltip title="Send & Start program">
          <Button
            onClick={handlePlay}
            disabled={!connected}
            variant="contained"
            color="success"
            startIcon={<PlayArrow />}
          >
            Run
          </Button>
        </Tooltip>
        <Tooltip title="Stop program">
          <Button
            onClick={handleStop}
            disabled={!connected}
            variant="contained"
            color="error"
            startIcon={<Stop />}
          >
            Stop
          </Button>
        </Tooltip>
        <Tooltip title="Help">
          <Button
            onClick={() => setHelpOpen(true)}
            variant="contained"
            startIcon={<HelpCenter />}
            sx={{}}
          >
            Hilfe
          </Button>
        </Tooltip>
      </Box>
      <Modal open={helpOpen} onClose={() => setHelpOpen(false)}>
        <HelpModal onClose={() => setHelpOpen(false)} />
      </Modal>
    </Box>
  );
};

export default ConnectWizard;

const HelpModal = ({ onClose }) => {
  const theme = useTheme();
  const [activeSlide, setActiveSlide] = React.useState(0);

  const slides = [
    {
      title: "Willkommen!",
      text: "In den folgenden Schritten bereiten wir die senseBox:basic für die Programmierung vor und erklären dir die wichtigsten Funktionen.",
      image: "/media/basic/tutorial/senseBox_Logo_bunt_schrift_gruen.png",
    },
    {
      title: "Den :basic Sketch hochladen",
      custom: <FlashToolMiniWithTutorial />,
    },
    {
      title: "Verbinden",
      text: "Starte die senseBox neu und Verbinde dich über den Connect-Button.",
      image: "/media/basic/tutorial/selectUSB.png",
    },
    {
      title: "Action Bar",
      text: "Du bist sogut wie fertig, klicke auf 'Run', um dein Programm zu starten! Stop beendet das Programm und mit Disconnect trennst du die senseBox wieder von deinem Browser",
      image: "/media/basic/tutorial/actionBar.png",
    },
  ];

  const slide = slides[activeSlide];

  const next = () => {
    if (activeSlide < slides.length - 1) {
      setActiveSlide(activeSlide + 1);
    }
  };

  const prev = () => {
    if (activeSlide > 0) {
      setActiveSlide(activeSlide - 1);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        p: 2,
      }}
    >
      <Paper
        elevation={12}
        sx={{
          maxWidth: 500,
          width: "100%",
          p: 4,
          borderRadius: 4,
          position: "relative",
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 12, right: 12 }}
        >
          <CloseIcon />
        </IconButton>

        {/* 🔵 Slide Titel */}
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, mb: 2, textAlign: "center" }}
        >
          {slide.title}
        </Typography>

        {slide.custom ? <Box> {slide.custom}</Box> : null}
        {/* 🔵 Slide Bild */}
        <Box sx={{ textAlign: "center" }}>
          {slide.image && (
            <img
              src={slide.image}
              alt={slide.title}
              style={{
                width: "100%",
                maxHeight: 200,
                objectFit: "contain",
                borderRadius: 8,
              }}
            />
          )}
        </Box>

        {/* 🔵 Slide Text */}
        <Typography variant="body1" sx={{ textAlign: "center", minHeight: 80 }}>
          {slide.text}
        </Typography>

        {/* 🔵 Navigation */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={prev}
            disabled={activeSlide === 0}
          >
            Zurück
          </Button>

          <Typography variant="body2">
            {activeSlide + 1} / {slides.length}
          </Typography>

          <Button
            variant="contained"
            onClick={next}
            disabled={activeSlide === slides.length - 1}
          >
            Weiter
          </Button>
        </Box>

        {/* 🔵 Indicators */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
            mb: 2,
          }}
        >
          {slides.map((_, i) => (
            <Box
              key={i}
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background:
                  i === activeSlide
                    ? theme.palette.primary.main
                    : theme.palette.grey[400],
                transition: "0.3s",
              }}
            />
          ))}
        </Box>

        {/* 🔵 Modal schließen */}
        {activeSlide === slides.length - 1 && (
          <Box textAlign="center" mt={2}>
            <Button variant="contained" onClick={onClose}>
              Verstanden
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};
