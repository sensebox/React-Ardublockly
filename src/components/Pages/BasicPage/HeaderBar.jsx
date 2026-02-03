import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Terminal,
  Usb,
  LinkOff,
  PlayArrow,
  Autorenew,
  Stop,
} from "@mui/icons-material";

const HeaderBar = ({
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
  const [localDelay, setLocalDelay] = useState(delay);

  return (
    <Card
      elevation={3}
      sx={{ borderRadius: "16px", "&:hover": { boxShadow: 6 } }}
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
              onClick={onConnect}
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
              Verbinden
            </Button>
            <Button
              onClick={onDisconnect}
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
              Verbindung trennen
            </Button>
          </Stack>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        {!supported && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Dein Browser unterstützt die Web Serial API nicht. Nutze Chrome/Edge
            (HTTPS oder localhost).
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
            value={localDelay}
            onChange={(e) => setLocalDelay(parseInt(e.target.value || "0", 10))}
            onBlur={() => setDelay(localDelay || 0)}
            sx={{ width: 160 }}
            inputProps={{ min: 0 }}
          />

          <Tooltip title="RUN">
            <span>
              <IconButton
                onClick={() => onQuick("RUN")}
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
                onClick={() => onQuick("RUNLOOP")}
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
                onClick={() => onQuick("STOP")}
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
  );
};

export default HeaderBar;
