import React from "react";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Chip,
  Typography,
  Link,
  Collapse,
  CircularProgress,
} from "@mui/material";
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";

/**
 * SerialCameraErrorHandler
 *
 * Comprehensive error handling and status display component for ESP32 serial camera.
 * Handles different error types with appropriate messages, actions, and visual feedback.
 */

// Error type constants matching SerialCameraService
export const ErrorTypes = {
  CONNECTION_FAILED: "CONNECTION_FAILED",
  PORT_NOT_FOUND: "PORT_NOT_FOUND",
  PERMISSION_DENIED: "PERMISSION_DENIED",
  FRAME_TIMEOUT: "FRAME_TIMEOUT",
  FRAME_CORRUPTED: "FRAME_CORRUPTED",
  DEVICE_DISCONNECTED: "DEVICE_DISCONNECTED",
  UNSUPPORTED_BROWSER: "UNSUPPORTED_BROWSER",
  INVALID_FORMAT: "INVALID_FORMAT",
  DECODING_ERROR: "DECODING_ERROR",
  READ_LOOP_ERROR: "READ_LOOP_ERROR",
};

// Connection status constants
export const ConnectionStatus = {
  DISCONNECTED: "disconnected",
  CONNECTING: "connecting",
  CONNECTED: "connected",
  ERROR: "error",
};

/**
 * Get error details based on error type
 * @param {string} errorType - Error type from ErrorTypes
 * @returns {Object} Error details with severity, title, message, and actions
 */
const getErrorDetails = (errorType) => {
  switch (errorType) {
    case ErrorTypes.UNSUPPORTED_BROWSER:
      return {
        severity: "error",
        title: "Browser Not Supported",
        message:
          "Your browser does not support the Web Serial API required for ESP32 camera connection.",
        details:
          "The Web Serial API is currently supported in Chrome 89+, Edge 89+, and Opera 76+ on desktop platforms.",
        action: "switch-browser",
        icon: <ErrorIcon />,
      };

    case ErrorTypes.PERMISSION_DENIED:
      return {
        severity: "error",
        title: "Permission Denied",
        message:
          "Serial port access was denied. Please grant permission to connect to your ESP32 camera.",
        details:
          "You may need to check your browser settings or try connecting again.",
        action: "retry",
        icon: <CancelIcon />,
      };

    case ErrorTypes.CONNECTION_FAILED:
      return {
        severity: "error",
        title: "Connection Failed",
        message: "Connection to senseBox Eye camera could not be established.",
        details:
          "Please check that your device is properly connected and the correct port is selected. You can download and flash the camera capture firmware to your device.",
        action: "retry-with-download",
        icon: <ErrorIcon />,
      };

    case ErrorTypes.DEVICE_DISCONNECTED:
      return {
        severity: "error",
        title: "Device Disconnected",
        message: "The ESP32 camera was disconnected.",
        details: "Please reconnect your device and try again.",
        action: "reconnect",
        icon: <ErrorIcon />,
      };

    case ErrorTypes.FRAME_TIMEOUT:
      return {
        severity: "warning",
        title: "Frame Timeout",
        message:
          "No frames received from the ESP32 camera within the expected time.",
        details:
          "The device may be busy or experiencing communication issues. The system will continue waiting for frames.",
        action: "none",
        icon: <WarningIcon />,
      };

    case ErrorTypes.FRAME_CORRUPTED:
      return {
        severity: "warning",
        title: "Corrupted Frame",
        message: "Received a corrupted frame from the ESP32 camera.",
        details:
          "This can happen due to transmission errors. The system will continue processing subsequent frames.",
        action: "none",
        icon: <WarningIcon />,
      };

    case ErrorTypes.INVALID_FORMAT:
    case ErrorTypes.DECODING_ERROR:
      return {
        severity: "warning",
        title: "Frame Decoding Error",
        message: "Failed to decode frame data from the ESP32 camera.",
        details:
          "The frame format may be invalid or corrupted. The system will continue processing subsequent frames.",
        action: "none",
        icon: <WarningIcon />,
      };

    case ErrorTypes.READ_LOOP_ERROR:
      return {
        severity: "error",
        title: "Communication Error",
        message: "An error occurred while reading data from the ESP32 camera.",
        details:
          "The connection may have been interrupted. Please try reconnecting.",
        action: "reconnect",
        icon: <ErrorIcon />,
      };

    default:
      return {
        severity: "error",
        title: "Unknown Error",
        message: "An unexpected error occurred with the ESP32 camera.",
        details: errorType || "No additional details available.",
        action: "retry",
        icon: <ErrorIcon />,
      };
  }
};

/**
 * Get connection status display details
 * @param {string} status - Connection status from ConnectionStatus
 * @returns {Object} Status display details
 */
const getStatusDetails = (status) => {
  switch (status) {
    case ConnectionStatus.CONNECTED:
      return {
        color: "success",
        icon: <CheckCircleIcon />,
        label: "Connected",
      };
    case ConnectionStatus.CONNECTING:
      return {
        color: "info",
        icon: <InfoIcon />,
        label: "Connecting...",
      };
    case ConnectionStatus.ERROR:
      return {
        color: "error",
        icon: <ErrorIcon />,
        label: "Error",
      };
    case ConnectionStatus.DISCONNECTED:
    default:
      return {
        color: "default",
        icon: <CancelIcon />,
        label: "Disconnected",
      };
  }
};

/**
 * SerialCameraErrorHandler Component
 */
