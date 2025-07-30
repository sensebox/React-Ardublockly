import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import * as Blockly from "blockly/core";
import { IconButton, Tooltip, useTheme } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";

const TrashcanButtons = () => {
  const theme = useTheme();
  const workspaceChange = useSelector((state) => state.workspace.change);
  const [flyoutOpen, setFlyoutOpen] = useState(() => {
    const ws = Blockly.getMainWorkspace();
    return ws?.trashcan?.contentsIsOpen() ?? false;
  });

  // Sync flyout state when workspace.change updates
  useEffect(() => {
    const workspace = Blockly.getMainWorkspace();
    const isOpen = workspace.trashcan.contentsIsOpen();
    setFlyoutOpen(isOpen);
  }, [workspaceChange]);

  const closeTrashcan = () => {
    setFlyoutOpen(false);
    const workspace = Blockly.getMainWorkspace();
    workspace.trashcan.flyout.hide();
  };

  const clearTrashcan = () => {
    setFlyoutOpen(false);
    const workspace = Blockly.getMainWorkspace();
    workspace.trashcan.emptyContents();
  };

  if (!flyoutOpen) return null;

  return (
    <>
      <Tooltip title={Blockly.Msg.tooltip_trashcan_hide}>
        <IconButton
          onClick={closeTrashcan}
          size="large"
          sx={{
            width: "40px",
            height: "40px",
            position: "absolute",
            bottom: "10px",
            right: "10px",
            zIndex: 21,
            "&:hover": {
              backgroundColor: "transparent",
              color: theme.palette.primary.main,
            },
          }}
        >
          <FontAwesomeIcon icon={faTimes} size="xs" />
        </IconButton>
      </Tooltip>

      <Tooltip title={Blockly.Msg.tooltip_trashcan_delete}>
        <IconButton
          onClick={clearTrashcan}
          size="large"
          sx={{
            width: "40px",
            height: "40px",
            position: "absolute",
            bottom: "10px",
            right: "50px",
            zIndex: 21,
            "&:hover": {
              backgroundColor: "transparent",
              color: theme.palette.primary.main,
            },
          }}
        >
          <FontAwesomeIcon icon={faTrash} size="xs" />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default TrashcanButtons;
