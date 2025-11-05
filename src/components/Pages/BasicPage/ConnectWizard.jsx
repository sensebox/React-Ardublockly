"use client";

import React from "react";
import { Box, Button, Typography, useTheme, Tooltip } from "@mui/material";
import {
  PlayArrow,
  Stop,
  Computer,
  Bluetooth,
  BluetoothDisabled,
} from "@mui/icons-material";

const ConnectWizard = ({
  supported,
  connected,
  onConnect,
  onDisconnect,
  onQuick,
  onSend,
}) => {
  const theme = useTheme();

  const handlePlay = async () => {
    if (!connected) return;
    try {
      await onSend();
      await onQuick("RUNLOOP");
    } catch (err) {
      console.error("Error during play:", err);
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
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        padding: "6px 12px",
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
            size="small"
            startIcon={<Computer />}
            onClick={connected ? onDisconnect : onConnect}
            disabled={!supported}
            sx={{ minWidth: 110 }}
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
            size="small"
            startIcon={<PlayArrow />}
            sx={{
              fontWeight: 600,
              textTransform: "none",
              px: 2,
            }}
          >
            Run
          </Button>
        </Tooltip>

        <Tooltip title="Stop program">
          <Button
            onClick={() => onQuick("STOP")}
            disabled={!connected}
            variant="contained"
            color="error"
            size="small"
            startIcon={<Stop />}
            sx={{
              fontWeight: 600,
              textTransform: "none",
              px: 2,
            }}
          >
            Stop
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default ConnectWizard;
