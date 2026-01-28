/**
 * WebcamCameraSource - Camera source implementation for browser webcam
 * Implements the CameraSource interface for webcam access via getUserMedia API
 */
class WebcamCameraSource {
  constructor() {
    this.stream = null;
    this.videoElement = null;
    this.errorCallback = null;
    this._isActive = false;
  }

  /**
   * Start the webcam stream
   * @returns {Promise<void>}
   */
  async start() {
    try {
      // Clean up any existing video element from previous session
      if (this.videoElement) {
        console.log('[WebcamCameraSource] Cleaning up existing video element');
        this.videoElement.srcObject = null;
        this.videoElement = null;
      }

      // Clean up any existing stream from previous session
      if (this.stream) {
        console.log('[WebcamCameraSource] Cleaning up existing stream');
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
      }

      this.stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      // Create fresh video element
      this.videoElement = document.createElement('video');
      this.videoElement.autoplay = true;
      this.videoElement.playsInline = true;
      this.videoElement.muted = true;
      this.videoElement.srcObject = this.stream;

      // Wait for video to be ready
      await new Promise((resolve, reject) => {
        const playVideo = async () => {
          try {
            await this.videoElement.play();
            this._isActive = true;
            resolve();
          } catch (error) {
            reject(error);
          }
        };

        if (this.videoElement.readyState >= 2) {
          playVideo();
        } else {
          this.videoElement.addEventListener('loadedmetadata', playVideo, { once: true });
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
   * Stop the webcam stream
   * @returns {Promise<void>}
   */
  async stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    if (this.videoElement) {
      this.videoElement.srcObject = null;
      this.videoElement = null;
    }

    this._isActive = false;
  }

  /**
   * Capture a single frame from the webcam
   * @returns {Promise<Blob>} JPEG image blob
   */
  async captureFrame() {
    if (!this.videoElement || !this._isActive) {
      throw new Error('Webcam is not active');
    }

    // Check if video has loaded and is playing
    if (this.videoElement.readyState < 2) {
      throw new Error('Video not ready');
    }

    if (this.videoElement.paused) {
      await this.videoElement.play();
    }

    const canvas = document.createElement('canvas');
    const size = 224;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Draw the video frame to canvas
    ctx.drawImage(this.videoElement, 0, 0, size, size);

    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      }, 'image/jpeg', 0.8);
    });
  }

  /**
   * Get the preview element (video element)
   * @returns {HTMLVideoElement}
   */
  getPreviewElement() {
    return this.videoElement;
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
}

export default WebcamCameraSource;
