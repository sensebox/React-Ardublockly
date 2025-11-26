"use client";

import React, { useState } from "react";
import { Box, Paper, Button, Collapse, Divider } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import FlashToolMini from "./FlashToolMini";
import TutorialCard from "./TutorialCard";

export default function FlashToolMiniWithTutorial() {
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <Paper
      elevation={6}
      sx={{
        p: 2,
        width: "100%",
        borderRadius: 3,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <TutorialCard />
      <FlashToolMini />
    </Paper>
  );
}
