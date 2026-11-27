import React from "react";
import { Tab, Tabs, Tooltip } from "@mui/material";

// Folder-tab look: unselected tabs are tinted and sit "behind" the card
// (bottom divider line), the selected tab has the card's background, merges
// with the content below and is marked by a green line on top.
// `action.*` colours are translucent, so this works in light and dark mode.
const tabSx = {
  typography: "h5",
  textTransform: "none",
  py: 2,
  color: "text.primary",
  bgcolor: "action.selected",
  boxShadow: (theme) => `inset 0 -1px 0 ${theme.palette.divider}`,
  borderTopLeftRadius: (theme) => theme.shape.borderRadius,
  borderTopRightRadius: (theme) => theme.shape.borderRadius,
  "&:hover": { bgcolor: "action.focus" },
  "&.Mui-selected, &.Mui-selected:hover": {
    color: "primary.main",
    bgcolor: "background.paper",
    boxShadow: (theme) => `inset 0 3px 0 ${theme.palette.primary.main}`,
  },
  "&.Mui-disabled": { color: "text.disabled" },
};

// Looks like a disabled tab but still receives hover events for the tooltip
// (a real disabled tab has `pointer-events: none`).
const lockedTabSx = {
  ...tabSx,
  color: "text.disabled",
  cursor: "default",
  "&:hover": { bgcolor: "action.selected" },
};

/**
 * Section title that switches between the training and the test view.
 * Rendered as full-width tabs; use it with `fullWidthTitle` on `Section` so
 * the tabs span the whole card.
 * `value` is either "train" or "test". `testDisabled` greys out only the
 * test tab (e.g. while no model has been trained) and explains why in a
 * tooltip.
 */
const TrainTestSwitch = ({ value, onChange, disabled, testDisabled, t }) => (
  <Tabs
    value={value}
    variant="fullWidth"
    onChange={(_, next) => {
      if (next === "test" && testDisabled) return;
      onChange(next);
    }}
    aria-label={t.section.switchView}
    sx={{
      // The top line marks the selected tab instead of the underline
      "& .MuiTabs-indicator": { display: "none" },
    }}
  >
    <Tab
      value="train"
      label={t.section.viewTraining}
      disabled={disabled}
      sx={tabSx}
    />
    {/* Tabs reads `value` from its direct child; Tooltip passes it and the
        other props from Tabs on to the Tab */}
    <Tooltip
      value="test"
      title={testDisabled ? t.section.testRequiresModel : ""}
      arrow
    >
      <Tab
        value="test"
        label={t.section.viewTest}
        disabled={disabled && !testDisabled}
        aria-disabled={testDisabled || undefined}
        disableRipple={testDisabled}
        sx={testDisabled ? lockedTabSx : tabSx}
      />
    </Tooltip>
  </Tabs>
);

export default TrainTestSwitch;
