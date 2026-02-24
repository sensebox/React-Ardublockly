import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import WebcamCameraSource from './WebcamCameraSource';

describe('WebcamCameraSource', () => {
  let webcamSource;
  let mockStream;
  let mockVideoElement;

  beforeEach(() => {
    webcamSource = new WebcamCameraSource();

    // Mock MediaStream with consistent track array
    const mockTrack = { stop: vi.fn() };
    const mockTracks = [mockTrack];
    
    mockStream = {
      getTracks: vi.fn(() => mockTracks)
    };

    // Mock video element
    mockVideoElement = {
      autoplay: false,
      playsInline: false,
      muted: false,
      srcObject: null,
      readyState: 4,
      paused: false,
      play: vi.fn().mockResolvedValue(undefined),
      addEventListener: vi.fn((event, handler) => {
        if (event === 'loadedmetadata') {
          setTimeout(handler, 0);
        }
      })
    };

    // Mock document.createElement for video
    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'video') {
        return mockVideoElement;
      }
      if (tag === 'canvas') {
        const canvas = {
          width: 0,
          height: 0,
          getContext: vi.fn(() => ({
            drawImage: vi.fn()
          })),
          toBlob: vi.fn((callback) => {
            callback(new Blob(['fake-image'], { type: 'image/jpeg' }));
          })
        };
        return canvas;
      }
      return {};
    });

    // Mock getUserMedia
    global.navigator.mediaDevices = {
      getUserMedia: vi.fn().mockResolvedValue(mockStream)
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('start()', () => {
    it('should start webcam and set active state', async () => {
      await webcamSource.start();

      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
        video: true,
        audio: false
      });
      expect(webcamSource.isActive()).toBe(true);
      expect(webcamSource.getPreviewElement()).toBe(mockVideoElement);
    });

    it('should handle getUserMedia errors', async () => {
      const error = new Error('Permission denied');
      navigator.mediaDevices.getUserMedia.mockRejectedValue(error);

      const errorCallback = vi.fn();
      webcamSource.onError(errorCallback);

      await expect(webcamSource.start()).rejects.toThrow('Permission denied');
      expect(webcamSource.isActive()).toBe(false);
      expect(errorCallback).toHaveBeenCalledWith(error);
    });

    it('should configure video element correctly', async () => {
      await webcamSource.start();

      expect(mockVideoElement.autoplay).toBe(true);
      expect(mockVideoElement.playsInline).toBe(true);
      expect(mockVideoElement.muted).toBe(true);
      expect(mockVideoElement.srcObject).toBe(mockStream);
    });
  });

  describe('stop()', () => {
    it('should stop all tracks and clean up', async () => {
      await webcamSource.start();
      await webcamSource.stop();

      expect(mockStream.getTracks()[0].stop).toHaveBeenCalled();
      expect(webcamSource.isActive()).toBe(false);
      expect(webcamSource.stream).toBeNull();
      expect(webcamSource.videoElement).toBeNull();
    });

    it('should handle stop when not started', async () => {
      await expect(webcamSource.stop()).resolves.not.toThrow();
      expect(webcamSource.isActive()).toBe(false);
    });
  });

  describe('captureFrame()', () => {
    it('should capture frame as JPEG blob', async () => {
      await webcamSource.start();
      const blob = await webcamSource.captureFrame();

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('image/jpeg');
    });

    it('should throw error when not active', async () => {
      await expect(webcamSource.captureFrame()).rejects.toThrow('Webcam is not active');
    });

    it('should throw error when video not ready', async () => {
      await webcamSource.start();
      mockVideoElement.readyState = 1;

      await expect(webcamSource.captureFrame()).rejects.toThrow('Video not ready');
    });

    it('should play video if paused', async () => {
      await webcamSource.start();
      mockVideoElement.paused = true;

      await webcamSource.captureFrame();

      expect(mockVideoElement.play).toHaveBeenCalled();
    });
  });

  describe('getPreviewElement()', () => {
    it('should return video element', async () => {
      await webcamSource.start();
      expect(webcamSource.getPreviewElement()).toBe(mockVideoElement);
    });

    it('should return null when not started', () => {
      expect(webcamSource.getPreviewElement()).toBeNull();
    });
  });

  describe('isActive()', () => {
    it('should return false initially', () => {
      expect(webcamSource.isActive()).toBe(false);
    });

    it('should return true after start', async () => {
      await webcamSource.start();
      expect(webcamSource.isActive()).toBe(true);
    });

    it('should return false after stop', async () => {
      await webcamSource.start();
      await webcamSource.stop();
      expect(webcamSource.isActive()).toBe(false);
    });
  });

  describe('onError()', () => {
    it('should register error callback', () => {
      const callback = vi.fn();
      webcamSource.onError(callback);
      expect(webcamSource.errorCallback).toBe(callback);
    });
  });
});
