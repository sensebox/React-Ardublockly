import React, { useState, useCallback, useEffect, useRef } from "react";
import { IconButton, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// ─── Help-blink hooks ──────────────────────────────────────────────────────────

const STORAGE_KEY = "teachable_help_seen";
const BLINK_DURATION_MS = 1400;

function getSeenTopics() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function markHelpSeen(topic) {
  try {
    const seen = getSeenTopics();
    seen[topic] = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seen));
  } catch {
    // ignore storage errors in restricted environments
  }
}

export function isHelpSeen(topic) {
  return getSeenTopics()[topic] === true;
}

/**
 * useHelpBlink(topic)
 *
 * Returns { isBlinking, trigger, markSeen }
 *
 * - trigger()  starts a two-blink animation if the topic has not been seen yet
 * - markSeen() stops blinking and persists the "seen" flag
 */
export function useHelpBlink(topic) {
  const [isBlinking, setIsBlinking] = useState(false);
  const timerRef = useRef(null);

  const trigger = useCallback(() => {
    if (!isHelpSeen(topic)) {
      setIsBlinking(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(
        () => setIsBlinking(false),
        BLINK_DURATION_MS,
      );
    }
  }, [topic]);

  const markSeen = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsBlinking(false);
    markHelpSeen(topic);
  }, [topic]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { isBlinking, trigger, markSeen };
}

/**
 * useHelpBlinkCooldown(cooldownMs)
 *
 * Like useHelpBlink but always re-triggers (no seen-flag check).
 * A minimum cooldown between triggers prevents over-blinking.
 */
export function useHelpBlinkCooldown(cooldownMs = 3000) {
  const [isBlinking, setIsBlinking] = useState(false);
  const timerRef = useRef(null);
  const lastTriggerRef = useRef(0);

  const trigger = useCallback(() => {
    const now = Date.now();
    if (now - lastTriggerRef.current >= cooldownMs) {
      lastTriggerRef.current = now;
      setIsBlinking(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(
        () => setIsBlinking(false),
        BLINK_DURATION_MS,
      );
    }
  }, [cooldownMs]);

  const markSeen = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsBlinking(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { isBlinking, trigger, markSeen };
}

// ─── HelpButton component ──────────────────────────────────────────────────────

/**
 * HelpButton - A grey question mark button that triggers help sidebar
 * Only visible on wide screens (lg breakpoint and above)
 *
 * Props:
 *   isBlinking - when true, plays a two-pulse highlight animation to draw attention
 */
const HelpButton = ({
  onClick,
  tooltip = "Help",
  size = "small",
  isBlinking = false,
}) => {
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
          ...(isBlinking && {
            "@keyframes helpButtonBlink": {
              "0%, 50%, 100%": {
                backgroundColor: "white",
                color: theme.palette.grey[600],
                transform: "scale(1)",
              },
              "25%, 75%": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                transform: "scale(1.3)",
              },
            },
            animation: "helpButtonBlink 1.4s ease-in-out forwards",
          }),
        }}
      >
        <FontAwesomeIcon icon={faQuestionCircle} />
      </IconButton>
    </Tooltip>
  );
};

export default HelpButton;
