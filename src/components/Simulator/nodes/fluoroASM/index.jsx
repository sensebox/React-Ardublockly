// path: src/components/Simulator/nodes/fluoroASM/index.jsx
// Erstellt
import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import SvgComponent from "./svg";

const FluoroASM = ({ id, data }) => {
  console.log("FluoroASM Component:", { id, data });
  return (
    <div
      style={{
        minWidth: "150px",
      }}
    >
      <SvgComponent />
      {/* Input für den Sensor */}
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
        id={`${id}-sensor-input`}
      />

      {/* Output für den Sensor */}
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
        id={`${id}-sensor-output`}
      />
    </div>
  );
};

export default memo(FluoroASM);
