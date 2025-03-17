// path: src/components/Simulator/nodes/sps30/index.jsx
import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import SvgComponent from "./svg"; // SVG-Komponente einbinden

const Sps30 = ({ data }) => {
  return (
    <div
      style={{
        minWidth: "150px",
      }}
    >
      <SvgComponent />
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: "1rem",
          background: "lightblue",
          height: "1rem",
          left: "0.5rem",
          top: "50%",
          transform: "translateY(-50%)",
        }}
        id="sensor-input"
      />

      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: "1rem",
          height: "1rem",
          right: "0.5rem",
          top: "50%",
          transform: "translateY(-50%)",
        }}
        id="sensor-output"
      />
    </div>
  );
};

export default memo(Sps30);
