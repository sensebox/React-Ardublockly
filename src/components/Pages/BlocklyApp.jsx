import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Blockly from "blockly/core";
import { createNameId } from "mnemonic-id";
import { setRenderer } from "@/actions/generalActions";

import { clearStats, workspaceName } from "@/actions/workspaceActions";
import BlocklyWindow from "../Blockly/BlocklyWindow";
import DeviceSelection from "../DeviceSelection";
import WorkspaceToolbar from "../Workspace/WorkspaceToolbar";
import { Box } from "@mui/material";
import "./BlocklyApp.css";

const BlocklyApp = ({ project = null, projectType = null }) => {
  const dispatch = useDispatch();
  const [initialXml, setInitialXml] = useState(
    localStorage.getItem("autoSaveXML"),
  );

  useEffect(() => {
    dispatch(workspaceName(createNameId()));
    
    // Force tablet mode and Zelos renderer for mobile/touch optimization
    dispatch(setRenderer("zelos"));

    // Update viewport meta tag for better mobile experience
    const viewport = document.querySelector('meta[name="viewport"]');
    const originalContent = viewport?.getAttribute("content");
    if (viewport) {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover"
      );
    }

    return () => {
      dispatch(clearStats());
      dispatch(workspaceName(null));
      
      // Restore original viewport
      if (viewport && originalContent) {
        viewport.setAttribute("content", originalContent);
      }
    };
  }, [dispatch]);

  useEffect(() => {
    // Resize Workspace on updates
    const workspace = Blockly.getMainWorkspace();
    if (workspace && workspace.options) {
      Blockly.svgResize(workspace);
    }
  });

  // Mobile-optimized configuration
  const mobileConfig = {
    // Enable pinch-to-zoom and better touch gestures
    move: {
      scrollbars: true,
      drag: true,
      wheel: true, // Enable wheel/pinch zoom for mobile
    },
    // Mobile-friendly zoom settings
    zoom: {
      controls: true,
      wheel: true, // Enable pinch-to-zoom
      startScale: 0.9, // Slightly zoomed out for better overview
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.1, // Smoother zoom on mobile
      pinch: true, // Enable pinch gestures
    },
    // Simplified grid for mobile
    grid: {
      spacing: 20,
      length: 1,
      colour: "#4EAF47",
      snap: true, // Enable snap for easier block placement on touch
    },
  };

  return (
    <div className="blockly-app-container">
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        height: "100%", 
        position: "relative" 
      }}>
        {/* Toolbar */}
        <Box
          className="workspaceFunc"
          sx={{ 
            height: "40px", 
            flexShrink: 0,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "0 16px"
          }}
        >
          <WorkspaceToolbar project={project} projectType={projectType} />
        </Box>
        
        {/* Blockly Workspace */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <BlocklyWindow
            initialXml={initialXml}
            zoom={mobileConfig.zoom}
            move={mobileConfig.move}
            grid={mobileConfig.grid}
          />
        </div>
      </div>
      <DeviceSelection />
    </div>
  );
};

export default BlocklyApp;

