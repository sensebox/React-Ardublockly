import React, { memo } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import WorkspaceName from "./ToolbarItems/WorkspaceName";
import Compile from "./ToolbarItems/Compile";
import SaveProject from "./ToolbarItems/SaveProject";
import DownloadProject from "./ToolbarItems/DownloadProject";
import OpenProject from "./ToolbarItems/OpenProject";
import Screenshot from "./ToolbarItems/Screenshot";
import ShareProject from "./ToolbarItems/ShareProject";
import ResetWorkspace from "./ToolbarItems/ResetWorkspace";
import DeleteProject from "./ToolbarItems/DeleteProject";
import CopyCode from "./ToolbarItems/CopyCode";
import AutoSave from "./ToolbarItems/AutoSave";
import SolutionCheck from "../Tutorial/SolutionCheck";

const containerStyle = {
  width: "max-content",
  display: "flex",
  alignItems: "center",
};

const WorkspaceToolbar = ({
  assessment = false,
  multiple = false,
  project,
  projectType,
}) => {
  const user = useSelector((state) => state.auth.user);
  const isEmbedded = useSelector((state) => state.general.embeddedMode);

  // iPad-friendly styles for embedded mode
  const embeddedStyle = isEmbedded ? {
    padding: "8px 12px",
    minHeight: "48px",
    minWidth: "48px",
    marginRight: "8px",
  } : {};

  // Simplified toolbar for embedded mode - only show: save, name, compile, share, reset
  if (isEmbedded) {
    return (
      <div style={{
        ...containerStyle,
        justifyContent: "space-between",
        width: "100%",
        padding: "0 16px"
      }}>
        <WorkspaceName
          style={{ 
            marginRight: "8px",
            ...embeddedStyle
          }}
          multiple={multiple}
          project={project}
          projectType={projectType}
          isEmbedded={isEmbedded}
        />
        
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {!multiple && (
            <Compile 
              iconButton 
              style={embeddedStyle}
              isEmbedded={isEmbedded}
            />
          )}

          {projectType !== "gallery" && !assessment && (
            <ShareProject
              style={embeddedStyle}
              multiple={multiple}
              project={project}
              projectType={projectType}
              isEmbedded={isEmbedded}
            />
          )}

          {!multiple && (
            <ResetWorkspace
              style={embeddedStyle}
              isEmbedded={isEmbedded}
            />
          )}
        </div>
      </div>
    );
  }

  // Original toolbar for non-embedded mode
  return (
    <div style={containerStyle}>
      {!assessment && !multiple && <AutoSave />}
      {!assessment && (
        <WorkspaceName
          style={{ marginRight: "5px" }}
          multiple={multiple}
          project={project}
          projectType={projectType}
        />
      )}

      {assessment ? <SolutionCheck /> : !multiple && <Compile iconButton />}
      {!multiple && <CopyCode iconButton />}
      {user && !multiple && (
        <SaveProject
          style={{ marginRight: "5px" }}
          projectType={projectType}
          project={project}
        />
      )}
      {!multiple && <DownloadProject style={{ marginRight: "5px" }} />}
      {!assessment && !multiple && (
        <>
          <OpenProject style={{ marginRight: "5px" }} assessment={assessment} />
          <Screenshot style={{ marginRight: "5px" }} />
        </>
      )}

      {projectType !== "gallery" && !assessment && (
        <ShareProject
          style={{ marginRight: "5px" }}
          multiple={multiple}
          project={project}
          projectType={projectType}
        />
      )}

      {!multiple && (
        <ResetWorkspace
          style={
            projectType === "project" || projectType === "gallery"
              ? { marginRight: "5px" }
              : undefined
          }
        />
      )}

      {!assessment &&
        (projectType === "project" || projectType === "gallery") &&
        user?.email === project.creator && (
          <DeleteProject project={project} projectType={projectType} />
        )}
    </div>
  );
};

WorkspaceToolbar.propTypes = {
  assessment: PropTypes.bool,
  multiple: PropTypes.bool,
  project: PropTypes.object,
  projectType: PropTypes.string,
};

export default memo(WorkspaceToolbar);
