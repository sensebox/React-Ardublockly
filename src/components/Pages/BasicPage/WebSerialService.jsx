import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import * as Blockly from "blockly";

/**
 * Custom Hook für Web Serial (Chrome/Edge, HTTPS oder localhost).
 * Props:
 *  - script: string
 *  - setLog: (updater) => void
 *  - logBoxRef: ref auf das <pre>-Element (für Autoscroll)
 */
export default function useWebSerial({ setLog, logBoxRef }) {
  const [supported] = useState(
    typeof navigator !== "undefined" && "serial" in navigator,
  );
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState("Disconnected");
  const [delay, setDelay] = useState(30);

  const portRef = useRef(null);
  const readerRef = useRef(null);
  const writerRef = useRef(null);
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

  const readLoop = useCallback(
    async (reader) => {
      let buffer = [];
      const flush = () => {
        if (buffer.length) {
          setLog((prev) =>
            prev ? prev + "\n" + buffer.join("\n") : buffer.join("\n"),
          );
          buffer = [];
        }
      };

      const interval = setInterval(flush, 100); // alle 100ms rendern
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          if (value) {
            const lines = value.replace(/\r/g, "").split("\n");
            buffer.push(...lines.filter(Boolean));
          }
        }
      } catch (err) {
        logMessage(`Read error: ${err}`);
      } finally {
        clearInterval(interval);
        flush();
      }
    },
    [setLog, logMessage],
  );

  const connect = useCallback(async () => {
    try {
      const port = await navigator.serial.requestPort({
        filters: [
          { usbVendorId: 0x303a }, // ESP-32
        ],
      });
      await port.open({ baudRate: 115200 });

      const textDecoder = new TextDecoderStream();
      const textEncoder = new TextEncoderStream();
      port.readable.pipeTo(textDecoder.writable);
      textEncoder.readable.pipeTo(port.writable);

      const reader = textDecoder.readable.getReader();
      const writer = textEncoder.writable.getWriter();

      portRef.current = port;
      readerRef.current = reader;
      writerRef.current = writer;

      readLoop(reader);

      setConnected(true);
      setStatus("Connected");
      logMessage("[Connected]");
    } catch (err) {
      logMessage(`Connection failed: ${err}`);
      setConnected(false);
      setStatus("Disconnected");
    }
  }, [logMessage, readLoop]);

  const disconnect = useCallback(async () => {
    try {
      if (readerRef.current) await readerRef.current.cancel();
      if (writerRef.current) await writerRef.current.close();
      if (portRef.current) await portRef.current.close();
    } catch {
      /* ignore */
    }
    readerRef.current = null;
    writerRef.current = null;
    portRef.current = null;
    setConnected(false);
    setStatus("Disconnected");
    logMessage("[Disconnected]");
  }, [logMessage]);

  const sendLine = useCallback(
    async (line) => {
      if (!writerRef.current) return;
      await writerRef.current.write(line + "\n");
      logMessage(`>>> ${line}`);
    },
    [logMessage],
  );

  const sendScript = useCallback(
    async (d = delay) => {
      const lines = script.split(/\r?\n/);
      for (let line of lines) {
        const trimmed = line.trimEnd();
        if (trimmed) {
          await sendLine(trimmed);
          const ms = Math.max(0, Number.isFinite(d) ? d : 0);
          if (ms > 0) await new Promise((r) => setTimeout(r, ms));
        }
      }
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

  // Cleanup bei Unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // Markiere das <pre> für copyLog (fallback)
  useEffect(() => {
    if (logBoxRef?.current) {
      logBoxRef.current.setAttribute("data-log-pre", "true");
    }
  }, [logBoxRef]);

  // Info bei fehlender Unterstützung
  useEffect(() => {
    if (!supported) {
      logMessage(
        "Web Serial API not supported (Chrome/Edge, HTTPS oder localhost).",
      );
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
