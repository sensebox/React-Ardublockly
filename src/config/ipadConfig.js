// iPad-specific configuration for embedded mode
export const IPAD_CONFIG = {
  ROUTE: '/embedded',
  RENDERER: 'zelos',
  VIEWPORT: {
    content: "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover"
  },
  TOOLBAR: {
    height: '64px',
    padding: '0 16px'
  },
  TOUCH: {
    minHeight: '48px',
    minWidth: '48px'
  }
};

// iPad-specific Blockly configuration
export const IPAD_BLOCKLY_CONFIG = {
  move: {
    scrollbars: true,
    drag: true,
    wheel: true,
  },
  zoom: {
    controls: true,
    wheel: true,
    startScale: 0.9,
    maxScale: 3,
    minScale: 0.3,
    scaleSpeed: 1.1,
    pinch: true, // iPad supports pinch gestures
  },
  grid: {
    spacing: 20,
    length: 1,
    colour: "#4EAF47",
    snap: true,
  },
};

// iPad-specific container styles for embedded mode
export const IPAD_CONTAINER_STYLES = {
  height: "100%",
  width: "100%",
  overflow: "hidden",
  touchAction: "none", // Prevent default touch behaviors
  WebkitTouchCallout: "none", // Disable iOS callout
  WebkitUserSelect: "none", // Disable text selection
  userSelect: "none",
};

// Default Blockly configurations (used when not in embedded mode)
export const DEFAULT_BLOCKLY_CONFIG = {
  zoom: {
    controls: true,
    wheel: false,
    startScale: 1,
    maxScale: 3,
    minScale: 0.3,
    scaleSpeed: 1.2,
  },
  grid: {
    spacing: 20,
    length: 1,
    colour: "#4EAF47", // senseBox-green
    snap: false,
  },
  move: {
    scrollbars: true,
    drag: true,
    wheel: true,
  },
};
