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
  Start,
  Rocket,
} from "@mui/icons-material";
import FlashtoolMiniWithTutorial from "./FlashtoolMiniWithTutorial";

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
            startIcon={<Rocket />}
            sx={{}}
          >
            Quickstart
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
      text: " Bevor du mit Blockly Basic programmieren kannst, muss der Grundsketch auf deine senseBox geladen werden. Dieser ermöglicht die Kommunikation zwischen deinem Computer und der senseBox.",
      custom: <FlashtoolMiniWithTutorial />,
    },
    // {
    //   title: "Verbinden",
    //   text: "Resette jetzt deine senseBox !",
    //   image: "/media/basic/tutorial/resetBtn.png",
    // },
    {
      title: "Action Bar",
      text: "Nachdem du die senseBox neu gestartet hast, kannst du Blockly Basic verwenden. Die Action Bar bietet dir Schnellzugriffe auf wichtige Funktionen.",
      custom: (
        <ul
          style={{
            textAlign: "left",
            padding: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <li
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{ display: "flex", gap: "12px", flexDirection: "column" }}
            >
              <Tooltip title="Connect to senseBox">
                <Button
                  variant={"outlined"}
                  color={"error"}
                  startIcon={<Computer />}
                >
                  Disconnect
                </Button>
              </Tooltip>

              <Tooltip title="Connect to senseBox">
                <Button
                  variant={"contained"}
                  color={"primary"}
                  startIcon={<Computer />}
                >
                  Connect
                </Button>
              </Tooltip>
            </div>

            <div style={{ fontSize: "0.95rem", opacity: 0.85 }}>
              <strong>Verbindung verwalten: </strong>
              Mit diesen beiden Schaltflächen kannst du deine senseBox verbinden
              oder die bestehende Verbindung sauber trennen.
            </div>
          </li>

          {/* RUN */}
          <li
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <Tooltip title="Send & Start program">
              <Button
                variant="contained"
                color="success"
                startIcon={<PlayArrow />}
              >
                Run
              </Button>
            </Tooltip>

            <div style={{ fontSize: "0.95rem", opacity: 0.85 }}>
              <strong>Programm starten: </strong>
              Dein Sketch wird hochgeladen und direkt auf der senseBox
              ausgeführt.
            </div>
          </li>

          {/* STOP */}
          <li
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <Tooltip title="Stop program">
              <Button variant="contained" color="error" startIcon={<Stop />}>
                Stop
              </Button>
            </Tooltip>

            <div style={{ fontSize: "0.95rem", opacity: 0.85 }}>
              <strong>Programm beenden: </strong>
              Stoppt den aktuell laufenden Code auf der senseBox sofort.
            </div>
          </li>

          {/* HELP */}
          <li
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <Tooltip title="Help">
              <Button variant="contained" startIcon={<HelpCenter />}>
                Hilfe
              </Button>
            </Tooltip>

            <div style={{ fontSize: "0.95rem", opacity: 0.85 }}>
              <strong>Hilfe & Anleitung: </strong>
              Öffnet diese Erklärung erneut, falls du Unterstützung brauchst.
            </div>
          </li>
        </ul>
      ),
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
          maxWidth: 600,
          maxHeight: "80vh",
          overflow: "scroll",
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
          sx={{ fontWeight: 700, mb: 0, textAlign: "center" }}
        >
          {slide.title}
        </Typography>

        {/* 🔵 Slide Text */}
        <Typography variant="body1" sx={{ textAlign: "center", minHeight: 80 }}>
          {slide.text}
        </Typography>

        {slide.custom ? (
          <Box sx={{ textAlign: "center", my: 1 }}> {slide.custom}</Box>
        ) : null}
        {/* 🔵 Slide Bild */}
        <Box sx={{ textAlign: "center" }}>
          {slide.image && (
            <img
              src={slide.image}
              alt={slide.title}
              style={{
                width: "100%",
                maxHeight: 500,
                objectFit: "contain",
                borderRadius: 8,
              }}
            />
          )}
        </Box>

        {/* 🔵 Navigation */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={prev}
            disabled={activeSlide === 0}
          >
            Zurück
          </Button>

          <Box>
            <Typography variant="body2">
              {activeSlide + 1} / {slides.length}
            </Typography>
          </Box>

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
            alignItems: "center",
            gap: 4,
            mb: 1,
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
