import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Blockly from "blockly/core";
import { createNameId } from "mnemonic-id";
import { useIpadEmbeddedMode } from "@/hooks/useIpadEmbeddedMode";

import { clearStats, workspaceName } from "@/actions/workspaceActions";
import BlocklyWindow from "./Blockly/BlocklyWindow";
import DeviceSelection from "./DeviceSelection";
import IpadToolbar from "./Workspace/IpadToolbar";
import { Box } from "@mui/material";
import { IPAD_BLOCKLY_CONFIG, IPAD_CONFIG } from "@/config/ipadConfig";
import "./EmbeddedBlockly.css";

const EmbeddedBlockly = ({ project = null, projectType = null }) => {
  const dispatch = useDispatch();
  const [initialXml, setInitialXml] = useState(
    localStorage.getItem("autoSaveXML"),
  );

  // iPad-specific setup
  useIpadEmbeddedMode();

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
    if (workspace && workspace.options) {
      Blockly.svgResize(workspace);
    }
  });


  return (
    <div className="blockly-app-container">
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        height: "100%", 
        position: "relative" 
      }}>
        {/* iPad-optimized Toolbar */}
        <Box
          className="workspaceFunc"
          sx={{ 
            height: IPAD_CONFIG.TOOLBAR.height, 
            flexShrink: 0,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: IPAD_CONFIG.TOOLBAR.padding
          }}
        >
          <IpadToolbar project={project} projectType={projectType} />
        </Box>
        
        {/* Blockly Workspace with iPad config */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <BlocklyWindow
            initialXml={initialXml}
            zoom={IPAD_BLOCKLY_CONFIG.zoom}
            move={IPAD_BLOCKLY_CONFIG.move}
            grid={IPAD_BLOCKLY_CONFIG.grid}
          />
        </div>
      </div>
      <DeviceSelection />
    </div>
  );
};

export default EmbeddedBlockly;
