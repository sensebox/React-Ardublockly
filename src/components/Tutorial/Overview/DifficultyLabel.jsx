import React from "react";
import { Box } from "@mui/material";

const difficultyColors = {
  SEHR_LEICHT: {
    background: "#dcfce7", // bg-green-100
    text: "#166534", // text-green-800
    border: "#bbf7d0", // border-green-200
  },
  LEICHT: {
    background: "#dbeafe", // bg-blue-100
    text: "#1e40af", // text-blue-800
    border: "#bfdbfe", // border-blue-200
  },
  MITTEL: {
    background: "#fef3c7", // bg-yellow-100
    text: "#92400e", // text-yellow-800
    border: "#fde68a", // border-yellow-200
  },
  SCHWER: {
    background: "#fed7aa", // bg-orange-100
    text: "#9a3412", // text-orange-800
    border: "#fdba74", // border-orange-200
  },
  SEHR_SCHWER: {
    background: "#fee2e2", // bg-red-100
    text: "#991b1b", // text-red-800
    border: "#fecaca", // border-red-200
  },
};

const DifficultyLabel = ({ level }) => {
  const colors = difficultyColors[level] || difficultyColors.MITTEL; // Fallback

  return (
    <Box
      sx={{
        display: "inline-block",
        px: 2,
        py: 0.5,
        borderRadius: "20px",
        fontWeight: "bold",
        fontSize: "0.875rem",
        textAlign: "center",
        color: colors.text,
        backgroundColor: colors.background,
        border: `1px solid ${colors.border}`,
      }}
    >
      {level.replace("_", " ")} {/* Text direkt aus Key */}
    </Box>
  );
};

export default DifficultyLabel;
