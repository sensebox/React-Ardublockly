import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Slide,
  Tab,
  Fade,
  Box,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import * as Blockly from "blockly";
import GraphViewer from "./GraphViewer";
import DebugViewer from "./DebugViewer";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import { TabList } from "@mui/lab";

// ———————————————————————————————————————
// Styles (kept in one place to avoid repetition)
// ———————————————————————————————————————
const cardSx = {
  height: "100%",
  overflowY: "auto",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  borderRadius: "5px",
  border: "1px solid #ddd",
  background: "#fff",
  display: "flex",
  flexDirection: "column",
  justifyContent: "stretch",
};

const tabListSx = {
  minHeight: 36,
  "& .MuiTabs-flexContainer": { gap: 0.5 },
  "& .MuiTab-root": {
    minHeight: 36,
    padding: "6px 10px",
    textTransform: "none",
    fontSize: 13,
    fontWeight: 500,
    borderRadius: 1,
    color: "text.secondary",
  },
  "& .MuiTab-root.Mui-selected": (theme) => ({
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.action.selected,
    boxShadow: `inset 0 -2px 0 ${theme.palette.primary.main}`,
  }),
};

// ———————————————————————————————————————
// Small reusable building blocks
// ———————————————————————————————————————
const UnderlinedTitle = ({ children }) => (
  <Typography
    variant="h6"
    component="h2"
    sx={{ mb: 0.5, position: "relative", pb: 0.3 }}
  >
    <span style={{ display: "inline-block" }}>{children}</span>
    <span
      style={{
        display: "block",
        width: "50%",
        height: 4,
        backgroundColor: "#4caf50",
        position: "absolute",
        bottom: 0,
        left: 0,
        borderRadius: 2,
      }}
    />
  </Typography>
);

const SlidePanel = ({
  activeValue,
  myValue,
  direction = "up",
  children,
  sx,
}) => (
  <Slide timeout={500} in={activeValue === myValue} direction={direction}>
    <div>
      <TabPanel keepMounted value={myValue} sx={sx}>
        {children}
      </TabPanel>
    </div>
  </Slide>
);

// ———————————————————————————————————————
// Tab contents as tiny components
// ———————————————————————————————————————

const HelpTab = ({ tooltip, helpurl }) => {
  const markdownKey = `${tooltip ?? ""}`;

  return (
    <>
      <UnderlinedTitle>
        {Blockly.Msg.tooltip_moreInformation_02}
      </UnderlinedTitle>

      <Box sx={{ maxHeight: 230, overflowY: "auto", mt: 1 }}>
        {tooltip ? (
          <Fade in key={markdownKey} timeout={350}>
            <div>
              <ReactMarkdown linkTarget="_blank">{tooltip}</ReactMarkdown>
            </div>
          </Fade>
        ) : (
          <Typography variant="body2" color="textSecondary">
            Keine Beschreibung verfügbar.
          </Typography>
        )}
      </Box>

      {helpurl && (
        <Button
          variant="contained"
          color="primary"
          href={helpurl}
          target="_blank"
          sx={{ mt: 2, px: 2, py: 1, borderRadius: 1, fontSize: "0.9rem" }}
        >
          Zur Dokumentation
        </Button>
      )}
    </>
  );
};

const GraphTab = () => <GraphViewer />;
const DebugTab = () => <DebugViewer />;

// ———————————————————————————————————————
// Main component
// ———————————————————————————————————————
const TooltipViewer = () => {
  const tooltip = useSelector((s) => s.workspace.code.tooltip);
  const helpurl = useSelector((s) => s.workspace.code.helpurl);
  const [value, setValue] = useState("help");

  return (
    <Card className="helpSection" sx={cardSx}>
      <CardContent sx={{ display: "flex", flexDirection: "column", p: 0 }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", px: 1.5, pt: 1 }}>
            <TabList
              onChange={(_, v) => setValue(v)}
              variant="scrollable"
              TabIndicatorProps={{ sx: { height: 3, borderRadius: 1 } }}
              sx={tabListSx}
            >
              <Tab label="Help" value="help" disableRipple />
              <Tab label="Graph" value="graph" disableRipple />
              <Tab label="Debug" value="debug" disableRipple />
            </TabList>
          </Box>

          <SlidePanel
            activeValue={value}
            myValue="help"
            direction="left"
            sx={{ p: 1.5, flex: 1 }}
          >
            <HelpTab tooltip={tooltip} helpurl={helpurl} />
          </SlidePanel>

          <SlidePanel
            activeValue={value}
            myValue="graph"
            direction="left"
            sx={{ p: 0, flex: 1 }}
          >
            <GraphTab />
          </SlidePanel>

          <SlidePanel
            activeValue={value}
            myValue="debug"
            direction="left"
            sx={{ p: 2, flex: 1 }}
          >
            <DebugTab />
          </SlidePanel>
        </TabContext>
      </CardContent>
    </Card>
  );
};

export default TooltipViewer;
