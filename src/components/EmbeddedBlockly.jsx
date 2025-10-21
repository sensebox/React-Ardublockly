import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Blockly from "blockly/core";
import { createNameId } from "mnemonic-id";
import { useIpadEmbeddedMode } from "@/hooks/useIpadEmbeddedMode";

import { clearStats, workspaceName } from "@/actions/workspaceActions";
import BlocklyWindow from "./Blockly/BlocklyWindow";
import DeviceSelection from "./DeviceSelection";
import IpadToolbar from "./Workspace/IpadToolbar";
import { IPAD_BLOCKLY_CONFIG } from "@/config/ipadConfig";
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
      <div className="embedded-toolbar">
        <IpadToolbar project={project} projectType={projectType} />
      </div>
      
      <div className="embedded-workspace">
        <BlocklyWindow
          initialXml={initialXml}
          zoom={IPAD_BLOCKLY_CONFIG.zoom}
          move={IPAD_BLOCKLY_CONFIG.move}
          grid={IPAD_BLOCKLY_CONFIG.grid}
        />
      </div>
      
      <DeviceSelection />
    </div>
  );
};

export default EmbeddedBlockly;
