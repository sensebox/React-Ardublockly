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
import { getAccelerationTranslations } from "./translations";

// Load acceleration-specific help markdown files
const markdownFiles = import.meta.glob("./translations/help/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

export const SIDEBAR_WIDTH = 320;
const NAVBAR_HEIGHT = 64;

const AccelerationHelpSidebar = ({ open, onClose, helpTopic }) => {
  const theme = useTheme();
  const isWideScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollOffset(Math.min(window.scrollY, NAVBAR_HEIGHT));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isWideScreen) return null;

  const t = getAccelerationTranslations();
  const helpTranslations = t.help || {};

  const locale = window.localStorage.getItem("locale") || "de_DE";
  const language = locale.split("_")[0];

  const mdKey = `./translations/help/${language}/${helpTopic}.md`;
  const mdFallbackKey = `./translations/help/de/${helpTopic}.md`;
  const markdownContent =
    markdownFiles[mdKey] ?? markdownFiles[mdFallbackKey] ?? null;

  const topicTranslation = helpTranslations[helpTopic];
  const title = topicTranslation?.title ?? helpTranslations.help ?? "Help";

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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h6">{title}</Typography>
        <IconButton onClick={onClose} size="small">
          <ChevronRightIcon />
        </IconButton>
      </Box>

      <Box sx={{ p: 2, overflowY: "auto", flex: 1 }}>
        {markdownContent ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ src, alt }) => (
                <img
                  src={src}
                  alt={alt}
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              ),
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {helpTranslations.help || "Help"}
          </Typography>
        )}
      </Box>
    </Drawer>
  );
};

export default AccelerationHelpSidebar;
