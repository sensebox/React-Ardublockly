"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Blockly from "blockly/core";
import { createNameId } from "mnemonic-id";

import { clearStats, workspaceName } from "@/actions/workspaceActions";
import WorkspaceStats from "../Workspace/WorkspaceStats";
import WorkspaceToolbar from "../Workspace/WorkspaceToolbar";
import BlocklyWindow from "../Blockly/BlocklyWindow";
import CodeViewer from "../Workspace/CodeViewer";
import TrashcanButtons from "../Workspace/TrashcanButtons";
import DeviceSelection from "../DeviceSelection";
import TooltipViewer from "@/components/Workspace/TooltipViewer";
import Dialog from "@/components/ui/Dialog";

import { Grid, IconButton, Tooltip, Box } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";

function Home({ project, projectType }) {
  const dispatch = useDispatch();

  const message = useSelector((state) => state.message);
  const statistics = useSelector((state) => state.general.statistics);
  const platform = useSelector((state) => state.general.platform);

  const [codeOn, setCodeOn] = useState(true);
  const [open, setOpen] = useState(true);
  const [initialXml, setInitialXml] = useState(
    localStorage.getItem("autoSaveXML"),
  );

  useEffect(() => {
    if (platform) setCodeOn(false);

    const stats = window.localStorage.getItem("stats");
    if (!project) {
      dispatch(workspaceName(createNameId()));
    }

    if (message && message.id === "GET_SHARE_FAIL") {
      console.error(
        "Das angefragte geteilte Projekt konnte nicht gefunden werden.",
      );
    }

    return () => {
      dispatch(clearStats());
      dispatch(workspaceName(null));
    };
  }, [platform, project, message, dispatch]);

  useEffect(() => {
    // Resize Workspace on updates
    const workspace = Blockly.getMainWorkspace();
    Blockly.svgResize(workspace);
  });

  const handleToggleDialog = () => {
    setOpen((prev) => !prev);
  };

  const handleToggleCode = () => {
    setCodeOn((prev) => !prev);

    const workspace = Blockly.getMainWorkspace();
    if (workspace.trashcan?.flyout) {
      workspace.trashcan.flyout.hide();
    }
  };

  return (
    <Box>
      {/* Workspace Stats */}
      {statistics && (
        <Box sx={{ float: "left", height: "40px", position: "relative" }}>
          <WorkspaceStats />
        </Box>
      )}

      {/* Toolbar */}
      <Box
        className="workspaceFunc"
        sx={{ float: "right", height: "40px", mb: 2 }}
      >
        <WorkspaceToolbar project={project} projectType={projectType} />
      </Box>

      {/* Blockly Workspace */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={codeOn ? 8 : 12} sx={{ position: "relative" }}>
          <Tooltip
            title={
              codeOn
                ? Blockly.Msg.tooltip_hide_code
                : Blockly.Msg.tooltip_show_code
            }
          >
            <IconButton
              sx={{
                width: 40,
                height: 40,
                position: "absolute",
                top: -12,
                right: 8,
                zIndex: 21,
                bgcolor: codeOn ? "primary.main" : "background.paper",
                color: codeOn ? "primary.contrastText" : "primary.main",
                border: 1,
                borderColor: "secondary.main",
                "&:hover": {
                  bgcolor: codeOn ? "background.paper" : "primary.main",
                  color: codeOn ? "primary.main" : "primary.contrastText",
                },
              }}
              onClick={handleToggleCode}
              size="large"
            >
              <FontAwesomeIcon icon={faCode} size="xs" />
            </IconButton>
          </Tooltip>

          <Box className="blocklyWindow">
            <BlocklyWindow
              blocklyCSS={{ height: "80vH" }}
              initialXml={project ? project.xml : initialXml}
            />
          </Box>
        </Grid>

        {codeOn && (
          <Grid item xs={12} md={4}>
            <CodeViewer />
            <TooltipViewer />
          </Grid>
        )}
      </Grid>

      <DeviceSelection />

      {/* Platform Dialog */}
      {platform && (
        <Dialog
          style={{ zIndex: 9999999 }}
          fullWidth
          maxWidth="sm"
          open={open}
          title={Blockly.Msg.tabletDialog_headline}
          content={""}
          onClose={handleToggleDialog}
          onClick={handleToggleDialog}
          button={Blockly.Msg.button_close}
        >
          <div>{Blockly.Msg.tabletDialog_text}</div>
          <div>
            {Blockly.Msg.tabletDialog_more}{" "}
            <a href="https://sensebox.de/app" target="_blank" rel="noreferrer">
              https://sensebox.de/app
            </a>
          </div>
        </Dialog>
      )}
    </Box>
  );
}

export default Home;
