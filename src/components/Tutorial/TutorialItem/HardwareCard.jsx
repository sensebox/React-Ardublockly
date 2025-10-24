import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import { MenuBook } from "@mui/icons-material";
import COMPONENT_MAP from "../componentMap"; // Pfad ggf. anpassen
const HardwareCard = ({ component }) => {
  const theme = useTheme();
  const compData = COMPONENT_MAP[component] || {
    name: component,
    image: "/media/hardware/3dmodels/coming-soon.png", // Fallback
    docUrl: "#",
  };

  return (
    <Card
      sx={{
        height: "100%",

        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: 3,
        transition: "all 0.25s ease-in-out",
        "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
      }}
    >
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          textAlign: "center",
        }}
      >
        {/* Bild */}
        {/* Bild mit Hover-Zoom */}
        <Tooltip
          title={
            <Box
              sx={{
                p: 1,
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              <img
                src={compData.image}
                alt={compData.name}
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "contain",
                }}
              />
            </Box>
          }
          placement="top"
          arrow
        >
          <Box
            sx={{
              width: 96,
              height: 96,
              borderRadius: "20%",
              background: theme.palette.action.hover,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              boxShadow: 1,
              cursor: "pointer",
            }}
          >
            <img
              src={compData.image}
              alt={compData.name}
              style={{
                width: "70%",
                height: "70%",
                objectFit: "contain",
              }}
            />
          </Box>
        </Tooltip>

        {/* Titel */}
        <Typography variant="subtitle1" fontWeight="600" noWrap>
          {compData.name}
        </Typography>

        {/* Sensor (falls vorhanden) */}
        {compData.sensor && (
          <Chip
            label={compData.sensor}
            color="primary"
            variant="outlined"
            size="small"
          />
        )}
      </CardContent>

      {/* Footer mit Doc-Link */}
      <Box
        sx={{
          p: 1,
          display: "flex",
          justifyContent: "center",
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Tooltip title="Zur Dokumentation">
          <IconButton
            href={compData.docUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "white",
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            <MenuBook />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
};

HardwareCard.propTypes = {
  component: PropTypes.string.isRequired, // nur Name-String notwendig
};

export default HardwareCard;
