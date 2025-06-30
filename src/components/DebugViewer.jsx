import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faMousePointer } from "@fortawesome/free-solid-svg-icons";

/**
 * DebugLogger
 * Logs every user click event on the page, showing the element's inner HTML (truncated to 90 chars) and timestamp.
 * Clicking a log entry outputs the full outer HTML to the console.
 * Ignores clicks within the log panel itself.
 * Styled with Material-UI and FontAwesome icons.
 * Positioning is controlled by the parent component.
 */
export default function DebugLogger() {
  const [logs, setLogs] = useState([]);
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      // Ignore clicks inside this debug panel
      if (panelRef.current && panelRef.current.contains(e.target)) {
        return;
      }

      const elementDesc = `des`;

      // Capture inner and outer HTML
      const inner = e.target.innerHTML || "";
      const full = e.target.outerHTML;
      const truncated = inner.length > 90 ? `${inner.slice(0, 90)}…` : inner;

      const timestamp = new Date();

      setLogs((prev) => [
        {
          element: elementDesc,
          time: timestamp,
          title: truncated,
          fullHtml: full,
        },
        ...prev,
      ]);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return (
    <Box
      ref={panelRef}
      component={Paper}
      elevation={3}
      sx={{
        bgcolor: "common.white",
        color: "text.primary",
        p: 2,
        maxHeight: 400,
        overflowY: "auto",
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{ mb: 1, letterSpacing: 1, color: "grey.700" }}
      >
        Debug Log
      </Typography>

      <List dense disablePadding>
        {logs.length === 0 ? (
          <ListItem sx={{ p: 1, bgcolor: "grey.100", borderRadius: 1, mb: 1 }}>
            <ListItemText
              primary={
                <Typography variant="body2" color="text.secondary">
                  No events yet...
                </Typography>
              }
            />
          </ListItem>
        ) : (
          logs.map((log, idx) => (
            <ListItem
              key={idx}
              alignItems="flex-start"
              button
              onClick={() => console.log(log.fullHtml)}
              sx={{
                p: 1,
                bgcolor: "grey.50",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: 1,
                mb: 1,
              }}
            >
              <ListItemIcon sx={{ minWidth: 32, color: "grey.500" }}>
                <FontAwesomeIcon icon={faMousePointer} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ fontFamily: "monospace" }}
                  >
                    {log.title || "(no inner HTML)"}
                  </Typography>
                }
                secondary={
                  <Typography
                    component="span"
                    variant="caption"
                    sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                  >
                    <FontAwesomeIcon icon={faClock} />
                    {log.time.toLocaleString()}
                  </Typography>
                }
              />
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
}
