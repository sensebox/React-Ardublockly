
import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";

const Display = ({ data }) => {
  return (
    <div
      style={{
        maxWidth: "350px",
        zIndex:100
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#4eaf47",
          borderRadius: "1rem",
          padding: "0.5rem 1.5rem",
        }}
      >
        <canvas
          id="oled-display"
          width="256"
          height="128"
          style={{
            border: "1px solid black",
            imageRendering: "pixelated",
            height: "64px",
            width: "128px",
            backgroundColor: "black",
          }}
        ></canvas>
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

export default memo(Display);