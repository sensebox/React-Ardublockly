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
  const [isSending, setIsSending] = useState(false);
  const [loop, setLoop] = useState(false);

  const portRef = useRef(null);
  const readerRef = useRef(null);
  const writerRef = useRef(null);
  const isSendingRef = useRef(false);
  const loopRef = useRef(false);
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
      const port = await navigator.serial.requestPort({});
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
      const port = portRef.current;

      if (readerRef.current) {
        try {
          await readerRef.current.cancel();
        } catch (e) {}
        try {
          readerRef.current.releaseLock();
        } catch (e) {}
      }

      if (writerRef.current) {
        try {
          writerRef.current.releaseLock();
        } catch (e) {}
      }

      if (port) {
        try {
          await port.close();
        } catch (e) {}
      }
    } catch (e) {
      console.warn("Disconnect error:", e);
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
      if (!writerRef.current) return;
      isSendingRef.current = true;
      setIsSending(true);
      try {
        const lines = script.split(/\r?\n/);
        for (let line of lines) {
          if (!isSendingRef.current) break;
          const trimmed = line.trimEnd();
          if (trimmed) {
            await sendLine(trimmed);
            const ms = Math.max(0, Number.isFinite(d) ? d : 0);
            if (ms > 0) await new Promise((r) => setTimeout(r, ms));
          }
        }
      } finally {
        isSendingRef.current = false;
        setIsSending(false);
      }
    },
    [script, sendLine, delay],
  );

  const stopSend = useCallback(() => {
    isSendingRef.current = false;
    setIsSending(false);
  }, []);

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
    stopSend,
    isSending,
    loop,
    clearLog,
    copyLog,
  };
}
