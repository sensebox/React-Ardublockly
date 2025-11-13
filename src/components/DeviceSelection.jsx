import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Dialog from "./ui/Dialog";
import * as Blockly from "blockly";
import {
  IconButton,
  Grid,
  Avatar,
  Typography,
  Link,
  useTheme,
} from "@mui/material";
import { setBoard } from "../actions/boardAction";

const DeviceSelection = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const currentBoard = useSelector((state) => state.board.board);

  // Dialog geöffnet, wenn noch kein Board gesetzt ist
  const [open, setOpen] = useState(!currentBoard);
  const [selectedBoard, setSelectedBoard] = useState(currentBoard || "");

  const boards = [
    {
      value: "MCU",
      alt: "Sensebox MCU",
      label: "senseBox MCU",
      src: "/media/hardware/blockly_mcu.png",
    },
    {
      value: "MCU-S2",
      alt: "Sensebox ESP",
      label: "senseBox MCU-S2",
      src: "/media/hardware/blockly_esp.png",
    },
    {
      value: "MCU:MINI",
      alt: "Sensebox Mini",
      label: "senseBox MCU:mini",
      src: "/media/hardware/blockly_mini.png",
    },
  ];

  const handleBoardSelect = (value) => {
    setSelectedBoard(value);
    dispatch(setBoard(value));
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="xl"
      title={Blockly.Msg.deviceselection_head}
      onClick={() => dispatch(setBoard(selectedBoard))}
      disabled={!selectedBoard}
      sx={{ zIndex: 9999999 }}
    >
      <Grid container spacing={2} sx={{ textAlign: "center" }}>
        {boards.map(({ value, alt, label, src }) => (
          <Grid item xs={4} key={value}>
            <IconButton size="large" onClick={() => handleBoardSelect(value)}>
              <Avatar
                alt={alt}
                src={src}
                sx={{
                  border:
                    selectedBoard === value
                      ? `3px solid ${theme.palette.primary.main}`
                      : "0.1px solid lightgray",
                  width: "10vw",
                  height: "10vw",
                }}
              />
            </IconButton>
            <Typography sx={{ fontSize: "0.9rem" }}>{label}</Typography>
          </Grid>
        ))}
      </Grid>

      <Typography variant="body1" sx={{ mt: 2 }}>
        {Blockly.Msg.deviceselection_footnote}{" "}
        <Link
          href="https://sensebox.github.io/blockly/"
          sx={{
            color: theme.palette.primary.main,
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Arduino UNO
        </Link>{" "}
        {Blockly.Msg.deviceselection_footnote_02}{" "}
        <Link
          href="https://sensebox-blockly.netlify.app/ardublockly/?board=sensebox-mcu"
          sx={{
            color: theme.palette.primary.main,
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          senseBox MCU
        </Link>
      </Typography>
    </Dialog>
  );
};

export default DeviceSelection;
