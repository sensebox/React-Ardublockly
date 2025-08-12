import React, { useState } from "react";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import {
  Card,
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  AccordionDetails as MuiAccordionDetails,
  Typography,
} from "@mui/material";
import MonacoEditor from "@monaco-editor/react";
import * as Blockly from "blockly";
import Simulator from "../Simulator";
import DebugViewer from "./DebugViewer";
import GraphViewer from "./GraphViewer";

const Accordion = styled(MuiAccordion)(({ theme }) => ({
  border: `1px solid ${theme.palette.secondary.main}`,
  boxShadow: "none",
  "&:before": { display: "none" },
  "&.Mui-expanded": { margin: "auto" },
}));

const AccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  borderBottom: "1px solid white",
  marginBottom: "-1px",
  minHeight: 50,
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
  const [expandedPanel, setExpandedPanel] = useState("simulator");

  const handleChange = (panel) => (_, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Simulator />
    </Card>
  );
};

export default CodeViewer;
