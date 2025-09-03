import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { ContentCopy, DeleteSweep } from "@mui/icons-material";

const DeviceLogCard = ({ log, logBoxRef, onClear, onCopy }) => {
  const theme = useTheme();

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        flex: "1 1 0",
        minHeight: 0,
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
                  onClick={onCopy}
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
                  onClick={onClear}
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
  );
};

export default DeviceLogCard;
