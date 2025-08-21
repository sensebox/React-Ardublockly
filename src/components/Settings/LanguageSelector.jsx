import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../../actions/generalActions";

import * as Blockly from "blockly/core";

import Snackbar from "../Snackbar";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import FormHelperText from "@mui/material/FormHelperText";

export default function LanguageSelector() {
  const dispatch = useDispatch();
  const language = useSelector((s) => s.general.language);

  // force re-render so Blockly.Msg is up-to-date
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    forceUpdate((n) => n + 1);
  }, [language]);

  // snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackInfo, setSnackInfo] = useState({
    type: "success",
    key: 0,
    message: "",
  });

  const handleChange = (e) => {
    const newLang = e.target.value;
    dispatch(setLanguage(newLang));
    setSnackInfo({
      type: "success",
      key: Date.now(),
      message: Blockly.Msg.settings_language_changed || "Sprache geändert",
    });
    setSnackbarOpen(true);
  };

  return (
    <div>
      <Typography id="settingsLanguage" style={{ fontWeight: "bold" }}>
        {Blockly.Msg.settings_language}
      </Typography>
      <FormHelperText
        style={{
          color: "black",
          lineHeight: 1.3,
          marginBottom: "8px",
        }}
      >
        {Blockly.Msg.settings_language_text}
      </FormHelperText>
      <FormControl variant="standard">
        <InputLabel id="language-selector-label">
          {Blockly.Msg.settings_language}
        </InputLabel>
        <Select
          variant="standard"
          labelId="language-selector-label"
          id="language-selector"
          value={language}
          onChange={handleChange}
        >
          <MenuItem value="de_DE">{Blockly.Msg.settings_language_de}</MenuItem>
          <MenuItem value="en_US">{Blockly.Msg.settings_language_en}</MenuItem>
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
