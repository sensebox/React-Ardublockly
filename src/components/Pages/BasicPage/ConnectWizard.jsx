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
    <Card
      elevation={4}
      sx={{
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        p: 2,
      }}
    >
      <CardHeader
        title={
          <Typography
            variant="h4"
            sx={{ fontWeight: 900, color: theme.palette.primary.main }}
            align="center"
          >
            senseBox:basic
          </Typography>
        }
      />

      <CardContent>
        {/* Main Grid */}
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          }}
        >
          {/* Connection Card */}
          <Card
            variant="outlined"
            sx={{
              borderRadius: 2,
              boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
            }}
          >
            <CardHeader
              title={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Usb fontSize="small" />
                  <Typography variant="h6">Device Connection</Typography>
                </Stack>
              }
              subheader="Connect to your ESP32 device via USB"
            />
            <CardContent>
              <Box
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  border: 2,
                  borderColor: connected
                    ? theme.palette.primary.light
                    : theme.palette.error.light,
                  bgcolor: connected
                    ? theme.palette.primary.main + "11"
                    : theme.palette.error.main + "11",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: connected
                          ? theme.palette.primary.main
                          : theme.palette.error.main,
                        animation: connected ? "pulse 1.5s infinite" : "none",
                      }}
                    />
                    <Typography
                      fontWeight={600}
                      color={
                        connected
                          ? theme.palette.primary.main
                          : theme.palette.error.main
                      }
                    >
                      {connected ? "Connected" : "Disconnected"}
                    </Typography>
                  </Stack>
                  <Badge
                    color={connected ? "primary" : "error"}
                    badgeContent={connected ? "Active" : "Inactive"}
                  />
                </Stack>
              </Box>
              <Button
                fullWidth
                color={connected ? "error" : "primary"}
                variant={connected ? "outlined" : "contained"}
                startIcon={connected ? <LinkOff /> : <Usb />}
                onClick={connected ? onDisconnect : onConnect}
                disabled={!supported}
                sx={{ py: 1.5 }}
              >
                {connected ? "Disconnect" : "Connect Device"}
              </Button>
            </CardContent>
          </Card>

          {/* Control Panel */}
          <Card
            variant="outlined"
            sx={{
              borderRadius: 2,
              boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
            }}
          >
            <CardHeader
              title={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Settings fontSize="small" />
                  <Typography variant="h6">Control Panel</Typography>
                </Stack>
              }
              subheader="Configure and control pseudocode transmission"
            />
            <CardContent>
              <Stack direction="column" spacing={2}>
                <Button
                  onClick={() => onQuick("RUN")}
                  disabled={!connected}
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<PlayArrow />}
                >
                  Start
                </Button>
                <Button
                  onClick={() => onQuick("LOOP")}
                  disabled={!connected}
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<Autorenew />}
                >
                  Loop
                </Button>
                <Button
                  onClick={() => onQuick("STOP")}
                  disabled={!connected}
                  fullWidth
                  variant="contained"
                  color="error"
                  startIcon={<Stop />}
                >
                  Stop
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ConnectWizard;
