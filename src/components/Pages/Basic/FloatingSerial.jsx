import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Paper,
  Typography,
} from "@mui/material";
import {
  ConnectWithoutContact,
  Send,
  Delete,
  ContentCopy,
  PlayArrow,
  Stop,
  Loop,
} from "@mui/icons-material";
import useWebSerial from "@/hooks/WebSerialService";

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
    loop,
    toggleLoop,
    clearLog,
    copyLog,
  } = useWebSerial({ setLog, logBoxRef: logRef });

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          right: 16,
          top: 16,
          zIndex: 1400,
          display: "flex",
          gap: 1,
          alignItems: "center",
        }}
      >
        <Button
          variant={connected ? "contained" : "outlined"}
          color={connected ? "primary" : "inherit"}
          startIcon={<ConnectWithoutContact />}
          onClick={() => (connected ? disconnect() : connect())}
        >
          {connected ? "Disconnect" : "Connect"}
        </Button>

        <IconButton
          color={isSending ? "secondary" : "default"}
          onClick={() => sendScript()}
          disabled={!connected}
          aria-label="send"
          title="Send"
        >
          <Send />
        </IconButton>

        <IconButton
          color="primary"
          onClick={() => {
            // Play sends a RUN command
            if (connected) sendLine("RUN");
          }}
          disabled={!connected}
          aria-label="play"
          title="Play"
        >
          <PlayArrow />
        </IconButton>

        <IconButton
          color={loop ? "primary" : "default"}
          onClick={() => {
            const willEnable = !loop;
            toggleLoop();
            if (willEnable && connected) sendLine("LOOP");
          }}
          aria-label="loop"
          title="Loop"
        >
          <Loop />
        </IconButton>

        <TextField
          size="small"
          label="Delay ms"
          type="number"
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value || 0))}
          sx={{ width: 110 }}
        />
      </Box>

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
          <IconButton
            color="inherit"
            onClick={() => {
              if (connected) sendLine("STOP");
              stopSend();
            }}
            disabled={!isSending}
            title="Stop"
          >
            <Stop />
          </IconButton>
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
    </>
  );
};

export default FloatingSerial;
