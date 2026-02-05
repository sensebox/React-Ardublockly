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
    this.currentBlobUrl = null; // Track current blob URL for cleanup
  }

  /**
   * Start the serial camera stream
   * @returns {Promise<void>}
   */
  async start() {
    try {
      // Clean up any existing resources from previous session
      if (this.currentBlobUrl) {
        URL.revokeObjectURL(this.currentBlobUrl);
        this.currentBlobUrl = null;
      }

      if (this.imageElement) {
        this.imageElement = null;
      }

      if (this.frameCallback) {
        this.serialService.offFrame(this.frameCallback);
        this.frameCallback = null;
      }

      // Clear any latent frame data
      this.latestFrame = null;

      // Cancel any automatic reconnection attempts that might be in progress
      // This is critical when user manually selects a new port
      this.serialService._cancelReconnection();

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
          // Streams not available, need to fully disconnect and get new port
          console.log(
            "[SerialCameraSource] Port exists but streams unavailable, requesting new port",
          );
          await this.serialService.disconnect();

          // Establish new connection with fresh port selection
          const port = await this.serialService.requestPort();
          if (!port) {
            throw new Error("No serial port selected");
          }
          this.serialService.port = port;
          await this.serialService.connect();
        }
      } else {
        // Need to establish a new connection
        // Ensure we're fully disconnected first
        if (this.serialService.isConnected) {
          await this.serialService.disconnect();
        }

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

              // Revoke old URL to prevent memory leak
              if (this.currentBlobUrl) {
                URL.revokeObjectURL(this.currentBlobUrl);
                this.currentBlobUrl = null;
              }

              // Update preview image
              const url = URL.createObjectURL(blob);
              this.currentBlobUrl = url;

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

    // Clean up blob URLs
    if (this.currentBlobUrl) {
      URL.revokeObjectURL(this.currentBlobUrl);
      this.currentBlobUrl = null;
    }

    // Clean up image element
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
