"use client";

import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import MonitorOutlinedIcon from "@mui/icons-material/MonitorOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import { senseboxColors } from "./theme";

// SidebarItem Component
const SidebarItem = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 13,
  color: "#374151",
  "& svg": {
    width: 16,
    height: 16,
  },
});

export function DragDropIcon() {
  // Animation Keyframes für die Datei
  const fileAnimation = {
    x: [
      16, // Start
      -150, // Zur SENSEBOX
      -150, // Kurz warten
      -150, // Verschwinden
      16, // Zurück zum Start (unsichtbar)
      16, // Neue Datei erscheint
    ],
    y: [
      16, // Start
      190, // Zur SENSEBOX
      190, // Kurz warten
      190, // Verschwinden
      16, // Zurück zum Start (unsichtbar)
      16, // Neue Datei erscheint
    ],
    opacity: [
      0.7, // Start
      0.7, // Zur SENSEBOX
      0.7, // Kurz warten
      0, // Verschwinden
      0, // Unsichtbar zurück
      0.7, // Neue Datei erscheint
    ],
    scale: [
      1, // Normal
      1, // Normal während Bewegung
      1, // Normal beim Warten
      0.8, // Kleiner beim Verschwinden
      1, // Normal zurück
      1, // Normal neue Datei
    ],
  };

  // Animation Keyframes für den Cursor
  const cursorAnimation = {
    x: [
      12, // Start
      -154, // Zur SENSEBOX
      -154, // Kurz warten
      -154, // Beim Loslassen
      12, // Zurück zum Start
      12, // Bereit für neue Datei
    ],
    y: [
      12, // Start
      186, // Zur SENSEBOX
      186, // Kurz warten
      186, // Beim Loslassen
      12, // Zurück zum Start
      12, // Bereit für neue Datei
    ],
  };

  // Timing für die Animationsphasen (in Sekunden)
  const timing = {
    moveToSensebox: 1.5, // Zeit bis zur SENSEBOX
    waitAtSensebox: 0.3, // Wartezeit bei SENSEBOX
    fadeOut: 0.2, // Zeit zum Verschwinden
    moveBack: 0.5, // Zeit für Rückweg
    waitForNew: 0.2, // Wartezeit vor neuer Datei
    total: 2.7, // Gesamtzeit (Summe aller Zeiten)
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: 300,
        width: 400,
        overflow: "hidden",
        borderRadius: 2,
        bgcolor: "#f8f9fa",
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: 180,
          borderRight: "1px solid #e5e7eb",
          bgcolor: "#f8f9fa",
          p: 2,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <SidebarItem>
            <StarOutlinedIcon sx={{ color: "#4EAF46" }} />
            <span>Schnellzugriff</span>
          </SidebarItem>
          <SidebarItem>
            <MonitorOutlinedIcon sx={{ color: "#4EAF46" }} />
            <span>Desktop</span>
          </SidebarItem>
          <SidebarItem>
            <FolderOutlinedIcon sx={{ color: "#4EAF46" }} />
            <span>Downloads</span>
          </SidebarItem>
          <SidebarItem>
            <InsertDriveFileOutlinedIcon sx={{ color: "#4EAF46" }} />
            <span>Dokumente</span>
          </SidebarItem>
          <SidebarItem>
            <ImageOutlinedIcon sx={{ color: "#4EAF46" }} />
            <span>Bilder</span>
          </SidebarItem>
          <Box sx={{ mt: 2 }}>
            <motion.div
              initial={{ backgroundColor: "transparent" }}
              animate={{
                backgroundColor: [
                  "transparent", // Start
                  "transparent", // Während des Ziehens
                  "transparent", // Kurz vor dem Loslassen
                  `${senseboxColors.blue}40`, // Highlight beim Loslassen (verstärkt)
                  "transparent", // Zurück zu normal
                  "transparent", // Bereit für nächste Animation
                ],
                scale: [
                  1, // Start
                  1, // Während des Ziehens
                  1, // Kurz vor dem Loslassen
                  1.05, // Leicht vergrößern beim Loslassen
                  1, // Zurück zu normal
                  1, // Bereit für nächste Animation
                ],
              }}
              transition={{
                duration: timing.total,
                times: [
                  0,
                  timing.moveToSensebox / timing.total,
                  (timing.moveToSensebox + timing.waitAtSensebox) /
                    timing.total,
                  (timing.moveToSensebox +
                    timing.waitAtSensebox +
                    timing.fadeOut) /
                    timing.total,
                  (timing.moveToSensebox +
                    timing.waitAtSensebox +
                    timing.fadeOut +
                    timing.moveBack) /
                    timing.total,
                  1,
                ],
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              style={{
                borderRadius: 4,
                padding: "4px 8px",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  color: "#374151",
                  fontSize: 13,
                }}
              >
                <StorageOutlinedIcon sx={{ fontSize: 16, color: "#4B5563" }} />
                <span>SENSEBOX (E:)</span>
              </Box>
            </motion.div>
          </Box>
        </Box>
      </Box>

      {/* Main Area */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 180,
          right: 0,
          bgcolor: "white",
        }}
      >
        {/* Static File */}
        <Box
          sx={{
            position: "absolute",
            left: 16,
            top: 16,
            display: "flex",
            alignItems: "center",
            gap: 1,
            borderRadius: 1,
            bgcolor: "#e9ecef",
            px: 1,
            py: 0.5,
          }}
        >
          <InsertDriveFileOutlinedIcon
            sx={{ fontSize: 16, color: "text.secondary" }}
          />
          <Typography sx={{ fontSize: 13, color: "grey.700" }}>
            sketch.bin
          </Typography>
        </Box>

        {/* Dragged File */}
        <motion.div
          style={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            gap: 8,
            borderRadius: 4,
            backgroundColor: "rgba(233, 236, 239, 0.7)",
            padding: "4px 8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
          initial={{ x: 16, y: 16, opacity: 0.7, scale: 1 }}
          animate={fileAnimation}
          transition={{
            duration: timing.total,
            times: [
              0,
              timing.moveToSensebox / timing.total,
              (timing.moveToSensebox + timing.waitAtSensebox) / timing.total,
              (timing.moveToSensebox + timing.waitAtSensebox + timing.fadeOut) /
                timing.total,
              (timing.moveToSensebox +
                timing.waitAtSensebox +
                timing.fadeOut +
                timing.moveBack) /
                timing.total,
              1,
            ],
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <InsertDriveFileOutlinedIcon
            sx={{ fontSize: 16, color: "#4B5563" }}
          />
          <span style={{ fontSize: 13, color: "#374151" }}>sketch.bin</span>
        </motion.div>

        {/* Cursor */}
        <motion.div
          style={{
            position: "absolute",
            pointerEvents: "none",
          }}
          initial={{ x: 12, y: 12 }}
          animate={cursorAnimation}
          transition={{
            duration: timing.total,
            times: [
              0,
              timing.moveToSensebox / timing.total,
              (timing.moveToSensebox + timing.waitAtSensebox) / timing.total,
              (timing.moveToSensebox + timing.waitAtSensebox + timing.fadeOut) /
                timing.total,
              (timing.moveToSensebox +
                timing.waitAtSensebox +
                timing.fadeOut +
                timing.moveBack) /
                timing.total,
              1,
            ],
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            style={{ transform: "rotate(-45deg)" }}
          >
            <g>
              <path
                fill="#FFFFFF"
                d="M11.3,20.4c-0.3-0.4-0.6-1.1-1.2-2c-0.3-0.5-1.2-1.5-1.5-1.9c-0.2-0.4-0.2-0.6-0.1-1c0.1-0.6,0.7-1.1,1.4-1.1c0.5,0,1,0.4,1.4,0.7c0.2,0.2,0.5,0.6,0.7,0.8c0.2,0.2,0.2,0.3,0.4,0.5c0.2,0.3,0.3,0.5,0.2,0.1c-0.1-0.5-0.2-1.3-0.4-2.1c-0.1-0.6-0.2-0.7-0.3-1.1c-0.1-0.5-0.2-0.8-0.3-1.3c-0.1-0.3-0.2-1.1-0.3-1.5c-0.1-0.5-0.1-1.4,0.3-1.8c0.3-0.3,0.9-0.4,1.3-0.2c0.5,0.3,0.8,1,0.9,1.3c0.2,0.5,0.4,1.2,0.5,2c0.2,1,0.5,2.5,0.5,2.8c0-0.4-0.1-1.1,0-1.5c0.1-0.3,0.3-0.7,0.7-0.8c0.3-0.1,0.6-0.1,0.9-0.1c0.3,0.1,0.6,0.3,0.8,0.5c0.4,0.6,0.4,1.9,0.4,1.8c0.1-0.4,0.1-1.2,0.3-1.6c0.1-0.2,0.5-0.4,0.7-0.5c0.3-0.1,0.7-0.1,1,0c0.2,0,0.6,0.3,0.7,0.5c0.2,0.3,0.3,1.3,0.4,1.7c0,0.1,0.1-0.4,0.3-0.7c0.4-0.6,1.8-0.8,1.9,0.6c0,0.7,0,0.6,0,1.1c0,0.5,0,0.8,0,1.2c0,0.4-0.1,1.3-0.2,1.7c-0.1,0.3-0.4,1-0.7,1.4c0,0-1.1,1.2-1.2,1.8c-0.1,0.6-0.1,0.6-0.1,1c0,0.4,0.1,0.9,0.1,0.9s-0.8,0.1-1.2,0c-0.4-0.1-0.9-0.8-1-1.1c-0.2-0.3-0.5-0.3-0.7,0c-0.2,0.4-0.7,1.1-1.1,1.1c-0.7,0.1-2.1,0-3.1,0c0,0,0.2-1-0.2-1.4c-0.3-0.3-0.8-0.8-1.1-1.1L11.3,20.4z"
              />
              <path
                fill="none"
                stroke="#000000"
                strokeWidth="0.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.3,20.4c-0.3-0.4-0.6-1.1-1.2-2c-0.3-0.5-1.2-1.5-1.5-1.9c-0.2-0.4-0.2-0.6-0.1-1c0.1-0.6,0.7-1.1,1.4-1.1c0.5,0,1,0.4,1.4,0.7c0.2,0.2,0.5,0.6,0.7,0.8c0.2,0.2,0.2,0.3,0.4,0.5c0.2,0.3,0.3,0.5,0.2,0.1c-0.1-0.5-0.2-1.3-0.4-2.1c-0.1-0.6-0.2-0.7-0.3-1.1c-0.1-0.5-0.2-0.8-0.3-1.3c-0.1-0.3-0.2-1.1-0.3-1.5c-0.1-0.5-0.1-1.4,0.3-1.8c0.3-0.3,0.9-0.4,1.3-0.2c0.5,0.3,0.8,1,0.9,1.3c0.2,0.5,0.4,1.2,0.5,2c0.2,1,0.5,2.5,0.5,2.8c0-0.4-0.1-1.1,0-1.5c0.1-0.3,0.3-0.7,0.7-0.8c0.3-0.1,0.6-0.1,0.9-0.1c0.3,0.1,0.6,0.3,0.8,0.5c0.4,0.6,0.4,1.9,0.4,1.8c0.1-0.4,0.1-1.2,0.3-1.6c0.1-0.2,0.5-0.4,0.7-0.5c0.3-0.1,0.7-0.1,1,0c0.2,0,0.6,0.3,0.7,0.5c0.2,0.3,0.3,1.3,0.4,1.7c0,0.1,0.1-0.4,0.3-0.7c0.4-0.6,1.8-0.8,1.9,0.6c0,0.7,0,0.6,0,1.1c0,0.5,0,0.8,0,1.2c0,0.4-0.1,1.3-0.2,1.7c-0.1,0.3-0.4,1-0.7,1.4c0,0-1.1,1.2-1.2,1.8c-0.1,0.6-0.1,0.6-0.1,1c0,0.4,0.1,0.9,0.1,0.9s-0.8,0.1-1.2,0c-0.4-0.1-0.9-0.8-1-1.1c-0.2-0.3-0.5-0.3-0.7,0c-0.2,0.4-0.7,1.1-1.1,1.1c-0.7,0.1-2.1,0-3.1,0c0,0,0.2-1-0.2-1.4c-0.3-0.3-0.8-0.8-1.1-1.1L11.3,20.4z"
              />
            </g>
          </svg>
        </motion.div>
      </Box>
    </Box>
  );
}
