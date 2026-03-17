import React from "react";
import { IconButton, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import { HelpOutline as HelpIcon } from "@mui/icons-material";

/**
 * HelpButton - A grey question mark button that triggers help sidebar
 * Only visible on wide screens (lg breakpoint and above)
 */
const HelpButton = ({ onClick, tooltip = t.help.help, size = "small" }) => {
  const theme = useTheme();
  const isWideScreen = useMediaQuery(theme.breakpoints.up("lg"));

  // Only render on wide screens
  if (!isWideScreen) {
    return null;
  }

  return (
    <Tooltip title={tooltip} arrow>
      <IconButton
        onClick={onClick}
        size={size}
        aria-label={tooltip}
        sx={{
          color: "grey.500",
          backgroundColor: "grey.100",
          border: "1px solid",
          borderColor: "grey.300",
          "&:hover": {
            backgroundColor: "grey.200",
            color: "grey.700",
          },
          ml: 1,
          width: size === "small" ? 28 : 36,
          height: size === "small" ? 28 : 36,
        }}
      >
        <HelpIcon fontSize={size === "small" ? "small" : "medium"} />
      </IconButton>
    </Tooltip>
  );
};

export default HelpButton;
