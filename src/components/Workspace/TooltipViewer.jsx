import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Tabs,
  Tab,
  useTheme,
} from "@mui/material";
import * as Blockly from "blockly";
import ReactMarkdown from "react-markdown";
import { withBoardParam } from "@/components/Blockly/helpers/helpUrlBuilder";
import GraphViewer from "./GraphViewer";
import DebugViewer from "./DebugViewer";
import { SIMULATOR_BOARD } from "@/components/Simulator/constants";

// Keeps a tab mounted while hidden, so the graph history survives tab changes.
const TabContent = ({ active, children }) => (
  <Box sx={{ display: active ? "block" : "none", pt: 1 }}>{children}</Box>
);

const TooltipViewer = () => {
  const theme = useTheme();
  const tooltip = useSelector((s) => s.workspace.code.tooltip);
  const helpurl = useSelector((s) => s.workspace.code.helpurl);
  // Graph and debug log belong to the simulator (MCU-S2 only).
  // Texts come from Blockly.Msg: re-render when the language changes.
  useSelector((s) => s.general.language);
  const simulatorAvailable = useSelector(
    (s) => s.board.board === SIMULATOR_BOARD,
  );
  const [tab, setTab] = useState("help");
  const activeTab = simulatorAvailable ? tab : "help";

  // Wrap the helpurl with board parameter if it exists
  const helpUrlWithBoard = helpurl ? withBoardParam(helpurl) : null;

  return (
    <Card
      className="helpSection"
      sx={{
        overflowY: "auto",
        maxHeight: "23vh",
        mt: 2,
        p: 2,
        borderRadius: 1,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: 1,
      }}
    >
      {simulatorAvailable && (
        <Tabs
          value={activeTab}
          onChange={(_, value) => setTab(value)}
          variant="fullWidth"
          sx={{
            minHeight: 36,
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTab-root": { minHeight: 36, textTransform: "none" },
          }}
        >
          <Tab
            id="tooltip-tab-help"
            value="help"
            label={Blockly.Msg.simulator_tab_help}
          />
          <Tab
            id="tooltip-tab-graph"
            value="graph"
            label={Blockly.Msg.simulator_tab_graph}
          />
          <Tab
            id="tooltip-tab-debug"
            value="debug"
            label={Blockly.Msg.simulator_tab_debug}
          />
        </Tabs>
      )}

      <CardContent sx={{ display: activeTab === "help" ? "block" : "none" }}>
        <Typography
          variant="h6"
          component="h2"
          style={{
            marginBottom: "0.5rem",
            position: "relative",
            paddingBottom: "0.3rem",
          }}
        >
          <span style={{ display: "inline-block" }}>
            {Blockly.Msg.tooltip_moreInformation_02}
          </span>
          <span
            style={{
              content: "''",
              display: "block",
              width: "50%",
              height: "4px",
              backgroundColor: "#4caf50",
              position: "absolute",
              bottom: 0,
              left: 0,
              borderRadius: "2px",
            }}
          ></span>
        </Typography>

        <ReactMarkdown>{tooltip || ""}</ReactMarkdown>

        {helpUrlWithBoard && (
          <Button
            variant="contained"
            color="primary"
            href={helpUrlWithBoard}
            target="_blank"
            sx={{
              mt: 2,
              px: 2,
              py: 1,
              borderRadius: 1,
              fontSize: "0.9rem",
            }}
          >
            Zur Dokumentation
          </Button>
        )}
      </CardContent>

      {simulatorAvailable && (
        <>
          <TabContent active={activeTab === "graph"}>
            <GraphViewer />
          </TabContent>
          <TabContent active={activeTab === "debug"}>
            <DebugViewer />
          </TabContent>
        </>
      )}
    </Card>
  );
};

export default TooltipViewer;
