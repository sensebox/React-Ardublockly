"use client";

import React from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  TextField,
  ToggleButton,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Usb,
  PlayArrow,
  Autorenew,
  Stop,
  Bolt,
  Settings,
  LinkOff,
  Bluetooth,
  Computer,
} from "@mui/icons-material";

const ConnectWizard = ({
  supported,
  connected,
  status,
  delay,
  setDelay,
  onConnect,
  onDisconnect,
  onQuick,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "grid",
        gap: 3,
        p: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          gap: 4,
          backgroundColor: "#f5f5f5",
          borderRadius: "5px",
          p: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              alignItems: "center",
            }}
          >
            <Bluetooth
              sx={{
                color: connected
                  ? theme.palette.success.main
                  : theme.palette.error.main,
              }}
            />
            <div
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: connected
                  ? theme.palette.success.main
                  : theme.palette.error.main,
                borderRadius: "50%",
                boxShadow: connected ? "0 0 8px #00cc44" : "0 0 8px #ff3333",
                animation: "pulse 2s infinite",
              }}
              className="status-dot"
            />
            <style>
              {`
    @keyframes pulse {
      0%   { box-shadow: 0 0 6px ${connected ? "#00cc44" : "#ff3333"}; }
      50%  { box-shadow: 0 0 15px ${connected ? "#00ff55" : "#ff6666"}; }
      100% { box-shadow: 0 0 6px ${connected ? "#00cc44" : "#ff3333"}; }
    }
  `}
            </style>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <span>{connected ? "Connected" : "Disconnected"}</span>

            <Box
              sx={{
                backgroundColor: connected
                  ? theme.palette.success.main
                  : theme.palette.error.main,
                color: "white",
                textAlign: "center",
                display: "inline-block",
                py: 0.2,
                px: 0.6,
                fontSize: 14,
                borderRadius: 10,
              }}
            >
              {connected ? "Active" : "Inactive"}
            </Box>
          </Box>
        </Box>
        <Button
          color={connected ? "error" : "primary"}
          variant={connected ? "outlined" : "contained"}
          onClick={connected ? onDisconnect : onConnect}
          disabled={!supported}
          startIcon={<Computer />}
          size="medium"
          sx={{ py: 1.5 }}
        >
          {connected ? "Disconnect" : "Connect Device"}
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 4,
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Button
          onClick={() => onQuick("RUN")}
          disabled={!connected}
          size="large"
          variant="contained"
          color="primary"
        >
          <div>
            <PlayArrow /> <br />
            Start
          </div>
        </Button>
        <Button
          onClick={() => onQuick("LOOP")}
          disabled={!connected}
          variant="contained"
          size="large"
          color="primary"
        >
          <div>
            <Autorenew /> <br />
            Loop
          </div>
        </Button>
        <Button
          onClick={() => onQuick("STOP")}
          size="large"
          disabled={!connected}
          variant="contained"
          color="error"
        >
          <div>
            <Stop /> <br />
            Stop
          </div>
        </Button>
      </Box>
    </Box>
  );
};

export default ConnectWizard;
