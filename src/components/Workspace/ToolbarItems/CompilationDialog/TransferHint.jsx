"use client";

import React from "react";
import { Card, Box, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDesktop, faMousePointer } from "@fortawesome/free-solid-svg-icons";

export default function TransferHint({ filename = "sketch.bin" }) {
  return (
    <Card
      variant="outlined"
      sx={{
        p: 2,
        bgcolor: "#fefce8", // yellow-50
        border: "1.5px solid",
        borderColor: "#fde047", // yellow-300
        borderRadius: 2,
      }}
    >
      <Box display="flex" alignItems="center" gap={1.5}>
        {/* Icon Left */}
        <Box
          sx={{
            width: 36,
            height: 36,
            bgcolor: "#eab308", // yellow-500
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <FontAwesomeIcon
            icon={faDesktop}
            style={{ color: "white", fontSize: 18 }}
          />
        </Box>

        {/* Text */}
        <Box flex={1}>
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            sx={{ color: "#854d0e", mb: 0.3 }}
          >
            Jetzt an deinem PC:
          </Typography>
          <Typography variant="body2" sx={{ color: "#ca8a04" }}>
            Öffne deinen <strong>Downloads-Ordner</strong> und suche{" "}
            <strong>{filename}.bin</strong>. Ziehe sie auf dein{" "}
            <strong>senseBox-Laufwerk</strong>.
          </Typography>
        </Box>

        {/* Icon Right mit Bounce */}
        <Box
          component={FontAwesomeIcon}
          icon={faMousePointer}
          sx={{
            fontSize: 20,
            color: "#ca8a04", // yellow-600
            animation: "bounce 1.5s infinite",
            "@keyframes bounce": {
              "0%, 20%, 50%, 80%, 100%": {
                transform: "translateY(0)",
              },
              "40%": {
                transform: "translateY(-6px)",
              },
              "60%": {
                transform: "translateY(-3px)",
              },
            },
          }}
        />
      </Box>
    </Card>
  );
}
