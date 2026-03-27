/**
 * AccelerometerService
 *
 * Manages serial communication with senseBox Eye for accelerometer data
 * using the Web Serial API. Reads X, Y, Z acceleration values streamed
 * from the device firmware.
 *
 * Expected firmware output format: comma-separated values per line:
 *   "<x>,<y>,<z>\n"
 * where x, y, z are floating-point acceleration values in m/s².
 */

class AccelerometerService {
  constructor() {
    this.port = null;
    this.reader = null;
    this.writer = null;
    this.isConnected = false;
    this.readLoopActive = false;
    this.dataCallbacks = [];
    this.errorCallbacks = [];
    this.lineBuffer = "";
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
    if (!AccelerometerService.isSupported()) {
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
   * Connect to the serial port and start reading accelerometer data
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
  }

  /**
   * Register a callback for incoming accelerometer data
   * @param {Function} callback - called with { x, y, z } on each sample
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
   */
  onError(callback) {
    this.errorCallbacks.push(callback);
    return () => {
      this.errorCallbacks = this.errorCallbacks.filter((cb) => cb !== callback);
    };
  }

  // ─── Private ──────────────────────────────────────────────────────────────

  _emitData(sample) {
    for (const cb of this.dataCallbacks) {
      try {
        cb(sample);
      } catch (e) {
        console.error("AccelerometerService data callback error:", e);
      }
    }
  }

  _emitError(error) {
    for (const cb of this.errorCallbacks) {
      try {
        cb(error);
      } catch (e) {
        console.error("AccelerometerService error callback error:", e);
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

    // Labeled format: "x:-4.27,y:7.43,z:2.93"
    const labeled = line.match(
      /x:\s*([-\d.]+)[,\s]+y:\s*([-\d.]+)[,\s]+z:\s*([-\d.]+)/i,
    );
    if (labeled) {
      const x = parseFloat(labeled[1]);
      const y = parseFloat(labeled[2]);
      const z = parseFloat(labeled[3]);
      if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
        this._emitData({ x, y, z, timestamp: Date.now() });
      }
      return;
    }

    // Fallback: plain "x,y,z" — e.g. "0.12,-9.81,0.34"
    const parts = line.split(",");
    if (parts.length !== 3) return;
    const x = parseFloat(parts[0]);
    const y = parseFloat(parts[1]);
    const z = parseFloat(parts[2]);
    if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
      this._emitData({ x, y, z, timestamp: Date.now() });
    }
  }
}

export default AccelerometerService;
