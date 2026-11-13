import React from "react";
import {
  FormControlLabel,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { ANGLES, NV_AXES } from "./model.js";

// labels: {centres, orientations: [one per ensemble size], direction, angles: [one per ANGLES entry], fieldLines}
export default function MagnetControls({
  orientations,
  angle,
  fieldLines,
  onChange,
  labels,
}) {
  const group = (name, title, value, options) => (
    <Stack spacing={0.5}>
      <Typography variant="caption" color="text.secondary">
        {title}
      </Typography>
      <ToggleButtonGroup
        exclusive
        size="small"
        color="primary"
        aria-label={title}
        value={value}
        onChange={(_, next) => next != null && onChange({ [name]: next })}
      >
        {options.map(([option, label]) => (
          <ToggleButton
            key={option}
            id={`magnetometer-${name}-${option}`}
            value={option}
            sx={{ textTransform: "none" }}
          >
            {label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Stack>
  );
  return (
    <Stack
      direction="row"
      spacing={2}
      useFlexGap
      flexWrap="wrap"
      alignItems="flex-end"
      sx={{ mb: 2 }}
    >
      {group(
        "orientations",
        labels.centres,
        orientations,
        NV_AXES.map((_, i) => [i + 1, labels.orientations[i]]),
      )}
      {group(
        "angle",
        labels.direction,
        angle,
        ANGLES.map((value, i) => [value, labels.angles[i]]),
      )}
      <FormControlLabel
        label={labels.fieldLines}
        control={
          <Switch
            id="magnetometer-fieldlines-switch"
            checked={fieldLines}
            onChange={(event) => onChange({ fieldLines: event.target.checked })}
          />
        }
      />
    </Stack>
  );
}
