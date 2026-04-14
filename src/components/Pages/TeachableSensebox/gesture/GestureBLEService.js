/**
 * GestureBLEService
 *
 * Manages Bluetooth Low Energy communication with senseBox for
 * magic wand gesture data using the Web Bluetooth API.
 * Receives stroke point data via BLE polling (read) since the
 * stroke data exceeds the 20-byte BLE notification limit.
 *
 * Expected data format (binary):
 *   Int32: state (0=waiting, 1=drawing, 2=done)
 *   Int32: length (number of valid stroke points)
 *   160 x {Int8 x, Int8 y}: stroke points normalized to -128..127
 */

const BLE_SERVICE_UUID = "4798e0f2-0000-4d68-af64-8a8f5258404e";
const BLE_STROKE_UUID = "4798e0f2-300a-4d68-af64-8a8f5258404e";
const STROKE_POINT_COUNT = 160;
const POLL_INTERVAL_MS = 200;

// Stroke states
export const StrokeState = {
  WAITING: 0,
  DRAWING: 1,
  DONE: 2,
};

class GestureBLEService {
  constructor() {
    this.device = null;
    this.server = null;
    this.characteristic = null;
    this.isConnected = false;
    this.strokeCallbacks = [];
    this.errorCallbacks = [];
    this.pollingInterval = null;
    this._boundOnDisconnected = this._onDisconnected.bind(this);
    this._previousStrokeState = StrokeState.WAITING;
  }

  /**
   * Check if Web Bluetooth API is supported in the current browser
   * @returns {boolean}
   */
  static isSupported() {
    return typeof navigator !== "undefined" && "bluetooth" in navigator;
  }

  /**
   * Connect to the senseBox via BLE and start receiving gesture data
   */
  async connect() {
    if (this.isConnected) return;

    if (!GestureBLEService.isSupported()) {
      const error = new Error(
        "Web Bluetooth API is not supported in this browser",
      );
      error.type = "UNSUPPORTED_BROWSER";
      throw error;
    }

    try {
      this.device = await navigator.bluetooth.requestDevice({
        filters: [
          { namePrefix: "senseBox" },
          { name: "senseBox-MagicWand" },
          { name: "senseBox-Gesture" },
        ],
        optionalServices: [BLE_SERVICE_UUID],
      });
    } catch (err) {
      if (err.name === "NotFoundError") {
        // User cancelled the device picker — not an error
        return;
      }
      const error = new Error(`BLE device request failed: ${err.message}`);
      error.type = "CONNECTION_FAILED";
      throw error;
    }

    this.device.addEventListener(
      "gattserverdisconnected",
      this._boundOnDisconnected,
    );

    try {
      this.server = await this.device.gatt.connect();
      const service = await this.server.getPrimaryService(BLE_SERVICE_UUID);
      this.characteristic = await service.getCharacteristic(BLE_STROKE_UUID);
      this.isConnected = true;

      // Start polling for stroke data (BLE read instead of notify for large data)
      this._startPolling();
    } catch (err) {
      await this.disconnect();
      const error = new Error(`BLE connection failed: ${err.message}`);
      error.type = "CONNECTION_FAILED";
      throw error;
    }
  }

  /**
   * Disconnect from the BLE device
   */
  async disconnect() {
    this.isConnected = false;
    this._stopPolling();

    if (this.device) {
      this.device.removeEventListener(
        "gattserverdisconnected",
        this._boundOnDisconnected,
      );
    }

    if (this.server?.connected) {
      try {
        this.server.disconnect();
      } catch (_) {
        // ignore
      }
    }

    this.server = null;
    this.device = null;
    this.characteristic = null;
    this._previousStrokeState = StrokeState.WAITING;
  }

  /**
   * Register a callback for incoming stroke data
   * @param {Function} callback - called with { state, length, strokePoints, timestamp } on each poll
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

  _onDisconnected() {
    this.isConnected = false;
    this._stopPolling();
    const error = new Error("BLE device disconnected");
    error.type = "DEVICE_DISCONNECTED";
    this._emitError(error);
  }

  _startPolling() {
    this._stopPolling();
    this.pollingInterval = setInterval(() => {
      this._readStrokeData();
    }, POLL_INTERVAL_MS);
  }

  _stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  async _readStrokeData() {
    if (!this.characteristic || !this.isConnected) return;

    try {
      const dataView = await this.characteristic.readValue();
      this._parseStrokeData(dataView);
    } catch (err) {
      // Ignore read errors during polling — device may be busy
      if (err.message?.includes("disconnected")) {
        this._onDisconnected();
      }
    }
  }

  _parseStrokeData(dataView) {
    if (!dataView || dataView.byteLength < 8) return;

    const state = dataView.getInt32(0, true); // little endian
    const length = dataView.getInt32(4, true);

    // Parse stroke points
    const strokePoints = [];
    let offset = 8;
    const pointCount = Math.min(length, STROKE_POINT_COUNT);

    for (let i = 0; i < pointCount; i++) {
      if (offset + 2 > dataView.byteLength) break;
      const x = dataView.getInt8(offset) / 128.0;
      const y = dataView.getInt8(offset + 1) / 128.0;
      strokePoints.push({ x, y });
      offset += 2;
    }

    const strokeData = {
      state,
      length: pointCount,
      strokePoints,
      timestamp: Date.now(),
    };

    this._emitStroke(strokeData);

    // Detect stroke completion (state changed to DONE)
    if (
      state === StrokeState.DONE &&
      this._previousStrokeState !== StrokeState.DONE
    ) {
      // Emit completed stroke event - this is when we want to store the gesture
      strokeData.isCompleted = true;
    }
    this._previousStrokeState = state;
  }

  _emitStroke(strokeData) {
    for (const cb of this.strokeCallbacks) {
      try {
        cb(strokeData);
      } catch (e) {
        console.error("GestureBLEService stroke callback error:", e);
      }
    }
  }

  _emitError(error) {
    for (const cb of this.errorCallbacks) {
      try {
        cb(error);
      } catch (e) {
        console.error("GestureBLEService error callback error:", e);
      }
    }
  }
}

export default GestureBLEService;
