import React from "react";
import { getImageTranslations } from "./image/translations";
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
import { downloadCameraFirmware } from "./utils/firmwareDownload";

/**
 * SerialErrorHandler
 *
 * Comprehensive error handling and status display component for senseBox Eye serial camera.
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
  CONNECTION_RESTORED: "CONNECTION_RESTORED",
  RECONNECTING: "RECONNECTING",
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
  const t = getImageTranslations();

  switch (errorType) {
    case ErrorTypes.UNSUPPORTED_BROWSER:
      return {
        severity: "error",
        title: t.errors.browserNotSupported,
        message: t.errors.browserNotSupportedMessage,
        details: t.errors.browserNotSupportedDetails,
        action: "switch-browser",
        icon: <ErrorIcon />,
      };

    case ErrorTypes.PERMISSION_DENIED:
      return {
        severity: "error",
        title: t.errors.permissionDenied,
        message: t.errors.permissionDeniedMessage,
        details: t.errors.permissionDeniedDetails,
        action: "retry",
        icon: <CancelIcon />,
      };

    case ErrorTypes.CONNECTION_FAILED:
      return {
        severity: "error",
        title: t.errors.connectionFailed,
        message: t.errors.connectionFailedMessage,
        details: t.errors.connectionFailedDetails,
        action: "retry-with-download",
        icon: <ErrorIcon />,
      };

    case ErrorTypes.DEVICE_DISCONNECTED:
      return {
        severity: "error",
        title: t.errors.deviceDisconnected,
        message: t.errors.deviceDisconnectedMessage,
        details: t.errors.deviceDisconnectedDetails,
        action: "reconnect",
        icon: <ErrorIcon />,
      };

    case ErrorTypes.FRAME_TIMEOUT:
      return {
        severity: "warning",
        title: t.errors.frameTimeout,
        message: t.errors.frameTimeoutMessage,
        details: t.errors.frameTimeoutDetails,
        action: "none",
        icon: <WarningIcon />,
      };

    case ErrorTypes.FRAME_CORRUPTED:
      return {
        severity: "warning",
        title: t.errors.frameCorrupted,
        message: t.errors.frameCorruptedMessage,
        details: t.errors.frameCorruptedDetails,
        action: "none",
        icon: <WarningIcon />,
      };

    case ErrorTypes.INVALID_FORMAT:
    case ErrorTypes.DECODING_ERROR:
      return {
        severity: "warning",
        title: t.errors.frameDecodingError,
        message: t.errors.frameDecodingErrorMessage,
        details: t.errors.frameDecodingErrorDetails,
        action: "none",
        icon: <WarningIcon />,
      };

    case ErrorTypes.READ_LOOP_ERROR:
      return {
        severity: "error",
        title: t.errors.communicationError,
        message: t.errors.communicationErrorMessage,
        details: t.errors.communicationErrorDetails,
        action: "reconnect",
        icon: <ErrorIcon />,
      };

    case ErrorTypes.CONNECTION_RESTORED:
      // This type should not show an error, but can be used to clear previous errors
      return null;

    case ErrorTypes.RECONNECTING:
      return {
        severity: "info",
        title: t.errors.reconnecting,
        message: t.errors.reconnectingMessage,
        details: t.errors.reconnectingDetails,
        action: "retry",
        icon: <InfoIcon />,
      };

    default:
      return {
        severity: "error",
        title: t.errors.unknownError,
        message: t.errors.unknownErrorMessage,
        details: errorType || t.errors.unknownErrorDetails,
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
  const t = getImageTranslations();

  switch (status) {
    case ConnectionStatus.CONNECTED:
      return {
        color: "success",
        icon: <CheckCircleIcon />,
        label: t.errors.connected,
      };
    case ConnectionStatus.CONNECTING:
      return {
        color: "info",
        icon: <InfoIcon />,
        label: t.errors.connecting,
      };
    case ConnectionStatus.ERROR:
      return {
        color: "error",
        icon: <ErrorIcon />,
        label: t.errors.error,
      };
    case ConnectionStatus.DISCONNECTED:
    default:
      return {
        color: "default",
        icon: <CancelIcon />,
        label: t.errors.disconnected,
      };
  }
};

/**
 * SerialErrorHandler Component
 *
 * @param {Object}   error              - Error object with `.type` and `.message`
 * @param {string}   connectionStatus   - One of ConnectionStatus values
 * @param {Function} onRetry            - Called on "Try Again"
 * @param {Function} onReconnect        - Called on "Reconnect"
 * @param {Function} onDismiss          - Called when the alert is closed
 * @param {boolean}  showStatus         - Whether to show the status chip above the alert
 * @param {boolean}  showDetails        - Whether the detail panel starts expanded
 * @param {Object}   overrides          - Optional text / behaviour overrides
 *   @param {string}   overrides.errorTitle             - Replaces the alert title
 *   @param {string}   overrides.errorMessage           - Replaces the alert body message
 *   @param {string}   overrides.troubleshootingFirmware - Replaces the firmware troubleshooting bullet
 *   @param {string}   overrides.downloadFirmwareLabel   - Replaces the download-button label
 *   @param {Function} overrides.downloadFirmwareFn      - Replaces the download function
 */
