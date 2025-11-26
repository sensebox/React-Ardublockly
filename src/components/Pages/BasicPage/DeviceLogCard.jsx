"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Stack,
  useTheme,
  Collapse,
  Paper,
} from "@mui/material";
import {
  ContentCopy,
  DeleteSweep,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";

const DeviceLogCard = ({ log, onClear, onCopy }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const logBoxRef = useRef(null);

  return (
    <Paper
      elevation={5}
      sx={{
        position: "absolute",
        bottom: "15%",
        right: "5%",
        width: open ? 380 : 100,
        height: open ? 260 : 36,
        borderRadius: "12px",
        backgroundColor: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(6px)",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
      }}
    >
      {/* Header bar */}
      <Box
        onClick={() => setOpen((prev) => !prev)}
        sx={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 0.5,
          backgroundColor: theme.palette.primary.main,
          color: "white",
          userSelect: "none",
          transition: "background 0.3s ease",
          "&:hover": {
            backgroundColor: theme.palette.primary.dark,
          },
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Log
        </Typography>
        {open ? <ExpandMore /> : <ExpandLess />}
        {open ? (
          <Stack
            direction="row"
            spacing={1}
            justifyContent="flex-end"
            sx={{ px: 1.5, py: 1 }}
          >
            <Tooltip title="Copy log">
              <span>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation;
                    onCopy();
                  }}
                  disabled={!log}
                  size="small"
                  sx={{
                    backgroundColor: "#f5f5f5",
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onClear();
                  }}
                  disabled={!log}
                  size="small"
                  sx={{
                    backgroundColor: "#f5f5f5",
                    color: theme.palette.error.main,
                    "&:hover": { backgroundColor: "#e0e0e0" },
                  }}
                >
                  <DeleteSweep fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        ) : null}
      </Box>

      {/* Content */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box
          ref={logBoxRef}
          component="pre"
          sx={{
            flex: 1,
            m: 0,
            p: 1.5,
            fontSize: "0.9rem",
            borderTop: "1px solid #ddd",
            backgroundColor: "white",
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            overflow: "scroll",
            height: "30vh",
          }}
        >
          {log
            ? log
                .split("\n")
                .filter((line) => line.trim() !== "")
                .reverse()
                .map((line, i) => {
                  const match = line.match(/^\[(.*?)\]\s?(.*)$/);
                  const timestamp = match ? match[1] : "";
                  const text = match ? match[2] : line;
                  return (
                    <Box
                      key={i}
                      sx={{
                        borderBottom: "1px solid rgba(0,0,0,0.08)",
                        backgroundColor: "#fafafa",
                        p: 1,
                        borderRadius: "6px",
                      }}
                    >
                      <Typography
                        sx={{
                          color: theme.palette.grey[600],
                          fontSize: "0.75rem",
                          display: "block",
                        }}
                      >
                        {timestamp}
                      </Typography>

                      <Typography
                        sx={{
                          color: theme.palette.text.primary,
                          fontSize: "0.88rem",
                          fontFamily:
                            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {text}
                      </Typography>
                    </Box>
                  );
                })
            : "—"}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default DeviceLogCard;
