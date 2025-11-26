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

  useEffect(() => {
    if (open && logBoxRef.current) {
      logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
    }
  }, [log, open]);

  const highlight = (line, theme) => {
    const rules = [
      {
        regex: /\b(ERROR|ERR|FAIL|FAILED)\b/gi,
        color: theme.palette.error.main,
      },
      { regex: /\b(WARN|WARNING)\b/gi, color: "#c99a00" },
      { regex: /\b(OK|SUCCESS|DONE)\b/gi, color: theme.palette.success.main },
      { regex: /\b\d+(\.\d+)?\b/g, color: theme.palette.info.main },
      { regex: /\b[a-zA-Z_]+\(/g, color: theme.palette.primary.dark }, // functionName(
      { regex: /\[[^\]]+\]/g, color: theme.palette.grey[700] }, // [tags]
    ];

    let result = line;

    rules.forEach((rule) => {
      result = result.replace(
        rule.regex,
        (match) =>
          `<span style="color:${rule.color}; font-weight:600;">${match}</span>`,
      );
    });

    return result;
  };

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
            backgroundColor: "#fafafa",
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            overflow: "scroll",
            maxHeight: "30vh",
          }}
        >
          {log
            ? log
                .split("\n")
                .reverse()
                .filter((line) => line.trim() !== "")
                .map((line, i) => {
                  const timestamp = new Date().toLocaleTimeString();
                  return (
                    <Box
                      key={i}
                      sx={{
                        mb: 1,
                        pb: 1,
                        borderBottom: "1px solid rgba(0,0,0,0.08)",
                      }}
                    >
                      <Typography
                        component="span"
                        sx={{
                          color: theme.palette.grey[600],
                          fontSize: "0.75rem",
                          display: "block",
                        }}
                      >
                        {timestamp}
                      </Typography>

                      <Typography
                        component="span"
                        sx={{
                          color: theme.palette.text.primary,
                          fontSize: "0.88rem",
                          fontFamily:
                            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {line}
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
