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
  const [expandedPanel, setExpandedPanel] = useState("arduino");

  const handleChange = (panel) => (_, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  return (
    <Card
      sx={{
        height: "100%",
        maxHeight: "50vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
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
          <Typography sx={{ m: "auto 5px 2px 0" }}>
            {Blockly.Msg.codeviewer_arduino}
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            height: "calc(50vh - 50px)",
            bgcolor: "background.paper",
          }}
        >
          <MonacoEditor
            height="100%"
            defaultLanguage="cpp"
            value={arduino}
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
            height: "calc(50vh - 50px)",
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
