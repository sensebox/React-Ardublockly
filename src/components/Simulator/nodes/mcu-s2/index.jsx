import React, { memo } from "react";
import { Handle, useNodeConnections } from "@xyflow/react";
import SvgBoardComplex from "./svg";
import { BOARD_PORTS, BUS } from "../../ports";

const HIGHLIGHT = "rgb(255, 221, 53)";

/**
 * Connector on the board. Used connectors are framed, so it is clear where
 * the cable goes. Free connectors are dashed: a cable can be plugged in there.
 */
function portStyle(port, used) {
  const style = {
    left: port.x,
    top: port.y,
    right: "auto",
    bottom: "auto",
    width: port.width,
    height: port.height,
    minWidth: 0,
    minHeight: 0,
    transform: "translate(-50%, -50%)",
    borderRadius: 3,
    background: "transparent",
    border: "none",
  };
  if (port.bus === BUS.ONBOARD) {
    return { ...style, opacity: 0 };
  }
  if (used) {
    return {
      ...style,
      border: `3px solid ${HIGHLIGHT}`,
      boxShadow: "0 0 6px rgba(0, 0, 0, 0.6)",
    };
  }
  return { ...style, border: `2px dashed ${HIGHLIGHT}` };
}

const SenseBoxMCUS2 = () => {
  const connections = useNodeConnections({ handleType: "source" });
  const usedPorts = new Set(connections.map((c) => c.sourceHandle));

  return (
    <div style={{ minWidth: "200px" }}>
      <SvgBoardComplex />
      {Object.entries(BOARD_PORTS).map(([id, port]) => (
        <Handle
          key={id}
          id={id}
          type="source"
          position={port.position}
          // Sensors on the board need no cable.
          isConnectable={port.bus !== BUS.ONBOARD}
          title={port.label}
          className={`board-port board-port-${id}`}
          style={portStyle(port, usedPorts.has(id))}
        />
      ))}
    </div>
  );
};

export default memo(SenseBoxMCUS2);
