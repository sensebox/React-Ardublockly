import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ChevronRight as ChevronRightIcon } from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getTeachableMachineTranslations } from "./translations";

// Load all help markdown files eagerly (Vite requires a static glob pattern)
const markdownFiles = import.meta.glob("./translations/help/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

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

  // Determine language for markdown file lookup
  const locale = window.localStorage.getItem("locale") || "de_DE";
  const language = locale.split("_")[0];

  // Resolve markdown content: prefer current language, fall back to "de"
  const mdKey = `./translations/help/${language}/${helpTopic}.md`;
  const mdFallbackKey = `./translations/help/de/${helpTopic}.md`;
  const markdownContent =
    markdownFiles[mdKey] ?? markdownFiles[mdFallbackKey] ?? null;

  // Title from translations (keep as localised string)
  const topicTranslation = helpTranslations[helpTopic];
  const title = topicTranslation?.title ?? helpTranslations.help ?? "Help";

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
          {title}
        </Typography>
      </Box>

      {/* Content */}
      <Box
        sx={{
          p: 2,
          overflowY: "auto",
          flex: 1,
          "& h1": { fontSize: "1.25rem", fontWeight: "bold", mt: 0, mb: 1 },
          "& h2": { fontSize: "1.05rem", fontWeight: "bold", mt: 2, mb: 0.5 },
          "& h3": { fontSize: "1rem", fontWeight: "bold", mt: 1.5, mb: 0.5 },
          "& p": { mt: 0, mb: 1, color: "text.secondary" },
          "& ul, & ol": { pl: 2.5, mb: 1, color: "text.secondary" },
          "& li": { mb: 0.5 },
          "& table": { borderCollapse: "collapse", width: "100%", mb: 1 },
          "& th, & td": {
            border: "1px solid",
            borderColor: "divider",
            px: 1,
            py: 0.5,
            fontSize: "0.875rem",
          },
          "& blockquote": {
            borderLeft: "3px solid",
            borderColor: "primary.main",
            pl: 1.5,
            ml: 0,
            color: "text.secondary",
            fontStyle: "italic",
          },
          "& code": {
            backgroundColor: "grey.100",
            px: 0.5,
            borderRadius: 0.5,
            fontSize: "0.8rem",
            fontFamily: "monospace",
          },
          "& strong": { color: "text.primary" },
        }}
      >
        {markdownContent ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdownContent}
          </ReactMarkdown>
        ) : (
          <Typography variant="body1" color="text.secondary">
            {helpTranslations.defaultContent || "Select a help topic."}
          </Typography>
        )}
      </Box>
    </Drawer>
  );
};

export default HelpSidebar;
export { SIDEBAR_WIDTH };
