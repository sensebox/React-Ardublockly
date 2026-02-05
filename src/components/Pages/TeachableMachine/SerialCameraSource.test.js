import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import SerialCameraSource from './SerialCameraSource';

describe('SerialCameraSource', () => {
  let serialCameraSource;
  let mockSerialService;
  let mockImageElement;

  beforeEach(() => {
    // Mock SerialCameraService
    mockSerialService = {
      isConnected: false,
      port: null,
      requestPort: vi.fn().mockResolvedValue({ /* mock port */ }),
      connect: vi.fn().mockResolvedValue(undefined),
      disconnect: vi.fn().mockResolvedValue(undefined),
      startFrameStream: vi.fn().mockResolvedValue(123), // Return interval ID
      stopFrameStream: vi.fn(),
      onFrame: vi.fn(),
      offFrame: vi.fn(),
      onError: vi.fn(),
      offError: vi.fn()
    };

    // Mock image element
    mockImageElement = {
      src: '',
      style: {},
      dataset: {}
    };

    // Mock document.createElement for image
    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'img') {
        return mockImageElement;
      }
      return {};
    });

    // Mock URL.createObjectURL and revokeObjectURL
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();

    serialCameraSource = new SerialCameraSource(mockSerialService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('start()', () => {
    it('should connect to serial port and start frame stream', async () => {
      await serialCameraSource.start();

      expect(mockSerialService.requestPort).toHaveBeenCalled();
      expect(mockSerialService.connect).toHaveBeenCalled();
      expect(mockSerialService.startFrameStream).toHaveBeenCalledWith(200);
      expect(serialCameraSource.isActive()).toBe(true);
    });

    it('should not reconnect if already connected', async () => {
      mockSerialService.isConnected = true;

      await serialCameraSource.start();

      expect(mockSerialService.requestPort).not.toHaveBeenCalled();
      expect(mockSerialService.connect).not.toHaveBeenCalled();
      expect(mockSerialService.startFrameStream).toHaveBeenCalled();
    });

    it('should create image element for preview', async () => {
      await serialCameraSource.start();

      expect(serialCameraSource.getPreviewElement()).toBe(mockImageElement);
      expect(mockImageElement.style.width).toBe('320px');
      expect(mockImageElement.style.height).toBe('240px');
    });

    it('should register frame callback', async () => {
      await serialCameraSource.start();

      expect(mockSerialService.onFrame).toHaveBeenCalled();
      expect(typeof serialCameraSource.frameCallback).toBe('function');
    });

    it('should register error callback', async () => {
      await serialCameraSource.start();

      expect(mockSerialService.onError).toHaveBeenCalled();
    });

    it('should handle connection errors', async () => {
      const error = new Error('Connection failed');
      mockSerialService.connect.mockRejectedValue(error);

      const errorCallback = vi.fn();
      serialCameraSource.onError(errorCallback);

      await expect(serialCameraSource.start()).rejects.toThrow('Connection failed');
      expect(serialCameraSource.isActive()).toBe(false);
      expect(errorCallback).toHaveBeenCalledWith(error);
    });

    it('should update preview when frame is received', async () => {
      await serialCameraSource.start();

      // Simulate frame callback
      const frameData = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]); // JPEG header
      const frame = { data: frameData, timestamp: Date.now() };
      
      serialCameraSource.frameCallback(frame);

      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(mockImageElement.src).toBe('blob:mock-url');
      expect(serialCameraSource.latestFrame).toBe(frameData);
    });
  });

  describe('stop()', () => {
    it('should stop frame stream and clean up', async () => {
      await serialCameraSource.start();
      await serialCameraSource.stop();

      expect(mockSerialService.stopFrameStream).toHaveBeenCalledWith(123);
      expect(serialCameraSource.isActive()).toBe(false);
      expect(serialCameraSource.frameIntervalId).toBeNull();
      expect(serialCameraSource.latestFrame).toBeNull();
    });

    it('should revoke object URL on stop', async () => {
      await serialCameraSource.start();
      
      // Simulate frame received
      const frameData = new Uint8Array([0xFF, 0xD8]);
      serialCameraSource.frameCallback({ data: frameData, timestamp: Date.now() });

      await serialCameraSource.stop();

      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });

    it('should handle stop when not started', async () => {
      await expect(serialCameraSource.stop()).resolves.not.toThrow();
      expect(serialCameraSource.isActive()).toBe(false);
    });
  });

  describe('captureFrame()', () => {
    it('should return latest frame as blob', async () => {
      await serialCameraSource.start();
      
      const frameData = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]);
      serialCameraSource.latestFrame = frameData;

      const blob = await serialCameraSource.captureFrame();

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('image/jpeg');
    });

    it('should throw error when not active', async () => {
      await expect(serialCameraSource.captureFrame()).rejects.toThrow('Serial camera is not active');
    });

    it('should wait for next frame if no latest frame', async () => {
      await serialCameraSource.start();
      serialCameraSource.latestFrame = null;

      // Start capture (will timeout)
      const capturePromise = serialCameraSource.captureFrame();

      // Wait a bit and simulate frame arrival
      setTimeout(() => {
        const frameData = new Uint8Array([0xFF, 0xD8]);
        const frame = { data: frameData, timestamp: Date.now() };
        
        // Find the frame callback registered during captureFrame
        const frameCallback = mockSerialService.onFrame.mock.calls[mockSerialService.onFrame.mock.calls.length - 1][0];
        frameCallback(frame);
      }, 100);

      const blob = await capturePromise;
      expect(blob).toBeInstanceOf(Blob);
    });

    it('should timeout if no frame received', async () => {
      await serialCameraSource.start();
      serialCameraSource.latestFrame = null;

      await expect(serialCameraSource.captureFrame()).rejects.toThrow('Timeout waiting for frame');
    }, 6000);
  });

  describe('getPreviewElement()', () => {
    it('should return image element', async () => {
      await serialCameraSource.start();
      expect(serialCameraSource.getPreviewElement()).toBe(mockImageElement);
    });

    it('should return null when not started', () => {
      expect(serialCameraSource.getPreviewElement()).toBeNull();
    });
  });

  describe('isActive()', () => {
    it('should return false initially', () => {
      expect(serialCameraSource.isActive()).toBe(false);
    });

    it('should return true after start', async () => {
      await serialCameraSource.start();
      expect(serialCameraSource.isActive()).toBe(true);
    });

    it('should return false after stop', async () => {
      await serialCameraSource.start();
      await serialCameraSource.stop();
      expect(serialCameraSource.isActive()).toBe(false);
    });
  });

  describe('onError()', () => {
    it('should register error callback', () => {
      const callback = vi.fn();
      serialCameraSource.onError(callback);
      expect(serialCameraSource.errorCallback).toBe(callback);
    });

    it('should call error callback on serial service error', async () => {
      const errorCallback = vi.fn();
      serialCameraSource.onError(errorCallback);

      await serialCameraSource.start();

      // Simulate error from serial service
      const errorHandler = mockSerialService.onError.mock.calls[0][0];
      const error = { message: 'Frame timeout', originalError: new Error('Timeout') };
      errorHandler(error);

      expect(errorCallback).toHaveBeenCalledWith(error.originalError);
    });
  });
});
