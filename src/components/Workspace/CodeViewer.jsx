import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import {
  Card,
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  AccordionDetails as MuiAccordionDetails,
  Typography,
  GlobalStyles,
} from "@mui/material";
import MonacoEditor from "@monaco-editor/react";
import * as Blockly from "blockly";
import { toLineRanges, updateSignal } from "./codeDiff";

const signalStyles = (
  <GlobalStyles
    styles={{
      ".code-signal-line": {
        backgroundColor: "rgba(76, 175, 80, 0.25)",
      },
      ".code-signal-gutter": {
        borderLeft: "4px solid #4caf50",
        marginLeft: 3,
      },
    }}
  />
);

const Accordion = styled(MuiAccordion)(({ theme }) => ({
  border: `1px solid ${theme.palette.secondary.main}`,
  boxShadow: "none",
  "&:before": { display: "none" },
  "&.Mui-expanded": {
    margin: "auto",
    // Expanded panel fills the remaining height of the card
    flex: "1 1 0",
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
  },
  "&.Mui-expanded > .MuiCollapse-root": { flex: "1 1 0", minHeight: 0 },
  "& .MuiCollapse-wrapper, & .MuiCollapse-wrapperInner, & .MuiAccordion-region":
    { height: "100%" },
}));

const AccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  borderBottom: "1px solid white",
  marginBottom: "-1px",
  minHeight: 50,
  flexShrink: 0,
  "&.Mui-expanded": { minHeight: 50 },
  "& .MuiAccordionSummary-content.Mui-expanded": {
    margin: "12px 0",
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(() => ({
  padding: 0,
}));

const CodeViewer = () => {
  const arduino = useSelector((s) => s.workspace.code.arduino);
  const xml = useSelector((s) => s.workspace.code.xml);
  const [expandedPanel, setExpandedPanel] = useState("arduino");

  // Code signaling: highlight the lines added/changed by the last edit.
  // The highlight stays until the next edit that adds or changes code.
  const editorRef = useRef(null);
  const decorationsRef = useRef(null);
  const signalRef = useRef({ baseCode: arduino, baseHighlight: [] });
  const highlightRef = useRef([]);
  const revealRef = useRef(false);
  // Set when Blockly finished loading XML (page reload, opening a project,
  // board/language change): that code must not be highlighted
  const resetRef = useRef(false);

  useEffect(() => {
    const workspace = Blockly.getMainWorkspace();
    if (!workspace) return undefined;
    const onLoaded = (event) => {
      if (event.type === Blockly.Events.FINISHED_LOADING) {
        resetRef.current = true;
      }
    };
    workspace.addChangeListener(onLoaded);
    return () => workspace.removeChangeListener(onLoaded);
  }, []);

  const applyHighlight = () => {
    if (!decorationsRef.current) return;
    decorationsRef.current.set(
      toLineRanges(highlightRef.current).map(({ start, end }) => ({
        range: {
          startLineNumber: start,
          startColumn: 1,
          endLineNumber: end,
          endColumn: 1,
        },
        options: {
          isWholeLine: true,
          className: "code-signal-line",
          linesDecorationsClassName: "code-signal-gutter",
          overviewRuler: { color: "#4caf50", position: 4 },
        },
      })),
    );
  };

  const handleEditorMount = (editor) => {
    editorRef.current = editor;
    decorationsRef.current = editor.createDecorationsCollection();
    applyHighlight();
  };

  useEffect(() => {
    const workspace = Blockly.getMainWorkspace();
    const { state, highlight, reveal } = updateSignal(
      signalRef.current,
      arduino,
      {
        dragging: Boolean(workspace?.isDragging?.()),
        reset: resetRef.current,
      },
    );
    resetRef.current = false;
    signalRef.current = state;
    highlightRef.current = highlight;
    if (reveal) revealRef.current = true;

    // Monaco replaces its model content in its own effect, which drops the
    // decorations, so (re)apply them afterwards
    const frame = requestAnimationFrame(() => {
      applyHighlight();
      const lines = highlightRef.current;
      if (revealRef.current && editorRef.current && lines.length > 0) {
        revealRef.current = false;
        editorRef.current.revealLinesInCenterIfOutsideViewport(
          lines[0],
          lines[lines.length - 1],
        );
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [arduino]);

  const handleChange = (panel) => (_, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  return (
    <Card
      sx={{
        flex: "1 1 0",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {signalStyles}
      <Accordion
        style={{ width: "100%" }}
        expanded={expandedPanel === "arduino"}
        onChange={handleChange("arduino")}
        sx={{ margin: 0 }}
      >
        <AccordionSummary>
          <Typography
            component="span"
            sx={{ fontSize: 20, fontWeight: "bold", mr: 1, width: 35 }}
          >
            {"{ }"}
          </Typography>
          <Typography id="codeviewer-headline" sx={{ m: "auto 5px 2px 0" }}>
            {Blockly.Msg.codeviewer_arduino}
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            height: "100%",
            bgcolor: "background.paper",
          }}
        >
          <MonacoEditor
            height="100%"
            defaultLanguage="cpp"
            value={arduino}
            onMount={handleEditorMount}
            options={{ readOnly: true, fontSize: 16 }}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion
        square
        expanded={expandedPanel === "xml"}
        onChange={handleChange("xml")}
        sx={{ margin: 0 }}
      >
        <AccordionSummary>
          <Typography
            component="span"
            sx={{ fontSize: 20, fontWeight: "bold", mr: 1, width: 35 }}
          >
            {"<>"}
          </Typography>
          <Typography sx={{ m: "auto 5px 2px 0" }}>
            {Blockly.Msg.codeviewer_xml}
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            height: "100%",
            bgcolor: "background.paper",
          }}
        >
          <MonacoEditor
            height="100%"
            defaultLanguage="xml"
            value={xml}
            options={{ readOnly: true }}
          />
        </AccordionDetails>
      </Accordion>
    </Card>
  );
};

export default CodeViewer;
