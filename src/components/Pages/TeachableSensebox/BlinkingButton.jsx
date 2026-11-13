import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

// 5 pulses of 1 s each → the button blinks for 5 seconds, then stays solid.
const BLINK_PERIOD_S = 1;
const BLINK_COUNT = 5;

/**
 * BlinkingButton
 *
 * Contained primary MUI Button that blinks to draw attention to the next step
 * (e.g. granting the bootloader port, or connecting again after a sketch
 * upload). All other props are passed to the Button.
 *
 * @param {boolean} [blink=true] - The button blinks once each time this turns
 *   true (and on mount if it is true).
 * @param {boolean} [disabled] - Stops the blink. It doesn't start again when
 *   the button is re-enabled (e.g. after the user clicked and the action
 *   failed) – only when `blink` turns true again.
 */
const BlinkingButton = ({
  blink = true,
  disabled,
  onAnimationEnd,
  sx,
  ...buttonProps
}) => {
  const theme = useTheme();
  const main = theme.palette.primary.main;
  const [blinkDone, setBlinkDone] = useState(false);

  useEffect(() => {
    if (blink) setBlinkDone(false);
  }, [blink]);

  useEffect(() => {
    if (disabled) setBlinkDone(true);
  }, [disabled]);

  return (
    <Button
      variant="contained"
      color="primary"
      {...buttonProps}
      disabled={disabled}
      onAnimationEnd={(event) => {
        setBlinkDone(true);
        onAnimationEnd?.(event);
      }}
      sx={[
        {
          "@keyframes teachableButtonBlink": {
            "0%, 100%": {
              backgroundColor: main,
              color: theme.palette.primary.contrastText,
              boxShadow: `inset 0 0 0 2px ${main}`,
            },
            "50%": {
              backgroundColor: alpha(theme.palette.common.white, 0.95),
              color: main,
              boxShadow: `inset 0 0 0 2px ${main}`,
            },
          },
          animation:
            !blink || disabled || blinkDone
              ? "none"
              : `teachableButtonBlink ${BLINK_PERIOD_S}s ease-in-out ${BLINK_COUNT}`,
          "@media (prefers-reduced-motion: reduce)": {
            animation: "none",
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
};

export default BlinkingButton;
