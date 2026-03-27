import { useState, useCallback, useRef, useEffect } from "react";
import AccelerometerService from "../AccelerometerService";

// Share a single AccelerometerService across hook instances to avoid
// multiple Web Serial connections to the same port.
let sharedService = null;
let sharedServiceUsers = 0;

/**
 * useAccelerometerSource
 *
 * Provides a unified interface for connecting to the senseBox Eye
 * accelerometer via Web Serial and streaming X/Y/Z data.
 *
 * @returns {Object} Accelerometer source management interface
 */
const DATA_TIMEOUT_MS = 5000;

function useAccelerometerSource() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [latestSample, setLatestSample] = useState(null);
  const [dataTimeoutError, setDataTimeoutError] = useState(false);

  const serviceRef = useRef(null);
  const unsubscribeDataRef = useRef(null);
  const unsubscribeErrorRef = useRef(null);
  const lastDataTimeRef = useRef(null);

  useEffect(() => {
    if (!sharedService) {
      sharedService = new AccelerometerService();
    }
    sharedServiceUsers += 1;
    serviceRef.current = sharedService;

    return () => {
      sharedServiceUsers = Math.max(0, sharedServiceUsers - 1);

      if (unsubscribeDataRef.current) {
        unsubscribeDataRef.current();
        unsubscribeDataRef.current = null;
      }
      if (unsubscribeErrorRef.current) {
        unsubscribeErrorRef.current();
        unsubscribeErrorRef.current = null;
      }

      if (sharedServiceUsers === 0 && serviceRef.current) {
        if (serviceRef.current.isConnected) {
          serviceRef.current.disconnect().catch((err) => {
            console.error("Error disconnecting accelerometer on unmount:", err);
          });
        }
        serviceRef.current = null;
        sharedService = null;
      }
    };
  }, []);

  const connect = useCallback(async () => {
    if (!serviceRef.current) return;
    setIsConnecting(true);
    setError(null);

    try {
      await serviceRef.current.connect();

      lastDataTimeRef.current = Date.now();
      setDataTimeoutError(false);

      unsubscribeDataRef.current = serviceRef.current.onData((sample) => {
        lastDataTimeRef.current = Date.now();
        setDataTimeoutError(false);
        setLatestSample(sample);
      });

      unsubscribeErrorRef.current = serviceRef.current.onError((err) => {
        setError(err);
        setIsConnected(false);
      });

      setIsConnected(true);
    } catch (err) {
      setError(err);
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (!serviceRef.current) return;

    if (unsubscribeDataRef.current) {
      unsubscribeDataRef.current();
      unsubscribeDataRef.current = null;
    }
    if (unsubscribeErrorRef.current) {
      unsubscribeErrorRef.current();
      unsubscribeErrorRef.current = null;
    }

    try {
      await serviceRef.current.disconnect();
    } catch (err) {
      console.error("Error disconnecting accelerometer:", err);
    }

    setIsConnected(false);
    setLatestSample(null);
    setError(null);
    setDataTimeoutError(false);
    lastDataTimeRef.current = null;
  }, []);

  /**
   * Record a gesture for a fixed duration.
   * @param {number} durationMs - how long to record in milliseconds
   * @returns {Promise<Array<{x,y,z,timestamp}>>} array of samples
   */
  const recordGesture = useCallback(
    (durationMs = 2000) => {
      return new Promise((resolve, reject) => {
        if (!serviceRef.current || !isConnected) {
          reject(new Error("Not connected"));
          return;
        }

        const samples = [];

        const unsubscribe = serviceRef.current.onData((sample) => {
          samples.push(sample);
        });

        setTimeout(() => {
          unsubscribe();
          resolve(samples);
        }, durationMs);
      });
    },
    [isConnected],
  );

  // ─── Data-timeout watchdog ────────────────────────────────────────────────
  // While connected, check every second whether a sample arrived in the last
  // DATA_TIMEOUT_MS milliseconds. If not, surface a warning to the UI.
  useEffect(() => {
    if (!isConnected) {
      setDataTimeoutError(false);
      return;
    }

    const interval = setInterval(() => {
      if (
        lastDataTimeRef.current !== null &&
        Date.now() - lastDataTimeRef.current > DATA_TIMEOUT_MS
      ) {
        setDataTimeoutError(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnected]);

  return {
    isConnected,
    isConnecting,
    error,
    latestSample,
    dataTimeoutError,
    connect,
    disconnect,
    recordGesture,
    isSupported: AccelerometerService.isSupported(),
  };
}

export default useAccelerometerSource;
