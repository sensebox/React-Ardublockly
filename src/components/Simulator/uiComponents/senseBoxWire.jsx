import React from "react";
import {
  EdgeLabelRenderer,
  Position,
  getBezierPath,
  useReactFlow,
} from "@xyflow/react";
import * as Blockly from "blockly/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

// The four wires of a senseBox cable, side by side
const WIRES = [
  { color: "red", offset: -4.5 },
  { color: "yellow", offset: -1.5 },
  { color: "green", offset: 1.5 },
  { color: "black", offset: 4.5 },
];

// Labels are drawn in their own layer. The cables lie above the nodes
// (zIndex 1), so the labels must be even higher to be visible and clickable.
const LABEL_Z_INDEX = 1001;

const isHorizontal = (position) =>
  position === Position.Left || position === Position.Right;

// Shift across the cable direction, so the wires run side by side.
function shift(x, y, position, offset) {
  return isHorizontal(position) ? [x, y + offset] : [x + offset, y];
}

// Outward direction of a connector
function outward(position) {
  switch (position) {
    case Position.Left:
      return [-1, 0];
    case Position.Right:
      return [1, 0];
    case Position.Top:
      return [0, -1];
    default:
      return [0, 1];
  }
}

// Plug at the end of the cable
const Plug = ({ x, y, position }) => {
  const [width, height] = isHorizontal(position) ? [8, 16] : [16, 8];
  return (
    <rect
      x={x - width / 2}
      y={y - height / 2}
      width={width}
      height={height}
      rx={2}
      fill="#f2ead8"
      stroke="#444"
      strokeWidth={1.5}
    />
  );
};

/**
 * senseBox cable with four coloured wires. Cables from the board show the
 * name of the connector, e.g. "I2C". A selected I2C cable can be unplugged.
 */
const SenseBoxWireEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  deletable,
  data,
}) => {
  const { deleteElements } = useReactFlow();

  const wires = WIRES.map(({ color, offset }) => {
    const [sx, sy] = shift(sourceX, sourceY, sourcePosition, offset);
    const [tx, ty] = shift(targetX, targetY, targetPosition, offset);
    const [path] = getBezierPath({
      sourceX: sx,
      sourceY: sy,
      targetX: tx,
      targetY: ty,
      sourcePosition,
      targetPosition,
    });
    return { color, path };
  });
  const [centerPath, centerX, centerY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const [dx, dy] = outward(sourcePosition);
  const labelX = sourceX + dx * 30;
  const labelY = sourceY + dy * 18;

  return (
    <>
      {/* Wider invisible path, so the thin cable is easy to click */}
      <path
        d={centerPath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        className="react-flow__edge-interaction"
      />
      {selected && (
        <path
          d={centerPath}
          fill="none"
          stroke="#1976d2"
          strokeOpacity={0.35}
          strokeWidth={18}
        />
      )}
      {/* Dark sheath around the wires */}
      <path
        d={centerPath}
        fill="none"
        stroke="#333"
        strokeOpacity={0.5}
        strokeWidth={14}
      />
      {wires.map(({ color, path }) => (
        <path
          key={color}
          id={`${id}-${color}`}
          d={path}
          stroke={color}
          strokeWidth={2.5}
          fill="none"
        />
      ))}
      <Plug x={sourceX} y={sourceY} position={sourcePosition} />
      <Plug x={targetX} y={targetY} position={targetPosition} />

      {(data?.label || (selected && deletable)) && (
        <EdgeLabelRenderer>
          {data?.label && (
            <div
              className="nodrag nopan simulator-port-label"
              style={{
                position: "absolute",
                transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                zIndex: LABEL_Z_INDEX,
                background: "#333",
                color: "#fff",
                fontSize: 11,
                fontWeight: "bold",
                padding: "1px 6px",
                borderRadius: 4,
                pointerEvents: "none",
                whiteSpace: "nowrap",
              }}
            >
              {data.label}
            </div>
          )}
          {selected && deletable && (
            <button
              type="button"
              className="nodrag nopan simulator-unplug"
              title={Blockly.Msg.simulator_unplug}
              aria-label={Blockly.Msg.simulator_unplug}
              onClick={() => deleteElements({ edges: [{ id }] })}
              style={{
                position: "absolute",
                transform: `translate(-50%, -50%) translate(${centerX}px, ${centerY}px)`,
                zIndex: LABEL_Z_INDEX,
                pointerEvents: "all",
                width: 24,
                height: 24,
                borderRadius: "50%",
                border: "1px solid #999",
                background: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          )}
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default SenseBoxWireEdge;
