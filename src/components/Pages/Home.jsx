"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
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

  const [toolbox, setToolbox] = useState(null);
  const selectedBoard = useSelector((state) => state.board.board);

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
  }, [platform, project, message]);

  useEffect;

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
    setCodeOn((prev) => !prev);
  };

  const blocklyInitialXml = project?.xml ?? initialXml;

  return (
    <div>
      {/* Workspace stats and toolbar */}
      {statistics && (
        <div style={{ float: "left", height: "40px", position: "relative" }}>
          <WorkspaceStats />
        </div>
      )}

      {/* Blockly + Code Viewer */}
      <Grid sx={{ marginTop: "5px" }} container spacing={2}>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <CodeViewer />
          </Box>
          <Box sx={{ flex: 1 }}>
            <TooltipViewer />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Tooltip
            title={
              codeOn
                ? Blockly.Msg.tooltip_hide_code
                : Blockly.Msg.tooltip_show_code
            }
          ></Tooltip>

          <div className="blocklyWindow">
            <BlocklyWindow
              blocklyCSS={{ height: "80vH" }}
              initialXml={blocklyInitialXml}
            />
          </div>
        </Grid>
      </Grid>
      <div
        className="workspaceFunc"
        style={{
          float: "right",
          height: "20px",
        }}
      >
        <WorkspaceToolbar project={project} projectType={projectType} />
      </div>

      {/* Device Selection */}
      <DeviceSelection />

      {/* Platform dialog */}
      {platform && (
        <Dialog
          style={{ zIndex: 9999999 }}
          fullWidth
          maxWidth={"sm"}
          open={dialogOpen}
          title={Blockly.Msg.tabletDialog_headline}
          content=""
          onClose={toggleDialog}
          onClick={toggleDialog}
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
    </div>
  );
}

export default Home;
