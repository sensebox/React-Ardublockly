import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLevelStore } from "../../store/useLevelStore";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { faCaretDown, faLevelUp } from "@fortawesome/free-solid-svg-icons";

interface LevelSelectorProps {}

const LevelSelector: React.FC<LevelSelectorProps> = ({}) => {
  const selectedLevel = useLevelStore((state) => state.level);
  const setLevel = useLevelStore((state) => state.setLevel);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleSelect = (level: number) => {
    setLevel(level);
    handleClose();
  };

  useEffect(() => {
    console.log("Selected level changed:", selectedLevel);
  }, [selectedLevel]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ padding: "12px" }}>
      <Button
        style={{
          textTransform: "none",
          cursor: "pointer",
          alignItems: "center",
          alignContent: "center",
          background: "transparent",
          color: "inherit",
          fontWeight: "bold",
          border: "2px solid white",
          borderRadius: "25px",
        }}
        id="level-button"
        aria-controls={Boolean(anchorEl) ? "level-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={Boolean(anchorEl) ? "true" : undefined}
        onClick={(event) => {
          handleSelect(selectedLevel);
          setAnchorEl(event.currentTarget);
        }}
        variant="contained"
        color="primary"
        startIcon={<FontAwesomeIcon icon={faLevelUp} />}
        endIcon={<FontAwesomeIcon icon={faCaretDown} />}
      >
        Level {selectedLevel}
      </Button>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleSelect(1)}>
          <FontAwesomeIcon icon="level-up-alt" />
          Level 1
        </MenuItem>
        <MenuItem onClick={() => handleSelect(2)}>
          <FontAwesomeIcon icon="level-up-alt" />
          Level 2
        </MenuItem>
        <MenuItem onClick={() => handleSelect(3)}>
          <FontAwesomeIcon icon="level-up-alt" />
          Level 3
        </MenuItem>
      </Menu>{" "}
      {/* {[1, 2, 3].map((level) => (
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
      ))} */}
    </div>
  );
};

export default LevelSelector;
