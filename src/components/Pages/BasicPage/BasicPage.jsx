import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Accordion,
  accordionClasses,
  AccordionDetails,
  accordionDetailsClasses,
  AccordionSummary,
  Box,
  Fade,
  Typography,
} from "@mui/material";
import ConnectWizard from "./ConnectWizard";
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
import { ExpandMore } from "@mui/icons-material";

const BasicPage = () => {
  const [script, setScript] = useState("");
  const [log, setLog] = useState("");
  const [code, setCode] = useState("");
  const [expanded, setExpanded] = useState(false);
  const handleExpansion = () => {
    setExpanded(!expanded);
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
    link.href = new URL("./toolbox_style.css", import.meta.url).href;
    head.appendChild(link);

    return () => {
      if (head.contains(link)) {
        head.removeChild(link);
      }
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
      {/* Linke Seite */}
      <Box sx={{ display: "flex", gap: 2, flex: "1 1 auto", minHeight: 0 }}>
        <BlocklyCard
          toolboxXml={toolboxDom} // ⬅️ jetzt echtes XML-DOM-Element
          blocklyCSS={{ height: "100%" }}
        />
        {/* Rechte Seite */}
        <Box
          sx={{
            flex: "1 1 50%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minHeight: "50%", // rechte Seite immer mindestens 50%
          }}
        >
          {/* ConnectWizard nimmt nur so viel Platz wie er braucht */}
          <Box sx={{ flex: "0 0 auto" }}>
            <ConnectWizard
              supported={supported}
              connected={connected}
              status={status}
              delay={delay}
              setDelay={setDelay}
              onConnect={connect}
              onDisconnect={disconnect}
              onQuick={(cmd) => sendLine(cmd)}
            />
          </Box>

          <Box sx={{ flex: "1 1 auto", overflow: "auto" }}>
            <Accordion
              expanded={expanded}
              onChange={handleExpansion}
              slots={{ transition: Fade }}
              slotProps={{ transition: { timeout: 400 } }}
              sx={[
                {
                  borderRadius: 3,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                  transition: "box-shadow 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                  },
                },
                expanded
                  ? {
                      [`& .${accordionClasses.region}`]: {
                        height: "auto",
                      },
                      [`& .${accordionDetailsClasses.root}`]: {
                        display: "block",
                      },
                    }
                  : {
                      [`& .${accordionClasses.region}`]: {
                        height: 0,
                      },
                      [`& .${accordionDetailsClasses.root}`]: {
                        display: "none",
                      },
                    },
              ]}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="devContainer"
                id="devContainer-header"
              >
                <Typography variant="h6">Fortgeschritten</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ height: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                    height: "100%",
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
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BasicPage;
