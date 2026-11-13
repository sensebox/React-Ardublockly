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
 *
 * Lines of any other sketch (e.g. the camera sketch) are ignored.
 */

import {
  CameraOutputGuard,
  parseStrictNumber,
} from "../utils/serialInputGuard";

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
    // Resolvers of pending waitForData() calls.
    this._dataWaiters = [];
    this.cameraGuard = new CameraOutputGuard();
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
   * @param {SerialPort} [explicitPort] - Already permitted port to open
   *   instead of showing the browser's port picker (e.g. after flashing).
   */
  async connect(baudRate = 115200, explicitPort = null) {
    if (this.isConnected) return;

    if (explicitPort) {
      this.port = explicitPort;
    } else if (!this.port) {
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
        const reader = this.reader;
        await reader.cancel();
        // Release the lock here as well, otherwise port.close() fails and
        // the port stays open (e.g. for the flash tool).
        try {
          reader.releaseLock();
        } catch (_) {
          // already released by the read loop
        }
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
    this.cameraGuard.reset();
    this._resolveDataWaiters(false);
  }

  /**
   * Wait until the first valid spell data line arrives.
   * @param {number} timeoutMs
   * @returns {Promise<boolean>} true if data arrived in time
   */
  waitForData(timeoutMs = 4000) {
    return new Promise((resolve) => {
      const waiter = (gotData) => {
        clearTimeout(timer);
        resolve(gotData);
      };
      const timer = setTimeout(() => {
        this._dataWaiters = this._dataWaiters.filter((w) => w !== waiter);
        resolve(false);
      }, timeoutMs);
      this._dataWaiters.push(waiter);
    });
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

  _resolveDataWaiters(gotData) {
    const waiters = this._dataWaiters;
    this._dataWaiters = [];
    for (const waiter of waiters) waiter(gotData);
  }

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

        const text = decoder.decode(value, { stream: true });
        this.cameraGuard.update(text);
        if (this.cameraGuard.isBlocking) {
          // The camera sketch is running – its image bytes are no strokes.
          this.lineBuffer = "";
          continue;
        }
        this.lineBuffer += text;

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
      const tokens = line.split(",");
      // Tolerate a trailing comma.
      if (tokens[tokens.length - 1].trim() === "") tokens.pop();
      if (tokens.length < 4) return;

      // Every value must be a plain number – otherwise the line is not from
      // the spell sketch (other sketches, boot messages, binary data).
      const values = tokens.map(parseStrictNumber);
      if (values.some(isNaN)) return;

      const state = values[0];
      const length = values[1];
      if (!Object.values(StrokeState).includes(state)) return;
      if (
        !Number.isInteger(length) ||
        length < 0 ||
        length > STROKE_POINT_COUNT
      ) {
        return;
      }

      // A valid spell line: the spell sketch is running.
      if (this._dataWaiters.length > 0) this._resolveDataWaiters(true);

      const strokePoints = [];
      for (let i = 2; i + 1 < values.length; i += 2) {
        strokePoints.push({ x: values[i], y: values[i + 1] });
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
