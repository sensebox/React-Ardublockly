import React from "react";
import { Box, Paper } from "@mui/material";

/**
 * Page section (Paper) with a title row. Optional `actions` are rendered on
 * the right side of the title row. With `stickyTitle` the title row stays
 * at the top of the viewport while the section is scrolled. With
 * `fullWidthTitle` the title row spans the whole card without padding
 * (e.g. for tabs).
 */
const Section = ({
  title,
  actions,
  stickyTitle = false,
  fullWidthTitle = false,
  children,
  sx,
}) => (
  <Paper elevation={2} sx={{ p: 3, ...sx }}>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        mb: 2,
        ...((stickyTitle || fullWidthTitle) && {
          // Extend the title row over the Paper padding
          mx: -3,
          mt: -3,
          px: 3,
          pt: 3,
          pb: 2,
          borderTopLeftRadius: "inherit",
          borderTopRightRadius: "inherit",
          overflow: "hidden",
        }),
        ...(stickyTitle && {
          position: "sticky",
          top: 0,
          zIndex: 2,
          // Cover content scrolling underneath
          bgcolor: "background.paper",
        }),
        ...(fullWidthTitle && { px: 0, pt: 0, pb: 0 }),
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>{title}</Box>
      {actions}
    </Box>
    {children}
  </Paper>
);

export default Section;
