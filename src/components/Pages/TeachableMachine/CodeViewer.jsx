import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  ContentCopy as CopyIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";

/**
 * CodeViewer Component
 *
 * Displays C/C++ code with syntax highlighting, line numbers, and copy functionality.
 *
 * @param {Object} props
 * @param {string} props.code - The C/C++ code to display
 * @param {string} [props.language='cpp'] - The language for syntax highlighting ('c' or 'cpp')
 * @param {function} [props.onCopy] - Callback function when code is copied
 * @param {number} [props.maxHeight=400] - Maximum height in pixels for the scrollable container
 * @param {boolean} [props.loading=false] - Whether to show loading indicator
 */
const CodeViewer = ({
  code,
  language = "cpp",
  onCopy,
  maxHeight = 400,
  loading = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [renderedCode, setRenderedCode] = useState("");
  const codeRef = useRef(null);

  // Highlight code when it changes
  useEffect(() => {
    if (code && !loading) {
      setRenderedCode(code);
    }
  }, [code, language, loading]);

  // Handle copy to clipboard
  const handleCopy = async () => {
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);

      // Call the onCopy callback if provided
      if (onCopy) {
        onCopy();
      }

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);

      // Fallback: try to select the text for manual copy
      if (codeRef.current) {
        const range = document.createRange();
        range.selectNodeContents(codeRef.current);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  if (loading) {
    return (
      <Paper
        elevation={1}
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 200,
          bgcolor: "grey.50",
        }}
      >
        <CircularProgress size={40} sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Generating code...
        </Typography>
      </Paper>
    );
  }

  if (!code) {
    return (
      <Paper
        elevation={1}
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 200,
          bgcolor: "grey.50",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No code to display
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ position: "relative" }}>
      {/* Header with copy button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Generated C/C++ Code
        </Typography>
        <Tooltip title={copied ? "Copied!" : "Copy to Clipboard"}>
          <Button
            size="small"
            startIcon={copied ? <CheckIcon /> : <CopyIcon />}
            onClick={handleCopy}
            color={copied ? "success" : "primary"}
            variant={copied ? "contained" : "outlined"}
          >
            {copied ? "Copied" : "Copy"}
          </Button>
        </Tooltip>
      </Box>

      {/* Code display container */}
      <Paper
        elevation={2}
        sx={{
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "#f5f5f5",
        }}
      >
        <Box
          sx={{
            display: "flex",
            maxHeight: maxHeight,
            overflow: "auto",
            fontFamily: "monospace",
            fontSize: "0.875rem",
            lineHeight: 1.5,
            "&::-webkit-scrollbar": {
              width: "8px",
              height: "8px",
            },
            "&::-webkit-scrollbar-track": {
              bgcolor: "grey.200",
            },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "grey.400",
              borderRadius: "4px",
              "&:hover": {
                bgcolor: "grey.500",
              },
            },
          }}
        >
          {/* Code content */}
          <Box
            ref={codeRef}
            sx={{
              flex: 1,
              px: 2,
              py: 2,
              overflow: "auto",
              bgcolor: "white",
              "& pre": {
                margin: 0,
                padding: 0,
                background: "transparent",
                fontFamily: "inherit",
                fontSize: "inherit",
                lineHeight: "inherit",
              },
              "& code": {
                fontFamily: "inherit",
                fontSize: "inherit",
                lineHeight: "inherit",
              },
            }}
          >
            <pre>
              <code>{renderedCode}</code>
            </pre>
          </Box>
        </Box>
      </Paper>

      {/* Code statistics */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          mt: 1,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {code.length} characters
        </Typography>
      </Box>
    </Box>
  );
};

export default CodeViewer;
