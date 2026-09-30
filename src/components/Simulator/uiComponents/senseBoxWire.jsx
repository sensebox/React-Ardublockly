import React from "react";
import { getBezierPath } from "@xyflow/react";

const SenseBoxWireEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
}) => {
  // Berechnet den Bezier-Pfad zwischen Source und Target
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  // Wir verschieben die Linien leicht vertikal, damit sie nicht exakt übereinander liegen
  return (
    <>
      <path
        id={`${id}-red`}
        d={edgePath}
        stroke="red"
        strokeWidth={2}
        fill="none"
        transform="translate(0, -4)"
        markerEnd={markerEnd}
      />
      <path
        id={`${id}-yellow`}
        d={edgePath}
        stroke="yellow"
        strokeWidth={2}
        fill="none"
        transform="translate(0, -2)"
        markerEnd={markerEnd}
      />
      <path
        id={`${id}-green`}
        d={edgePath}
        stroke="green"
        strokeWidth={2}
        fill="none"
        transform="translate(0, 2)"
        markerEnd={markerEnd}
      />
      <path
        id={`${id}-black`}
        d={edgePath}
        stroke="black"
        strokeWidth={2}
        fill="none"
        transform="translate(0, 4)"
        markerEnd={markerEnd}
      />
    </>
  );
};

export default SenseBoxWireEdge;
