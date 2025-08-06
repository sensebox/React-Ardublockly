import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBoard } from "../../actions/boardAction";

import * as Blockly from "blockly/core";

import Snackbar from "../Snackbar";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import FormHelperText from "@mui/material/FormHelperText";

export default function DeviceSelector() {
  const dispatch = useDispatch();
  const selectedBoard = useSelector((s) => s.board.board);

  // force re-render so Blockly.Msg is up-to-date
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    forceUpdate((n) => n + 1);
  }, []);

  // snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackInfo, setSnackInfo] = useState({
    type: "success",
    key: 0,
    message: "",
  });

  const handleChange = (e) => {
    const value = e.target.value;
    dispatch(setBoard(value));

    setSnackInfo({
      type: "success",
      key: Date.now(),
      // you can replace this with a Blockly.Msg key if available
      message: `${Blockly.Msg.settings_board} geändert: ${value === "MCU" ? "senseBox MCU" : value === "MCU:mini" ? "senseBox MCU mini" : "senseBox MCU-S2"}`,
    });
    setSnackbarOpen(true);
  };

  return (
    <div>
      <Typography style={{ fontWeight: "bold" }}>
        {Blockly.Msg.settings_board}
      </Typography>
      <FormHelperText
        style={{
          color: "black",
          lineHeight: 1.3,
          marginBottom: "8px",
        }}
      >
        {Blockly.Msg.settings_board_text}
      </FormHelperText>
      <FormControl variant="standard">
        <InputLabel id="device-selector-label">
          {Blockly.Msg.settings_board}
        </InputLabel>
        <Select
          variant="standard"
          labelId="device-selector-label"
          id="device-selector"
          value={selectedBoard}
          onChange={handleChange}
        >
          <MenuItem value="MCU">senseBox MCU</MenuItem>
          <MenuItem value="MCU:mini">senseBox MCU mini</MenuItem>
          <MenuItem value="MCU-S2">senseBox MCU-S2</MenuItem>
        </Select>
      </FormControl>

      <Snackbar
        open={snackbarOpen}
        message={snackInfo.message}
        type={snackInfo.type}
        key={snackInfo.key}
      />
    </div>
  );
}
