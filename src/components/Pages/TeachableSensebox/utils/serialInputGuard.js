// Helpers that keep the text-based serial sources (spell, orientation) from
// accepting output of a different sketch – especially the camera sketch,
// whose raw image bytes can decode to lines like "0,0,0,0".

// Every frame of the camera capture sketch starts with this ASCII header
// (see SerialCameraService).
const CAMERA_FRAME_MARKER = "FRAM";
// The camera sketch sends frames well within 3 s (SerialCameraService's frame
// timeout), so input is ignored for that long after the last frame header.
const CAMERA_HOLD_MS = 3000;

// A plain decimal number, e.g. "-4.27", "0", "12." or ".5" – nothing else.
const NUMBER_PATTERN = /^[-+]?(?:\d+\.?\d*|\.\d+)$/;

/**
 * Strictly parses a decimal number. Unlike parseFloat it rejects trailing
 * garbage ("12abc") and empty strings.
 * @param {string} text
 * @returns {number} the number, or NaN if `text` is not a plain number
 */
export function parseStrictNumber(text) {
  const trimmed = text.trim();
  return NUMBER_PATTERN.test(trimmed) ? Number(trimmed) : NaN;
}

/**
 * Detects output of the camera capture sketch in a serial text stream.
 */
export class CameraOutputGuard {
  constructor() {
    this.reset();
  }

  reset() {
    this.tail = "";
    this.blockedUntil = 0;
  }

  /**
   * Feed the next decoded chunk of serial text.
   * @param {string} text
   */
  update(text) {
    const window = this.tail + text;
    if (window.includes(CAMERA_FRAME_MARKER)) {
      this.blockedUntil = Date.now() + CAMERA_HOLD_MS;
    }
    // Keep enough characters to find a marker split across two chunks.
    this.tail = window.slice(-(CAMERA_FRAME_MARKER.length - 1));
  }

  /** True while camera frames were seen recently – ignore all input then. */
  get isBlocking() {
    return Date.now() < this.blockedUntil;
  }
}
