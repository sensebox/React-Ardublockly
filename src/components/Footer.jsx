import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Link, Typography, useTheme } from "@mui/material";

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        position: "absolute",
        bottom: 0,
        width: "100%",
      }}
    >
      <Box
        sx={{
          minHeight: 30,
          backgroundColor: theme.palette.primary.main,
          textAlign: "center",
          py: 0.5,
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            color: theme.palette.primary.contrastText,
          }}
        >
          <Link
            component={RouterLink}
            to="/impressum"
            underline="none"
            color="inherit"
          >
            Impressum
          </Link>

          <Typography component="span">|</Typography>

          <Link
            component={RouterLink}
            to="/privacy"
            underline="none"
            color="inherit"
          >
            Privacy
          </Link>

          <Typography component="span">|</Typography>

          <Link
            component={RouterLink}
            to="/news"
            underline="none"
            color="inherit"
          >
            News
          </Link>

          <Typography component="span">|</Typography>

          <Link
            href="https://sensebox.de"
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            color="inherit"
          >
            sensebox.de
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
