import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Paper,
  Typography,
  useTheme,
  Tooltip,
  Modal,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  PlayArrow,
  Stop,
  Computer,
  Bluetooth,
  BluetoothDisabled,
  Rocket,
  Delete,
  ContentCopy,
  Loop,
  Close as CloseIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import useWebSerial from "@/hooks/WebSerialService";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FloatingSerial = () => {
  const [log, setLog] = useState("");
  const logRef = useRef(null);

  const {
    supported,
    connected,
    status,
    delay,
    setDelay,
    connect,
    disconnect,
    sendLine,
    sendScript,
    stopSend,
    isSending,
    clearLog,
    copyLog,
  } = useWebSerial({ setLog, logBoxRef: logRef });

  const theme = useTheme();
  const [helpOpen, setHelpOpen] = useState(false);
  const [unsupportedOpen, setUnsupportedOpen] = useState(!supported);
  const [loop, setLoop] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  // Redux state
  const user = useSelector((s) => s.auth.user);
  const xml = useSelector((s) => s.workspace.code.xml);
  const workspaceName = useSelector((s) => s.workspace.name);
  const navigate = useNavigate();
  const handlePlay = async () => {
    if (!connected) return;
    try {
      await sendLine("STOP");
      await new Promise((r) => setTimeout(r, 100));
      await sendScript();
      // If loop mode is active, send LOOP once; otherwise send RUN
      await sendLine(loop ? "LOOP" : "RUN");
    } catch (err) {
      console.error("Error during play:", err);
    }
  };

  const handleStop = async () => {
    if (!connected) return;
    try {
      await sendLine("STOP");
      stopSend();
    } catch (err) {
      console.error("Error during stop:", err);
    }
  };

  const handleDisconnect = async () => {
    if (!connected) return;
    try {
      await sendLine("DISCONNECT");
      await disconnect();
    } catch (err) {
      console.error("Error during disconnect:", err);
    }
  };

  const handleSaveProject = async () => {
    try {
      const body = {
        xml: xml,
        title: projectTitle || workspaceName || "Unbenanntes Projekt",
        description: projectDescription,
        generator: "basic",
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BLOCKLY_API}/gallery`,
        body,
      );

      if (response.data && response.data.project) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Error saving project:", err);
      setSaveError(true);
      setTimeout(() => setSaveError(false), 3000);
    } finally {
      setDialogOpen(false);
    }
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          position: "absolute",
          top: 26,
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
          zIndex: 1400,
        }}
      >
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
            {connected ? "Verbunden" : "Nicht verbunden"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Tooltip title="Connect to senseBox">
            <Button
              data-testid="serial-connect-button"
              variant={connected ? "outlined" : "contained"}
              color={connected ? "error" : "primary"}
              startIcon={<Computer />}
              onClick={connected ? handleDisconnect : connect}
              disabled={!supported}
            >
              {connected ? "Verbindung trennen" : "Verbinden"}
            </Button>
          </Tooltip>

          <Tooltip title="Send & Start program">
            <Button
              data-testid="serial-play-button"
              onClick={handlePlay}
              disabled={!connected}
              variant="contained"
              color="success"
              startIcon={<PlayArrow />}
            >
              Starten
            </Button>
          </Tooltip>

          <Tooltip title="Stop program">
            <Button
              data-testid="serial-stop-button"
              onClick={handleStop}
              disabled={!connected}
              variant="contained"
              color="error"
              startIcon={<Stop />}
            >
              Stopp
            </Button>
          </Tooltip>

          <Tooltip title="Help">
            <Button
              data-testid="serial-help-button"
              onClick={() => setHelpOpen(true)}
              variant="contained"
              startIcon={<Rocket />}
            >
              Anleitung
            </Button>
          </Tooltip>

          {user && (
            <Tooltip title="Projekt speichern">
              <Button
                data-testid="serial-save-button"
                onClick={handleOpenDialog}
                variant="contained"
                color={
                  saveSuccess ? "success" : saveError ? "error" : "primary"
                }
                startIcon={<SaveIcon />}
              >
                Speichern
              </Button>
            </Tooltip>
          )}
        </Box>

        <Modal open={helpOpen} onClose={() => setHelpOpen(false)}>
          <HelpModal onClose={() => setHelpOpen(false)} />
        </Modal>

        <Modal open={unsupportedOpen} onClose={() => setUnsupportedOpen(false)}>
          <UnsupportedBrowserModal onClose={() => setUnsupportedOpen(false)} />
        </Modal>
      </Box>

      {/* Log panel bottom-right */}
      <Paper
        elevation={6}
        sx={{
          position: "fixed",
          right: 16,
          bottom: 16,
          width: 360,
          maxHeight: "40vh",
          zIndex: 1400,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", p: 1, gap: 1 }}>
          <Typography variant="subtitle2" sx={{ flex: 1 }}>
            Web Serial — {status}
          </Typography>
          <IconButton
            size="small"
            onClick={() => {
              clearLog();
              setLog("");
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => copyLog()}>
            <ContentCopy fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ p: 1, overflow: "auto" }}>
          <pre
            ref={logRef}
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontSize: 12,
              maxHeight: "28vh",
            }}
          >
            {log}
          </pre>
        </Box>
      </Paper>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Projekt speichern</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Titel"
            type="text"
            fullWidth
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Beschreibung"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Abbrechen
          </Button>
          <Button onClick={handleSaveProject} color="primary">
            Speichern
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FloatingSerial;

function HelpModal({ onClose }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    {
      title: "Willkommen!",
      text: "Mit dieser Leiste kannst du die senseBox verbinden, Programm starten, stoppen und in den Loop-Modus versetzen.",
    },
    {
      title: "Run / Stop / Loop",
      text: "Play (Starten) sendet RUN, Stop sendet STOP. Loop aktiviert wiederholtes Ausführen (sendet LOOP).",
    },
  ];

  const next = () => setActiveSlide((s) => Math.min(s + 1, slides.length - 1));
  const prev = () => setActiveSlide((s) => Math.max(s - 1, 0));

  const slide = slides[activeSlide];

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
        sx={{ maxWidth: 600, width: "100%", p: 4, position: "relative" }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 12, right: 12 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, mb: 2, textAlign: "center" }}
        >
          {slide.title}
        </Typography>
        <Typography variant="body1" sx={{ textAlign: "center", mb: 2 }}>
          {slide.text}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button
            variant="outlined"
            onClick={prev}
            disabled={activeSlide === 0}
          >
            Zurück
          </Button>
          <Button
            variant="contained"
            onClick={next}
            disabled={activeSlide === slides.length - 1}
          >
            Weiter
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

function UnsupportedBrowserModal({ onClose }) {
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
        sx={{ maxWidth: 600, width: "100%", p: 4, position: "relative" }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 12, right: 12 }}
        >
          <CloseIcon />
        </IconButton>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <BluetoothDisabled sx={{ fontSize: 48, color: "error.main" }} />
          <Typography variant="h5" sx={{ fontWeight: 700, textAlign: "left" }}>
            Browser nicht unterstützt
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Dein Browser unterstützt die <strong>Web Serial API</strong> nicht,
          die für die Verbindung mit der senseBox benötigt wird.
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Bitte verwende einen der folgenden Browser:
        </Typography>
        <Box component="ul" sx={{ mb: 2, pl: 3 }}>
          <li>
            <Typography variant="body1">
              <strong>Google Chrome</strong> (Version 89 oder höher)
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Microsoft Edge</strong> (Version 89 oder höher)
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Opera</strong> (Version 75 oder höher)
            </Typography>
          </li>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Hinweis: Die Web Serial API funktioniert derzeit nur auf
          Desktop-Browsern, nicht auf mobilen Geräten. Benutze dafür die
          senseBox Basic App!
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" onClick={onClose}>
            Verstanden
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
