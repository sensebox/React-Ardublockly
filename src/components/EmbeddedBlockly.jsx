import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import * as Blockly from "blockly/core";
import { createNameId } from "mnemonic-id";
import { useEmbeddedMode } from "@/hooks/useEmbeddedMode";

import { clearStats, workspaceName } from "@/actions/workspaceActions";
import { getProject, resetProject } from "@/actions/projectActions";
import { returnErrors } from "@/actions/messageActions";
import BlocklyWindow from "./Blockly/BlocklyWindow";
import DeviceSelection from "./DeviceSelection";
import EmbeddedToolbar from "./Workspace/EmbeddedToolbar";
import { EMBEDDED_BLOCKLY_CONFIG } from "@/config/embeddedConfig";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import "./EmbeddedBlockly.css";

const EmbeddedBlockly = ({ project: propProject = null, projectType: propProjectType = null }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shareId } = useParams();
  const reduxProject = useSelector((state) => state.project.projects[0]);
  const progress = useSelector((state) => state.project.progress);
  const message = useSelector((state) => state.message);
  const workspaceNameFromState = useSelector((state) => state.workspace.name);
  
  const project = useMemo(() => {
    const actualProject = propProject || reduxProject;
    if (actualProject) {
      return actualProject;
    }
    const defaultTitle = workspaceNameFromState || createNameId();
    return {
      title: defaultTitle,
      _id: undefined,
      shared: undefined,
      xml: localStorage.getItem("autoSaveXML") || undefined,
    };
  }, [propProject, reduxProject, workspaceNameFromState]);
  
  const projectType = propProjectType || (shareId ? "share" : null);
  
  const [initialXml, setInitialXml] = useState(() => {
    return project.xml || localStorage.getItem("autoSaveXML");
  });
  useEmbeddedMode();

  useEffect(() => {
    if (shareId) {
      dispatch(resetProject());
      dispatch(getProject("share", shareId));
    }
    return () => {
      if (shareId) {
        dispatch(resetProject());
      }
    };
  }, [dispatch, shareId]);

  // Handle share loading errors
  useEffect(() => {
    if (shareId && (message.id === "PROJECT_EMPTY" || message.id === "GET_PROJECT_FAIL")) {
      navigate("/embedded", { replace: true });
      dispatch(returnErrors("", 404, "GET_SHARE_FAIL"));
    }
  }, [shareId, message, navigate, dispatch]);

  useEffect(() => {
    if (projectType === "share") {
      dispatch(workspaceName(null));
    } else {
      const name = project.title || createNameId();
      dispatch(workspaceName(name));
    }
    
    return () => {
      dispatch(clearStats());
      dispatch(workspaceName(null));
    };
  }, [dispatch, project, projectType]);

  useEffect(() => {
    if (project.xml) {
      setInitialXml(project.xml);
    }
  }, [project]);

  useEffect(() => {
    // Resize Workspace on updates
    const workspace = Blockly.getMainWorkspace();
    if (workspace && workspace.options) {
      Blockly.svgResize(workspace);
    }
  });

  // Show loading spinner if loading shared project
  if (shareId && progress) {
    return (
      <Backdrop open invisible>
        <CircularProgress color="primary" />
      </Backdrop>
    );
  }

  // Don't render if we're waiting for shared project to load
  if (shareId && !reduxProject && !propProject) {
    return null;
  }

  return (
    <div className="blockly-app-container">
      <div className="embedded-toolbar">
        <EmbeddedToolbar project={project} projectType={projectType} />
      </div>
      
      <div className="embedded-workspace">
        <BlocklyWindow
          initialXml={initialXml}
          zoom={EMBEDDED_BLOCKLY_CONFIG.zoom}
          move={EMBEDDED_BLOCKLY_CONFIG.move}
          grid={EMBEDDED_BLOCKLY_CONFIG.grid}
        />
      </div>
      
      <DeviceSelection />
    </div>
  );
};

export default EmbeddedBlockly;
