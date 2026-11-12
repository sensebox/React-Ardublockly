import { useState, useCallback, useRef, useEffect } from "react";
import SerialCameraService from "../SerialCameraService";
import WebcamCameraSource from "../WebcamCameraSource";
import SerialCameraSource from "../SerialCameraSource";
import { ErrorTypes } from "../../SerialErrorHandler";

// Share a single SerialCameraService across all hook instances to avoid
// Web Serial streams being locked by multiple readers/writers.
let sharedSerialService = null;
let sharedServiceUsers = 0;

/**
 * useCameraSource - React hook for managing camera sources
 *
 * Provides unified interface for selecting and controlling webcam or serial camera sources.
 * Handles source switching, lifecycle management, and error handling.
 *
 * @returns {Object} Camera source management interface
 */
function useCameraSource() {
  const [sourceType, setSourceType] = useState("webcam"); // 'webcam' | 'serial'
  const [cameraSource, setCameraSource] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);

  // Keep an immediate reference to the current source to avoid state lag
  const cameraSourceRef = useRef(null);

  // Use ref to maintain singleton SerialCameraService instance
  const serialServiceRef = useRef(null);

  // Running releaseSerialPort() call, if any.
  const releasePromiseRef = useRef(null);

  // Initialize serial service once on mount
  useEffect(() => {
    // Acquire shared service and track usage to prevent multiple readers
    if (!sharedSerialService) {
      sharedSerialService = new SerialCameraService();
    }

    sharedServiceUsers += 1;
    serialServiceRef.current = sharedSerialService;

    // Cleanup on unmount
    return () => {
      sharedServiceUsers = Math.max(0, sharedServiceUsers - 1);

      // Only disconnect when no other hook instance is using the service
      if (sharedServiceUsers === 0 && serialServiceRef.current) {
        if (serialServiceRef.current.isConnected) {
          serialServiceRef.current.disconnect().catch((err) => {
            console.error(
              "Error disconnecting serial service on unmount:",
              err,
            );
          });
        }

        serialServiceRef.current = null;
        sharedSerialService = null;
      }
    };
  }, []);

  const createSource = useCallback((type) => {
    if (type === "webcam") {
      return new WebcamCameraSource();
    }

    if (type === "serial") {
      if (!serialServiceRef.current) {
        throw new Error("Serial service not initialized");
      }
      return new SerialCameraSource(serialServiceRef.current);
    }

    throw new Error(`Invalid source type: ${type}`);
  }, []);

  const attachErrorHandler = useCallback((source) => {
    if (!source) return;
    source.onError((err) => {
      setError(err);

      // Keep stream alive for transient frame/decoding issues
      const nonFatalTypes = [
        ErrorTypes.FRAME_TIMEOUT,
        ErrorTypes.FRAME_CORRUPTED,
        ErrorTypes.INVALID_FORMAT,
        ErrorTypes.DECODING_ERROR,
        // Handled by the caller (releases the port and shows the error).
        ErrorTypes.CAPTURE_FAILED,
      ];

      const isCritical = !err?.type || !nonFatalTypes.includes(err.type);
      if (isCritical) {
        setIsActive(false);
      }
    });
  }, []);

  /**
   * Select a camera source type
   * Stops the current source if active before switching
   *
   * @param {string} type - Source type: 'webcam' or 'serial'
   */
  const selectSource = useCallback(
    async (type) => {
      if (type !== "webcam" && type !== "serial") {
        setError(new Error(`Invalid source type: ${type}`));
        return;
      }

      try {
        // Stop current source if active
        if (cameraSource && isActive) {
          await cameraSource.stop();
          setIsActive(false);
        }

        // Create new source based on type
        const newSource = createSource(type);

        // Register error callback for the new source
        attachErrorHandler(newSource);

        cameraSourceRef.current = newSource;
        setCameraSource(newSource);
        setSourceType(type);
        setError(null);
      } catch (err) {
        setError(err);
        console.error("Error selecting camera source:", err);
      }
    },
    [cameraSource, isActive, attachErrorHandler, createSource],
  );

  /**
   * Start the selected camera source
   *
   * @returns {Promise<void>}
   * @throws {Error} If no source is selected or start fails
   */
  const startCamera = useCallback(
    async (options) => {
      // Lazily create the current source if none exists
      let source = cameraSourceRef.current || cameraSource;
      // After a remount (e.g. Fast Refresh) the shared serial service is
      // recreated while the source still points to the old one. Frames would
      // then reach the preview but not waitForSerialFrame – recreate it.
      if (
        source instanceof SerialCameraSource &&
        source.serialService !== serialServiceRef.current
      ) {
        source = null;
      }
      if (!source) {
        try {
          source = createSource(sourceType);
          attachErrorHandler(source);
          cameraSourceRef.current = source;
          setCameraSource(source);
        } catch (err) {
          setError(err);
          throw err;
        }
      }

      try {
        setError(null);
        await source.start(options);
        setIsActive(true);
      } catch (err) {
        console.error("[useCameraSource] Error starting camera:", err);
        setError(err);
        setIsActive(false);
        throw err;
      }
    },
    [cameraSource, sourceType, createSource, attachErrorHandler, isActive],
  );

  /**
   * Stop the current camera source
   *
   * @returns {Promise<void>}
   */
  const stopCamera = useCallback(async () => {
    if (!cameraSource) {
      return;
    }

    try {
      const source = cameraSourceRef.current || cameraSource;
      await source.stop();
      setIsActive(false);
      setError(null);
    } catch (err) {
      setError(err);
      console.error("Error stopping camera:", err);
    }
  }, [cameraSource]);

  /**
   * Capture a single frame from the current camera source
   *
   * @returns {Promise<string>} Data URL of the captured image
   * @throws {Error} If no source is active or capture fails
   */
  const captureFrame = useCallback(async () => {
    if (!cameraSource) {
      throw new Error("No camera source selected");
    }

    if (!isActive) {
      throw new Error("Camera is not active");
    }

    try {
      const source = cameraSourceRef.current || cameraSource;
      const dataUrl = await source.captureFrame();
      return dataUrl;
    } catch (err) {
      setError(err);
      throw err;
    }
  }, [cameraSource, isActive]);

  /**
   * Get the preview element for the current camera source
   *
   * @returns {HTMLVideoElement|HTMLImageElement|null} Preview element or null if no source
   */
  const getPreviewElement = useCallback(() => {
    const source = cameraSourceRef.current || cameraSource;
    if (!source) {
      return null;
    }

    return source.getPreviewElement();
  }, [cameraSource]);

  /**
   * Switch between front and back camera (webcam source only)
   * Only works when using webcam source type
   *
   * @returns {Promise<void>}
   */
  const switchCamera = useCallback(async () => {
    if (sourceType !== "webcam") {
      console.warn("Camera switching is only supported for webcam source");
      return;
    }

    const source = cameraSourceRef.current || cameraSource;
    if (!source || !isActive) {
      console.warn("No active webcam source to switch");
      return;
    }

    try {
      await source.switchCamera();
    } catch (err) {
      setError(err);
      console.error("Error switching camera:", err);
    }
  }, [cameraSource, sourceType, isActive]);

  /**
   * Get current camera facing mode (webcam source only)
   *
   * @returns {string|null} 'user' or 'environment', or null if not webcam
   */
  const getFacingMode = useCallback(() => {
    if (sourceType !== "webcam") {
      return null;
    }

    const source = cameraSourceRef.current || cameraSource;
    if (!source || !source.getFacingMode) {
      return null;
    }

    return source.getFacingMode();
  }, [cameraSource, sourceType]);

  const pauseFrameTimeoutMonitor = useCallback(() => {
    if (sourceType === "serial" && serialServiceRef.current) {
      serialServiceRef.current.pauseFrameTimeoutMonitor();
    }
  }, [sourceType]);

  const resumeFrameTimeoutMonitor = useCallback(() => {
    if (sourceType === "serial" && serialServiceRef.current) {
      serialServiceRef.current.resumeFrameTimeoutMonitor();
    }
  }, [sourceType]);

  /**
   * Wait until the serial camera delivers its first frame. The frame timeout
   * monitor is paused meanwhile, so a missing image does not surface as a
   * connection error (the caller decides what to do, e.g. flash the sketch).
   *
   * @param {number} timeoutMs
   * @returns {Promise<"frame"|"captureFailed"|"timeout">} "frame" if a frame
   *   arrived in time, "captureFailed" if the sketch reports that the camera
   *   can't capture images, otherwise "timeout".
   */
  const waitForSerialFrame = useCallback(async (timeoutMs = 4000) => {
    const service = serialServiceRef.current;
    if (!service) return "timeout";

    service.pauseFrameTimeoutMonitor();
    const result = await new Promise((resolve) => {
      let timer = null;
      const finish = (value) => {
        clearTimeout(timer);
        service.offFrame(handleFrame);
        service.offError(handleError);
        resolve(value);
      };
      const handleFrame = () => finish("frame");
      const handleError = (err) => {
        if (err?.type === ErrorTypes.CAPTURE_FAILED) finish("captureFailed");
      };
      timer = setTimeout(() => finish("timeout"), timeoutMs);
      service.onFrame(handleFrame);
      service.onError(handleError);
    });
    if (result === "frame") service.resumeFrameTimeoutMonitor();
    return result;
  }, []);

  /**
   * Stop the serial camera and release its port so another tool (the flash
   * tool) can open it.
   *
   * @returns {Promise<SerialPort|null>} The port the camera was using
   */
  const releaseSerialPort = useCallback(() => {
    // Concurrent callers share one release instead of closing the port twice.
    if (releasePromiseRef.current) return releasePromiseRef.current;

    const release = (async () => {
      const service = serialServiceRef.current;
      const port = service?.port ?? null;
      const source = cameraSourceRef.current;
      try {
        if (source) await source.stop();
      } catch (err) {
        console.error("Error releasing serial port:", err);
      }
      service?.resumeFrameTimeoutMonitor();
      setIsActive(false);
      setError(null);
      return port;
    })();
    releasePromiseRef.current = release;
    release.finally(() => {
      releasePromiseRef.current = null;
    });
    return release;
  }, []);

  return {
    sourceType,
    selectSource,
    startCamera,
    stopCamera,
    waitForSerialFrame,
    releaseSerialPort,
    captureFrame,
    getPreviewElement,
    switchCamera,
    getFacingMode,
    isActive,
    error,
    pauseFrameTimeoutMonitor,
    resumeFrameTimeoutMonitor,
  };
}

export default useCameraSource;
