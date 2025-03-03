"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { Box, IconButton, styled } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CloseIcon from "@mui/icons-material/Close";

// Definiere die senseboxColors
const senseboxColors = {
  blue: "#4EAF46",
};

// Styled IconButton Komponente für normale Buttons
const StyledIconButton = styled(IconButton)(() => ({
  padding: 6,
  borderRadius: 6,
  color: "inherit",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
}));

// Styled IconButton Komponente für den runden Download-Button
const RoundIconButton = styled(IconButton)(() => ({
  padding: 8,
  borderRadius: "50%", // Vollständig rund
  minWidth: 32,
  minHeight: 32,
  width: 32,
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "inherit",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
  },
}));

const downloads = [
  {
    name: "sketch.bin",
    size: "276 KB",
    time: "Wird heruntergeladen...",
    type: "binary",
  },
];

export default function DownloadAnimation() {
  const [showDownloads, setShowDownloads] = useState(false);
  const [isFileClicked, setIsFileClicked] = useState(false);
  const cursorControls = useAnimation();
  const downloadButtonRef = useRef(null);
  const fileRef = useRef(null);

  // Animationssequenz
  useEffect(() => {
    const runAnimation = async () => {
      // Warte kurz bevor die Animation startet
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 1. Bewege Cursor zum Download-Button (angepasste Position für schmalere Box)
      await cursorControls.start({
        opacity: 1,
        x: 320, // Angepasst für schmalere Box
        y: 20,
        transition: { duration: 1 },
      });

      // 2. Klick-Animation auf dem Button
      await cursorControls.start({
        scale: 0.8,
        transition: { duration: 0.2 },
      });

      // 3. Öffne das Download-Panel
      setShowDownloads(true);

      // 4. Zurück zur normalen Größe
      await cursorControls.start({
        scale: 1,
        transition: { duration: 0.2 },
      });

      // 5. Warte bis das Panel geöffnet ist
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 6. Bewege Cursor zur Datei (angepasste Position für schmalere Box)
      await cursorControls.start({
        x: 80, // Angepasst für schmalere Box
        y: 130,
        transition: { duration: 1 },
      });

      // 7. Klick-Animation auf der Datei
      await cursorControls.start({
        scale: 0.8,
        transition: { duration: 0.2 },
      });

      // 8. Markiere die Datei als geklickt
      setIsFileClicked(true);

      // 9. Zurück zur normalen Größe
      await cursorControls.start({
        scale: 1,
        transition: { duration: 0.2 },
      });
    };

    runAnimation();
  }, [cursorControls]);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: "350px", // Reduziert von 500px auf 350px
        height: "400px",
        bgcolor: "#f8f9fa",
        borderRadius: 2,
        overflow: "visible",
        border: `1px solid ${senseboxColors.blue}30`,
        mx: "auto",
      }}
    >
      {/* Cursor Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 1, x: 150, y: 150 }} // Angepasste Startposition
        animate={cursorControls}
        style={{
          position: "absolute",
          zIndex: 50,
          pointerEvents: "none",
          filter: "drop-shadow(0px 0px 2px rgba(0,0,0,0.5))",
          width: 28,
          height: 28,
        }}
      >
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 28 28"
          enableBackground="new 0 0 28 28"
          style={{ width: "100%", height: "100%" }}
        >
          <polygon
            fill="#FFFFFF"
            points="8.2,20.9 8.2,4.9 19.8,16.5 13,16.5 12.6,16.6 "
          />
          <polygon
            fill="#FFFFFF"
            points="17.3,21.6 13.7,23.1 9,12 12.7,10.5 "
          />
          <rect
            x="12.5"
            y="13.6"
            transform="matrix(0.9221 -0.3871 0.3871 0.9221 -5.7605 6.5909)"
            width="2"
            height="8"
          />
          <polygon points="9.2,7.3 9.2,18.5 12.2,15.6 12.6,15.5 17.4,15.5 " />
        </svg>
      </motion.div>

      {/* Navigation Bar */}
      <Box
        sx={{
          height: 40,
          bgcolor: "#e8eaed",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          px: 2,
          justifyContent: "flex-end",
        }}
      >
        {/* Der Download-Button (jetzt rund) */}
        <RoundIconButton
          ref={downloadButtonRef}
          sx={{
            backgroundColor: showDownloads
              ? "rgba(0, 0, 0, 0.1)"
              : "rgba(0, 0, 0, 0.05)",
            "&:hover": {
              backgroundColor: showDownloads
                ? "rgba(0, 0, 0, 0.15)"
                : "rgba(0, 0, 0, 0.1)",
            },
            color: senseboxColors.blue,
            border: `2px solid ${senseboxColors.blue}`,
          }}
        >
          <FileDownloadIcon sx={{ fontSize: 16 }} />
        </RoundIconButton>
      </Box>

      {/* Downloads Dropdown */}
      {showDownloads && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute left-0 right-0 bottom-0 bg-[#f8f9fa] border-t border-[#dadce0]"
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1.5,
              borderBottom: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <Box sx={{ color: "#202124", fontSize: 14 }}>Downloads</Box>
            <StyledIconButton>
              <CloseIcon sx={{ fontSize: 16, color: "#5f6368" }} />
            </StyledIconButton>
          </Box>

          <Box sx={{ p: 1.5 }}>
            {downloads.map((download, i) => (
              <motion.div
                key={download.name}
                ref={fileRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex flex-col gap-1 py-1 rounded px-2 ${isFileClicked ? "bg-black/5" : ""}`}
              >
                {/* Obere Zeile: Datei-Icon, Name, Ordner-Icon, Hochladen-Icon */}
                <Box
                  sx={{ display: "flex", alignItems: "center", width: "100%" }}
                >
                  {/* Datei-Icon */}
                  <Box sx={{ color: "#5f6368", mr: 1.5 }}>
                    <InsertDriveFileIcon sx={{ fontSize: 20 }} />
                  </Box>

                  {/* Dateiname (flexibel) */}
                  <Box
                    sx={{
                      flex: 1,
                      fontSize: 13,
                      color: "#202124",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {download.name}
                    {!isFileClicked && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2 }}
                        style={{
                          height: 2,
                          backgroundColor: senseboxColors.blue,
                          borderRadius: 1,
                          marginTop: 2,
                        }}
                      />
                    )}
                  </Box>

                  {/* Aktionsbuttons (rechts) */}
                  {isFileClicked && (
                    <Box sx={{ display: "flex", ml: "auto" }}>
                      <StyledIconButton size="small">
                        <FolderOpenIcon
                          sx={{ fontSize: 16, color: "#5f6368" }}
                        />
                      </StyledIconButton>
                      <StyledIconButton size="small">
                        <FileUploadIcon
                          sx={{ fontSize: 16, color: "#5f6368" }}
                        />
                      </StyledIconButton>
                    </Box>
                  )}
                </Box>

                {/* Untere Zeile: Größe und Status */}
                <Box
                  sx={{
                    fontSize: 12,
                    color: "#5f6368",
                    pl: 5, // Eingerückt unter dem Dateinamen
                  }}
                >
                  {download.size}
                  <Box component="span" sx={{ mx: 1 }}>
                    •
                  </Box>
                  {isFileClicked
                    ? "Herunterladen abgeschlossen"
                    : download.time}
                </Box>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      )}
    </Box>
  );
}
