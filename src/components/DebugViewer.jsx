// src/components/DebugLogger.jsx
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { Box, Paper, List, ListItem, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCubes, // Blockly
  faMousePointer, // Klicks
  faWrench, // Simulator
} from "@fortawesome/free-solid-svg-icons";
import { selectLogs } from "../reducers/logReducer";

const TYPE_CONFIG = {
  blockly: { color: "green", icon: faCubes },
  click: { color: "goldenrod", icon: faMousePointer },
  simulator: { color: "blue", icon: faWrench },
};

export default function DebugViewer() {
  const logs = useSelector(selectLogs);
  const panelRef = useRef(null);

  return (
    <Paper
      ref={panelRef}
      sx={{
        bgcolor: "common.white",
        p: 1,
        maxHeight: 300,
        overflowY: "auto",
      }}
    >
      <List disablePadding>
        {[...logs].reverse().map((log) => {
          const { color, icon } = TYPE_CONFIG[log.type] || {};
          const title = log.title ? log.title.slice(0, 90) : "(no title)";
          const description = log.description || "";
          const timestamp = new Date(log.timestamp).toLocaleString();

          return (
            <ListItem
              key={log.id}
              button
              onClick={() => console.log(log)}
              disablePadding
              sx={{ mb: 1 }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  bgcolor: "grey.50",
                  border: 1,
                  borderColor: "grey.300",
                  borderRadius: 1,
                  width: "100%",
                  px: 1,
                  py: 0.75,
                }}
              >
                <FontAwesomeIcon
                  icon={icon}
                  style={{ color, marginRight: 12, marginTop: 4 }}
                />
                <Box sx={{ flexGrow: 1, pr: 1 }}>
                  <Typography
                    variant="subtitle2"
                    noWrap
                    sx={{ fontWeight: 500 }}
                  >
                    {title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mt: 0.5 }}
                  >
                    {description}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ whiteSpace: "nowrap", ml: 1 }}
                >
                  {timestamp}
                </Typography>
              </Box>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
}
