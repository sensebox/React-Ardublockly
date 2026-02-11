import React, { useState, useRef, useEffect } from "react";
import { Box, IconButton, Paper } from "@mui/material";
import {
  Videocam as VideocamIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Cameraswitch as CameraswitchIcon,
} from "@mui/icons-material";

/**
 * FloatingCameraPreview - A draggable, collapsible floating camera preview for mobile devices
 *
 * Shows camera preview in a fixed position overlay that can be minimized to save space
 */
const FloatingCameraPreview = ({
  previewContainerRef,
  isCollapsed,
  onToggleCollapse,
  videoLoading,
  onSwitchCamera,
}) => {
  const [position, setPosition] = useState({ x: null, y: null });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Initialize position on first render (bottom-right)
  useEffect(() => {
    if (position.x === null && position.y === null && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        x: window.innerWidth - rect.width - 16,
        y: window.innerHeight - rect.height - 80,
      });
    }
  }, [position.x, position.y]);

  const handleDragStart = (e) => {
    // Prevent drag on buttons
    if (
      e.target.closest(".collapse-button") ||
      e.target.closest(".switch-camera-button")
    ) {
      return;
    }

    setIsDragging(true);

    const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDragOffset({
        x: clientX - rect.left,
        y: clientY - rect.top,
      });
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

      // Keep within viewport bounds
      const maxX = window.innerWidth - rect.width;
      const maxY = window.innerHeight - rect.height;
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));

      setPosition({ x: newX, y: newY });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

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
        touchAction: "none", // Prevent scrolling when dragging
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
              width: 200,
              height: 200,
              borderRadius: 2,
            }),
      }}
    >
      {/* Collapsed state - show camera icon */}
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
          <VideocamIcon />
        </IconButton>
      )}

      {/* Expanded state - show camera preview (always mounted, hidden when collapsed) */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: isCollapsed ? "none" : "block",
        }}
      >
        {/* Preview container - always mounted to keep video element attached */}
        <Box
          ref={previewContainerRef}
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            "& video, & img, & canvas": {
              width: "100%",
              height: "100%",
              objectFit: "cover",
              imageRendering: "pixelated",
            },
          }}
        >
          {videoLoading && (
            <Box
              sx={{
                color: "white",
                textAlign: "center",
                fontSize: "0.75rem",
                padding: 1,
              }}
            >
              Loading...
            </Box>
          )}
        </Box>

        {/* Collapse button overlay */}
        <IconButton
          className="collapse-button"
          onClick={onToggleCollapse}
          size="small"
          sx={{
            position: "absolute",
            top: 4,
            right: 4,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            },
            width: 28,
            height: 28,
          }}
        >
          <ExpandMoreIcon sx={{ fontSize: 20 }} />
        </IconButton>

        {/* Switch camera button - only shown when onSwitchCamera is provided (webcam mode) */}
        {onSwitchCamera && (
          <IconButton
            className="switch-camera-button"
            onClick={onSwitchCamera}
            size="small"
            sx={{
              position: "absolute",
              top: 4,
              left: 4,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
              },
              width: 28,
              height: 28,
            }}
          >
            <CameraswitchIcon sx={{ fontSize: 20 }} />
          </IconButton>
        )}
      </Box>
    </Paper>
  );
};

export default FloatingCameraPreview;
