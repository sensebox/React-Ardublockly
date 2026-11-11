import React, { useRef } from "react";
import { Box, Typography } from "@mui/material";
import { clampDistance } from "./model.js";
import sensorImage from "./assets/sensor.svg";
import magnetImage from "./assets/magnet.svg";

const SENSOR_WIDTH = 120,
  MAGNET_WIDTH = 96,
  GAP = 8,
  STEP = 0.05;

// Sensor on the left, magnet draggable along one axis.
// distance: 0 = magnet at the sensor, 1 = magnet far away.
export default function MagnetScene({ distance, onChange, labels }) {
  const scene = useRef(null),
    grab = useRef(null);
  const drag = (event) => {
    if (grab.current == null) return;
    const rect = scene.current.getBoundingClientRect();
    const track = rect.width - SENSOR_WIDTH - GAP - MAGNET_WIDTH;
    if (track <= 0) return;
    onChange(
      clampDistance(
        (event.clientX - grab.current - rect.left - SENSOR_WIDTH - GAP) / track,
      ),
    );
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
    <Box sx={{ mb: 2 }}>
      <Box
        ref={scene}
        id="magnetometer-scene"
        sx={{
          position: "relative",
          height: 120,
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
          sx={{ position: "absolute", left: 0, top: 10, width: SENSOR_WIDTH }}
        />
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
          onPointerDown={(event) => {
            grab.current =
              event.clientX - event.currentTarget.getBoundingClientRect().left;
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
            position: "absolute",
            top: 40,
            left: `calc(${SENSOR_WIDTH + GAP}px + ${distance} * (100% - ${SENSOR_WIDTH + GAP + MAGNET_WIDTH}px))`,
            width: MAGNET_WIDTH,
            height: 40,
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
      <Typography variant="caption" color="text.secondary">
        {labels.hint}
      </Typography>
    </Box>
  );
}
