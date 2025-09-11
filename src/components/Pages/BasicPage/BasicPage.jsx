import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box } from "@mui/material";
import HeaderBar from "./HeaderBar";
import LeftPlaceholder from "./BlocklyCard";
import PseudocodeCard from "./PseudocodeCard";
import DeviceLogCard from "./DeviceLogCard";
import useWebSerial from "./WebSerialService";
import BlocklyCard from "./BlocklyCard";
import { ToolboxBasic } from "@/components/Blockly/toolbox/ToolboxBasic";
import ReactDOMServer from "react-dom/server";
import { useSelector } from "react-redux";
import * as Blockly from "blockly";
import { onChangeCode, onChangeWorkspace } from "@/actions/workspaceActions";
import "@/components/Blockly/blocks/basic/index"; // registriert Block

const BasicPage = () => {
  const [script, setScript] = useState("");
  const [log, setLog] = useState("");
  const [code, setCode] = useState("");
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

  const arduino = useSelector((s) => s.workspace.code.arduino);
  const [basicCode, setBasicCode] = useState("");
  // Memoisiert, damit wir nicht bei jedem Render neu parsen
  const toolboxDom = useMemo(() => {
    const xmlText = ReactDOMServer.renderToStaticMarkup(
      <xml
        xmlns="https://developers.google.com/blockly/xml"
        style={{ display: "none" }}
      >
        <ToolboxBasic />
      </xml>,
    );
    const parser = new DOMParser();
    return parser.parseFromString(xmlText, "text/xml").documentElement;
  }, []);

  useEffect(() => {
    var head = document.head;
    var link = document.createElement("link");

    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = "./toolbox_style.css";

    head.appendChild(link);

    return () => {
      head.removeChild(link);
    };
  }, []);

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        height: "100vh",
        boxSizing: "border-box",
      }}
    >
      <HeaderBar
        supported={supported}
        connected={connected}
        status={status}
        delay={delay}
        setDelay={setDelay}
        onConnect={connect}
        onDisconnect={disconnect}
        onQuick={(cmd) => sendLine(cmd)}
      />

      <Box sx={{ display: "flex", gap: 2, flex: "1 1 auto", minHeight: 0 }}>
        <BlocklyCard
          toolboxXml={toolboxDom} // ⬅️ jetzt echtes XML-DOM-Element
          blocklyCSS={{ height: "100%" }}
        />
        <Box
          sx={{
            flex: "1 1 50%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minHeight: 0,
          }}
        >
          <PseudocodeCard
            script={script}
            setScript={setScript}
            connected={connected}
            onSend={() => sendScript(delay)}
          />
          <DeviceLogCard
            log={log}
            logBoxRef={logBoxRef}
            onClear={clearLog}
            onCopy={copyLog}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default BasicPage;
