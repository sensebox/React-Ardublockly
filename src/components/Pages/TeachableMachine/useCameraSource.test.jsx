import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import useCameraSource from './useCameraSource';
import SerialCameraService from './SerialCameraService';
import WebcamCameraSource from './WebcamCameraSource';
import SerialCameraSource from './SerialCameraSource';

// Mock the camera source classes
vi.mock('./SerialCameraService');
vi.mock('./WebcamCameraSource');
vi.mock('./SerialCameraSource');

// Test wrapper component to use the hook
function TestWrapper({ onHookValue }) {
  const hookValue = useCameraSource();
  React.useEffect(() => {
    onHookValue(hookValue);
  }, [hookValue, onHookValue]);
  return null;
}

describe('useCameraSource', () => {
  let hookValue;
  let setHookValue;
  
  const renderHook = () => {
    hookValue = null;
    setHookValue = vi.fn((value) => { hookValue = value; });
    render(<TestWrapper onHookValue={setHookValue} />);
    // Wait for initial render
    return new Promise(resolve => setTimeout(() => resolve({ result: { current: hookValue } }), 0));
  };

  beforeEach(() => {
    vi.clearAllMocks();
    hookValue = null;
    
    // Setup default mock implementations
    SerialCameraService.mockImplementation(function() {
      this.isConnected = false;
      this.disconnect = vi.fn().mockResolvedValue(undefined);
    });

    WebcamCameraSource.mockImplementation(function() {
      this.start = vi.fn().mockResolvedValue(undefined);
      this.stop = vi.fn().mockResolvedValue(undefined);
      this.captureFrame = vi.fn().mockResolvedValue(new Blob(['test'], { type: 'image/jpeg' }));
      this.getPreviewElement = vi.fn().mockReturnValue(document.createElement('video'));
      this.isActive = vi.fn().mockReturnValue(true);
      this.onError = vi.fn();
    });

    SerialCameraSource.mockImplementation(function() {
      this.start = vi.fn().mockResolvedValue(undefined);
      this.stop = vi.fn().mockResolvedValue(undefined);
      this.captureFrame = vi.fn().mockResolvedValue(new Blob(['test'], { type: 'image/jpeg' }));
      this.getPreviewElement = vi.fn().mockReturnValue(document.createElement('img'));
      this.isActive = vi.fn().mockReturnValue(true);
      this.onError = vi.fn();
    });
  });

  it('should initialize with webcam as default source type', async () => {
    await renderHook();
    
    expect(hookValue.sourceType).toBe('webcam');
    expect(hookValue.isActive).toBe(false);
    expect(hookValue.error).toBe(null);
  });

  it('should select webcam source', async () => {
    await renderHook();
    
    await act(async () => {
      await hookValue.selectSource('webcam');
    });
    
    await waitFor(() => {
      expect(hookValue.sourceType).toBe('webcam');
    });
    expect(WebcamCameraSource).toHaveBeenCalled();
  });

  it('should select serial source', async () => {
    await renderHook();
    
    await act(async () => {
      await hookValue.selectSource('serial');
    });
    
    await waitFor(() => {
      expect(hookValue.sourceType).toBe('serial');
    });
    expect(SerialCameraSource).toHaveBeenCalled();
  });

  it('should reject invalid source type', async () => {
    await renderHook();
    
    await act(async () => {
      await hookValue.selectSource('invalid');
    });
    
    await waitFor(() => {
      expect(hookValue.error).toBeTruthy();
    });
    expect(hookValue.error.message).toContain('Invalid source type');
  });

  it('should start camera after source selection', async () => {
    await renderHook();
    
    await act(async () => {
      await hookValue.selectSource('webcam');
    });
    
    await waitFor(() => {
      expect(hookValue.sourceType).toBe('webcam');
    });
    
    const mockSource = WebcamCameraSource.mock.results[0].value;
    
    await act(async () => {
      await hookValue.startCamera();
    });
    
    await waitFor(() => {
      expect(hookValue.isActive).toBe(true);
    });
    expect(mockSource.start).toHaveBeenCalled();
  });

  it('should stop camera', async () => {
    await renderHook();
    
    await act(async () => {
      await hookValue.selectSource('webcam');
    });
    
    await waitFor(() => {
      expect(hookValue.sourceType).toBe('webcam');
    });
    
    await act(async () => {
      await hookValue.startCamera();
    });
    
    await waitFor(() => {
      expect(hookValue.isActive).toBe(true);
    });
    
    const mockSource = WebcamCameraSource.mock.results[0].value;
    
    await act(async () => {
      await hookValue.stopCamera();
    });
    
    await waitFor(() => {
      expect(hookValue.isActive).toBe(false);
    });
    expect(mockSource.stop).toHaveBeenCalled();
  });

  it('should stop current source before switching to new source', async () => {
    await renderHook();
    
    // Start with webcam
    await act(async () => {
      await hookValue.selectSource('webcam');
    });
    
    await waitFor(() => {
      expect(hookValue.sourceType).toBe('webcam');
    });
    
    await act(async () => {
      await hookValue.startCamera();
    });
    
    await waitFor(() => {
      expect(hookValue.isActive).toBe(true);
    });
    
    const webcamSource = WebcamCameraSource.mock.results[0].value;
    
    // Switch to serial
    await act(async () => {
      await hookValue.selectSource('serial');
    });
    
    await waitFor(() => {
      expect(hookValue.sourceType).toBe('serial');
    });
    expect(webcamSource.stop).toHaveBeenCalled();
  });

  it('should capture frame from active camera', async () => {
    await renderHook();
    
    await act(async () => {
      await hookValue.selectSource('webcam');
    });
    
    await waitFor(() => {
      expect(hookValue.sourceType).toBe('webcam');
    });
    
    await act(async () => {
      await hookValue.startCamera();
    });
    
    await waitFor(() => {
      expect(hookValue.isActive).toBe(true);
    });
    
    const mockSource = WebcamCameraSource.mock.results[0].value;
    
    let blob;
    await act(async () => {
      blob = await hookValue.captureFrame();
    });
    
    expect(mockSource.captureFrame).toHaveBeenCalled();
    expect(blob).toBeInstanceOf(Blob);
  });

  it('should throw error when capturing frame without active camera', async () => {
    await renderHook();
    
    await act(async () => {
      await hookValue.selectSource('webcam');
    });
    
    await waitFor(() => {
      expect(hookValue.sourceType).toBe('webcam');
    });
    
    await expect(async () => {
      await act(async () => {
        await hookValue.captureFrame();
      });
    }).rejects.toThrow('Camera is not active');
  });

  it('should get preview element from camera source', async () => {
    await renderHook();
    
    await act(async () => {
      await hookValue.selectSource('webcam');
    });
    
    await waitFor(() => {
      expect(hookValue.sourceType).toBe('webcam');
    });
    
    const previewElement = hookValue.getPreviewElement();
    
    expect(previewElement).toBeTruthy();
    expect(previewElement.tagName).toBe('VIDEO');
  });

  it('should return null preview element when no source selected', async () => {
    await renderHook();
    
    const previewElement = hookValue.getPreviewElement();
    
    expect(previewElement).toBe(null);
  });

  it('should handle camera start error', async () => {
    const startError = new Error('Camera start failed');
    
    WebcamCameraSource.mockImplementation(function() {
      this.start = vi.fn().mockRejectedValue(startError);
      this.stop = vi.fn().mockResolvedValue(undefined);
      this.onError = vi.fn();
    });
    
    await renderHook();
    
    await act(async () => {
      await hookValue.selectSource('webcam');
    });
    
    await waitFor(() => {
      expect(hookValue.sourceType).toBe('webcam');
    });
    
    await expect(async () => {
      await act(async () => {
        await hookValue.startCamera();
      });
    }).rejects.toThrow('Camera start failed');
    
    await waitFor(() => {
      expect(hookValue.isActive).toBe(false);
      expect(hookValue.error).toBe(startError);
    });
  });

  it('should register error callback on source', async () => {
    await renderHook();
    
    await act(async () => {
      await hookValue.selectSource('webcam');
    });
    
    await waitFor(() => {
      expect(hookValue.sourceType).toBe('webcam');
    });
    
    const mockSource = WebcamCameraSource.mock.results[0].value;
    
    expect(mockSource.onError).toHaveBeenCalled();
  });

  it('should handle error from source error callback', async () => {
    let errorCallback;
    
    WebcamCameraSource.mockImplementation(function() {
      this.start = vi.fn().mockResolvedValue(undefined);
      this.stop = vi.fn().mockResolvedValue(undefined);
      this.onError = vi.fn((cb) => { errorCallback = cb; });
    });
    
    await renderHook();
    
    await act(async () => {
      await hookValue.selectSource('webcam');
    });
    
    await waitFor(() => {
      expect(hookValue.sourceType).toBe('webcam');
    });
    
    await act(async () => {
      await hookValue.startCamera();
    });
    
    await waitFor(() => {
      expect(hookValue.isActive).toBe(true);
    });
    
    const testError = new Error('Camera error');
    
    await act(async () => {
      errorCallback(testError);
    });
    
    await waitFor(() => {
      expect(hookValue.error).toBe(testError);
      expect(hookValue.isActive).toBe(false);
    });
  });

  it('should auto-create default webcam source when starting without explicit selection', async () => {
    await renderHook();
    
    // Start camera without calling selectSource first
    await act(async () => {
      await hookValue.startCamera();
    });
    
    await waitFor(() => {
      expect(hookValue.isActive).toBe(true);
      expect(hookValue.sourceType).toBe('webcam');
    });
    
    // Should have created a webcam source
    expect(WebcamCameraSource).toHaveBeenCalled();
  });

  it('should handle stop camera when no source selected', async () => {
    await renderHook();
    
    // Should not throw
    await act(async () => {
      await hookValue.stopCamera();
    });
    
    expect(hookValue.isActive).toBe(false);
  });
});
