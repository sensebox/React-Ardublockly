import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Close as CloseIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";

import { getTeachableMachineTranslations } from "./translations";

// Width of the sidebar
const SIDEBAR_WIDTH = 320;
const NAVBAR_HEIGHT = 64;

/**
 * HelpSidebar - A collapsible sidebar that shows help content for different topics
 */

const HelpSidebar = ({ open, onClose, helpTopic }) => {
  const theme = useTheme();
  const isWideScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [scrollOffset, setScrollOffset] = useState(0);

  // Track scroll position to adjust sidebar position
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Offset decreases as we scroll, but never goes below 0
      setScrollOffset(Math.min(scrollY, NAVBAR_HEIGHT));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Only render on wide screens
  if (!isWideScreen) {
    return null;
  }

  const t = getTeachableMachineTranslations();
  const helpTranslations = t.help || {};
  const content = helpTranslations[helpTopic] || {
    title: helpTranslations.help || "Help",
    content: t.help?.defaultContent || "Select a help topic.",
  };

  // Calculate dynamic top position: starts at navbar height, reduces to 0 as we scroll
  const topPosition = Math.max(0, NAVBAR_HEIGHT - scrollOffset);
  const sidebarHeight = `calc(100% - ${topPosition}px)`;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      variant="persistent"
      sx={{
        width: open ? SIDEBAR_WIDTH : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: SIDEBAR_WIDTH,
          boxSizing: "border-box",
          top: topPosition,
          height: sidebarHeight,
          borderLeft: "1px solid",
          borderColor: "divider",
          backgroundColor: "grey.50",
          transition: "top 0.1s ease-out, height 0.1s ease-out",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        <IconButton
          onClick={onClose}
          size="small"
          aria-label={helpTranslations.help || "Close help"}
          sx={{
            color: "text.secondary",
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
        <Typography variant="h6" fontWeight="bold" paddingLeft={1}>
          {content.title}
        </Typography>
      </Box>

      {/* Content */}
      <Box
        sx={{
          p: 2,
          overflowY: "auto",
          flex: 1,
        }}
      >
        <Typography variant="body1" color="text.secondary">
          {content.content}
        </Typography>

        {/* Placeholder for future content */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            backgroundColor: "grey.100",
            borderRadius: 1,
            border: "1px dashed",
            borderColor: "grey.400",
          }}
        >
          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            {t.help?.futureContent ||
              "Weitere Inhalte werden hier hinzugefügt..."}
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default HelpSidebar;
export { SIDEBAR_WIDTH };
