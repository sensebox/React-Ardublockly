import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPlatform } from "../../actions/generalActions";

import * as Blockly from "blockly/core";

import Snackbar from "../Snackbar";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import FormHelperText from "@mui/material/FormHelperText";

export default function TabletMode() {
  const dispatch = useDispatch();
  const platform = useSelector((s) => s.general.platform);

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
    dispatch(setPlatform(value));
    setSnackInfo({
      type: "success",
      key: Date.now(),
      message:
        Blockly.Msg.settings_ota_changed ||
        `${Blockly.Msg.settings_ota_head} ${value ? Blockly.Msg.settings_ota_on.toLowerCase() : Blockly.Msg.settings_ota_off.toLowerCase()}`,
    });
    setSnackbarOpen(true);
  };

  return (
    <div>
      <Typography style={{ fontWeight: "bold" }}>
        {Blockly.Msg.settings_ota_head}
      </Typography>
      <FormHelperText
        style={{
          color: "black",
          lineHeight: 1.3,
          marginBottom: "8px",
        }}
      >
        {Blockly.Msg.settings_ota_text}
        <a
          href="https://sensebox.de/app"
          target="_blank"
          rel="noreferrer"
          style={{ marginLeft: "4px" }}
        >
          https://sensebox.de/app
        </a>
      </FormHelperText>
      <FormControl variant="standard">
        <InputLabel id="ota-selector-label">
          {Blockly.Msg.settings_statistics}
        </InputLabel>
        <Select
          variant="standard"
          labelId="ota-selector-label"
          id="ota-selector"
          value={platform}
          onChange={handleChange}
        >
          <MenuItem value={true}>{Blockly.Msg.settings_ota_on}</MenuItem>
          <MenuItem value={false}>{Blockly.Msg.settings_ota_off}</MenuItem>
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
