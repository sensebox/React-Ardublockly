import React, { useState, memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Checkbox, InputLabel, MenuItem, Select } from "@mui/material";
import { Input } from "blockly/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import SvgFluoroBee from "./svg";

const FluoroASM = ({ data }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterEnabled, setFilterEnabled] = useState(false);
  const [diamondEnabled, setDiamondEnabled] = useState(false);
  const [ledColor, setLedColor] = useState("yellow");
  const [filterOffset, setFilterOffset] = React.useState(0);


  const offsets = {
    Led4: -39,
    Led3: -26,
    Led2: -13,
    Led1: 0,
  };




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
    setDiamondEnabled(e.target.checked);
  };

  const handleLedColorChange = (e) => {

    setLedColor(e.target.value);
  };

      // State für den vertikalen Offset des Filters

  const moveFilterUp = (e) => {
    // stop menu from toggling
    e.stopPropagation();

    setFilterOffset((prev) => prev - 13);
    console.log(filterOffset);

  };

  const moveFilterDown = (e) => {
    // stop menu from toggling
    e.stopPropagation();
    setFilterOffset((prev) => prev + 13);
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
        <SvgFluoroBee filterEnabled={filterEnabled} filterOffset={filterOffset} diamondEnabled={diamondEnabled}   />
      {filterEnabled && (
              <div style={{ position:"absolute", top:"50px", left:"95px", display: "flex", flexDirection: "column" }}>
              <button disabled={filterOffset === offsets.Led4} onClick={moveFilterUp} style={{ marginBottom: "5px" }}><FontAwesomeIcon icon={faArrowUp}/> </button>
              <button disabled={filterOffset === offsets.Led1} onClick={moveFilterDown}><FontAwesomeIcon icon={faArrowDown} /> </button>
            </div>
            )}

      {menuOpen && (
        <div
          onClick={(e) => e.stopPropagation()} // 
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
          <span style={{color:'white', fontSize: "0.9rem" }}>Filter aktiv </span>
          <input type="checkbox" checked={filterEnabled} onChange={handleFilterChange} />
          <br />
          {filterEnabled && (
            <div>
            <span style={{color:'white', fontSize: "0.9rem" }}>Filter an: </span>
            <select value={filterOffset} onChange={(e) => setFilterOffset(parseInt(e.target.value))}>
              {Object.keys(offsets).map((key) => (
                <option key={key} value={offsets[key]}>
                  {key}
                </option>
              ))}
            </select>
            <span style={{color:'white', fontSize: "0.9rem" }}>Diamant aktiv </span>
          <input type="checkbox" checked={diamondEnabled} onChange={handleDiamondChange} />

            </div>
            
            )}
          
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

/** 
<div >


<div>
<span style={{ fontSize: "0.9rem" ,color:'white'}}>Filter typ: </span>

<select value={ledColor} onChange={handleLedColorChange}>
<option value="with">mit Diamant</option>
<option value="without">ohne Diamant</option>
</select>
</div>

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
*/