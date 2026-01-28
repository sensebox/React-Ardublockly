import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import SerialCameraErrorHandler, { ErrorTypes, ConnectionStatus } from './SerialCameraErrorHandler';

describe('SerialCameraErrorHandler', () => {
  describe('Connection Status Display', () => {
    it('should display disconnected status', () => {
      render(
        <SerialCameraErrorHandler
          connectionStatus={ConnectionStatus.DISCONNECTED}
          showStatus={true}
        />
      );
      
      expect(screen.getByText('Disconnected')).toBeInTheDocument();
    });

    it('should display connected status', () => {
      render(
        <SerialCameraErrorHandler
          connectionStatus={ConnectionStatus.CONNECTED}
          showStatus={true}
        />
      );
      
      expect(screen.getByText('Connected')).toBeInTheDocument();
    });

    it('should display connecting status', () => {
      render(
        <SerialCameraErrorHandler
          connectionStatus={ConnectionStatus.CONNECTING}
          showStatus={true}
        />
      );
      
      expect(screen.getByText('Connecting...')).toBeInTheDocument();
    });

    it('should display error status', () => {
      render(
        <SerialCameraErrorHandler
          connectionStatus={ConnectionStatus.ERROR}
          showStatus={true}
        />
      );
      
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('should hide status when showStatus is false', () => {
      render(
        <SerialCameraErrorHandler
          connectionStatus={ConnectionStatus.CONNECTED}
          showStatus={false}
        />
      );
      
      expect(screen.queryByText('Serial Camera Status:')).not.toBeInTheDocument();
    });
  });

  describe('Browser Compatibility Error', () => {
    it('should display unsupported browser error', () => {
      const error = {
        type: ErrorTypes.UNSUPPORTED_BROWSER,
        message: 'Web Serial API is not supported'
      };

      render(
        <SerialCameraErrorHandler
          error={error}
          connectionStatus={ConnectionStatus.ERROR}
        />
      );
      
      expect(screen.getByText('Browser Not Supported')).toBeInTheDocument();
      expect(screen.getByText(/does not support the Web Serial API/)).toBeInTheDocument();
    });

    it('should show supported browsers list', () => {
      const error = {
        type: ErrorTypes.UNSUPPORTED_BROWSER,
        message: 'Web Serial API is not supported'
      };

      render(
        <SerialCameraErrorHandler
          error={error}
          connectionStatus={ConnectionStatus.ERROR}
        />
      );
      
      fireEvent.click(screen.getByText('Show Details'));
      
      expect(screen.getByText('Supported Browsers:')).toBeInTheDocument();
      expect(screen.getByText(/Google Chrome 89 or later/)).toBeInTheDocument();
    });
  });

  describe('Permission Denied Error', () => {
    it('should display permission denied error', () => {
      const error = {
        type: ErrorTypes.PERMISSION_DENIED,
        message: 'Serial port access was denied'
      };

      render(
        <SerialCameraErrorHandler
          error={error}
          connectionStatus={ConnectionStatus.ERROR}
        />
      );
      
      expect(screen.getByText('Permission Denied')).toBeInTheDocument();
      expect(screen.getByText(/Please grant permission to connect/)).toBeInTheDocument();
    });

    it('should show permission instructions', () => {
      const error = {
        type: ErrorTypes.PERMISSION_DENIED,
        message: 'Serial port access was denied'
      };

      render(
        <SerialCameraErrorHandler
          error={error}
          connectionStatus={ConnectionStatus.ERROR}
        />
      );
      
      fireEvent.click(screen.getByText('Show Details'));
      
      expect(screen.getByText('How to grant permission:')).toBeInTheDocument();
    });

    it('should show retry button for permission denied', () => {
      const error = {
        type: ErrorTypes.PERMISSION_DENIED,
        message: 'Serial port access was denied'
      };
      const onRetry = vi.fn();

      render(
        <SerialCameraErrorHandler
          error={error}
          connectionStatus={ConnectionStatus.ERROR}
          onRetry={onRetry}
        />
      );
      
      const retryButton = screen.getByText('Try Again');
      fireEvent.click(retryButton);
      
      expect(onRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('Connection Failed Error', () => {
    it('should display connection failed error', () => {
      const error = {
        type: ErrorTypes.CONNECTION_FAILED,
        message: 'Failed to connect'
      };

      render(
        <SerialCameraErrorHandler
          error={error}
          connectionStatus={ConnectionStatus.ERROR}
        />
      );
      
      expect(screen.getByText('Connection Failed')).toBeInTheDocument();
    });

    it('should show troubleshooting steps', () => {
      const error = {
        type: ErrorTypes.CONNECTION_FAILED,
        message: 'Failed to connect'
      };

      render(
        <SerialCameraErrorHandler
          error={error}
          connectionStatus={ConnectionStatus.ERROR}
        />
      );
      
      fireEvent.click(screen.getByText('Show Details'));
      
      expect(screen.getByText('Troubleshooting:')).toBeInTheDocument();
      expect(screen.getByText(/ESP32 is properly connected/)).toBeInTheDocument();
    });
  });

  describe('Device Disconnected Error', () => {
    it('should display device disconnected error', () => {
      const error = {
        type: ErrorTypes.DEVICE_DISCONNECTED,
        message: 'Device was disconnected'
      };

      render(
        <SerialCameraErrorHandler
          error={error}
          connectionStatus={ConnectionStatus.ERROR}
        />
      );
      
      expect(screen.getByText('Device Disconnected')).toBeInTheDocument();
    });

    it('should show reconnect button', () => {
      const error = {
        type: ErrorTypes.DEVICE_DISCONNECTED,
        message: 'Device was disconnected'
      };
      const onReconnect = vi.fn();

      render(
        <SerialCameraErrorHandler
          error={error}
          connectionStatus={ConnectionStatus.ERROR}
          onReconnect={onReconnect}
        />
      );
      
      const reconnectButton = screen.getByText('Reconnect');
      fireEvent.click(reconnectButton);
      
      expect(onReconnect).toHaveBeenCalledTimes(1);
    });
  });

  describe('Frame Timeout Warning', () => {
    it('should display frame timeout warning', () => {
      const error = {
        type: ErrorTypes.FRAME_TIMEOUT,
        message: 'No frames received'
      };

      render(
        <SerialCameraErrorHandler
          error={error}
          connectionStatus={ConnectionStatus.CONNECTED}
        />
      );
      
      expect(screen.getByText('Frame Timeout')).toBeInTheDocument();
    });

    it('should show info message for timeout while connected', () => {
      const error = {
        type: ErrorTypes.FRAME_TIMEOUT,
        message: 'No frames received'
      };

      render(
        <SerialCameraErrorHandler
          error={error}
          connectionStatus={ConnectionStatus.CONNECTED}
        />
      );
      
      expect(screen.getByText(/Waiting for frames from ESP32 camera/)).toBeInTheDocument();
    });
  });

  describe('Frame Corrupted Warning', () => {
    it('should display frame corrupted warning', () => {
      const error = {
        type: ErrorTypes.FRAME_CORRUPTED,
        message: 'Frame checksum mismatch'
      };

      render(
        <SerialCameraErrorHandler
          error={error}
          connectionStatus={ConnectionStatus.CONNECTED}
        />
      );
      
      expect(screen.getByText('Corrupted Frame')).toBeInTheDocument();
    });
  });

  describe('Decoding Error', () => {
    it('should display decoding error', () => {
      const error = {
        type: ErrorTypes.DECODING_ERROR,
        message: 'Failed to decode frame'
      };

      render(
        <SerialCameraErrorHandler
          error={error}
          connectionStatus={ConnectionStatus.CONNECTED}
        />
      );
      
      expect(screen.getByText('Frame Decoding Error')).toBeInTheDocument();
    });
  });

  describe('Error Dismissal', () => {
    it('should call onDismiss when close button is clicked', () => {
      const error = {
        type: ErrorTypes.CONNECTION_FAILED,
        message: 'Failed to connect'
      };
      const onDismiss = vi.fn();

      render(
        <SerialCameraErrorHandler
          error={error}
          connectionStatus={ConnectionStatus.ERROR}
          onDismiss={onDismiss}
        />
      );
      
      const closeButton = screen.getByLabelText('Close');
      fireEvent.click(closeButton);
      
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('Details Expansion', () => {
    it('should expand and collapse error details', () => {
      const error = {
        type: ErrorTypes.CONNECTION_FAILED,
        message: 'Failed to connect'
      };

      render(
        <SerialCameraErrorHandler
          error={error}
          connectionStatus={ConnectionStatus.ERROR}
        />
      );
      
      // Initially should show "Show Details" button
      expect(screen.getByText('Show Details')).toBeInTheDocument();
      
      // Expand
      fireEvent.click(screen.getByText('Show Details'));
      
      // After expanding, should show "Hide Details" button
      expect(screen.getByText('Hide Details')).toBeInTheDocument();
      
      // Collapse
      fireEvent.click(screen.getByText('Hide Details'));
      
      // After collapsing, should show "Show Details" button again
      expect(screen.getByText('Show Details')).toBeInTheDocument();
    });
  });
});
