import React from "react";
import { Box, Paper } from "@mui/material";

/**
 * Page section (Paper) with a title row. Optional `actions` are rendered on
 * the right side of the title row. With `stickyTitle` the title row stays
 * at the top of the viewport while the section is scrolled.
 */
const Section = ({ title, actions, stickyTitle = false, children, sx }) => (
  <Paper elevation={2} sx={{ p: 3, ...sx }}>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        mb: 2,
        ...(stickyTitle && {
          position: "sticky",
          top: 0,
          zIndex: 2,
          bgcolor: "background.paper",
          // Extend the background over the Paper padding so content
          // scrolling underneath is fully covered
          mx: -3,
          mt: -3,
          px: 3,
          pt: 3,
          pb: 2,
          borderTopLeftRadius: "inherit",
          borderTopRightRadius: "inherit",
        }),
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>{title}</Box>
      {actions}
    </Box>
    {children}
  </Paper>
);

export default Section;
