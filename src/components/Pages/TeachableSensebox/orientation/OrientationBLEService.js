/**
 * OrientationBLEService
 *
 * Manages Bluetooth Low Energy communication with senseBox Eye for
 * accelerometer data using the Web Bluetooth API.
 * Receives X, Y, Z acceleration values via BLE notifications in
 * the same text format as the Serial service.
 *
 * Expected data format: comma-separated values per notification:
 *   "x:-4.27,y:7.43,z:2.93\n"
 * or plain:
 *   "-4.27,7.43,2.93\n"
 */

const BLE_SERVICE_UUID = "4798e0f2-0000-4d68-af64-8a8f5258404e";
const BLE_RX_UUID = "4798e0f2-300a-4d68-af64-8a8f5258404e";

class OrientationBLEService {
  constructor() {
    this.device = null;
    this.server = null;
    this.characteristic = null;
    this.isConnected = false;
    this.dataCallbacks = [];
    this.errorCallbacks = [];
    this.lineBuffer = "";
    this._decoder = new TextDecoder();
    this._boundOnNotification = this._onNotification.bind(this);
    this._boundOnDisconnected = this._onDisconnected.bind(this);
  }

  /**
   * Check if Web Bluetooth API is supported in the current browser
   * @returns {boolean}
   */
  static isSupported() {
    return typeof navigator !== "undefined" && "bluetooth" in navigator;
  }

  /**
   * Connect to the senseBox Eye via BLE and start receiving accelerometer data
   */
  async connect() {
    if (this.isConnected) return;

    if (!OrientationBLEService.isSupported()) {
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
          { name: "senseBox-Accelerometer" },
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
      this.characteristic = await service.getCharacteristic(BLE_RX_UUID);
      this.characteristic.addEventListener(
        "characteristicvaluechanged",
        this._boundOnNotification,
      );
      await this.characteristic.startNotifications();
      this.isConnected = true;
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

    if (this.characteristic) {
      this.characteristic.removeEventListener(
        "characteristicvaluechanged",
        this._boundOnNotification,
      );
      try {
        await this.characteristic.stopNotifications();
      } catch (_) {
        // ignore
      }
      this.characteristic = null;
    }

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
    this.lineBuffer = "";
  }

  /**
   * Register a callback for incoming accelerometer data
   * @param {Function} callback - called with { x, y, z, timestamp } on each sample
   * @returns {Function} unsubscribe function
   */
  onData(callback) {
    this.dataCallbacks.push(callback);
    return () => {
      this.dataCallbacks = this.dataCallbacks.filter((cb) => cb !== callback);
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
    const error = new Error("BLE device disconnected");
    error.type = "DEVICE_DISCONNECTED";
    this._emitError(error);
  }

  _onNotification(event) {
    const text = this._decoder.decode(event.target.value, { stream: true });
    this.lineBuffer += text;

    const lines = this.lineBuffer.split("\n");
    this.lineBuffer = lines.pop(); // Keep incomplete last segment

    for (const line of lines) {
      this._parseLine(line.trim());
    }

    // BLE notifications are self-contained packets and may arrive without a
    // trailing newline. If the leftover buffer looks like a complete x,y,z
    // triplet (two commas), parse and clear it immediately.
    const remaining = this.lineBuffer.trim();
    if (remaining && remaining.split(",").length >= 3) {
      this._parseLine(remaining);
      this.lineBuffer = "";
    }
  }

  _parseLine(line) {
    if (!line) return;

    const parts = line.split(",");
    if (parts.length !== 3) return;
    const x = parseFloat(parts[0]);
    const y = parseFloat(parts[1]);
    const z = parseFloat(parts[2]);
    if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
      this._emitData({ x, y, z, timestamp: Date.now() });
    }
  }

  _emitData(sample) {
    for (const cb of this.dataCallbacks) {
      try {
        cb(sample);
      } catch (e) {
        console.error("OrientationBLEService data callback error:", e);
      }
    }
  }

  _emitError(error) {
    for (const cb of this.errorCallbacks) {
      try {
        cb(error);
      } catch (e) {
        console.error("OrientationBLEService error callback error:", e);
      }
    }
  }
}

export default OrientationBLEService;
