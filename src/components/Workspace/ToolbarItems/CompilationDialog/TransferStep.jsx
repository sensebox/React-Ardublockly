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
import { FolderOpen, Usb } from "@mui/icons-material";
import { useTheme } from "@mui/styles";
import { useSelector } from "react-redux";
export default function TransferStep() {
  const theme = useTheme();
  const filename = useSelector((state) => state.workspace.name);
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
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Schritte zur Übertragung:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <FolderOpen sx={{ fontSize: 36, color: "#4EAF47" }} />
            </ListItemIcon>
            <ListItemText primary="1. Downloads-Ordner öffnen" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
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
              </Box>{" "}
            </ListItemIcon>
            <ListItemText
              primary={
                <>
                  2. Datei <b>{filename}.bin</b> finden
                </>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Usb sx={{ color: "#4EAF47" }} />
            </ListItemIcon>
            <ListItemText
              primary={
                <>
                  3. <b>{filename}.bin</b> per Drag & Drop auf die senseBox
                  kopieren
                </>
              }
            />
          </ListItem>
        </List>
      </Box>

      <Card
        variant="outlined"
        sx={{
          p: 2,
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
            textAlign="center"
            zIndex={1}
            flexDirection="column"
            alignItems={"center"}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
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

          {/* Step 2: File */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems={"center"}
            zIndex={1}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
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
                  height: 40,
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

          {/* Step 3: senseBox */}
          <Box
            textAlign="center"
            zIndex={1}
            flexDirection="column"
            alignItems={"center"}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
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
            <Typography
              variant="body2"
              fontWeight="bold"
              color={theme.palette.primary.main}
            >
              senseBox
            </Typography>
          </Box>
        </Box>

        {/* Animated Dot über die ganze Reihe */}
        <Box
          sx={{
            position: "absolute",
            top: "40%",
            left: "8%",
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            bgcolor: "primary.main",
            transform: "translateY(-50%)",
            animation: "moveFile 3s ease-in-out infinite",
          }}
        />

        <style>
          {`
@keyframes moveFile {
  0%, 8%   { left: 8%; }
  35%, 42% { left: 48%; }
  80%,100% { left: 88%; }
}



    `}
        </style>
      </Card>
      {/* <TransferHint filename={filename} /> */}
    </Box>
  );
}
