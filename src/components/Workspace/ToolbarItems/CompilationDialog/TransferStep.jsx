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
  Block,
} from "@mui/icons-material";
import { useTheme } from "@mui/styles";
import { useSelector } from "react-redux";
import { IconButton, Tooltip } from "@mui/material";
import * as Blockly from "blockly/core";
export default function TransferStep() {
  const theme = useTheme();
  const filename = useSelector((state) => state.workspace.name);
  const selectedBoard = useSelector((state) => state.board.board);
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
          {Blockly.Msg.transfer_headline}
        </Typography>
        <Typography color="text.secondary">
          {Blockly.Msg.transfer_subline}
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
          {Blockly.Msg.steps_to_transfer}
        </Typography>

        <List dense>
          <ListItem>
            <ListItemIcon sx={{ justifyContent: "center" }}>
              <FolderOpen
                sx={{ fontSize: 32, color: theme.palette.primary.main }}
              />
            </ListItemIcon>
            <ListItemText primary={Blockly.Msg.step_1} />
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
                  {Blockly.Msg.file} <b>{filename}.bin</b>{" "}
                  {Blockly.Msg.step_2}{" "}
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
              <ListItemText primary={<>{Blockly.Msg.mcu_to_learnmode} </>} />
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
                      {Blockly.Msg.step_3_mcu.replace("{filename}", filename)}
                    </>
                  ) : (
                    <>
                      {Blockly.Msg.step_3_esp32.replace(
                        "{filename}",
                        filename,
                      )}{" "}
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
          {Blockly.Msg.need_help}{" "}
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
            {Blockly.Msg.compile_overlay_help_2}
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
