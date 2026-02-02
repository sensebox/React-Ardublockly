/**
 * SerialCameraSource - Camera source implementation for senseBox Eye serial camera
 * Implements the CameraSource interface for serial camera access via SerialCameraService
 */
class SerialCameraSource {
  constructor(serialService) {
    this.serialService = serialService;
    this.imageElement = null;
    this.latestFrame = null;
    this.errorCallback = null;
    this.frameIntervalId = null;
    this._isActive = false;
    this.frameCallback = null;
  }

  /**
   * Start the serial camera stream
   * @returns {Promise<void>}
   */
  async start() {
    try {
      // Clean up any existing image element and frame callback from previous session
      if (this.imageElement) {
        if (this.imageElement.src) {
          URL.revokeObjectURL(this.imageElement.src);
        }
        this.imageElement = null;
      }

      if (this.frameCallback) {
        this.serialService.offFrame(this.frameCallback);
        this.frameCallback = null;
      }

      // Check if port is already connected
      const portAlreadyConnected = this.serialService.port?.connected;

      if (
        portAlreadyConnected &&
        this.serialService.isConnected &&
        this.serialService.readLoopActive
      ) {
        // Port is already connected and active, just reuse it
      } else if (portAlreadyConnected) {
        // Port is connected but we need to check if streams are available

        // Check if streams are available
        if (
          this.serialService.port.readable &&
          this.serialService.port.writable
        ) {
          this.serialService.isConnected = true;

          // Ensure reader and writer are available
          if (!this.serialService.reader || !this.serialService.writer) {
            this.serialService.reader =
              this.serialService.port.readable.getReader();
            this.serialService.writer =
              this.serialService.port.writable.getWriter();
          }

          // Restart read loop if not active
          if (!this.serialService.readLoopActive) {
            this.serialService._startReadLoop();
          }
        } else {
          // Streams not available, need to close and reopen
          try {
            await this.serialService.port.close();
          } catch (e) {
            console.warn("[SerialCameraSource] Error closing port:", e);
          }
          this.serialService.port = null;
          this.serialService.isConnected = false;

          // Establish new connection
          const port = await this.serialService.requestPort();
          if (!port) {
            throw new Error("No serial port selected");
          }
          this.serialService.port = port;
          await this.serialService.connect();
        }
      } else {
        // Need to establish a new connection
        const port = await this.serialService.requestPort();
        if (!port) {
          throw new Error("No serial port selected");
        }
        this.serialService.port = port;
        await this.serialService.connect();
      }

      // Create fresh image element for preview
      this.imageElement = document.createElement("img");
      this.imageElement.alt = "Serial camera feed";

      // Add a data attribute to indicate it's waiting for frames
      this.imageElement.dataset.waiting = "true";

      // Register frame callback to update preview and store latest frame
      this.frameCallback = (frame) => {
        // Convert RGBA data to canvas and then to blob
        const canvas = document.createElement("canvas");
        canvas.width = frame.width;
        canvas.height = frame.height;
        const ctx = canvas.getContext("2d");

        // Create ImageData from RGBA array
        const imageData = new ImageData(
          new Uint8ClampedArray(frame.data),
          frame.width,
          frame.height,
        );
        ctx.putImageData(imageData, 0, 0);

        // Convert canvas to blob and store
        canvas.toBlob(
          (blob) => {
            if (blob) {
              this.latestFrame = blob;

              // Update preview image
              const url = URL.createObjectURL(blob);

              // Revoke old URL to prevent memory leak
              if (this.imageElement && this.imageElement.src) {
                URL.revokeObjectURL(this.imageElement.src);
              }

              if (this.imageElement) {
                this.imageElement.src = url;

                // Remove waiting indicator
                if (this.imageElement.dataset.waiting) {
                  delete this.imageElement.dataset.waiting;
                }
              }
            }
          },
          "image/jpeg",
          0.8,
        );
      };

      this.serialService.onFrame(this.frameCallback);

      // Register error callback AFTER successful connection
      // This prevents connection errors from being reported as runtime errors
      this.serialService.onError((error) => {
        // Only forward errors if we're active (ignore errors during connection)
        if (this._isActive && this.errorCallback) {
          const forwardedError =
            error?.originalError || error || new Error("Unknown serial error");
          // Preserve error metadata so downstream handlers can decide severity
          if (forwardedError && error?.type && !forwardedError.type) {
            forwardedError.type = error.type;
          }
          this.errorCallback(forwardedError);
        }
      });

      // Start frame stream (this is a no-op for Arduino which sends continuously)
      this.frameIntervalId = await this.serialService.startFrameStream(200);
      this._isActive = true;
    } catch (error) {
      this._isActive = false;
      if (this.errorCallback) {
        this.errorCallback(error);
      }
      throw error;
    }
  }

  /**
   * Stop the serial camera stream
   * @returns {Promise<void>}
   */
  async stop() {
    // Stop frame stream
    if (this.frameIntervalId) {
      this.serialService.stopFrameStream(this.frameIntervalId);
      this.frameIntervalId = null;
    }

    // Remove frame callback from service
    if (this.frameCallback) {
      this.serialService.offFrame(this.frameCallback);
      this.frameCallback = null;
    }

    // Clean up image element
    if (this.imageElement && this.imageElement.src) {
      URL.revokeObjectURL(this.imageElement.src);
    }

    this.imageElement = null;

    // Clear latest frame
    this.latestFrame = null;

    // Note: We don't disconnect the serial service here because
    // other consumers might be using it. The service manages its own lifecycle.

    this._isActive = false;
  }

  /**
   * Capture a single frame from the serial camera
   * @returns {Promise<Blob>} JPEG image blob
   */
  async captureFrame() {
    if (!this._isActive) {
      throw new Error("Serial camera is not active");
    }

    // If we have a latest frame, return it
    if (this.latestFrame) {
      return this.latestFrame;
    }

    // Wait for next frame (with timeout)
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Timeout waiting for frame"));
      }, 5000);

      const frameHandler = (frame) => {
        clearTimeout(timeout);

        // Convert RGBA to blob
        const canvas = document.createElement("canvas");
        canvas.width = frame.width;
        canvas.height = frame.height;
        const ctx = canvas.getContext("2d");

        const imageData = new ImageData(
          new Uint8ClampedArray(frame.data),
          frame.width,
          frame.height,
        );
        ctx.putImageData(imageData, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to create blob from frame"));
            }
          },
          "image/jpeg",
          0.8,
        );
      };

      this.serialService.onFrame(frameHandler);
    });
  }

  /**
   * Get the preview element (image element)
   * @returns {HTMLImageElement}
   */
  getPreviewElement() {
    return this.imageElement;
  }

  /**
   * Check if the serial camera is active
   * @returns {boolean}
   */
  isActive() {
    return this._isActive;
  }

  /**
   * Register error callback
   * @param {Function} callback - Error callback function
   */
  onError(callback) {
    this.errorCallback = callback;
  }
}

export default SerialCameraSource;
