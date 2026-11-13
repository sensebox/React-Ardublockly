import React, { useRef } from "react";
import { Box, Typography } from "@mui/material";
import { clampDistance } from "./model.js";
import sensorImage from "./assets/sensor.svg";
import magnetImage from "./assets/magnet.svg";

const HEIGHT = 180,
  SENSOR_WIDTH = 120,
  SENSOR_HEIGHT = 100,
  MAGNET_WIDTH = 96,
  MAGNET_HEIGHT = 40,
  GAP = 8,
  STEP = 0.05;

// Schematic only: arches from the north pole (left) to the south pole (right).
const ARCHES = [
  [8, 45, 75],
  [13, 85, 125],
  [18, 135, 190],
];
const FIELD_LINES = [
  `M ${-MAGNET_WIDTH / 2} 0 L -250 0`,
  `M 250 0 L ${MAGNET_WIDTH / 2 + 12} 0`,
  ...[-1, 1].flatMap((side) =>
    ARCHES.map(
      ([start, height, reach]) =>
        `M ${-MAGNET_WIDTH / 2} ${side * start} Q ${-reach} ${side * height} 0 ${side * height} Q ${reach} ${side * height} ${MAGNET_WIDTH / 2} ${side * start}`,
    ),
  ),
];

// Sensor on the left, magnet draggable along one axis.
// distance: 0 = magnet at the sensor, 1 = magnet far away. angle: magnet rotation in degrees.
export default function MagnetScene({
  distance,
  onChange,
  labels,
  angle = 0,
  showFieldLines = false,
}) {
  const scene = useRef(null),
    grab = useRef(null);
  // The magnet's layout box, ignoring its rotation.
  const track = () => {
    const rect = scene.current.getBoundingClientRect();
    return {
      start: rect.left + SENSOR_WIDTH + GAP,
      length: rect.width - SENSOR_WIDTH - GAP - MAGNET_WIDTH,
    };
  };
  const drag = (event) => {
    if (grab.current == null) return;
    const { start, length } = track();
    if (length <= 0) return;
    onChange(clampDistance((event.clientX - grab.current - start) / length));
  };
  const release = () => {
    grab.current = null;
  };
  const keys = {
    ArrowLeft: distance - STEP,
    ArrowDown: distance - STEP,
    ArrowRight: distance + STEP,
    ArrowUp: distance + STEP,
    Home: 0,
    End: 1,
  };
  return (
    <Box sx={{ mb: 1 }}>
      <Box
        ref={scene}
        id="magnetometer-scene"
        sx={{
          position: "relative",
          height: HEIGHT,
          bgcolor: "action.hover",
          borderRadius: 1,
          overflow: "hidden",
          userSelect: "none",
        }}
      >
        <Box
          component="img"
          src={sensorImage}
          alt={labels.sensor}
          draggable={false}
          sx={{
            position: "absolute",
            left: 0,
            top: (HEIGHT - SENSOR_HEIGHT) / 2,
            width: SENSOR_WIDTH,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: (HEIGHT - MAGNET_HEIGHT) / 2,
            left: `calc(${SENSOR_WIDTH + GAP}px + ${distance} * (100% - ${SENSOR_WIDTH + GAP + MAGNET_WIDTH}px))`,
            width: MAGNET_WIDTH,
            height: MAGNET_HEIGHT,
            transform: `rotate(${angle}deg)`,
          }}
        >
          {showFieldLines && (
            <Box
              component="svg"
              id="magnetometer-fieldlines"
              aria-hidden="true"
              sx={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 0,
                height: 0,
                overflow: "visible",
                pointerEvents: "none",
                color: "text.secondary",
                opacity: 0.7,
              }}
            >
              <defs>
                <marker
                  id="magnetometer-fieldlines-arrow"
                  viewBox="0 0 10 10"
                  refX="5"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
                </marker>
              </defs>
              {FIELD_LINES.map((path) => (
                <path
                  key={path}
                  d={path}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  markerMid="url(#magnetometer-fieldlines-arrow)"
                  markerEnd={
                    path.includes("Q")
                      ? undefined
                      : "url(#magnetometer-fieldlines-arrow)"
                  }
                />
              ))}
            </Box>
          )}
          <Box
            id="magnetometer-magnet"
            className="nodrag nopan"
            role="slider"
            tabIndex={0}
            aria-label={labels.magnet}
            aria-orientation="horizontal"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(distance * 100)}
            data-angle={angle}
            onPointerDown={(event) => {
              const { start, length } = track();
              grab.current = event.clientX - (start + distance * length);
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={drag}
            onPointerUp={release}
            onPointerCancel={release}
            onKeyDown={(event) => {
              if (!(event.key in keys)) return;
              event.preventDefault();
              onChange(clampDistance(keys[event.key]));
            }}
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
              cursor: "grab",
              touchAction: "none",
              "&:active": { cursor: "grabbing" },
              "&:focus-visible": {
                outline: "2px solid",
                outlineColor: "primary.main",
                outlineOffset: 2,
              },
            }}
          >
            <Box
              component="img"
              src={magnetImage}
              alt=""
              draggable={false}
              sx={{ display: "block", width: "100%", height: "100%" }}
            />
          </Box>
        </Box>
      </Box>
      <Typography variant="caption" color="text.secondary">
        {labels.hint}
      </Typography>
    </Box>
  );
}
