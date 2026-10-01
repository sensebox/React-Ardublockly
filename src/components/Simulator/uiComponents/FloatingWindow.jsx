import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IconButton, Paper, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const MARGIN = 8;

/**
 * Small window above the rest of the page. Can be moved by its title bar and
 * resized at the bottom right corner. The content stays mounted while the
 * window is closed, so e.g. the graph keeps recording.
 */
export default function FloatingWindow({
  id,
  title,
  open,
  onClose,
  children,
  initialPosition = { x: 80, y: 120 },
  width = 460,
  height = 340,
}) {
  const [position, setPosition] = useState(initialPosition);
  const windowRef = useRef(null);
  const drag = useRef(null);

  const handlePointerDown = (event) => {
    if (event.button !== 0 || event.target.closest("button")) {
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      offsetX: event.clientX - position.x,
      offsetY: event.clientY - position.y,
    };
  };

  const handlePointerMove = useCallback((event) => {
    if (!drag.current) {
      return;
    }
    const box = windowRef.current?.getBoundingClientRect();
    const maxX = window.innerWidth - (box?.width ?? 0) - MARGIN;
    const maxY = window.innerHeight - 40;
    setPosition({
      x: Math.max(MARGIN, Math.min(maxX, event.clientX - drag.current.offsetX)),
      y: Math.max(0, Math.min(maxY, event.clientY - drag.current.offsetY)),
    });
  }, []);

  const handlePointerUp = () => {
    drag.current = null;
  };

  return createPortal(
    <Paper
      id={id}
      ref={windowRef}
      elevation={8}
      sx={{
        display: open ? "flex" : "none",
        flexDirection: "column",
        position: "fixed",
        left: position.x,
        top: position.y,
        width,
        height,
        minWidth: 280,
        minHeight: 180,
        maxWidth: "calc(100vw - 16px)",
        maxHeight: "calc(100vh - 16px)",
        resize: "both",
        overflow: "hidden",
        zIndex: (theme) => theme.zIndex.modal - 1,
      }}
    >
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "2px 4px 2px 12px",
          cursor: "move",
          userSelect: "none",
          touchAction: "none",
          background: "#f0f0f0",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Typography variant="subtitle2">{title}</Typography>
        <IconButton size="small" onClick={onClose} aria-label="close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: "auto", padding: 8 }}>
        {children}
      </div>
    </Paper>,
    document.body,
  );
}
