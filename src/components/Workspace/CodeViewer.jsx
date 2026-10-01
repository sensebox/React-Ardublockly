import React, { useEffect, useState } from "react";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrochip } from "@fortawesome/free-solid-svg-icons";
import Simulator from "@/components/Simulator";
import { SIMULATOR_BOARD } from "@/components/Simulator/constants";

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

const CodeViewer = ({ onSimulatorOpenChange, availableHeight }) => {
  const arduino = useSelector((s) => s.workspace.code.arduino);
  const xml = useSelector((s) => s.workspace.code.xml);
  const simulatorAvailable = useSelector(
    (s) => s.board.board === SIMULATOR_BOARD,
  );
  const [expandedPanel, setExpandedPanel] = useState(
    simulatorAvailable ? "simulator" : "arduino",
  );

  // Open the simulator when its board is selected, close it otherwise.
  useEffect(() => {
    setExpandedPanel((panel) => {
      if (simulatorAvailable) {
        return "simulator";
      }
      return panel === "simulator" ? "arduino" : panel;
    });
  }, [simulatorAvailable]);

  const simulatorOpen = simulatorAvailable && expandedPanel === "simulator";
  useEffect(() => {
    onSimulatorOpenChange?.(simulatorOpen);
  }, [simulatorOpen, onSimulatorOpenChange]);

  const handleChange = (panel) => (_, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  // With the simulator, the open panel leaves space for all three 50px
  // headers, so nothing is cut off. An open simulator takes the whole column.
  const columnHeight =
    simulatorOpen && availableHeight ? availableHeight : "50vh";
  const detailsHeight = simulatorAvailable
    ? `calc(${columnHeight} - 150px)`
    : `calc(${columnHeight} - 50px)`;

  return (
    <Card
      sx={{
        height: "100%",
        maxHeight: columnHeight,
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
          <Typography id="codeviewer-headline" sx={{ m: "auto 5px 2px 0" }}>
            {Blockly.Msg.codeviewer_arduino}
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            height: detailsHeight,
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
            height: detailsHeight,
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

      {simulatorAvailable && (
        // Stays mounted while collapsed: the simulator reads the sensor
        // sliders from the DOM and keeps running.
        <Accordion
          square
          style={{ width: "100%" }}
          expanded={expandedPanel === "simulator"}
          onChange={handleChange("simulator")}
          sx={{ margin: 0 }}
          id="codeviewer-simulator"
        >
          <AccordionSummary>
            <Typography
              component="span"
              sx={{ fontSize: 20, fontWeight: "bold", mr: 1, width: 35 }}
            >
              <FontAwesomeIcon icon={faMicrochip} size="sm" />
            </Typography>
            <Typography sx={{ m: "auto 5px 2px 0" }}>
              {Blockly.Msg.codeviewer_simulator}
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              height: detailsHeight,
              bgcolor: "background.paper",
            }}
          >
            <Simulator />
          </AccordionDetails>
        </Accordion>
      )}
    </Card>
  );
};

export default CodeViewer;
