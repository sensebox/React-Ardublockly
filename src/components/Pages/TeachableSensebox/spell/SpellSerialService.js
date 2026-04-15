/**
 * SpellSerialService
 *
 * Manages serial communication with senseBox for magic wand spell data
 * using the Web Serial API. Reads stroke point data streamed from the
 * device firmware.
 *
 * Expected firmware output format (text-based, line-by-line):
 *   "<x1>,<y1>,<x2>,<y2>,..."
 *
 * Where:
 *   x,y: normalized coordinates as floats (-1.0 to 1.0)
 *
 * Each line represents one complete stroke.
 */

// Stroke states
export const StrokeState = {
  WAITING: 0,
  DRAWING: 1,
  DONE: 2,
};

const STROKE_POINT_COUNT = 160;

class SpellSerialService {
  constructor() {
    this.port = null;
    this.reader = null;
    this.isConnected = false;
    this.readLoopActive = false;
    this.strokeCallbacks = [];
    this.errorCallbacks = [];
    this.lineBuffer = "";
    this._previousStrokeState = StrokeState.WAITING;
  }

  /**
   * Check if Web Serial API is supported in the current browser
   * @returns {boolean}
   */
  static isSupported() {
    return "serial" in navigator;
  }

  /**
   * Request serial port access from the user
   * @returns {Promise<SerialPort|null>}
   */
  async requestPort() {
    if (!SpellSerialService.isSupported()) {
      const error = new Error(
        "Web Serial API is not supported in this browser",
      );
      error.type = "UNSUPPORTED_BROWSER";
      throw error;
    }

    try {
      const port = await navigator.serial.requestPort();
      return port;
    } catch (error) {
      if (error.name === "NotFoundError") {
        return null;
      }
      if (error.name === "SecurityError" || error.name === "NotAllowedError") {
        const permissionError = new Error("Serial port access was denied");
        permissionError.type = "PERMISSION_DENIED";
        permissionError.originalError = error;
        throw permissionError;
      }
      throw error;
    }
  }

  /**
   * Connect to the serial port and start reading spell data
   * @param {number} baudRate - default 115200
   */
  async connect(baudRate = 115200) {
    if (this.isConnected) return;

    if (!this.port) {
      this.port = await this.requestPort();
      if (!this.port) return; // User cancelled
    }

    try {
      if (!this.port.readable) {
        await this.port.open({ baudRate });
      }

      this.isConnected = true;
      this.readLoopActive = true;
      this._startReadLoop();
    } catch (error) {
      this.isConnected = false;
      const connError = new Error(`Failed to open port: ${error.message}`);
      connError.type = "CONNECTION_FAILED";
      throw connError;
    }
  }

  /**
   * Disconnect from the serial port
   */
  async disconnect() {
    this.readLoopActive = false;
    this.isConnected = false;

    try {
      if (this.reader) {
        await this.reader.cancel();
        this.reader = null;
      }
      if (this.port && this.port.readable) {
        await this.port.close();
      }
    } catch (error) {
      // Ignore close errors — port may already be closed
    }

    this.port = null;
    this.lineBuffer = "";
    this._previousStrokeState = StrokeState.WAITING;
  }

  /**
   * Register a callback for incoming stroke data
   * @param {Function} callback - called with { state, length, strokePoints, timestamp, isCompleted } on each stroke
   * @returns {Function} unsubscribe function
   */
  onStroke(callback) {
    this.strokeCallbacks.push(callback);
    return () => {
      this.strokeCallbacks = this.strokeCallbacks.filter(
        (cb) => cb !== callback,
      );
    };
  }

  /**
   * Register a callback for errors
   * @param {Function} callback - called with error object
   * @returns {Function} unsubscribe function
   */
  onError(callback) {
    this.errorCallbacks.push(callback);
    return () => {
      this.errorCallbacks = this.errorCallbacks.filter((cb) => cb !== callback);
    };
  }

  // ─── Private ──────────────────────────────────────────────────────────────

  _emitStroke(strokeData) {
    for (const cb of this.strokeCallbacks) {
      try {
        cb(strokeData);
      } catch (e) {
        console.error("SpellSerialService stroke callback error:", e);
      }
    }
  }

  _emitError(error) {
    for (const cb of this.errorCallbacks) {
      try {
        cb(error);
      } catch (e) {
        console.error("SpellSerialService error callback error:", e);
      }
    }
  }

  async _startReadLoop() {
    const decoder = new TextDecoder();

    try {
      this.reader = this.port.readable.getReader();

      while (this.readLoopActive) {
        const { value, done } = await this.reader.read();
        if (done) break;

        this.lineBuffer += decoder.decode(value, { stream: true });

        // Process complete lines
        const lines = this.lineBuffer.split("\n");
        this.lineBuffer = lines.pop(); // Keep incomplete last line

        for (const line of lines) {
          this._parseLine(line.trim());
        }
      }
    } catch (error) {
      if (this.readLoopActive) {
        // Unexpected error while still supposed to be reading
        const err = new Error(`Read error: ${error.message}`);
        err.type = "COMMUNICATION_ERROR";
        this._emitError(err);
      }
    } finally {
      if (this.reader) {
        try {
          this.reader.releaseLock();
        } catch (_) {
          // ignore
        }
        this.reader = null;
      }
    }
  }

  _parseLine(line) {
    if (!line) return;

    // Expected format: "<state>,<length>,<x1>,<y1>,<x2>,<y2>,..."
    // state: 0=waiting, 1=drawing, 2=done
    // length: number of stroke points that follow
    // x,y: normalized coordinates as floats (-1.0 to 1.0)

    try {
      const values = line.split(",").map((s) => parseFloat(s.trim()));
      if (values.length < 4) return;

      const state = values[0];
      const length = values[1];

      if (isNaN(state) || isNaN(length)) return;

      const strokePoints = [];
      for (let i = 2; i + 1 < values.length; i += 2) {
        if (!isNaN(values[i]) && !isNaN(values[i + 1])) {
          strokePoints.push({ x: values[i], y: values[i + 1] });
        }
      }

      if (strokePoints.length === 0) return;

      const isCompleted =
        state === StrokeState.DONE &&
        this._previousStrokeState !== StrokeState.DONE;

      const strokeData = {
        state,
        length: strokePoints.length,
        strokePoints,
        timestamp: Date.now(),
        isCompleted,
      };

      this._previousStrokeState = state;
      this._emitStroke(strokeData);
    } catch (e) {
      // Ignore parse errors for malformed lines
      console.warn("Failed to parse spell line:", line, e);
    }
  }
}

export default SpellSerialService;
