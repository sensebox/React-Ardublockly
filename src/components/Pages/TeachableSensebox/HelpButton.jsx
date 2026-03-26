import React from "react";
import { IconButton, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
          color: "grey.600",
          backgroundColor: "white",
          "&:hover": {
            backgroundColor: "grey.600",
            color: "white",
          },
          ml: 1,
          width: size === "small" ? 28 : 36,
          height: size === "small" ? 28 : 36,
        }}
      >
        <FontAwesomeIcon icon={faQuestionCircle} />
      </IconButton>
    </Tooltip>
  );
};

export default HelpButton;
