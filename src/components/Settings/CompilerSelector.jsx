import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCompiler } from "../../actions/generalActions";

import * as Blockly from "blockly/core";

import Snackbar from "../Snackbar";

import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function CompilerSelector() {
  const dispatch = useDispatch();
  const selectedCompiler = useSelector((s) => s.general.compiler);
  const [tempCompiler, setTempCompiler] = useState(selectedCompiler);
  const [readOnly, setReadOnly] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackInfo, setSnackInfo] = useState({
    type: "success",
    key: 0,
    message: "",
  });

  // ensure Blockly.Msg has loaded
  useEffect(() => {}, []);

  const handleToggle = () => {
    setReadOnly((prev) => !prev);
  };

  const handleInputChange = (e) => {
    setTempCompiler(e.target.value);
  };

  const handleSave = () => {
    dispatch(setCompiler(tempCompiler));
    setSnackInfo({
      type: "success",
      key: Date.now(),
      message:
        Blockly.Msg.settings_compiler_changed ||
        "Compiler erfolgreich geändert",
    });
    setSnackbarOpen(true);
  };

  return (
    <div>
      <Typography style={{ fontWeight: "bold" }}>
        {Blockly.Msg.settings_compiler}
      </Typography>
      <FormHelperText
        style={{
          color: "black",
          lineHeight: 1.3,
          marginBottom: "8px",
        }}
      >
        {Blockly.Msg.settings_compiler_text}
      </FormHelperText>

      <FormControl variant="standard">
        <FormControlLabel
          control={<Checkbox checked={readOnly} onChange={handleToggle} />}
          label={Blockly.Msg.settings_compiler_readOnly}
        />
        <TextField
          label="Helper text"
          helperText={Blockly.Msg.settings_compiler_helperText}
          value={tempCompiler}
          onChange={handleInputChange}
          InputProps={{
            readOnly: !readOnly,
          }}
          style={{
            backgroundColor: !readOnly ? "#f0f0f0" : "white",
            color: readOnly ? "gray" : "black",
            borderRadius: "5px",
            marginBottom: "8px",
          }}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          disabled={!readOnly}
          onClick={handleSave}
          sx={{ alignSelf: "flex-start" }}
        >
          Compiler ändern
        </Button>
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
