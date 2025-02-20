import React, { memo, useEffect, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import SensorGraphic from "./lightuv.png";

const lightUv = ({ data }) => {
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
          <label htmlFor="lux-slider">🌡️</label>
          <input
            type="range"
            id="lux-slider"
            name="lux"
            min="0"
            max="10000"
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
          <label htmlFor="uv-slider">☁️</label>
          <input
            type="range"
            id="uv-slider"
            name="uv"
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

export default memo(lightUv);