import React, { useEffect, useId, useState } from "react";
import PropTypes from "prop-types";
import * as Blockly from "blockly/core";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const VARIABLE_TYPES = [
  "int",
  "long",
  "float",
  "String",
  "char",
  "boolean",
  "bitmap",
];

export default function TypedVariableDialog({ workspace }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("int");
  const [error, setError] = useState("");
  const id = useId();

  useEffect(() => {
    if (!workspace || workspace.isDisposed?.()) return;
    workspace.registerButtonCallback("callbackName", () => {
      setName("");
      setType("int");
      setError("");
      setOpen(true);
    });
    return () => workspace.removeButtonCallback("callbackName");
  }, [workspace]);

  const close = () => setOpen(false);
  const create = (event) => {
    event.preventDefault();
    if (!workspace || workspace.isDisposed?.()) return;
    const normalized = name.replace(/[\s\xa0]+/g, " ").trim();
    if (
      !normalized ||
      [Blockly.Msg.RENAME_VARIABLE, Blockly.Msg.NEW_VARIABLE].includes(
        normalized,
      )
    ) {
      setError("invalid");
      return;
    }
    if (Blockly.Variables.nameUsedWithAnyType(normalized, workspace)) {
      setError("duplicate");
      return;
    }
    workspace.getVariableMap().createVariable(normalized, type);
    close();
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      fullWidth
      maxWidth="sm"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-intro`}
      PaperProps={{
        component: "form",
        onSubmit: create,
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle id={`${id}-title`} sx={{ pr: 7, pb: 1, fontWeight: 700 }}>
        {Blockly.Msg.typed_variable_title}
        <IconButton
          onClick={close}
          aria-label={Blockly.Msg.typed_variable_close}
          sx={{ position: "absolute", top: 12, right: 12 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography
          id={`${id}-intro`}
          color="text.secondary"
          variant="body2"
          sx={{ mb: 3 }}
        >
          {Blockly.Msg.typed_variable_intro}
        </Typography>
        <TextField
          autoFocus
          fullWidth
          required
          label={Blockly.Msg.typed_variable_name}
          value={name}
          placeholder={Blockly.Msg.typed_variable_placeholder}
          autoComplete="off"
          error={Boolean(error)}
          helperText={
            error
              ? Blockly.Msg[`typed_variable_${error}`]
              : Blockly.Msg.typed_variable_hint
          }
          onChange={(event) => {
            setName(event.target.value);
            setError("");
          }}
          FormHelperTextProps={{ "aria-live": "polite" }}
          sx={{ mb: 3 }}
        />
        <FormControl component="fieldset" fullWidth>
          <FormLabel
            component="legend"
            id={`${id}-types`}
            sx={{ color: "text.primary", fontWeight: 600 }}
          >
            {Blockly.Msg.typed_variable_type}
          </FormLabel>
          <Typography
            id={`${id}-type-hint`}
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5, mb: 1.5 }}
          >
            {Blockly.Msg.typed_variable_typeHint}
          </Typography>
          <RadioGroup
            aria-labelledby={`${id}-types`}
            aria-describedby={`${id}-type-hint`}
            name={`${id}-type`}
            value={type}
            onChange={(event) => setType(event.target.value)}
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 1,
            }}
          >
            {VARIABLE_TYPES.map((value) => (
              <FormControlLabel
                key={value}
                value={value}
                control={<Radio size="small" />}
                sx={{
                  m: 0,
                  p: 1,
                  alignItems: "flex-start",
                  border: "1px solid",
                  borderColor: type === value ? "primary.main" : "divider",
                  borderRadius: 2,
                  bgcolor:
                    type === value
                      ? "rgba(78, 175, 71, 0.08)"
                      : "background.paper",
                  "&:hover": { borderColor: "primary.main" },
                  "&:focus-within": {
                    outline: "2px solid",
                    outlineColor: "primary.main",
                    outlineOffset: 2,
                  },
                  "& .MuiRadio-root": { p: 0.5, mr: 0.75 },
                  "& .MuiFormControlLabel-label": { minWidth: 0 },
                }}
                label={
                  <Box sx={{ pt: 0.25 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {Blockly.Msg[`typed_variable_${value}_label`]} ({value})
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", lineHeight: 1.5 }}
                    >
                      {Blockly.Msg[`typed_variable_${value}_example`]}
                    </Typography>
                  </Box>
                }
              />
            ))}
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          gap: 1,
        }}
      >
        <Button onClick={close} color="inherit" sx={{ textTransform: "none" }}>
          {Blockly.Msg.typed_variable_cancel}
        </Button>
        <Button
          type="submit"
          variant="contained"
          disableElevation
          disabled={!name.trim()}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          {Blockly.Msg.typed_variable_create}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

TypedVariableDialog.propTypes = {
  workspace: PropTypes.object,
};