const SerialCameraErrorHandler = ({
  error,
  connectionStatus = ConnectionStatus.DISCONNECTED,
  onRetry,
  onReconnect,
  onDismiss,
  showStatus = true,
  showDetails = false,
}) => {
  const [detailsExpanded, setDetailsExpanded] = React.useState(showDetails);
  const [isDownloading, setIsDownloading] = React.useState(false);

  // Get error details if error exists
  const errorDetails = error
    ? getErrorDetails(error.type || error.message)
    : null;

  // Get status details
  const statusDetails = getStatusDetails(connectionStatus);

  // Handle download camera capture firmware
  const handleDownloadFirmware = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/compile-camera-capture",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            boardType: "sensebox_eye",
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || "Failed to compile firmware",
        );
      }

      const result = await response.json();

      if (result.success && result.data?.binary) {
        // Decode base64 binary
        const binaryStr = atob(result.data.binary);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }

        // Create download link
        const blob = new Blob([bytes], { type: "application/octet-stream" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "camera_capture.bin";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Failed to download firmware:", err);
      alert(`Failed to download firmware: ${err.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle action button click
  const handleAction = () => {
    if (!errorDetails) return;

    switch (errorDetails.action) {
      case "retry":
      case "retry-with-download":
        if (onRetry) onRetry();
        break;
      case "reconnect":
        if (onReconnect) onReconnect();
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      {/* Connection Status Indicator */}
      {showStatus && (
        <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Serial Camera Status:
          </Typography>
          <Chip
            icon={statusDetails.icon}
            label={statusDetails.label}
            color={statusDetails.color}
            size="small"
            variant="outlined"
          />
        </Box>
      )}

      {/* Error Alert */}
      {error && errorDetails && (
        <Alert
          severity={errorDetails.severity}
          onClose={onDismiss}
          icon={errorDetails.icon}
          sx={{ mb: 2 }}
        >
          <AlertTitle>{errorDetails.title}</AlertTitle>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {errorDetails.message}
          </Typography>

          {/* Error Details (Expandable) */}
          {errorDetails.details && (
            <>
              <Button
                size="small"
                onClick={() => setDetailsExpanded(!detailsExpanded)}
                sx={{ mb: detailsExpanded ? 1 : 0, p: 0, minWidth: "auto" }}
              >
                {detailsExpanded ? "Hide Details" : "Show Details"}
              </Button>
              <Collapse in={detailsExpanded}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {errorDetails.details}
                </Typography>
              </Collapse>
            </>
          )}

          {/* Browser Compatibility Info */}
          {error.type === ErrorTypes.UNSUPPORTED_BROWSER && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                Supported Browsers:
              </Typography>
              <Typography variant="body2" component="ul" sx={{ pl: 2, mb: 1 }}>
                <li>Google Chrome 89 or later</li>
                <li>Microsoft Edge 89 or later</li>
                <li>Opera 76 or later</li>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Note: Web Serial API is not supported on mobile browsers or
                Firefox/Safari.
              </Typography>
            </Box>
          )}

          {/* Permission Instructions */}
          {error.type === ErrorTypes.PERMISSION_DENIED && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                How to grant permission:
              </Typography>
              <Typography variant="body2" component="ol" sx={{ pl: 2 }}>
                <li>Click the lock icon in your browser's address bar</li>
                <li>Find "Serial ports" in the permissions list</li>
                <li>Change the setting to "Allow"</li>
                <li>Refresh the page and try connecting again</li>
              </Typography>
            </Box>
          )}

          {/* Troubleshooting for Connection Errors */}
          {(error.type === ErrorTypes.CONNECTION_FAILED ||
            error.type === ErrorTypes.DEVICE_DISCONNECTED) && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                Troubleshooting:
              </Typography>
              <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                <li>Ensure the senseBox Eye is properly connected via USB</li>
                <li>Check that the correct serial port is selected</li>
                <li>
                  Verify the senseBox Eye is running the firmware to stream
                  camera images. You can download it with the button below.
                </li>
                <li>Try unplugging and reconnecting the device</li>
              </Typography>
            </Box>
          )}

          {/* Action Buttons */}
          {errorDetails.action !== "none" && (
            <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
              {errorDetails.action === "retry-with-download" && (
                <Button
                  size="small"
                  variant="contained"
                  startIcon={
                    isDownloading ? (
                      <CircularProgress size={16} />
                    ) : (
                      <DownloadIcon />
                    )
                  }
                  onClick={handleDownloadFirmware}
                  disabled={isDownloading}
                >
                  {isDownloading ? "Compiling..." : "Download Firmware"}
                </Button>
              )}
              {(errorDetails.action === "retry" ||
                errorDetails.action === "retry-with-download") &&
                onRetry && (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={handleAction}
                  >
                    Try Again
                  </Button>
                )}
              {errorDetails.action === "reconnect" && onReconnect && (
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={handleAction}
                >
                  Reconnect
                </Button>
              )}
              {errorDetails.action === "switch-browser" && (
                <Button
                  size="small"
                  variant="outlined"
                  component={Link}
                  href="https://www.google.com/chrome/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Chrome
                </Button>
              )}
            </Box>
          )}
        </Alert>
      )}

      {/* Timeout Warning (Non-dismissible info) */}
      {connectionStatus === ConnectionStatus.CONNECTED &&
        error?.type === ErrorTypes.FRAME_TIMEOUT && (
          <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2 }}>
            <Typography variant="body2">
              Waiting for frames from ESP32 camera... If this persists, check
              your device connection.
            </Typography>
          </Alert>
        )}
    </Box>
  );
};

export default SerialCameraErrorHandler;
