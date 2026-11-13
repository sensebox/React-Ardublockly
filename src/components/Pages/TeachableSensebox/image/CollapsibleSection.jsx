import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Box, Collapse, IconButton, Paper, Tooltip } from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { getImageTranslations } from "./translations";

/**
 * Page section (Paper) with a title row and a subtle arrow button on the
 * right that collapses/expands the section content.
 */
const CollapsibleSection = ({
  title,
  children,
  defaultExpanded = true,
  sx,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const language = useSelector((s) => s.general.language);
  const t = getImageTranslations(language);
  const label = expanded ? t.section.collapse : t.section.expand;

  return (
    <Paper elevation={2} sx={{ p: 3, ...sx }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>{title}</Box>
        <Tooltip title={label} arrow>
          <IconButton
            size="small"
            onClick={() => setExpanded((prev) => !prev)}
            aria-label={label}
            aria-expanded={expanded}
            sx={{ color: "text.secondary", mt: -0.5 }}
          >
            <ExpandMoreIcon
              sx={{
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Collapse in={expanded}>{children}</Collapse>
    </Paper>
  );
};

export default CollapsibleSection;
