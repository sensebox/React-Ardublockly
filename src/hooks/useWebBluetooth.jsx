import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const BLE_SERVICE_UUID = "cf06a218-f68e-e0be-ad04-8ebc1eb0bc84";
const BLE_RX_UUID = "2cdf2174-35be-fdc4-4ca2-6fd173f8b3a8";
const ENCODER = new TextEncoder();
const DECODER = new TextDecoder();

/**
 * Custom Hook für Web Bluetooth.
 * Props:
 *  - setLog: (updater) => void
 *  - logBoxRef: ref auf das <pre>-Element (für Autoscroll)
 */
export default function useWebBluetooth({ setLog, logBoxRef }) {
  const [supported] = useState(
    typeof navigator !== "undefined" && "bluetooth" in navigator,
  );
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState("Disconnected");
  const [delay, setDelay] = useState(30);

  const deviceRef = useRef(null);
  const serverRef = useRef(null);
  const characteristicRef = useRef(null);
  const notificationListenerRef = useRef(null);
  const writeQueueRef = useRef(Promise.resolve());
  const script = useSelector((s) => s.workspace.code.basic);

  const logMessage = useCallback(
    (msg) => {
      setLog((prev) => (prev ? `${prev}\n${msg}` : msg));
      if (logBoxRef?.current) {
        queueMicrotask(() => {
          logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
        });
      }
    },
    [setLog, logBoxRef],
  );

  const handleNotification = useCallback(
    (event) => {
      const value = event.target?.value;
      if (!value) return;
      const text = DECODER.decode(value);
      const lines = text.replace(/\r/g, "").split("\n");
      lines.forEach((line) => {
        const trimmed = line.trim();
        if (trimmed) logMessage(trimmed);
      });
    },
    [logMessage],
  );

  const connect = useCallback(async () => {
    try {
      // Search by device name instead of service UUID
      const requestOptions = {
        filters: [
          { namePrefix: "senseBox" },
          { name: "senseBoxOS" },
          { name: "senseBox-BLE" },
        ],
        optionalServices: [BLE_SERVICE_UUID],
      };

      const device = await navigator.bluetooth.requestDevice(requestOptions);
      deviceRef.current = device;
      device.addEventListener("gattserverdisconnected", () => {
        logMessage("[Disconnected]");
        setConnected(false);
        setStatus("Disconnected");
      });

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(BLE_SERVICE_UUID);
      const characteristic = await service.getCharacteristic(BLE_RX_UUID);

      characteristic.addEventListener(
        "characteristicvaluechanged",
        handleNotification,
      );
      notificationListenerRef.current = handleNotification;
      await characteristic.startNotifications();

      serverRef.current = server;
      characteristicRef.current = characteristic;

      setConnected(true);
      setStatus("Connected");
      logMessage("[Connected]");
    } catch (err) {
      logMessage(`Connection failed: ${err}`);
      setConnected(false);
      setStatus("Disconnected");
    }
  }, [handleNotification, logMessage]);

  const disconnect = useCallback(async () => {
    try {
      if (characteristicRef.current) {
        if (notificationListenerRef.current) {
          characteristicRef.current.removeEventListener(
            "characteristicvaluechanged",
            notificationListenerRef.current,
          );
          notificationListenerRef.current = null;
        }
        try {
          await characteristicRef.current.stopNotifications();
        } catch (e) {}
        characteristicRef.current = null;
      }

      if (serverRef.current?.connected) {
        await serverRef.current.disconnect();
      }
    } catch (e) {
      console.warn("Bluetooth disconnect error:", e);
    } finally {
      deviceRef.current = null;
      serverRef.current = null;
      characteristicRef.current = null;
      setConnected(false);
      setStatus("Disconnected");
      logMessage("[Disconnected]");
      writeQueueRef.current = Promise.resolve();
    }
  }, [logMessage]);

  const sendLine = useCallback(
    async (line) => {
      console.log("[BLE] sendLine called with:", line);
      if (!characteristicRef.current) return;
      // Don't add newline - MCU strips CR/LF anyway
      const payload = ENCODER.encode(line);
      console.log("[BLE] Encoded payload length:", payload.length, "bytes");

      const writeValue = async () => {
        if (!characteristicRef.current) return;
        console.log("[BLE] Writing to characteristic:", line);
        await characteristicRef.current.writeValue(payload);
        console.log("[BLE] Write successful:", line);
        logMessage(`>>> ${line}`);
      };

      const queued = writeQueueRef.current.then(writeValue, writeValue);
      writeQueueRef.current = queued.catch(() => Promise.resolve());
      await queued;
    },
    [logMessage],
  );

  const sendScript = useCallback(
    async (d = delay) => {
      const lines = script.split(/\r?\n/);
      console.log("[BLE] sendScript: Total lines in script:", lines.length);
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trimEnd();
        if (trimmed) {
          console.log(`[BLE] Sending line ${i + 1}/${lines.length}:`, trimmed);
          await sendLine(trimmed);
          const ms = Math.max(0, Number.isFinite(d) ? d : 0);
          if (ms > 0) {
            console.log(`[BLE] Waiting ${ms}ms before next line`);
            await new Promise((r) => setTimeout(r, ms));
          }
        } else {
          console.log(`[BLE] Skipping empty line ${i + 1}`);
        }
      }
      console.log("[BLE] sendScript: All lines sent");
    },
    [script, sendLine, delay],
  );

  const clearLog = useCallback(() => setLog(""), [setLog]);
  const copyLog = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(
        typeof window !== "undefined"
          ? document.querySelector("[data-log-pre]")?.textContent || ""
          : "",
      );
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  useEffect(() => {
    if (logBoxRef?.current) {
      logBoxRef.current.setAttribute("data-log-pre", "true");
    }
  }, [logBoxRef]);

  useEffect(() => {
    if (!supported) {
      logMessage("Web Bluetooth API not supported in this browser.");
    }
  }, [supported, logMessage]);

  return {
    supported,
    connected,
    status,
    delay,
    setDelay,
    connect,
    disconnect,
    sendLine,
    sendScript,
    clearLog,
    copyLog,
  };
}
