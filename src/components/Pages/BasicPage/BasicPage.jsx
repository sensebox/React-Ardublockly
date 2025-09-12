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
import { ToolboxBasic } from "@/components/Blockly/toolbox/ToolboxBasic";
import ReactDOMServer from "react-dom/server";
import { useSelector } from "react-redux";
import * as Blockly from "blockly";
import { onChangeCode, onChangeWorkspace } from "@/actions/workspaceActions";
import "@/components/Blockly/blocks/basic/index"; // registriert Block
import {
  Upload,
  Usb,
  Link,
  Code,
  PlayArrow,
  Autorenew,
} from "@mui/icons-material";

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
        height: "80vh",
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ display: "flex", gap: 2, flex: 1, minHeight: 0 }}>
        {/* Linke Seite */}
        <Box sx={{ flex: " 0 0 70%", minHeight: 0, display: "flex" }}>
          <BlocklyCard
            toolboxXml={toolboxDom}
            blocklyCSS={{ flex: 1, minHeight: 0 }}
          />
        </Box>

        {/* Rechte Seite */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
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

          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Accordion
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
              sx={{
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                overflow: "hidden",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                },
              }}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
                sx={{
                  borderBottom: `5px ${theme.palette.primary.main} solid`,
                  borderRadius: "5px",
                }}
              >
                <Typography component="h2">Kurzanleitung</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense disablePadding>
                  <ListItem>
                    <ListItemIcon>
                      <Upload color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="SenseBoxOS Sketch aufspielen"
                      secondary="Über Arduino IDE oder senseBox:MCU Flasher aufspielen"
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <Usb color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Mit PC verbinden" />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <Link color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Auf „Verbinden“ klicken"
                      secondary="SenseBox im erscheinenden Dialog auswählen"
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <Code color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Code mit „Code senden“ übertragen"
                      secondary="Dein Blockly-Code wird an die MCU geschickt"
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <PlayArrow color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Mit Play oder Loop starten"
                      secondary={
                        <>
                          <Typography component="span" fontWeight="bold">
                            Play:
                          </Typography>{" "}
                          führt den Code einmal aus –{" "}
                          <Typography component="span" fontWeight="bold">
                            Loop:
                          </Typography>{" "}
                          wiederholt ihn endlos.
                        </>
                      }
                    />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel2"}
              onChange={handleChange("panel2")}
              sx={{
                borderRadius: 3,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                overflow: "hidden",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                },
              }}
            >
              <AccordionSummary
                aria-controls="panel2d-content"
                id="panel2d-header"
                sx={{
                  borderBottom: `5px ${theme.palette.primary.main} solid`,
                  borderRadius: "5px",
                }}
              >
                <Typography component="span">Code & Log</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                    flex: 1,
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
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BasicPage;
