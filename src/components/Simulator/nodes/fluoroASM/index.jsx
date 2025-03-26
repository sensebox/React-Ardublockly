import React, { useState, memo } from "react";
import { Handle, Position } from "@xyflow/react";
import FluoroBee from "./fluoroBee"; // SVG-Komponente einbinden
import { Checkbox, InputLabel, MenuItem, Select } from "@mui/material";
import { Input } from "blockly/core";

const FluoroASM = ({ data }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterEnabled, setFilterEnabled] = useState(false);
  const [withDiamond, setWithDiamond] = useState(true);
  const [ledColor, setLedColor] = useState("yellow");

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = (e) => {
    e.stopPropagation(); // verhindert, dass der Klick den Node erneut toggled
    setMenuOpen(false);
  };

  const handleFilterChange = (e) => {
    setFilterEnabled(e.target.checked);
  };

  const handleDiamondChange = (e) => {
    console.log(e.target.value);
  };

  const handleLedColorChange = (e) => {

    setLedColor(e.target.value);
  };

  return (
    <div
      style={{
        minWidth: "150px",
        position: "relative",
        cursor: "pointer",
      }}
      onClick={toggleMenu}
    >
      <FluoroBee filterEnabled={filterEnabled} color={ledColor} />
      {menuOpen && (
        <div
          onClick={(e) => e.stopPropagation()} // Klicks innerhalb des Menüs lösen nicht das Toggle aus
          style={{
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 10,
            width: "200px",
            backgroundColor: "#5ba55b",

          }}
        >
          {/* Close-Button */}
          <div
            style={{
              position: "absolute",
              top: "4px",
              right: "10px",
              cursor: "pointer",
              fontSize: "1.5rem",
              fontWeight: "bold",
              color:"white"
            }}
            onClick={closeMenu}
          >
            ×
          </div>

          <div >
            {/* Checkbox für Filter an/aus */}
            <span style={{color:'white', fontSize: "0.9rem" }}>Filter aktiv </span>

            <input type="checkbox" checked={filterEnabled} onChange={handleFilterChange} />


            {/* Radiobuttons für Filter-Typ */}
            <div>
            <span style={{ fontSize: "0.9rem" ,color:'white'}}>Filter typ: </span>

            <select value={ledColor} onChange={handleLedColorChange}>
            <option value="with">mit Diamant</option>
            <option value="without">ohne Diamant</option>
            </select>
            </div>

            {/* Dropdown für LED-Farbe */}
            <div>
              <span style={{ color:'white', fontSize: "0.9rem" }}>LED Farbe: </span>
              <select value={ledColor} onChange={handleLedColorChange}>
                <option value="#FFFF66">Gelb</option>
                <option value="#3399FF">Blau</option>
                <option value="#33FF33">Grün</option>
                <option value="#FF3333">Rot</option>
              </select>
            </div>
          </div>

          {/* Tooltip-Pfeil */}
          <div
            style={{
              position: "absolute",
              bottom: "-8px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "0",
              height: "0",
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: "8px solid #5ba55b",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default memo(FluoroASM);
