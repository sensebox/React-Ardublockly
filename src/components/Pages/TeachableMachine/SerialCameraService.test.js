import { describe, it, expect, beforeEach, vi } from 'vitest';
import SerialCameraService from './SerialCameraService';

describe('SerialCameraService - Connection Management', () => {
  let service;
  let mockPort;
  let mockReader;
  let mockWriter;

  beforeEach(() => {
    service = new SerialCameraService();
    
    // Create mock reader
    mockReader = {
      read: vi.fn().mockResolvedValue({ value: new Uint8Array([]), done: true }),
      cancel: vi.fn().mockResolvedValue(undefined),
      releaseLock: vi.fn(),
    };

    // Create mock writer
    mockWriter = {
      write: vi.fn().mockResolvedValue(undefined),
      releaseLock: vi.fn(),
    };

    // Create mock port
    mockPort = {
      open: vi.fn().mockResolvedValue(undefined),
      close: vi.fn().mockResolvedValue(undefined),
      readable: {
        getReader: vi.fn().mockReturnValue(mockReader),
      },
      writable: {
        getWriter: vi.fn().mockReturnValue(mockWriter),
      },
    };
  });

  describe('isSupported', () => {
    it('should return true when Web Serial API is available', () => {
      global.navigator.serial = {};
      expect(SerialCameraService.isSupported()).toBe(true);
    });

    it('should return false when Web Serial API is not available', () => {
      const originalSerial = global.navigator.serial;
      delete global.navigator.serial;
      expect(SerialCameraService.isSupported()).toBe(false);
      global.navigator.serial = originalSerial;
    });
  });

  describe('requestPort', () => {
    beforeEach(() => {
      global.navigator.serial = {
        requestPort: vi.fn(),
      };
    });

    it('should request a serial port with filters', async () => {
      const filters = [{ usbVendorId: 0x1234 }];
      global.navigator.serial.requestPort.mockResolvedValue(mockPort);

      const port = await service.requestPort(filters);

      expect(global.navigator.serial.requestPort).toHaveBeenCalledWith({ filters });
      expect(port).toBe(mockPort);
    });

    it('should return null when user cancels port selection', async () => {
      const error = new Error('User cancelled');
      error.name = 'NotFoundError';
      global.navigator.serial.requestPort.mockRejectedValue(error);

      const port = await service.requestPort();

      expect(port).toBeNull();
    });

    it('should throw PERMISSION_DENIED error when access is denied', async () => {
      const error = new Error('Permission denied');
      error.name = 'NotAllowedError';
      global.navigator.serial.requestPort.mockRejectedValue(error);

      await expect(service.requestPort()).rejects.toThrow('Serial port access was denied');
      await expect(service.requestPort()).rejects.toMatchObject({
        type: 'PERMISSION_DENIED',
      });
    });

    it('should throw UNSUPPORTED_BROWSER error when Web Serial API is not available', async () => {
      delete global.navigator.serial;

      await expect(service.requestPort()).rejects.toThrow('Web Serial API is not supported');
      await expect(service.requestPort()).rejects.toMatchObject({
        type: 'UNSUPPORTED_BROWSER',
      });

      // Restore
      global.navigator.serial = { requestPort: vi.fn() };
    });
  });

  describe('connect', () => {
    beforeEach(() => {
      service.port = mockPort;
    });

    it('should successfully connect to serial port with default baud rate', async () => {
      await service.connect();

      expect(mockPort.open).toHaveBeenCalledWith({ baudRate: 115200 });
      expect(service.isConnected).toBe(true);
      expect(service.reader).toBe(mockReader);
      expect(service.writer).toBe(mockWriter);
    });

    it('should connect with custom baud rate', async () => {
      await service.connect(9600);

      expect(mockPort.open).toHaveBeenCalledWith({ baudRate: 9600 });
      expect(service.isConnected).toBe(true);
    });

    it('should skip connection if already connected and active', async () => {
      service.port = mockPort;
      service.isConnected = true;
      service.readLoopActive = true;

      // Should not throw, just return early
      await service.connect();

      // Port should not be opened again
      expect(mockPort.open).not.toHaveBeenCalled();
      expect(service.isConnected).toBe(true);
    });

    it('should throw error if no port is selected', async () => {
      service.port = null;

      await expect(service.connect()).rejects.toThrow('No serial port selected');
    });

    it('should handle connection failure and clean up', async () => {
      const connectionError = new Error('Connection failed');
      mockPort.open.mockRejectedValue(connectionError);

      const errorCallback = vi.fn();
      service.onError(errorCallback);

      await expect(service.connect()).rejects.toThrow('Failed to connect to serial port');
      expect(service.isConnected).toBe(false);
      expect(errorCallback).toHaveBeenCalled();
    });
  });

  describe('disconnect', () => {
    beforeEach(async () => {
      service.port = mockPort;
      await service.connect();
    });

    it('should disconnect and clean up resources', async () => {
      await service.disconnect();

      expect(mockReader.cancel).toHaveBeenCalled();
      expect(mockReader.releaseLock).toHaveBeenCalled();
      expect(mockWriter.releaseLock).toHaveBeenCalled();
      expect(mockPort.close).toHaveBeenCalled();
      expect(service.isConnected).toBe(false);
      expect(service.reader).toBeNull();
      expect(service.writer).toBeNull();
      expect(service.port).toBeNull();
    });

    it('should do nothing if not connected', async () => {
      await service.disconnect();
      await service.disconnect(); // Call again

      // Should not throw and should handle gracefully
      expect(service.isConnected).toBe(false);
    });

    it('should handle cleanup errors gracefully', async () => {
      mockReader.cancel.mockRejectedValue(new Error('Cancel failed'));
      mockPort.close.mockRejectedValue(new Error('Close failed'));

      // Should not throw
      await expect(service.disconnect()).resolves.toBeUndefined();
      expect(service.isConnected).toBe(false);
    });
  });

  describe('getConnectionState', () => {
    it('should return false when not connected', () => {
      expect(service.getConnectionState()).toBe(false);
    });

    it('should return true when connected', async () => {
      service.port = mockPort;
      await service.connect();

      expect(service.getConnectionState()).toBe(true);
    });
  });

  describe('event callbacks', () => {
    it('should register frame callbacks', () => {
      const callback = vi.fn();
      service.onFrame(callback);

      expect(service.frameCallbacks).toContain(callback);
    });

    it('should register error callbacks', () => {
      const callback = vi.fn();
      service.onError(callback);

      expect(service.errorCallbacks).toContain(callback);
    });

    it('should not register non-function callbacks', () => {
      service.onFrame('not a function');
      service.onError(null);

      expect(service.frameCallbacks).toHaveLength(0);
      expect(service.errorCallbacks).toHaveLength(0);
    });

    it('should emit errors to all registered callbacks', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      service.onError(callback1);
      service.onError(callback2);

      const error = { type: 'TEST_ERROR', message: 'Test error' };
      service._emitError(error);

      expect(callback1).toHaveBeenCalledWith(error);
      expect(callback2).toHaveBeenCalledWith(error);
    });

    it('should handle callback errors gracefully', () => {
      const throwingCallback = vi.fn().mockImplementation(() => {
        throw new Error('Callback error');
      });
      const normalCallback = vi.fn();
      
      service.onError(throwingCallback);
      service.onError(normalCallback);

      const error = { type: 'TEST_ERROR', message: 'Test error' };
      
      // Should not throw
      expect(() => service._emitError(error)).not.toThrow();
      expect(normalCallback).toHaveBeenCalledWith(error);
    });

    it('should emit frames to all registered callbacks', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      service.onFrame(callback1);
      service.onFrame(callback2);

      const frame = {
        data: new Uint8Array([1, 2, 3]),
        size: 3,
        checksum: 12345,
        timestamp: Date.now()
      };
      service._emitFrame(frame);

      expect(callback1).toHaveBeenCalledWith(frame);
      expect(callback2).toHaveBeenCalledWith(frame);
    });

    it('should handle frame callback errors gracefully', () => {
      const throwingCallback = vi.fn().mockImplementation(() => {
        throw new Error('Frame callback error');
      });
      const normalCallback = vi.fn();
      
      service.onFrame(throwingCallback);
      service.onFrame(normalCallback);

      const frame = {
        data: new Uint8Array([1, 2, 3]),
        size: 3,
        checksum: 12345,
        timestamp: Date.now()
      };
      
      // Should not throw
      expect(() => service._emitFrame(frame)).not.toThrow();
      expect(normalCallback).toHaveBeenCalledWith(frame);
    });
  });
});

