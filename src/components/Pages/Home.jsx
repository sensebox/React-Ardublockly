import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearStats, workspaceName } from "@/actions/workspaceActions";

import * as Blockly from "blockly/core";
import { createNameId } from "mnemonic-id";

// Components
import WorkspaceStats from "../Workspace/WorkspaceStats";
import WorkspaceToolbar from "../Workspace/WorkspaceToolbar";
import BlocklyWindow from "../Blockly/BlocklyWindow";
import CodeViewer from "../Workspace/CodeViewer";
import TrashcanButtons from "../Workspace/TrashcanButtons";
import DeviceSelection from "../DeviceSelection";
import TooltipViewer from "@/components/Workspace/TooltipViewer";
import Dialog from "@/components/ui/Dialog";

// Material UI
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { makeStyles } from "@mui/styles";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import { Box } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  codeOn: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.contrastText,
      color: theme.palette.primary.main,
      border: `1px solid ${theme.palette.secondary.main}`,
    },
  },
  codeOff: {
    backgroundColor: theme.palette.primary.contrastText,
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.secondary.main}`,
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  },
}));

const Home = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const statistics = useSelector((state) => state.general.statistics);
  const platform = useSelector((state) => state.general.platform);
  const project = useSelector((state) => state.workspace.project);
  const projectType = useSelector((state) => state.workspace.projectType);
  const message = useSelector((state) => state.message);

  const [codeOn, setCodeOn] = useState(!platform);
  const [dialogOpen, setDialogOpen] = useState(true);
  const [initialXml] = useState(localStorage.getItem("autoSaveXML"));

  // Mount
  useEffect(() => {
    if (!project) {
      dispatch(workspaceName(createNameId()));
    }

    if (message?.id === "GET_SHARE_FAIL") {
      // Optional: implement snackbar handling here
      console.warn(
        "Das angefragte geteilte Projekt konnte nicht gefunden werden.",
      );
    }

    // Unmount
    return () => {
      dispatch(clearStats());
      dispatch(workspaceName(null));
    };
  }, [dispatch, message, project]);

  // Resize Blockly on update
  useEffect(() => {
    const workspace = Blockly.getMainWorkspace();
    Blockly.svgResize(workspace);
  });

  const toggleDialog = useCallback(() => {
    setDialogOpen((prev) => !prev);
  }, []);

  const toggleCode = () => {
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

          <TrashcanButtons />
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
};

export default Home;
