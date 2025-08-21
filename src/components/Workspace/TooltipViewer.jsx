import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  useTheme,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import * as Blockly from "blockly";

const TooltipViewer = () => {
  const theme = useTheme();
  const tooltip = useSelector((s) => s.workspace.code.tooltip);
  const helpurl = useSelector((s) => s.workspace.code.helpurl);

  useEffect(() => {
    console.log("tooltip changed", tooltip);
  }, [tooltip]);
  return (
    <Card
      className="helpSection"
      sx={{
        height: "25vh",
        overflowY: "auto",
        mt: 2,
        p: 2,
        borderRadius: 1,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: 1,
      }}
    >
      <CardContent>
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

        {tooltip ? (
          <ReactMarkdown linkTarget="_blank">{tooltip}</ReactMarkdown>
        ) : (
          <Typography>{Blockly.Msg.tooltip_hint}</Typography>
        )}

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
      </CardContent>
    </Card>
  );
};

export default TooltipViewer;