const SerialErrorHandler = ({
  error,
  connectionStatus = ConnectionStatus.DISCONNECTED,
  onRetry,
  onReconnect,
  onDismiss,
  showStatus = true,
  showDetails = false,
  overrides = {},
}) => {
  const [detailsExpanded, setDetailsExpanded] = React.useState(showDetails);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const t = getImageTranslations();

  const errorDetails = error
    ? getErrorDetails(error.type || error.message)
    : null;
  const statusDetails = getStatusDetails(connectionStatus);

  const handleDownloadFirmware = async () => {
    setIsDownloading(true);
    const fn = overrides.downloadFirmwareFn || downloadCameraFirmware;
    const result = await fn();
    if (!result.success) {
      alert(`Failed to download firmware: ${result.error}`);
    }
    setIsDownloading(false);
  };

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
            {t.errors.serialCameraStatus}
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
          <AlertTitle>{overrides.errorTitle || errorDetails.title}</AlertTitle>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {overrides.errorMessage || errorDetails.message}
          </Typography>

          {/* Error Details (Expandable) - shows actual error message */}
          {error.message && (
            <>
              <Button
                size="small"
                onClick={() => setDetailsExpanded(!detailsExpanded)}
                sx={{ mb: detailsExpanded ? 1 : 0, p: 0, minWidth: "auto" }}
              >
                {detailsExpanded ? t.errors.hideDetails : t.errors.showDetails}
              </Button>
              <Collapse in={detailsExpanded}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, fontFamily: "monospace", fontSize: "0.85rem" }}
                >
                  {error.message}
                </Typography>
              </Collapse>
            </>
          )}

          {/* Browser Compatibility Info */}
          {error.type === ErrorTypes.UNSUPPORTED_BROWSER && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                {t.errors.supportedBrowsers}
              </Typography>
              <Typography variant="body2" component="ul" sx={{ pl: 2, mb: 1 }}>
                <li>Google Chrome 89+</li>
                <li>Microsoft Edge 89+</li>
                <li>Opera 76+</li>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t.errors.supportedBrowsersNote}
              </Typography>
            </Box>
          )}

          {/* Permission Instructions */}
          {error.type === ErrorTypes.PERMISSION_DENIED && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                {t.errors.howToGrantPermission}
              </Typography>
              <Typography variant="body2" component="ol" sx={{ pl: 2 }}>
                <li>{t.errors.permissionStep1}</li>
                <li>{t.errors.permissionStep2}</li>
                <li>{t.errors.permissionStep3}</li>
                <li>{t.errors.permissionStep4}</li>
              </Typography>
            </Box>
          )}

          {/* Troubleshooting for Connection Errors */}
          {(error.type === ErrorTypes.CONNECTION_FAILED ||
            error.type === ErrorTypes.DEVICE_DISCONNECTED) && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                {t.errors.troubleshooting}
              </Typography>
              <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                <li>{t.errors.troubleshootingUsb}</li>
                <li>{t.errors.troubleshootingPort}</li>
                <li>
                  {overrides.troubleshootingFirmware ||
                    t.errors.troubleshootingFirmware}
                </li>
                <li>{t.errors.troubleshootingReconnect}</li>
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
                  {isDownloading
                    ? t.errors.compilingFirmware
                    : overrides.downloadFirmwareLabel ||
                      t.errors.downloadFirmware}
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
                    {t.errors.tryAgain}
                  </Button>
                )}
              {errorDetails.action === "reconnect" && onReconnect && (
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={handleAction}
                >
                  {t.errors.reconnect}
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
            <Typography variant="body2">{t.errors.waitingForFrames}</Typography>
          </Alert>
        )}
    </Box>
  );
};

export default SerialErrorHandler;
