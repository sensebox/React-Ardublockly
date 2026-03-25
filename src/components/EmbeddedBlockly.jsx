import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import * as Blockly from "blockly/core";
import { createNameId } from "mnemonic-id";
import { useEmbeddedMode } from "@/hooks/useEmbeddedMode";

import { clearStats, workspaceName } from "@/actions/workspaceActions";
import { autosaveProject, getProject, resetProject } from "@/actions/projectActions";
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
  const { shareId, projectId } = useParams();
  const reduxProject = useSelector((state) => state.project.projects[0]);
  const progress = useSelector((state) => state.project.progress);
  const message = useSelector((state) => state.message);
  const workspaceNameFromState = useSelector((state) => state.workspace.name);
  const workspaceXml = useSelector((state) => state.workspace.code.xml);

  const [createdProject, setCreatedProject] = useState(null);
  
  const project = useMemo(() => {
    const actualProject = propProject || createdProject || reduxProject;
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
  }, [propProject, createdProject, reduxProject, workspaceNameFromState]);
  
  const projectType =
    propProjectType || (shareId ? "share" : projectId ? "project" : null);
  
  const [initialXml, setInitialXml] = useState(() => {
    return project.xml || localStorage.getItem("autoSaveXML");
  });
  useEmbeddedMode();

  const autosaveStateRef = useRef({
    shareId: null,
    projectId: null,
    title: "",
    xml: "",
  });

  useEffect(() => {
    autosaveStateRef.current = {
      shareId: shareId || null,
      projectId: projectId || null,
      title: workspaceNameFromState || project.title || "",
      xml: workspaceXml || project.xml || "",
    };
  }, [shareId, projectId, workspaceNameFromState, workspaceXml, project]);

  const createInFlightRef = useRef(false);
  const createEmbeddedProjectNow = async () => {
    if (createInFlightRef.current) return;
    createInFlightRef.current = true;
    try {
      const { title, xml } = autosaveStateRef.current;
      const xmlToSave =
        xml ||
        '<xml xmlns="https://developers.google.com/blockly/xml"></xml>';
      const created = await dispatch(
        autosaveProject({
          id: undefined,
          xml: xmlToSave,
          title: title || createNameId(),
        }),
      );
      const createdId = created?._id;
      if (created && createdId) {
        setCreatedProject(created);
        navigate(`/embedded/project/${createdId}`, { replace: true });
      }
    } catch (e) {
    } finally {
      createInFlightRef.current = false;
    }
  };

  // Create the backend project immediately on /embedded (once)
  useEffect(() => {
    if (shareId) return; // never create when viewing a shared project
    if (projectId) return; // already has an id
    void createEmbeddedProjectNow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareId, projectId]);

  useEffect(() => {
    const intervalMs = 60_000;

    const tick = async () => {
      const { shareId: currentShareId, projectId: currentProjectId, title, xml } =
        autosaveStateRef.current;

      if (currentShareId) return;

      if (!xml) return;

      if (currentProjectId) {
        try {
          await dispatch(
            autosaveProject({
              id: currentProjectId,
              xml,
              title,
            }),
          );
        } catch (e) {
        }
        return;
      }
      // No project id yet → we create immediately on board selection, so do nothing here.
    };

    const intervalId = window.setInterval(tick, intervalMs);
    return () => window.clearInterval(intervalId);
  }, [navigate]);

  useEffect(() => {
    if (shareId) {
      dispatch(resetProject());
      dispatch(getProject("share", shareId));
    } else if (projectId) {
      const alreadyHave =
        (createdProject && createdProject._id === projectId) ||
        (reduxProject && reduxProject._id === projectId);
      if (!alreadyHave) {
        dispatch(resetProject());
        dispatch(getProject("project", projectId));
      }
    }
    return () => {
      if (shareId || projectId) {
        dispatch(resetProject());
      }
    };
  }, [dispatch, shareId, projectId, createdProject, reduxProject]);

  // Handle share loading errors
  useEffect(() => {
    const routeType = shareId ? "share" : projectId ? "project" : null;
    if (
      routeType &&
      (message.id === "PROJECT_EMPTY" || message.id === "GET_PROJECT_FAIL")
    ) {
      navigate("/embedded", { replace: true });
      dispatch(
        returnErrors(
          "",
          404,
          routeType === "share" ? "GET_SHARE_FAIL" : "GET_PROJECT_FAIL",
        ),
      );
    }
  }, [shareId, projectId, message, navigate, dispatch]);

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

  const isLoadingProjectRoute = (shareId || projectId) && progress;
  // Show loading spinner if loading shared/project route
  if (isLoadingProjectRoute) {
    return (
      <Backdrop open invisible>
        <CircularProgress color="primary" />
      </Backdrop>
    );
  }

  // Don't render if we're waiting for project to load
  if ((shareId || projectId) && !reduxProject && !propProject && !createdProject) {
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
