import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addLog } from "@/actions/logReducer";
import {
  setFilterEnabled,
  setDiamondEnabled,
  setFilterOffset,
  setFilterColour,
  setLedColor,
} from "@/actions/fluoroActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import SvgFluoroBee from "./svg";

const offsets = {
  Led1: 0,
  Led2: -13,
  Led3: -26,
  Led4: -39,
};

const FluoroASM = () => {
  const dispatch = useDispatch();
  const {
    filterEnabled,
    diamondEnabled,
    filterOffset,
    filterColour,
    ledColor,
  } = useSelector((state) => state.fluoroASM);

  const ledSelected = Object.values(offsets).indexOf(filterOffset) + 1 || 0;

  const handleFilterChange = (e) => {
    dispatch(setFilterEnabled(e.target.checked));
    dispatch(
      addLog({
        type: "simulator",
        description: `Fluoro ${e.target.checked ? "aktiviert" : "deaktiviert"}`,
        title: "FluoroASM",
      }),
    );
  };

  const handleDiamondChange = (e) => {
    dispatch(setDiamondEnabled(e.target.checked));
  };

  const handleFilterColourChange = (e) => {
    dispatch(setFilterColour(e.target.value));
    dispatch(
      addLog({
        type: "simulator",
        description: `Filterfarbe geändert zu ${e.target.value}`,
        title: "FluoroASM",
      }),
    );
  };

  const handleFilterOffsetChange = (e) => {
    dispatch(setFilterOffset(parseInt(e.target.value)));
  };

  const handleLedColorChange = (e) => {
    dispatch(setLedColor(e.target.value));
  };

  const moveFilterUp = (e) => {
    e.stopPropagation();
    dispatch(setFilterOffset(filterOffset - 13));
    dispatch(
      addLog({
        type: "simulator",
        description: "Filter nach oben verschoben",
        title: "FluoroASM",
      }),
    );
  };

  const moveFilterDown = (e) => {
    e.stopPropagation();
    dispatch(setFilterOffset(filterOffset + 13));
    dispatch(
      addLog({
        type: "simulator",
        description: "Filter nach unten verschoben",
        title: "FluoroASM",
      }),
    );
  };

  const [menuOpen, setMenuOpen] = React.useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
  };

  return (
    <div
      style={{ minWidth: "150px", position: "relative", cursor: "pointer" }}
      onClick={toggleMenu}
    >
      <SvgFluoroBee
        ledSelected={ledSelected}
        filterEnabled={filterEnabled}
        filterOffset={filterOffset}
        diamondEnabled={diamondEnabled}
        filterColour={filterColour}
      />

      {filterEnabled && (
        <div
          style={{
            position: "absolute",
            top: "50px",
            left: "95px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <button
            disabled={filterOffset === offsets.Led4}
            onClick={moveFilterUp}
          >
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
          <button
            disabled={filterOffset === offsets.Led1}
            onClick={moveFilterDown}
          >
            <FontAwesomeIcon icon={faArrowDown} />
          </button>
        </div>
      )}

      {menuOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
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
          <span style={{ color: "white", fontSize: "0.9rem" }}>
            Filter aktiv
          </span>
          <input
            type="checkbox"
            checked={filterEnabled}
            onChange={handleFilterChange}
          />
          <br />

          {filterEnabled && (
            <>
              <span style={{ color: "white", fontSize: "0.9rem" }}>
                Filter an:
              </span>
              <select value={filterOffset} onChange={handleFilterOffsetChange}>
                {Object.entries(offsets).map(([label, value]) => (
                  <option key={label} value={value}>
                    {label}
                  </option>
                ))}
              </select>

              <br />
              <span style={{ color: "white", fontSize: "0.9rem" }}>
                Diamant aktiv
              </span>
              <input
                type="checkbox"
                checked={diamondEnabled}
                onChange={handleDiamondChange}
              />

              <br />
              <span style={{ color: "white", fontSize: "0.9rem" }}>
                Filter Farbe:
              </span>
              <select value={filterColour} onChange={handleFilterColourChange}>
                <option value="#f90c0c">Rot</option>
                <option value="#280cf9">Blau</option>
              </select>

              <br />
              <span style={{ color: "white", fontSize: "0.9rem" }}>
                LED Farbe:
              </span>
              <select value={ledColor} onChange={handleLedColorChange}>
                <option value="#FFFF66">Gelb</option>
                <option value="#3399FF">Blau</option>
                <option value="#33FF33">Grün</option>
                <option value="#FF3333">Rot</option>
              </select>
            </>
          )}

          <div
            style={{
              position: "absolute",
              top: "4px",
              right: "10px",
              cursor: "pointer",
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "white",
            }}
            onClick={closeMenu}
          >
            ×
          </div>
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
