import React from "react";
import { getBezierPath } from "@xyflow/react";

/**
 * Dashed line from a sensor on the board (light sensor, IMU) to its panel.
 * It is no cable: these sensors need no wiring.
 */
const OnboardEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}) => {
  const [path] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });
  return (
    <path
      d={path}
      fill="none"
      stroke="rgb(255, 221, 53)"
      strokeWidth={2.5}
      strokeDasharray="6 5"
    />
  );
};

export default OnboardEdge;
