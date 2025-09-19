import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  useTheme,
} from "@mui/material";

const HardwareCard = ({ component }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: "100%",
        transition: "all 0.2s ease-in-out",
        "&:hover": { boxShadow: 6 },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 2,
            alignItems: "center",
          }}
        >
          {/* Bild */}
          <img
            src={component.image || "/media/hardware/hdc1080.png"}
            alt={component.name}
            style={{
              width: 64,
              height: 64,
              objectFit: "cover",
              borderRadius: 8,
              background: theme.palette.action.hover,
            }}
          />

          {/* Textbereich */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              fontWeight="500"
              noWrap
              gutterBottom
            >
              {component}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
              }}
            >
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr
            </Typography>

            <Box sx={{ mt: 1 }}>
              <a
                href={component.docUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <Chip
                  label="Zur senseBox Doku"
                  color="primary"
                  clickable
                  sx={{ fontWeight: 500 }}
                />
              </a>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default HardwareCard;
