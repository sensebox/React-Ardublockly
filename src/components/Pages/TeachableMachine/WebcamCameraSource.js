/**
 * WebcamCameraSource - Camera source implementation for browser webcam
 * Implements the CameraSource interface for webcam access via getUserMedia API
 */
class WebcamCameraSource {
  constructor() {
    this.stream = null;
    this.videoElement = null;
    this.canvasElement = null;
    this.errorCallback = null;
    this._isActive = false;
    this.animationFrameId = null;
    // 'user' = front camera, 'environment' = back camera
    this.facingMode = "environment";
  }

  /**
   * Start the webcam stream
   * @param {Object} options - Optional start options
   * @param {string} options.facingMode - 'user' for front camera, 'environment' for back camera
   * @returns {Promise<void>}
   */
  async start(options = {}) {
    try {
      // Update facing mode if provided
      if (options.facingMode) {
        this.facingMode = options.facingMode;
      }

      // Clean up any existing resources from previous session
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }

      if (this.videoElement) {
        this.videoElement.srcObject = null;
        this.videoElement = null;
      }

      if (this.canvasElement) {
        this.canvasElement = null;
      }

      if (this.stream) {
        this.stream.getTracks().forEach((track) => track.stop());
        this.stream = null;
      }

      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: this.facingMode },
        audio: false,
      });

      // Create fresh video element (hidden from user)
      this.videoElement = document.createElement("video");
      this.videoElement.autoplay = true;
      this.videoElement.playsInline = true;
      this.videoElement.muted = true;
      this.videoElement.srcObject = this.stream;
      this.videoElement.style.display = "none"; // Hide the original video

      // Create canvas element for grayscale 96x96 display
      this.canvasElement = document.createElement("canvas");
      this.canvasElement.width = 96;
      this.canvasElement.height = 96;
      this.canvasElement.style.imageRendering = "pixelated";

      // Wait for video to be ready
      await new Promise((resolve, reject) => {
        const playVideo = async () => {
          try {
            await this.videoElement.play();
            this._isActive = true;
            // Start the rendering loop
            this._renderFrame();
            resolve();
          } catch (error) {
            reject(error);
          }
        };

        if (this.videoElement.readyState >= 2) {
          playVideo();
        } else {
          this.videoElement.addEventListener("loadedmetadata", playVideo, {
            once: true,
          });
          // Fallback timeout
          setTimeout(() => {
            if (this.videoElement.paused) {
              playVideo();
            }
          }, 1000);
        }
      });
    } catch (error) {
      this._isActive = false;
      if (this.errorCallback) {
        this.errorCallback(error);
      }
      throw error;
    }
  }

  /**
   * Render frame to canvas as 96x96 grayscale
   * @private
   */
  _renderFrame() {
    if (!this._isActive || !this.videoElement || !this.canvasElement) {
      return;
    }

    if (
      this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA &&
      !this.videoElement.paused
    ) {
      const ctx = this.canvasElement.getContext("2d");

      // Get video dimensions
      const videoWidth = this.videoElement.videoWidth;
      const videoHeight = this.videoElement.videoHeight;

      // Calculate center crop dimensions (square)
      const minDim = Math.min(videoWidth, videoHeight);
      const sourceX = (videoWidth - minDim) / 2;
      const sourceY = (videoHeight - minDim) / 2;

      // Draw center-cropped video frame to canvas
      ctx.drawImage(
        this.videoElement,
        sourceX,
        sourceY,
        minDim,
        minDim, // source rectangle (center crop)
        0,
        0,
        96,
        96, // destination rectangle (96x96)
      );

      // Convert to grayscale using luminosity method
      const imageData = ctx.getImageData(0, 0, 96, 96);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        // Calculate grayscale using luminosity formula: 0.299*R + 0.587*G + 0.114*B
        const gray =
          0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = gray; // Red
        data[i + 1] = gray; // Green
        data[i + 2] = gray; // Blue
        // Alpha (data[i + 3]) remains unchanged
      }

      ctx.putImageData(imageData, 0, 0);
    }

    this.animationFrameId = requestAnimationFrame(() => this._renderFrame());
  }

  /**
   * Stop the webcam stream
   * @returns {Promise<void>}
   */
  async stop() {
    // Stop animation frame
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.videoElement) {
      this.videoElement.srcObject = null;
      this.videoElement = null;
    }

    if (this.canvasElement) {
      this.canvasElement = null;
    }

    this._isActive = false;
  }

  /**
   * Capture a single frame from the webcam
   * @returns {Promise<Blob>} JPEG image blob
   */
  async captureFrame() {
    if (!this.canvasElement || !this._isActive) {
      throw new Error("Webcam is not active");
    }

    // The canvas is already 96x96 grayscale from the render loop
    return new Promise((resolve, reject) => {
      this.canvasElement.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create blob from canvas"));
          }
        },
        "image/jpeg",
        0.8,
      );
    });
  }

  /**
   * Get the preview element (canvas element with 96x96 grayscale)
   * @returns {HTMLCanvasElement}
   */
  getPreviewElement() {
    return this.canvasElement;
  }

  /**
   * Check if the webcam is active
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

  /**
   * Switch between front and back camera
   * @returns {Promise<void>}
   */
  async switchCamera() {
    const newFacingMode = this.facingMode === "user" ? "environment" : "user";
    await this.stop();
    await this.start({ facingMode: newFacingMode });
  }

  /**
   * Get current facing mode
   * @returns {string} 'user' or 'environment'
   */
  getFacingMode() {
    return this.facingMode;
  }
}

export default WebcamCameraSource;
