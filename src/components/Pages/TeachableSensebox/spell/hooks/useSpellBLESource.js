import { useState, useCallback, useRef, useEffect } from "react";
import SpellBLEService, { StrokeState } from "../SpellBLEService";

// Share a single SpellBLEService across hook instances to avoid
// multiple simultaneous BLE connections to the same device.
let sharedService = null;
let sharedServiceUsers = 0;

const DATA_TIMEOUT_MS = 5000;

/**
 * useSpellBLESource
 *
 * Provides a unified interface for connecting to the senseBox
 * magic wand spell sensor via Web Bluetooth and streaming stroke data.
 *
 * @returns {Object} Spell BLE source management interface
 */
function useSpellBLESource() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [latestStroke, setLatestStroke] = useState(null);
  const [dataTimeoutError, setDataTimeoutError] = useState(false);

  const serviceRef = useRef(null);
  const unsubscribeStrokeRef = useRef(null);
  const unsubscribeErrorRef = useRef(null);
  const lastDataTimeRef = useRef(null);
  const completedStrokeCallbackRef = useRef(null);

  useEffect(() => {
    if (!sharedService) {
      sharedService = new SpellBLEService();
    }
    sharedServiceUsers += 1;
    serviceRef.current = sharedService;

    return () => {
      sharedServiceUsers = Math.max(0, sharedServiceUsers - 1);

      if (unsubscribeStrokeRef.current) {
        unsubscribeStrokeRef.current();
        unsubscribeStrokeRef.current = null;
      }
      if (unsubscribeErrorRef.current) {
        unsubscribeErrorRef.current();
        unsubscribeErrorRef.current = null;
      }

      if (sharedServiceUsers === 0 && serviceRef.current) {
        if (serviceRef.current.isConnected) {
          serviceRef.current.disconnect().catch((err) => {
            console.error("Error disconnecting BLE spell on unmount:", err);
          });
        }
        serviceRef.current = null;
        sharedService = null;
      }
    };
  }, []);

  /**
   * Set a callback to be called when a complete stroke is received
   * @param {Function} callback - called with strokeData when a spell is completed
   */
  const setOnCompletedStroke = useCallback((callback) => {
    completedStrokeCallbackRef.current = callback;
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

      unsubscribeStrokeRef.current = serviceRef.current.onStroke(
        (strokeData) => {
          lastDataTimeRef.current = Date.now();
          setDataTimeoutError(false);
          setLatestStroke(strokeData);

          // Call the completed stroke callback if this is a finished spell
          if (strokeData.isCompleted && completedStrokeCallbackRef.current) {
            completedStrokeCallbackRef.current(strokeData);
          }
        },
      );

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

    if (unsubscribeStrokeRef.current) {
      unsubscribeStrokeRef.current();
      unsubscribeStrokeRef.current = null;
    }
    if (unsubscribeErrorRef.current) {
      unsubscribeErrorRef.current();
      unsubscribeErrorRef.current = null;
    }

    try {
      await serviceRef.current.disconnect();
    } catch (err) {
      console.error("Error disconnecting BLE spell:", err);
    }

    setIsConnected(false);
    setLatestStroke(null);
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
    latestStroke,
    dataTimeoutError,
    connect,
    disconnect,
    setOnCompletedStroke,
    isSupported: SpellBLEService.isSupported(),
    StrokeState,
  };
}

export default useSpellBLESource;
export { StrokeState };