describe('SerialCameraService - Frame Decoding and Conversion', () => {
  let service;

  beforeEach(() => {
    service = new SerialCameraService();
  });

  describe('_createImageFromBuffer', () => {
    it('should create a JPEG Blob from valid JPEG buffer', () => {
      // Create a minimal valid JPEG buffer
      // JPEG starts with FF D8 (SOI) and ends with FF D9 (EOI)
      const validJpegBuffer = new Uint8Array([
        0xFF, 0xD8, // SOI marker
        0xFF, 0xE0, // APP0 marker
        0x00, 0x10, // APP0 length
        0x4A, 0x46, 0x49, 0x46, 0x00, // "JFIF\0"
        0x01, 0x01, // Version
        0x00, // Units
        0x00, 0x01, 0x00, 0x01, // X/Y density
        0x00, 0x00, // Thumbnail size
        0xFF, 0xD9  // EOI marker
      ]);

      const blob = service._createImageFromBuffer(validJpegBuffer);

      expect(blob).not.toBeNull();
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('image/jpeg');
      expect(blob.size).toBe(validJpegBuffer.length);
    });

    it('should return null for buffer that is too small', () => {
      const errorCallback = vi.fn();
      service.onError(errorCallback);

      const tooSmallBuffer = new Uint8Array([0xFF]);

      const blob = service._createImageFromBuffer(tooSmallBuffer);

      expect(blob).toBeNull();
      expect(errorCallback).toHaveBeenCalled();
      expect(errorCallback.mock.calls[0][0]).toMatchObject({
        type: 'INVALID_FORMAT',
        message: expect.stringContaining('too small'),
      });
    });

    it('should return null for buffer missing JPEG SOI marker', () => {
      const errorCallback = vi.fn();
      service.onError(errorCallback);

      // Invalid start marker
      const invalidBuffer = new Uint8Array([
        0x00, 0x00, // Wrong start
        0xFF, 0xE0,
        0x00, 0x10,
        0xFF, 0xD9  // Valid end
      ]);

      const blob = service._createImageFromBuffer(invalidBuffer);

      expect(blob).toBeNull();
      expect(errorCallback).toHaveBeenCalled();
      expect(errorCallback.mock.calls[0][0]).toMatchObject({
        type: 'INVALID_FORMAT',
        message: expect.stringContaining('SOI marker'),
      });
    });

    it('should return null for buffer missing JPEG EOI marker', () => {
      const errorCallback = vi.fn();
      service.onError(errorCallback);

      // Invalid end marker
      const invalidBuffer = new Uint8Array([
        0xFF, 0xD8, // Valid start
        0xFF, 0xE0,
        0x00, 0x10,
        0x00, 0x00  // Wrong end
      ]);

      const blob = service._createImageFromBuffer(invalidBuffer);

      expect(blob).toBeNull();
      expect(errorCallback).toHaveBeenCalled();
      expect(errorCallback.mock.calls[0][0]).toMatchObject({
        type: 'INVALID_FORMAT',
        message: expect.stringContaining('EOI marker'),
      });
    });

    it('should handle empty buffer', () => {
      const errorCallback = vi.fn();
      service.onError(errorCallback);

      const emptyBuffer = new Uint8Array([]);

      const blob = service._createImageFromBuffer(emptyBuffer);

      expect(blob).toBeNull();
      expect(errorCallback).toHaveBeenCalled();
    });

    it('should handle unexpected errors during conversion', () => {
      const errorCallback = vi.fn();
      service.onError(errorCallback);

      // Mock Blob constructor to throw an error
      const originalBlob = global.Blob;
      global.Blob = vi.fn().mockImplementation(() => {
        throw new Error('Blob creation failed');
      });

      const validJpegBuffer = new Uint8Array([
        0xFF, 0xD8, // SOI
        0xFF, 0xD9  // EOI
      ]);

      const blob = service._createImageFromBuffer(validJpegBuffer);

      expect(blob).toBeNull();
      expect(errorCallback).toHaveBeenCalled();
      expect(errorCallback.mock.calls[0][0]).toMatchObject({
        type: 'DECODING_ERROR',
      });

      // Restore
      global.Blob = originalBlob;
    });

    it('should create blob with correct MIME type', () => {
      const validJpegBuffer = new Uint8Array([
        0xFF, 0xD8, // SOI
        0xFF, 0xE0, 0x00, 0x10,
        0x4A, 0x46, 0x49, 0x46, 0x00,
        0x01, 0x01, 0x00,
        0x00, 0x01, 0x00, 0x01,
        0x00, 0x00,
        0xFF, 0xD9  // EOI
      ]);

      const blob = service._createImageFromBuffer(validJpegBuffer);

      expect(blob).not.toBeNull();
      expect(blob.type).toBe('image/jpeg');
    });
  });
});
