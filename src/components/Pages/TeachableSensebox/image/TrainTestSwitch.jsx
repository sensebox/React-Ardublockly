import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const buttonSx = {
  flex: 1,
  typography: "h5",
  textTransform: "none",
  py: 1,
  borderColor: "primary.main",
  bgcolor: "common.white",
  color: "primary.main",
  "&:hover": { bgcolor: "action.hover" },
  "&.Mui-selected, &.Mui-selected:hover": {
    bgcolor: "primary.main",
    color: "common.white",
  },
};

/**
 * Section title that switches between the training and the test view.
 * `value` is either "train" or "test".
 */
const TrainTestSwitch = ({ value, onChange, disabled, t }) => (
  <ToggleButtonGroup
    value={value}
    exclusive
    fullWidth
    disabled={disabled}
    onChange={(_, next) => next && onChange(next)}
    aria-label={t.section.switchView}
  >
    <ToggleButton value="train" sx={buttonSx}>
      {t.section.viewTraining}
    </ToggleButton>
    <ToggleButton value="test" sx={buttonSx}>
      {t.section.viewTest}
    </ToggleButton>
  </ToggleButtonGroup>
);

export default TrainTestSwitch;
