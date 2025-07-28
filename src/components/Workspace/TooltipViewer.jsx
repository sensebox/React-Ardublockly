import React from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  useTheme,
  Tabs,
  Tab,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import * as Blockly from "blockly";
import GraphViewer from "./GraphViewer";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import { TabList } from "@mui/lab";
const TooltipViewer = () => {
  const theme = useTheme();
  const tooltip = useSelector((s) => s.workspace.code.tooltip);
  const helpurl = useSelector((s) => s.workspace.code.helpurl);

  const [value, setValue] = React.useState("help");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Card
      className="helpSection"
      sx={{
        height: "25vh",
        overflowY: "auto",
        mt: 2,
        borderRadius: 1,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: 1,
      }}
    >
      <CardContent>
        <TabContext value={value}>
          <TabList onChange={handleChange}>
            <Tab label="Help" value="help"></Tab>
            <Tab label="Graph" value="graph"></Tab>
          </TabList>

          <TabPanel value="help">
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

            <ReactMarkdown linkTarget="_blank">{tooltip}</ReactMarkdown>

            {helpurl && (
              <Button
                variant="contained"
                color="primary"
                href={helpurl}
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
          </TabPanel>
          <TabPanel keepMounted={true} value="graph">
            <GraphViewer />
          </TabPanel>
        </TabContext>
      </CardContent>
    </Card>
  );
};

export default TooltipViewer;
