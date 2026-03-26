/**
 * SerialCameraService
 *
 * Manages serial communication with senseBox Eye camera devices using the Web Serial API.
 * Handles connection lifecycle, frame requests, and error management.
 */

class SerialCameraService {
  constructor() {
    this.port = null;
    this.reader = null;
    this.writer = null;
    this.isConnected = false;
    this.frameCallbacks = [];
    this.errorCallbacks = [];
    this.readLoopActive = false;
    this.frameBuffer = new Uint8Array(0);

    // Frame reception tracking and retry logic
    this.lastFrameTime = null;
    this.frameTimeout = 3000; // 3 seconds timeout for frame reception
    this.frameTimeoutCheckInterval = null;
    this.hasEmittedTimeoutError = false;
    this.consecutiveFailures = 0;
    this.maxConsecutiveFailures = 1000000;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 3;
    this.reconnectDelay = 2000; // Start with 2 seconds
    this.reconnectTimeoutId = null;
  }

  /**
   * Check if Web Serial API is supported in the current browser
   * @returns {boolean} True if Web Serial API is available
   */
  static isSupported() {
    return "serial" in navigator;
  }

  /**
   * Request serial port access from the user
   * @param {Array} filters - Optional USB vendor/product ID filters
   * @returns {Promise<SerialPort|null>} Selected serial port or null if cancelled
   * @throws {Error} If Web Serial API is not supported or permission denied
   */
  async requestPort(filters = []) {
    if (!SerialCameraService.isSupported()) {
      const error = new Error(
        "Web Serial API is not supported in this browser",
      );
      error.type = "UNSUPPORTED_BROWSER";
      throw error;
    }

    try {
      const port = await navigator.serial.requestPort({ filters });
      return port;
    } catch (error) {
      if (error.name === "NotFoundError") {
        // User cancelled the port selection
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
   * Open a connection to the serial port
   * @param {number} baudRate - Baud rate for serial communication (default: 115200)
   * @returns {Promise<void>}
   * @throws {Error} If connection fails or port is already connected
   */
  async connect(baudRate = 115200) {
    if (this.isConnected && this.readLoopActive) {
      return;
    }

    if (!this.port) {
      throw new Error("No serial port selected. Call requestPort() first.");
    }

    // Reset error states and flags when attempting a new connection
    this.hasEmittedTimeoutError = false;
    this.consecutiveFailures = 0;
    this.reconnectAttempts = 0;
    this.frameBuffer = new Uint8Array(0); // Clear any stale data
    this.lastFrameTime = null;

    try {
      // Only open the port if it's not already open
      if (!this.port.connected) {
        await this.port.open({ baudRate });
      } else {
        // If port is open but streams aren't available, we need to close and reopen
        if (!this.port.readable || !this.port.writable) {
          try {
            await this.port.close();
          } catch (e) {
            console.warn("[SerialCameraService] Error closing port:", e);
          }
          // Now open it fresh
          await this.port.open({ baudRate });
        }
      }

      // Verify streams are now available
      if (!this.port.readable || !this.port.writable) {
        throw new Error(
          "Port streams are not available after opening. Port may be in an invalid state.",
        );
      }

      // Release existing reader/writer if they exist (they might be from a previous session)
      if (this.reader) {
        try {
          await this.reader.cancel();
          this.reader.releaseLock();
        } catch (e) {
          console.warn(
            "[SerialCameraService] Error releasing existing reader:",
            e,
          );
        }
        this.reader = null;
      }

      if (this.writer) {
        try {
          this.writer.releaseLock();
        } catch (e) {
          console.warn(
            "[SerialCameraService] Error releasing existing writer:",
            e,
          );
        }
        this.writer = null;
      }

      // Now get fresh reader and writer
      this.reader = this.port.readable.getReader();
      this.writer = this.port.writable.getWriter();

      this.isConnected = true;

      // Start the read loop if not already active
      if (!this.readLoopActive) {
        this._startReadLoop();
      }

      // Always start/restart frame timeout monitoring on connection
      this._startFrameTimeoutMonitor();
    } catch (error) {
      console.error("[SerialCameraService] Connection error:", error);
      const connectionError = new Error(
        `Failed to connect to serial port: ${error.message}`,
      );
      connectionError.type = "CONNECTION_FAILED";
      connectionError.originalError = error;

      // Clean up on error
      await this._cleanup();

      this._emitError(connectionError);
      throw connectionError;
    }
  }

  /**
   * Close the serial port connection and clean up resources
   * @returns {Promise<void>}
   */
  async disconnect() {
    // Store timeout error state before cleanup
    const hadTimeoutError = this.hasEmittedTimeoutError;

    // Cancel any pending reconnection attempts
    this._cancelReconnection();

    // Stop frame timeout monitoring
    this._stopFrameTimeoutMonitor();

    // Stop frame stream if active
    this.stopFrameStream();

    this.readLoopActive = false;

    // Fully cleanup including clearing port reference
    await this._cleanup(false);

    this.isConnected = false;

    // Re-emit timeout error after disconnect to ensure it persists in UI
    if (hadTimeoutError) {
      this._emitError({
        type: "CONNECTION_FAILED",
        message: "Connection to senseBox Eye camera could not be established",
        details: "No frames were received from the camera",
      });
    }
  }

  /**
   * Internal cleanup method to release resources
   * @private
   * @param {boolean} keepPort - If true, don't clear the port reference (for reconnection)
   */
  async _cleanup(keepPort = false) {
    try {
      // Release reader
      if (this.reader) {
        await this.reader.cancel();
        this.reader.releaseLock();
        this.reader = null;
      }
    } catch (error) {
      console.error("Error releasing reader:", error);
    }

    try {
      // Release writer
      if (this.writer) {
        this.writer.releaseLock();
        this.writer = null;
      }
    } catch (error) {
      console.error("Error releasing writer:", error);
    }

    try {
      // Close port
      if (this.port) {
        await this.port.close();
        if (!keepPort) {
          this.port = null;
        }
      }
    } catch (error) {
      console.error("Error closing port:", error);
      // If close fails, still clear port reference when not keeping it
      if (!keepPort && this.port) {
        this.port = null;
      }
    }
  }

  /**
   * Start the continuous read loop for incoming data
   * @private
   */
  _startReadLoop() {
    this.readLoopActive = true;
    this._readLoop().catch((error) => {
      console.error("Read loop error:", error);
      this._emitError({
        type: "READ_LOOP_ERROR",
        message: "Error in read loop",
        originalError: error,
      });
    });
  }

  /**
   * Continuous read loop for incoming serial data
   * This will be extended in future tasks to handle frame parsing
   * @private
   */
  async _readLoop() {
    while (this.readLoopActive && this.reader) {
      try {
        const { value, done } = await this.reader.read();

        if (done) {
          // Reader has been cancelled or stream ended
          break;
        }

        // Accumulate data into frame buffer
        if (value && value.length > 0) {
          this._appendToBuffer(value);
          // Try to parse frames from the buffer
          this._tryParseFrames();
        }
      } catch (error) {
        if (this.readLoopActive) {
          // Only emit error if we're still supposed to be reading
          console.error("[SerialCamera] Read loop error:", error);
          const readError = new Error(`Read error: ${error.message}`);
          readError.type = "DEVICE_DISCONNECTED";
          readError.originalError = error;
          this._emitError(readError);

          // Stop the read loop on error
          this.readLoopActive = false;
          this.isConnected = false;

          // Attempt automatic reconnection with exponential backoff
          this._attemptReconnection();
        }
        break;
      }
    }
  }

  /**
   * Append incoming data to the frame buffer
   * @private
   * @param {Uint8Array} data - New data to append
   */
  _appendToBuffer(data) {
    const newBuffer = new Uint8Array(this.frameBuffer.length + data.length);
    newBuffer.set(this.frameBuffer, 0);
    newBuffer.set(data, this.frameBuffer.length);
    this.frameBuffer = newBuffer;
  }

  /**
   * Try to parse complete frames from the buffer
   * Uses a sliding window approach to find frame headers
   * Implements retry logic for corrupted frames
   * @private
   */
  _tryParseFrames() {
    const MAX_BUFFER_SIZE = 2 * 1024 * 1024; // 2MB max buffer

    while (this.frameBuffer.length > 0) {
      const frame = this._parseFrame();

      if (frame === null) {
        // Not enough data for a complete frame yet
        break;
      }

      if (frame === false) {
        // Invalid frame at current position
        // Track consecutive failures for retry logic
        this.consecutiveFailures++;

        if (this.consecutiveFailures >= this.maxConsecutiveFailures) {
          console.warn(
            `[SerialCamera] ${this.consecutiveFailures} consecutive frame parsing failures`,
          );

          // Emit error for excessive failures
          this._emitError({
            type: "FRAME_CORRUPTED",
            message: `Failed to parse ${this.consecutiveFailures} consecutive frames. Data may be corrupted.`,
            consecutiveFailures: this.consecutiveFailures,
          });

          // Clear buffer to resync - this is our "retry" by starting fresh
          this.frameBuffer = new Uint8Array(0);
          this.consecutiveFailures = 0;
          break;
        }

        // Skip 1 byte and try again (sliding window search)
        this.frameBuffer = this.frameBuffer.slice(1);

        // Prevent buffer from growing indefinitely if no valid frames found
        if (this.frameBuffer.length > MAX_BUFFER_SIZE) {
          console.warn("[SerialCamera] Buffer overflow, clearing buffer");
          this.frameBuffer = new Uint8Array(0);
          this.consecutiveFailures = 0;

          this._emitError({
            type: "FRAME_CORRUPTED",
            message: "Buffer overflow - too much invalid data received",
          });
          break;
        }
        continue;
      }

      // Valid frame received, emit to callbacks
      this._emitFrame(frame);
    }
  }

  /**
   * Parse a frame from the buffer according to the protocol:
   * [HEADER][SIZE][DATA][CHECKSUM]
   * HEADER: 4 bytes - "FRAM" (0x46 0x52 0x41 0x4D)
   * SIZE: 4 bytes - uint32 little-endian
   * DATA: SIZE bytes - JPEG data
   * CHECKSUM: 4 bytes - uint32 little-endian CRC32
   *
   * @private
   * @returns {Object|null|false} Frame object if valid, null if incomplete, false if invalid
   */
  _parseFrame() {
    const HEADER_SIZE = 4;
    const FRAME_WIDTH = 96;
    const FRAME_HEIGHT = 96;
    const GRAYSCALE_DATA_SIZE = FRAME_WIDTH * FRAME_HEIGHT; // 9216 bytes
    const TOTAL_FRAME_SIZE = HEADER_SIZE + GRAYSCALE_DATA_SIZE;

    // Check if we have enough data for header
    if (this.frameBuffer.length < HEADER_SIZE) {
      return null; // Not enough data yet
    }

    // Check for valid header "FRAM" (0x46='F', 0x52='R', 0x41='A', 0x4D='M')
    const header = this.frameBuffer.slice(0, HEADER_SIZE);
    const isValidHeader =
      header[0] === 0x46 &&
      header[1] === 0x52 &&
      header[2] === 0x41 &&
      header[3] === 0x4d;

    if (!isValidHeader) {
      // Not a valid header at current position
      // Return false to trigger 1-byte skip (sliding window)
      return false;
    }

    // console.log('[SerialCamera] Valid header found at buffer start');

    // Check if we have the complete frame
    if (this.frameBuffer.length < TOTAL_FRAME_SIZE) {
      // console.log(`[SerialCamera] Incomplete frame: have ${this.frameBuffer.length}, need ${TOTAL_FRAME_SIZE}`);
      return null; // Not enough data yet
    }

    // Extract grayscale data (96x96 bytes)
    const dataStart = HEADER_SIZE;
    const dataEnd = dataStart + GRAYSCALE_DATA_SIZE;
    const grayscaleData = this.frameBuffer.slice(dataStart, dataEnd);

    // console.log('[SerialCamera] Grayscale frame received:', GRAYSCALE_DATA_SIZE, 'bytes');

    // Convert grayscale to RGBA for canvas rendering
    const rgbaData = this._grayscaleToRGBA(
      grayscaleData,
      FRAME_WIDTH,
      FRAME_HEIGHT,
    );

    // Remove processed frame from buffer
    this.frameBuffer = this.frameBuffer.slice(TOTAL_FRAME_SIZE);

    // Return valid frame with RGBA data
    return {
      data: rgbaData,
      width: FRAME_WIDTH,
      height: FRAME_HEIGHT,
      format: "rgba",
      timestamp: Date.now(),
    };
  }

  /**
   * Convert grayscale data to RGBA format for canvas rendering
   * @private
   * @param {Uint8Array} grayscaleData - Grayscale pixel data (1 byte per pixel)
   * @param {number} width - Image width
   * @param {number} height - Image height
   * @returns {Uint8Array} RGBA pixel data (4 bytes per pixel)
   */
  _grayscaleToRGBA(grayscaleData, width, height) {
    const rgbaData = new Uint8Array(width * height * 4);

    for (let i = 0; i < grayscaleData.length; i++) {
      const gray = grayscaleData[i];
      const rgbaIndex = i * 4;

      rgbaData[rgbaIndex] = gray; // R
      rgbaData[rgbaIndex + 1] = gray; // G
      rgbaData[rgbaIndex + 2] = gray; // B
      rgbaData[rgbaIndex + 3] = 255; // A (fully opaque)
    }

    return rgbaData;
  }

  /**
   * Convert a Uint8Array frame buffer to an image Blob
   * Validates JPEG format and handles decoding errors
   * @private
   * @param {Uint8Array} buffer - Frame data buffer
   * @returns {Blob|null} Blob with image/jpeg MIME type, or null if validation fails
   */
  _createImageFromBuffer(buffer) {
    try {
      // Validate JPEG format by checking magic bytes
      // JPEG files start with FF D8 and end with FF D9
      if (buffer.length < 2) {
        const error = new Error("Buffer too small to be a valid JPEG");
        error.type = "INVALID_FORMAT";
        this._emitError(error);
        return null;
      }

      // Check JPEG start marker (SOI - Start of Image)
      if (buffer[0] !== 0xff || buffer[1] !== 0xd8) {
        const error = new Error("Invalid JPEG format: missing SOI marker");
        error.type = "INVALID_FORMAT";
        this._emitError(error);
        return null;
      }

      // Check JPEG end marker (EOI - End of Image)
      if (
        buffer[buffer.length - 2] !== 0xff ||
        buffer[buffer.length - 1] !== 0xd9
      ) {
        const error = new Error("Invalid JPEG format: missing EOI marker");
        error.type = "INVALID_FORMAT";
        this._emitError(error);
        return null;
      }

      // Create Blob with image/jpeg MIME type
      const blob = new Blob([buffer], { type: "image/jpeg" });
      return blob;
    } catch (error) {
      // Handle any unexpected errors during conversion
      const conversionError = new Error(
        `Failed to create image from buffer: ${error.message}`,
      );
      conversionError.type = "DECODING_ERROR";
      conversionError.originalError = error;
      this._emitError(conversionError);
      return null;
    }
  }

  /**
   * Emit a frame to all registered frame callbacks
   * @private
   * @param {Object} frame - Frame object with data, size, checksum, timestamp
   */
  _emitFrame(frame) {
    const hadTimeoutError = this.hasEmittedTimeoutError;

    // Track successful frame reception - reset failure counters and error flags
    this.lastFrameTime = Date.now();
    this.consecutiveFailures = 0;
    this.reconnectAttempts = 0;
    this.hasEmittedTimeoutError = false;

    // Emit a special "CONNECTION_RESTORED" event if we had a timeout error before
    // This helps the UI clear error messages when frames start flowing again
    if (hadTimeoutError) {
      this._emitError({
        type: "CONNECTION_RESTORED",
        message: "Connection restored, receiving frames",
      });
    }

    this.frameCallbacks.forEach((callback) => {
      try {
        callback(frame);
      } catch (callbackError) {
        console.error("Error in frame callback:", callbackError);
      }
    });
  }

  /**
   * Start continuous frame requests at specified interval
   * NOTE: Not used with Arduino that sends frames continuously
   * @param {number} intervalMs - Interval between frame requests in milliseconds (default: 200ms = 5fps)
   * @returns {number} Interval ID that can be used to stop the stream
   */
  startFrameStream(intervalMs = 200) {
    // Arduino sends frames continuously, so we don't need to request them
    // Just return a dummy interval ID for compatibility
    // The monitor is already started by connect(), nothing to do here

    return null;
  }

  /**
   * Stop continuous frame requests
   * @param {number} intervalId - Interval ID returned by startFrameStream
   */
  stopFrameStream(intervalId) {
    // Arduino sends frames continuously, so nothing to stop
  }

  /**
   * Register a callback for frame reception events
   * @param {Function} callback - Callback function receiving frame data
   */
  onFrame(callback) {
    if (typeof callback === "function") {
      this.frameCallbacks.push(callback);
    }
  }

  /**
   * Remove a frame callback
   * @param {Function} callback - Callback function to remove
   */
  offFrame(callback) {
    const index = this.frameCallbacks.indexOf(callback);
    if (index > -1) {
      this.frameCallbacks.splice(index, 1);
    }
  }

  /**
   * Register a callback for error events
   * @param {Function} callback - Callback function receiving error information
   */
  onError(callback) {
    if (typeof callback === "function") {
      this.errorCallbacks.push(callback);
    }
  }

  /**
   * Remove an error callback
   * @param {Function} callback - Callback function to remove
   */
  offError(callback) {
    const index = this.errorCallbacks.indexOf(callback);
    if (index > -1) {
      this.errorCallbacks.splice(index, 1);
    }
  }

  /**
   * Attempt automatic reconnection with exponential backoff
   * @private
   */
  _attemptReconnection() {
    // Don't attempt reconnection if we've exceeded max attempts
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("[SerialCamera] Max reconnection attempts reached");
      this._emitError({
        type: "CONNECTION_FAILED",
        message: `Failed to reconnect after ${this.maxReconnectAttempts} attempts`,
        reconnectAttempts: this.reconnectAttempts,
      });
      return;
    }

    // Calculate delay with exponential backoff: 2s, 4s, 8s, 16s, 32s
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts);
    this.reconnectAttempts++;

    // Emit notification about reconnection attempt
    this._emitError({
      type: "RECONNECTING",
      message: `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
      reconnectAttempts: this.reconnectAttempts,
      delay: delay,
    });

    // Schedule reconnection attempt
    this.reconnectTimeoutId = setTimeout(async () => {
      try {
        // Clean up existing connection state but keep port reference
        await this._cleanup(true);

        // Try to reconnect using the existing port
        if (this.port) {
          await this.connect();
          // Reset reconnection tracking on success
          this.reconnectAttempts = 0;

          this._emitError({
            type: "RECONNECTED",
            message: "Successfully reconnected to device",
          });
        } else {
          throw new Error("No port available for reconnection");
        }
      } catch (error) {
        console.error("[SerialCamera] Reconnection failed:", error);

        // Try again with next backoff delay
        this._attemptReconnection();
      }
    }, delay);
  }

  /**
   * Cancel any pending reconnection attempts
   * @private
   */
  _cancelReconnection() {
    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;
    }
    this.reconnectAttempts = 0;
  }

  /**
   * Start monitoring for frame timeout
   * @private
   */
  _startFrameTimeoutMonitor() {
    // Stop existing monitor if any
    this._stopFrameTimeoutMonitor();

    // Set initial frame time
    this.lastFrameTime = Date.now();
    this.hasEmittedTimeoutError = false;

    // Check for timeout every second
    this.frameTimeoutCheckInterval = setInterval(() => {
      if (!this.isConnected || !this.lastFrameTime) {
        return;
      }

      const timeSinceLastFrame = Date.now() - this.lastFrameTime;

      if (
        timeSinceLastFrame > this.frameTimeout &&
        !this.hasEmittedTimeoutError
      ) {
        console.warn(
          `[SerialCamera] Frame timeout: no frames received for ${timeSinceLastFrame}ms`,
        );

        // Emit CONNECTION_FAILED error (not FRAME_TIMEOUT)
        this._emitError({
          type: "CONNECTION_FAILED",
          message: "Connection to senseBox Eye camera could not be established",
          details: `No frames received for ${timeSinceLastFrame}ms`,
          timeSinceLastFrame,
        });

        // Set flag to prevent repeated error emissions
        this.hasEmittedTimeoutError = true;
      }
    }, 1000); // Check every second
  }

  /**
   * Stop frame timeout monitoring
   * @private
   */
  _stopFrameTimeoutMonitor() {
    if (this.frameTimeoutCheckInterval) {
      clearInterval(this.frameTimeoutCheckInterval);
      this.frameTimeoutCheckInterval = null;
    }
  }

  /**
   * Emit an error to all registered error callbacks
   * @private
   * @param {Object} error - Error object with type, message, and optional originalError
   */
  _emitError(error) {
    this.errorCallbacks.forEach((callback) => {
      try {
        callback(error);
      } catch (callbackError) {
        console.error("Error in error callback:", callbackError);
      }
    });
  }

  /**
   * Get the current connection state
   * @returns {boolean} True if connected to a serial port
   */
  getConnectionState() {
    return this.isConnected;
  }
}

export default SerialCameraService;
