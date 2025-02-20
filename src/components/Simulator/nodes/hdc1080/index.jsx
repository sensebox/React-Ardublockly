import React, { memo, useEffect, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import SensorGraphic from "./hdc1080.png";

const HDC1080 = ({ data }) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Check if required simulator features are available
      if (
        !document.getElementById("temperature-slider") ||
        !document.getElementById("humidity-slider")
      ) {
        setError("Simulator initializing...");
      }
    } catch (err) {
      setError("Simulator initializing...");
    }
  }, []);

  return (
    <div
      style={{
        maxWidth: "200px",
      }}
    >
      <img
        src={SensorGraphic}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
      <div
        style={{
          backgroundColor: "white",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "10px",
          }}
          className="nodrag"
        >
          <label htmlFor="temperature-slider">🌡️</label>
          <input
            type="range"
            id="temperature-slider"
            name="temperature"
            min="-40"
            max="50"
            style={{ width: "80%" }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "10px",
          }}
          className="nodrag"
        >
          <label htmlFor="humidity-slider">☁️</label>
          <input
            type="range"
            id="humidity-slider"
            name="humidity"
            min="0"
            max="100"
            style={{ width: "80%" }}
          />
        </div>
        {error && (
          <div
            style={{
              color: "#666",
              fontSize: "0.8rem",
              textAlign: "center",
              padding: "5px",
              backgroundColor: "#f5f5f5",
              borderRadius: "3px",
              marginTop: "5px",
            }}
          >
            {error}
          </div>
        )}
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

export default memo(HDC1080);