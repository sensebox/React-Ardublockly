import React from "react";
import {
  FormControlLabel,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { NV_AXES } from "./model.js";

// A single NV centre or the full ensemble with all four diamond axes.
export const ORIENTATION_CHOICES = [1, NV_AXES.length];

// The NV centres are chosen in the magnet scene: with this toggle in its
// controls, or by clicking the sensor (MagnetScene's menu). The magnet
// direction is set on the magnet itself.

// labels: {centres, orientations: [single, ensemble]}
export function OrientationToggle({ orientations, onChange, labels }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Typography variant="body2" color="text.secondary">
        {labels.centres}
      </Typography>
      <ToggleButtonGroup
        exclusive
        size="small"
        color="primary"
        aria-label={labels.centres}
        value={orientations}
        onChange={(_, next) => next != null && onChange(next)}
      >
        {ORIENTATION_CHOICES.map((option, i) => (
          <ToggleButton
            key={option}
            id={`magnetometer-orientations-${option}`}
            value={option}
            sx={{ textTransform: "none", px: 1.5, py: 0.25 }}
          >
            {labels.orientations[i]}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Stack>
  );
}

// 3D view (magnet anywhere around the sensor) or 2D front view.
export function ViewSwitch({ threeD, onChange, label }) {
  return (
    <FormControlLabel
      sx={{ mr: 0 }}
      label={<Typography variant="body2">{label}</Typography>}
      control={
        <Switch
          size="small"
          id="magnetometer-3d-switch"
          checked={threeD}
          onChange={(event) => onChange(event.target.checked)}
        />
      }
    />
  );
}

export function FieldLinesSwitch({ checked, onChange, label }) {
  return (
    <FormControlLabel
      sx={{ mr: 0 }}
      label={<Typography variant="body2">{label}</Typography>}
      control={
        <Switch
          size="small"
          id="magnetometer-fieldlines-switch"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
      }
    />
  );
}
