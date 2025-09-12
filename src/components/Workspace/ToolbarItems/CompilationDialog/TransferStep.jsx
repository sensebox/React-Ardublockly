"use client";

import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  ArrowForward,
  FolderOpen,
  Memory,
  Usb,
  InfoOutlined,
  Book,
  BookOutlined,
} from "@mui/icons-material";
import { useTheme } from "@mui/styles";
import { useSelector } from "react-redux";
import { IconButton, Tooltip } from "@mui/material";

export default function TransferStep() {
  const theme = useTheme();
  const filename = useSelector((state) => state.workspace.name);
  const selectedBoard = useSelector((state) => state.board.board);
  console.log("Selected Board in TransferStep:", selectedBoard);
  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        overflowY: "hidden",
      }}
    >
      <Box textAlign="center">
        <Typography
          variant="h4"
          fontWeight="bold"
          color={theme.palette.primary.main}
          gutterBottom
        >
          Datei übertragen
        </Typography>
        <Typography color="text.secondary">
          Ziehe die Datei aus deinem Downloads-Ordner auf die senseBox
        </Typography>
      </Box>

      <Box
        sx={{
          bgcolor: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: 2,
          p: 2,
          position: "relative",
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Schritte zur Übertragung:
        </Typography>

        <List dense>
          <ListItem>
            <ListItemIcon sx={{ justifyContent: "center" }}>
              <FolderOpen
                sx={{ fontSize: 32, color: theme.palette.primary.main }}
              />
            </ListItemIcon>
            <ListItemText primary="1. Downloads-Ordner öffnen" />
          </ListItem>

          <ListItem>
            <ListItemIcon sx={{ justifyContent: "center" }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "white",
                  border: "1px solid",
                  borderColor: "grey.400",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  fontSize={10}
                  variant="caption"
                  fontWeight="bold"
                  color="text.secondary"
                >
                  bin
                </Typography>
              </Box>
            </ListItemIcon>
            <ListItemText
              primary={
                <>
                  2. Datei <b>{filename}.bin</b> finden
                </>
              }
            />
          </ListItem>

          {/* Nur anzeigen wenn MCU ausgewählt */}
          {selectedBoard === "MCU" && (
            <ListItem>
              <ListItemIcon
                sx={{
                  justifyContent: "center",
                  color: theme.palette.primary.main,
                }}
              >
                <Memory />
              </ListItemIcon>
              <ListItemText
                primary={
                  <>
                    3. MCU in den <b>Lernmodus</b> versetzen <br />
                    (zweimal schnell den roten Reset-Knopf drücken)
                  </>
                }
              />
            </ListItem>
          )}

          <ListItem>
            <ListItemIcon sx={{ justifyContent: "center" }}>
              <Usb sx={{ fontSize: 32, color: theme.palette.primary.main }} />
            </ListItemIcon>
            <ListItemText
              primary={
                <>
                  {selectedBoard === "MCU" ? (
                    <>
                      4. <b>{filename}.bin</b> per Drag & Drop auf die senseBox
                      kopieren
                    </>
                  ) : (
                    <>
                      3. <b>{filename}.bin</b> per Drag & Drop auf die senseBox
                      kopieren
                    </>
                  )}
                </>
              }
            />
          </ListItem>
        </List>
        {/* Hilfe-Link unten rechts */}
        <Typography
          variant="caption"
          sx={{ display: "block", textAlign: "right" }}
        >
          Benötigst du Hilfe?{" "}
          <Box
            component="a"
            href={
              selectedBoard === "MCU"
                ? "https://docs.sensebox.de/docs/boards/mcu/mcu-kompilieren"
                : "https://docs.sensebox.de/docs/boards/mcus2/mcus2-kompilieren#kompilieren"
            }
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: "primary.main",
              textDecoration: "none",
              fontWeight: "bold",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Schau in unserer Dokumentation vorbei!
          </Box>
        </Typography>
      </Box>

      <Card
        variant="outlined"
        sx={{
          p: 1,
          borderStyle: "dashed",
          borderColor: "grey.400",
          borderWidth: 2,
          borderRadius: 3,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Steps-Row */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {/* Step 1: Downloads */}
          <Box
            display="flex"
            textAlign="center"
            flexDirection="column"
            alignItems="center"
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                bgcolor: theme.palette.senseboxColors.blue,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
              }}
            >
              <FolderOpen sx={{ fontSize: 36, color: "white" }} />
            </Box>
            <Typography variant="body2" fontWeight="bold">
              Downloads
            </Typography>
          </Box>

          {/* Pfeil */}
          <ArrowForward
            sx={{
              fontSize: 42,
              color: theme.palette.primary.main,
              marginBottom: "5px",
            }}
          />

          {/* Step 2: File */}
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box
              sx={{
                width: 48,
                height: 48,
                bgcolor: "grey.100",
                border: "2px solid",
                borderColor: "grey.300",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "white",
                  border: "1px solid",
                  borderColor: "grey.400",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  color="text.secondary"
                >
                  bin
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" fontWeight="bold">
              {filename}.bin
            </Typography>
          </Box>

          {/* Pfeil */}
          <ArrowForward
            sx={{
              fontSize: 42,

              color: theme.palette.primary.main,
              marginBottom: "5px",
            }}
          />

          {/* Step 3: senseBox */}
          <Box
            display="flex"
            textAlign="center"
            flexDirection="column"
            alignItems="center"
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                bgcolor: theme.palette.primary.main,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
              }}
            >
              <Usb sx={{ fontSize: 36, color: "white" }} />
            </Box>
            <Typography variant="body2" fontWeight="bold">
              senseBox
            </Typography>
          </Box>
        </Box>
      </Card>
      {/* <TransferHint filename={filename} /> */}
    </Box>
  );
}
