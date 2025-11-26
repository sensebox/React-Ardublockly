"use client";

import React from "react";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import PowerIcon from "@mui/icons-material/Power";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import TerminalIcon from "@mui/icons-material/Terminal";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function TutorialCard() {
  const steps = [
    {
      icon: <SettingsIcon color="success" />,
      title: "Dev-Modus aktivieren",
      desc: "Halte den Switch-Button gedrückt und drücke einmal Reset.",
    },
    {
      icon: <SearchIcon color="warning" />,
      title: "Board auswählen",
      desc: "Klicke auf „Mit Board verbinden“, um das richtige Gerät auszuwählen.",
    },
    {
      icon: <CloudUploadIcon color="secondary" />,
      title: "Sketch hochladen",
      desc: "Klicke anschließend auf „Sketch flashen“.",
    },
    {
      icon: <CheckCircleIcon color="success" />,
      title: "Upload erfolgreich",
      desc: "Starte danach deine MCU-S2 neu.",
    },
  ];

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 2,
        background: "#fafafa",
      }}
    >
      <List dense disablePadding>
        {steps.map((s, i) => (
          <ListItem key={i} sx={{ alignItems: "center" }}>
            <ListItemIcon sx={{ minWidth: 36 }}>{s.icon}</ListItemIcon>
            <ListItemText
              primary={s.title}
              secondary={s.desc}
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
