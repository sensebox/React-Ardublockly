import React, { use, useEffect, useMemo, useRef, useState } from "react";
import { Box, useTheme } from "@mui/material";
import ConnectWizard from "./ConnectWizard";
import useWebSerial from "./WebSerialService";
import BlocklyCard from "./BlocklyCard";
import "@/components/Blockly/blocks/basic/index"; // registriert Block
import senseboxlogo from "@/data/senseBox_Icon_bunt.png";
import DeviceLogCard from "./DeviceLogCard";
import { useSelector } from "react-redux";

const BasicPage = () => {
  const [log, setLog] = useState("");
  const [script, setScript] = useState("");
  const basicCode = useSelector((s) => s.workspace.code.basic);
  const logBoxRef = useRef(null);

  const {
    supported,
    connected,
    status,
    delay,
    setDelay,
    connect,
    disconnect,
    sendLine,
    sendScript,
  } = useWebSerial({ script, setLog, logBoxRef });

  useEffect(() => {
    console.log(basicCode);
  }, [basicCode]);

  useEffect(() => {
    const head = document.head;
    const link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = new URL("./toolbox_style.css", import.meta.url).href;
    head.appendChild(link);

    // 🎨 Hintergrund setzen (freundlich, senseBox Basic)
    const root = document.querySelector(":root");

    root.style.setProperty("--url", `url(${senseboxlogo})`);

    // 🧹 Cleanup: CSS entfernen und Hintergrund zurücksetzen
    return () => {
      if (head.contains(link)) {
        head.removeChild(link);
      }
      root.style.removeProperty("--url");
    };
  }, []);

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        height: "80vh",
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ display: "flex", gap: 2, flex: 1, minHeight: 0 }}>
        {/* Linke Seite */}
        <Box sx={{ flex: " 0 0 100%", minHeight: 0, display: "flex" }}>
          <BlocklyCard generatorName="Basic" />
          <ConnectWizard
            supported={supported}
            connected={connected}
            onSend={() => sendScript(delay)}
            status={status}
            delay={delay}
            setDelay={setDelay}
            onConnect={connect}
            onDisconnect={disconnect}
            onQuick={(cmd) => sendLine(cmd)}
          />
          <DeviceLogCard log={log} onClear={() => setLog("")} />{" "}
        </Box>
      </Box>
    </Box>
  );
};

export default BasicPage;
