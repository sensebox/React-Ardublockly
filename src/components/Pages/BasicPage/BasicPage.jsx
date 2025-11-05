import React, { use, useEffect, useMemo, useRef, useState } from "react";
import {
  Accordion,
  accordionClasses,
  AccordionDetails,
  accordionDetailsClasses,
  AccordionSummary,
  Box,
  Fade,
  Typography,
  useTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ConnectWizard from "./ConnectWizard";
import LeftPlaceholder from "./BlocklyCard";
import PseudocodeCard from "./PseudocodeCard";
import DeviceLogCard from "./DeviceLogCard";
import useWebSerial from "./WebSerialService";
import BlocklyCard from "./BlocklyCard";
import ReactDOMServer from "react-dom/server";
import { useSelector } from "react-redux";
import "@/components/Blockly/blocks/basic/index"; // registriert Block
import { ExpandMoreRounded } from "@mui/icons-material";
import TutorialAccordion from "./TutorialAccordion";

const BasicPage = () => {
  const [script, setScript] = useState("");
  const [log, setLog] = useState("");
  const [code, setCode] = useState("");
  const [expanded, setExpanded] = React.useState("panel1");
  const theme = useTheme();
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
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
    clearLog,
    copyLog,
  } = useWebSerial({ script, setLog, logBoxRef });

  useEffect(() => {
    // 📦 Dynamisch CSS hinzufügen
    const head = document.head;
    const link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = new URL("./toolbox_style.css", import.meta.url).href;
    head.appendChild(link);

    // 🎨 Hintergrund setzen (freundlich, senseBox Basic)
    const root = document.querySelector(":root");
    root.style.setProperty(
      "--url",
      "linear-gradient(180deg, rgba(250,250,252,0.7) 0%, rgba(242,245,248,0.7) 100%)",
    );

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
        </Box>
      </Box>
    </Box>
  );
};

export default BasicPage;
