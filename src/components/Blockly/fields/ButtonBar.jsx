import React, { useRef, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import {
  Bluetooth,
  BluetoothDisabled,
  PlayArrow,
  Stop,
} from "@mui/icons-material";
import useWebSerial from "@/components/Pages/BasicPage/WebSerialService";

export default function ButtonBar() {
  const [log, setLog] = useState("");
  const [script, setScript] = useState("");
  const logBoxRef = useRef(null);

  const { supported, connected, connect, disconnect, sendScript } =
    useWebSerial({ script, setLog, logBoxRef });

  const onConnect = async () => {
    if (connected) await disconnect();
    else await connect();
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        marginTop: "5px",
        marginLeft: "5px",
      }}
    >
      <Tooltip
        title={
          supported
            ? connected
              ? "Disconnect"
              : "Connect"
            : "WebSerial wird nicht unterstützt. Bitte Chrome oder Edge nutzen."
        }
      >
        <span>
          <IconButton
            disabled={!supported}
            sx={{
              width: 100,
              height: 36,
              borderRadius: "10px",

              // Farbe abhängig von Status
              background: !supported
                ? "#BBD3F7" // ❌ nicht supported
                : connected
                  ? "#0082FC" // 🔵 verbunden
                  : "#AFC7E8", // 🌫️ unterstützt, aber nicht verbunden

              color: "white",
              transition: "background 0.2s ease",
              cursor: supported ? "pointer" : "not-allowed",

              boxShadow:
                supported && connected
                  ? `
            inset 2px 2px 4px rgba(255,255,255,0.5),
            inset -2px -2px 4px rgba(0,0,0,0.25),
            3px 3px 0px #0060B8
          `
                  : "none",

              // leicht ausgegrauter Look, wenn supported aber nicht connected
              ...(supported &&
                !connected && {
                  filter: "grayscale(20%) brightness(95%)",
                  border: "1px solid rgba(0,0,0,0.15)",
                }),

              // disabled look
              ...(!supported && {
                opacity: 0.6,
                border: "2px solid rgba(0,0,0,0.25)",
                filter: "grayscale(40%) brightness(95%)",
              }),

              "&:hover":
                supported && connected
                  ? { background: "#006BD0" }
                  : supported && !connected
                    ? { background: "#9FB8D8" }
                    : {},
            }}
            onClick={onConnect}
          >
            {supported ? (
              connected ? (
                <Bluetooth />
              ) : (
                <BluetoothDisabled />
              )
            ) : (
              <Bluetooth />
            )}
          </IconButton>
        </span>
      </Tooltip>

      {/* ▶️ PLAY */}
      <Tooltip title={connected ? "Upload & Start" : "Nicht verbunden"}>
        <span>
          <IconButton
            disabled={!connected}
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              background: connected ? "#FFD565" : "#E6D9B3",
              color: "black",
              transition: "background 0.2s ease",
              cursor: connected ? "pointer" : "not-allowed",

              boxShadow: connected
                ? `
                inset 2px 2px 4px rgba(255,255,255,0.6),
                inset -2px -2px 4px rgba(0,0,0,0.25),
                3px 3px 0px #D87855
              `
                : "none",

              /* 🔥 Disabled look */
              ...(!connected && {
                opacity: 0.6,
                border: "2px solid rgba(0,0,0,0.25)",
                filter: "grayscale(30%) brightness(95%)",
              }),

              "&:hover": connected ? { background: "#E5BE5B" } : {},
            }}
            onClick={() => sendScript()}
          >
            <PlayArrow />
          </IconButton>
        </span>
      </Tooltip>

      {/* ⏹ STOP */}
      <Tooltip title={connected ? "Stop" : "Nicht verbunden"}>
        <span>
          <IconButton
            disabled={!connected}
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              background: connected ? "#FFD565" : "#E6D9B3",
              color: "black",
              transition: "background 0.2s ease",
              cursor: connected ? "pointer" : "not-allowed",

              boxShadow: connected
                ? `
                inset 2px 2px 4px rgba(255,255,255,0.6),
                inset -2px -2px 4px rgba(0,0,0,0.25),
                3px 3px 0px #D87855
              `
                : "none",

              ...(!connected && {
                opacity: 0.6,
                border: "2px solid rgba(0,0,0,0.25)",
                filter: "grayscale(30%) brightness(95%)",
              }),

              "&:hover": connected ? { background: "#E5BE5B" } : {},
            }}
            onClick={() => disconnect()}
          >
            <Stop />
          </IconButton>
        </span>
      </Tooltip>
    </div>
  );
}
