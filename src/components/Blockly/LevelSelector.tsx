import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLevelStore } from "../../store/useLevelStore";

interface LevelSelectorProps {
  onLevelChange?: (level: number) => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ onLevelChange }) => {
  const selectedLevel = useLevelStore((state) => state.level);
  const setLevel = useLevelStore((state) => state.setLevel);

  const handleSelect = (level: number) => {
    setLevel(level);
  };

  useEffect(() => {
    console.log("Selected level changed:", selectedLevel);
  }, [selectedLevel]);

  return (
    <div style={{ display: "flex", gap: "8px", paddingBottom: "8px" }}>
      {[1, 2, 3].map((level) => (
        <IconButton
          key={level}
          onClick={() => handleSelect(level)}
          style={{
            padding: "8px 16px",
            background: selectedLevel === level ? "#1976d2" : "#e0e0e0",
            color: selectedLevel === level ? "#fff" : "#000",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: selectedLevel === level ? "bold" : "normal",
          }}
        >
          {level}
        </IconButton>
      ))}
    </div>
  );
};

export default LevelSelector;
