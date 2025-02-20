import React, { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import SensorGraphic from "./lightuv.png";

const LightUv = ({ data }) => {
  const [lux, setLux] = useState(0);
  const [uv, setUv] = useState(0);

  return (
    <div
      style={{
        maxWidth: "250px",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
      }}
    >
      <img
        src={SensorGraphic}
        alt="Sensor Graphic"
        style={{
          width: "100%",
          height: "auto",
          borderRadius: "5px",
        }}
      />
      <div
        style={{
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          padding: "15px",
          borderRadius: "8px",
          marginTop: "10px",
        }}
      >
        {/* Lux-Slider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "15px",
          }}
          className="nodrag"
        >
          <span style={{ fontSize: "1.5rem", marginRight: "8px" }}>🔦</span>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "4px",
                textAlign: "left",
              }}
            >
              Lux
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="range"
                id="lux-slider"
                name="lux"
                min="0"
                max="10000"
                style={{ width: "100%" }}
                value={lux}
                onChange={(e) => setLux(Number(e.target.value))}
              />
              <span
                style={{
                  marginLeft: "8px",
                  minWidth: "40px",
                  textAlign: "right",
                }}
              >
                {lux}
              </span>
            </div>
          </div>
        </div>
        {/* UV-Slider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
          className="nodrag"
        >
          <span style={{ fontSize: "1.5rem", marginRight: "8px" }}>☀️</span>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "4px",
                textAlign: "left",
              }}
            >
              UV
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="range"
                id="uv-slider"
                name="uv"
                min="0"
                max="100"
                style={{ width: "100%" }}
                value={uv}
                onChange={(e) => setUv(Number(e.target.value))}
              />
              <span
                style={{
                  marginLeft: "8px",
                  minWidth: "40px",
                  textAlign: "right",
                }}
              >
                {uv}
              </span>
            </div>
          </div>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: "1rem",
          height: "1rem",
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: "1rem",
          height: "1rem",
        }}
      />
    </div>
  );
};

export default memo(LightUv);
