import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import SvgBoardComplex from "./svg";

const SenseBoxMCUS2 = ({ data }) => {
  return (
    <div
      style={{
        minWidth: "200px",
      }}
    >
      <SvgBoardComplex />
      <Handle
        type="source"
        position={Position.Left}
        style={{
          width: "1rem",
          height: "1rem",
          left: "1.5rem",
          top: "1.6rem",
        }}
        id="i2c-left"
      />
      {/* <Handle
        type="source"
        position={Position.Right}
        style={{
          width: "1rem",
          height: "1rem",
        }}
      /> */}
    </div>
  );
};

export default memo(SenseBoxMCUS2);