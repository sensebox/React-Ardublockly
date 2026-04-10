import { useState, useCallback, useRef, useEffect } from "react";
import OrientationBLEService from "../OrientationBLEService";

// Share a single OrientationBLEService across hook instances to avoid
// multiple simultaneous BLE connections to the same device.
let sharedService = null;
let sharedServiceUsers = 0;

const DATA_TIMEOUT_MS = 5000;

/**
 * useOrientationBLESource
 *
 * Provides a unified interface for connecting to the senseBox Eye
 * accelerometer via Web Bluetooth and streaming X/Y/Z data.
 *
 * @returns {Object} Accelerometer BLE source management interface
 */
function useOrientationBLESource() {
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
      sharedService = new OrientationBLEService();
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
            console.error(
              "Error disconnecting BLE accelerometer on unmount:",
              err,
            );
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

      // User may have cancelled the picker — service won't be connected
      if (!serviceRef.current.isConnected) {
        setIsConnecting(false);
        return;
      }

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
      console.error("Error disconnecting BLE accelerometer:", err);
    }

    setIsConnected(false);
    setLatestSample(null);
    setError(null);
    setDataTimeoutError(false);
    lastDataTimeRef.current = null;
  }, []);

  // ─── Data-timeout watchdog ────────────────────────────────────────────────
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
    isSupported: OrientationBLEService.isSupported(),
  };
}

export default useOrientationBLESource;
