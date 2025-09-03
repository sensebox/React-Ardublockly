import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  useTheme,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton,
  Tooltip,
  Divider,
  Stack,
} from "@mui/material";
import {
  Usb,
  LinkOff,
  Send,
  PlayArrow,
  Autorenew,
  Stop,
  DeleteSweep,
  Terminal,
  ContentCopy,
} from "@mui/icons-material";

const BasicPage = () => {
  const theme = useTheme();

  const [supported, setSupported] = useState(true);
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState("Disconnected");
  const [delay, setDelay] = useState(30);
  const [script, setScript] = useState("");
  const [log, setLog] = useState("");
  const [openSupportDialog, setOpenSupportDialog] = useState(false);

  const portRef = useRef(null);
  const readerRef = useRef(null);
  const writerRef = useRef(null);
  const logBoxRef = useRef(null);

  // Autoscroll fürs Log
  useEffect(() => {
    if (logBoxRef.current) {
      logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
    }
  }, [log]);

  useEffect(() => {
    const ok = "serial" in navigator;
    setSupported(ok);
    if (!ok) setOpenSupportDialog(true);
    return () => {
      // Cleanup bei Unmount
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logMessage = (msg) => {
    setLog((prev) => (prev ? `${prev}\n${msg}` : msg));
  };

  const connect = async () => {
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 115200 });

      const textDecoder = new TextDecoderStream();
      const textEncoder = new TextEncoderStream();

      port.readable.pipeTo(textDecoder.writable);
      textEncoder.readable.pipeTo(port.writable);

      const reader = textDecoder.readable.getReader();
      const writer = textEncoder.writable.getWriter();

      portRef.current = port;
      readerRef.current = reader;
      writerRef.current = writer;

      readLoop(reader);

      setConnected(true);
      setStatus("Connected");
      logMessage("[Connected]");
    } catch (err) {
      logMessage(`Connection failed: ${err}`);
      setStatus("Disconnected");
      setConnected(false);
    }
  };

  const disconnect = async () => {
    try {
      if (readerRef.current) await readerRef.current.cancel();
      if (writerRef.current) await writerRef.current.close();
      if (portRef.current) await portRef.current.close();
    } catch {
      /* ignore */
    }
    readerRef.current = null;
    writerRef.current = null;
    portRef.current = null;
    setConnected(false);
    setStatus("Disconnected");
    logMessage("[Disconnected]");
  };

  const readLoop = async (reader) => {
    while (true) {
      try {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) {
          const lines = value.replace(/\r/g, "").split("\n");
          for (const ln of lines) if (ln.length) logMessage(ln);
        }
      } catch (err) {
        logMessage(`Read error: ${err}`);
        break;
      }
    }
  };

  const sendLine = async (line) => {
    if (!writerRef.current) return;
    await writerRef.current.write(line + "\n");
    logMessage(`>>> ${line}`);
  };

  const handleQuick = (cmd) => sendLine(cmd);

  const sendScript = async () => {
    const lines = script.split(/\r?\n/);
    for (let line of lines) {
      const trimmed = line.trimEnd();
      if (trimmed) {
        await sendLine(trimmed);
        if (delay > 0)
          await new Promise((r) => setTimeout(r, Math.max(0, delay)));
      }
    }
  };

  const copyLog = async () => {
    try {
      await navigator.clipboard.writeText(log);
    } catch {
      /* ignore */
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        height: "100vh",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <Card
        elevation={3}
        sx={{
          borderRadius: "16px",
          transition: "box-shadow 0.2s",
          "&:hover": { boxShadow: 6 },
          flex: "0 0 auto",
        }}
      >
        <CardHeader
          title={
            <Stack direction="row" alignItems="center" spacing={1}>
              <Terminal />
              <Typography
                variant="h5"
                sx={{ fontWeight: 900, color: theme.palette.primary.main }}
              >
                ESP32 Pseudocode Sender
              </Typography>
            </Stack>
          }
          subheader={
            <Typography variant="body2" color="text.secondary">
              Web Serial · Baud: 115200 · Newline: LF (\n)
            </Typography>
          }
          action={
            <Stack direction="row" spacing={1}>
              <Button
                onClick={connect}
                disabled={connected || !supported}
                startIcon={<Usb />}
                sx={{
                  background: theme.palette.background.white,
                  color: theme.palette.primary.main,
                  borderRadius: "50px",
                  fontWeight: "bold",
                  border: "1px solid",
                  borderColor: theme.palette.primary.main,
                  "&:hover": {
                    background: theme.palette.primary.main,
                    color: theme.palette.background.white,
                  },
                }}
              >
                Connect
              </Button>
              <Button
                onClick={disconnect}
                disabled={!connected}
                startIcon={<LinkOff />}
                sx={{
                  background: theme.palette.background.white,
                  color: theme.palette.error.main,
                  borderRadius: "50px",
                  fontWeight: "bold",
                  border: "1px solid",
                  borderColor: theme.palette.error.main,
                  "&:hover": {
                    background: theme.palette.error.main,
                    color: theme.palette.background.white,
                  },
                }}
              >
                Disconnect
              </Button>
            </Stack>
          }
        />
        <CardContent sx={{ pt: 0 }}>
          {!supported && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Dein Browser unterstützt die Web Serial API nicht. Nutze
              Chrome/Edge (HTTPS oder localhost).
            </Alert>
          )}

          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Status:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: connected
                  ? theme.palette.success.main
                  : theme.palette.text.secondary,
              }}
            >
              {status}
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <TextField
              label="Line delay (ms)"
              type="number"
              size="small"
              value={delay}
              onChange={(e) => setDelay(parseInt(e.target.value || "0", 10))}
              sx={{ width: 160 }}
              inputProps={{ min: 0 }}
            />

            <Tooltip title="RUN">
              <span>
                <IconButton
                  onClick={() => handleQuick("RUN")}
                  disabled={!connected}
                  sx={{
                    backgroundColor: "#f0f0f0",
                    color: theme.palette.primary.main,
                    "&:hover": { backgroundColor: "#e0e0e0" },
                  }}
                >
                  <PlayArrow />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip title="RUNLOOP">
              <span>
                <IconButton
                  onClick={() => handleQuick("RUNLOOP")}
                  disabled={!connected}
                  sx={{
                    backgroundColor: "#f0f0f0",
                    color: theme.palette.primary.main,
                    "&:hover": { backgroundColor: "#e0e0e0" },
                  }}
                >
                  <Autorenew />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip title="STOP">
              <span>
                <IconButton
                  onClick={() => handleQuick("STOP")}
                  disabled={!connected}
                  sx={{
                    backgroundColor: "#f0f0f0",
                    color: theme.palette.error.main,
                    "&:hover": { backgroundColor: "#e0e0e0" },
                  }}
                >
                  <Stop />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </CardContent>
      </Card>

      {/* Main Flex Area */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flex: "1 1 auto",
          minHeight: 0, // wichtig für korrektes Flex-Scrolling
        }}
      >
        {/* Linke Hälfte: leerer weißer Kasten mit Schatten */}
        <Box
          sx={{
            flex: "1 1 50%",
            backgroundColor: theme.palette.background.paper,
            borderRadius: "16px",
            boxShadow: 3,
          }}
        />

        {/* Rechte Hälfte: zwei übereinander gestapelte Boxen */}
        <Box
          sx={{
            flex: "1 1 50%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minHeight: 0,
          }}
        >
          {/* Pseudocode Card (oberes Panel) */}
          <Card
            elevation={3}
            sx={{
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              flex: "1 1 0",
              minHeight: 0,
              transition: "box-shadow 0.2s",
              "&:hover": { boxShadow: 6 },
            }}
          >
            <CardHeader
              title={
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 900, color: theme.palette.primary.main }}
                >
                  Pseudocode (jede Zeile wird mit \n gesendet)
                </Typography>
              }
            />
            <CardContent
              sx={{ pt: 0, flex: "1 1 0", minHeight: 0, display: "flex" }}
            >
              <TextField
                placeholder="RUN\nMOVE 10 20\nPRINT Hello"
                value={script}
                onChange={(e) => setScript(e.target.value)}
                multiline
                fullWidth
                sx={{
                  flex: 1,
                  "& .MuiInputBase-root": {
                    height: "100%",
                    alignItems: "start",
                    fontFamily:
                      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                    overflow: "auto",
                  },
                  "& textarea": {
                    height: "100% !important",
                  },
                }}
                minRows={6}
              />
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button
                onClick={sendScript}
                disabled={!connected}
                startIcon={<Send />}
                fullWidth
                sx={{
                  background: theme.palette.background.white,
                  color: theme.palette.primary.main,
                  borderRadius: "50px",
                  fontWeight: "bold",
                  border: "1px solid",
                  borderColor: theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.background.white,
                  },
                }}
              >
                Send Lines
              </Button>
            </CardActions>
          </Card>

          {/* Device Log Card (unteres Panel) */}
          <Card
            elevation={3}
            sx={{
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              flex: "1 1 0",
              minHeight: 0,
              transition: "box-shadow 0.2s",
              "&:hover": { boxShadow: 6 },
            }}
          >
            <CardHeader
              title={
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 900, color: theme.palette.primary.main }}
                >
                  Device Log (Serial RX)
                </Typography>
              }
              action={
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Copy log">
                    <span>
                      <IconButton
                        onClick={copyLog}
                        disabled={!log}
                        sx={{
                          backgroundColor: "#f0f0f0",
                          color: theme.palette.primary.main,
                          "&:hover": { backgroundColor: "#e0e0e0" },
                        }}
                      >
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Clear log">
                    <span>
                      <IconButton
                        onClick={() => setLog("")}
                        disabled={!log}
                        sx={{
                          backgroundColor: "#f0f0f0",
                          color: theme.palette.error.main,
                          "&:hover": { backgroundColor: "#e0e0e0" },
                        }}
                      >
                        <DeleteSweep fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Stack>
              }
            />
            <Divider />
            <CardContent sx={{ pt: 1, flex: "1 1 0", minHeight: 0 }}>
              <Box
                ref={logBoxRef}
                component="pre"
                sx={{
                  m: 0,
                  p: 1.5,
                  height: "100%",
                  overflowY: "auto",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  backgroundColor: theme.palette.background.paper,
                  fontFamily:
                    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {log || "—"}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Hinweis-Dialog bei fehlender Unterstützung */}
      <Dialog
        open={openSupportDialog}
        onClose={() => setOpenSupportDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Web Serial nicht unterstützt</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Dein Browser unterstützt die <b>Web Serial API</b> nicht.
          </Typography>
          <Typography variant="body2">
            Bitte nutze <b>Google Chrome</b> oder <b>Microsoft Edge</b> und
            öffne die Seite über <b>HTTPS</b> oder <b>localhost</b>.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSupportDialog(false)}>OK</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BasicPage;
