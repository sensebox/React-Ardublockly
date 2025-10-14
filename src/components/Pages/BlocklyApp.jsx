import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Blockly from "blockly/core";
import { createNameId } from "mnemonic-id";
import { Box } from "@mui/material";

import { clearStats, workspaceName } from "@/actions/workspaceActions";
import BlocklyWindow from "../Blockly/BlocklyWindow";
import DeviceSelection from "../DeviceSelection";

const BlocklyApp = () => {
  const dispatch = useDispatch();
  const [initialXml, setInitialXml] = useState(
    localStorage.getItem("autoSaveXML"),
  );

  useEffect(() => {
    dispatch(workspaceName(createNameId()));

    return () => {
      dispatch(clearStats());
      dispatch(workspaceName(null));
    };
  }, [dispatch]);

  useEffect(() => {
    // Resize Workspace on updates
    const workspace = Blockly.getMainWorkspace();
    Blockly.svgResize(workspace);
  });

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <BlocklyWindow initialXml={initialXml} />
      </div>
      <DeviceSelection />
    </div>
  );
};

export default BlocklyApp;

