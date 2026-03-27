import React, { useRef, useEffect, useState } from "react";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import {
  Speed as SpeedIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";

const GRAPH_WIDTH = 240;
const GRAPH_HEIGHT = 160;
const HISTORY_LEN = 100; // number of samples shown at once
const AXIS_COLORS = {
  x: "#e53935",
  y: "#43a047",
  z: "#1e88e5",
};

/**
 * FloatingAccelerometerGraph
 *
 * A draggable, collapsible floating panel that draws a live scrolling
 * line graph of X / Y / Z accelerometer values on a canvas element.
 * Positioned and behaves identically to FloatingCameraPreview.
 */
const FloatingAccelerometerGraph = ({
  latestSample,
  isCollapsed,
  onToggleCollapse,
  predictions = [],
  trainedModel = null,
}) => {
  const [position, setPosition] = useState({ x: null, y: null });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Rolling history buffer — stored in a ref to avoid re-renders
  const historyRef = useRef([]);

  // Initialize position to bottom-right on first render
  useEffect(() => {
    if (position.x === null && position.y === null && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        x: window.innerWidth - rect.width - 16,
        y: window.innerHeight - rect.height - 80,
      });
    }
  }, [position.x, position.y]);

  // Append new sample to rolling history
  useEffect(() => {
    if (!latestSample) return;
    historyRef.current.push(latestSample);
    if (historyRef.current.length > HISTORY_LEN) {
      historyRef.current.shift();
    }
  }, [latestSample]);

  // Draw the graph on every new sample
  useEffect(() => {
    if (isCollapsed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const history = historyRef.current;

    const W = canvas.width;
    const H = canvas.height;

    // Background
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, W, H);

    // Horizontal zero-line
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, H / 2);
    ctx.lineTo(W, H / 2);
    ctx.stroke();

    if (history.length < 2) return;

    // Determine value range across all axes for auto-scaling
    let minVal = Infinity;
    let maxVal = -Infinity;
    for (const s of history) {
      minVal = Math.min(minVal, s.x, s.y, s.z);
      maxVal = Math.max(maxVal, s.x, s.y, s.z);
    }
    const range = maxVal - minVal || 1;
    const pad = range * 0.1;
    const lo = minVal - pad;
    const hi = maxVal + pad;

    const toY = (v) => H - ((v - lo) / (hi - lo)) * H;

    // Draw each axis
    for (const axis of ["x", "y", "z"]) {
      ctx.strokeStyle = AXIS_COLORS[axis];
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      history.forEach((s, i) => {
        const px = (i / (HISTORY_LEN - 1)) * W;
        const py = toY(s[axis]);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
    }

    // Axis legend — top-left corner
    let legendY = 14;
    for (const axis of ["x", "y", "z"]) {
      const latest = history[history.length - 1];
      ctx.fillStyle = AXIS_COLORS[axis];
      ctx.font = "bold 10px monospace";
      ctx.fillText(
        `${axis.toUpperCase()} ${latest[axis].toFixed(2)}`,
        6,
        legendY,
      );
      legendY += 14;
    }
  }, [latestSample, isCollapsed]);

  // ─── Drag handling ────────────────────────────────────────────────────────

  const handleDragStart = (e) => {
    if (e.target.closest(".collapse-button")) {
      return;
    }
    setIsDragging(true);
    const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDragOffset({ x: clientX - rect.left, y: clientY - rect.top });
    }
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      let newX = clientX - dragOffset.x;
      let newY = clientY - dragOffset.y;
      newX = Math.max(0, Math.min(newX, window.innerWidth - rect.width));
      newY = Math.max(0, Math.min(newY, window.innerHeight - rect.height));
      setPosition({ x: newX, y: newY });
    }
  };

  const handleDragEnd = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchmove", handleDragMove, { passive: false });
      window.addEventListener("touchend", handleDragEnd);
      return () => {
        window.removeEventListener("mousemove", handleDragMove);
        window.removeEventListener("mouseup", handleDragEnd);
        window.removeEventListener("touchmove", handleDragMove);
        window.removeEventListener("touchend", handleDragEnd);
      };
    }
  }, [isDragging, dragOffset]);

  // ─── Render ───────────────────────────────────────────────────────────────

  const hasPredictions = trainedModel && predictions.length > 0;

  return (
    <Paper
      ref={containerRef}
      elevation={8}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      sx={{
        position: "fixed",
        left: position.x !== null ? `${position.x}px` : "auto",
        top: position.y !== null ? `${position.y}px` : "auto",
        bottom: position.y === null ? 80 : "auto",
        right: position.x === null ? 16 : "auto",
        zIndex: 1300,
        transition: isDragging
          ? "none"
          : "width 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none",
        ...(isCollapsed
          ? {
              width: 56,
              height: 56,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }
          : {
              width: GRAPH_WIDTH + 8,
              borderRadius: 2,
            }),
      }}
    >
      {/* Collapsed bubble */}
      {isCollapsed && (
        <IconButton
          className="collapse-button"
          onClick={onToggleCollapse}
          color="primary"
          sx={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 2,
          }}
        >
          <SpeedIcon />
        </IconButton>
      )}

      {/* Expanded panel */}
      {!isCollapsed && (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {/* Title bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 1,
              py: 0.5,
              bgcolor: "grey.900",
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "grey.300", userSelect: "none" }}
            >
              Accelerometer
            </Typography>
            <IconButton
              className="collapse-button"
              size="small"
              onClick={onToggleCollapse}
              sx={{ color: "grey.400", p: 0.5 }}
            >
              <ExpandMoreIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Canvas graph */}
          <Box sx={{ bgcolor: "#111", lineHeight: 0 }}>
            <canvas
              ref={canvasRef}
              width={GRAPH_WIDTH}
              height={GRAPH_HEIGHT}
              style={{
                display: "block",
                width: GRAPH_WIDTH,
                height: GRAPH_HEIGHT,
              }}
            />
          </Box>

          {/* Live predictions below graph */}
          {hasPredictions && (
            <Box
              sx={{ p: 1, bgcolor: "background.paper", minWidth: GRAPH_WIDTH }}
            >
              {predictions.slice(0, 3).map((pred) => (
                <Box
                  key={pred.className}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mb: 0.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{ width: 72, flexShrink: 0 }}
                  >
                    {pred.className}
                  </Typography>
                  <Box
                    sx={{
                      flex: 1,
                      height: 8,
                      bgcolor: "grey.200",
                      borderRadius: 0.5,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: `${(pred.probability * 100).toFixed(0)}%`,
                        height: "100%",
                        bgcolor: "primary.main",
                        borderRadius: 0.5,
                        transition: "width 0.3s ease",
                      }}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{ width: 30, textAlign: "right" }}
                  >
                    {(pred.probability * 100).toFixed(0)}%
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default FloatingAccelerometerGraph;
