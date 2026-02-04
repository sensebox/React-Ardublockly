// Embedded mode configuration
export const EMBEDDED_CONFIG = {
  ROUTE: '/embedded',
  VIEWPORT: {
    content: "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover"
  },
};

// Embedded mode Blockly configuration
export const EMBEDDED_BLOCKLY_CONFIG = {
  move: {
    scrollbars: true,
    drag: true,
    wheel: false,  // Disable wheel for touch devices
  },
  zoom: {
    controls: true,
    wheel: false,  // Disable wheel zoom for touch devices
    startScale: 0.6,
    maxScale: 3,
    minScale: 0.3,
    scaleSpeed: 1.1,
    pinch: true, // Embedded mode supports pinch gestures
  },
  grid: {
    spacing: 20,
    length: 1,
    colour: "#4EAF47",
    snap: true,
  },
  // Performance optimizations for WebView
  renderer: 'zelos',  // Zelos is more performant than Geras
  oneBasedIndex: false,
  comments: false,  // Disable comments for better performance
  collapse: false,  // Disable collapse/expand animations
  sounds: false,  // Disable sounds in WebView
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
