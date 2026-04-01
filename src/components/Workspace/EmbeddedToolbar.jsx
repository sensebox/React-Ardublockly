import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import WorkspaceName from "./ToolbarItems/WorkspaceName";
import Compile from "./ToolbarItems/Compile";
import ShareProject from "./ToolbarItems/ShareProject";
import ResetWorkspace from "./ToolbarItems/ResetWorkspace";
import ReloadWorkspace from "./ToolbarItems/ReloadWorkspace";
import AutoSave from "./ToolbarItems/AutoSave";

const EmbeddedToolbar = ({
  assessment = false,
  multiple = false,
  project,
  projectType,
}) => {
  const selectedBoard = useSelector((state) => state.board.board);
  
  // Embedded-optimized toolbar layout for embedded mode
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {!assessment && !multiple && <AutoSave />}
        <WorkspaceName
          multiple={multiple}
          project={project}
          projectType={projectType}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          flex: 1,
          justifyContent: "flex-end",
          flexWrap: "wrap",
        }}
      >
        {!multiple && selectedBoard && <Compile iconButton />}

        {projectType !== "gallery" && !assessment && (
          <ShareProject
            multiple={multiple}
            project={project}
            projectType={projectType}
          />
        )}
        {!multiple && <ResetWorkspace />}
        {!multiple && <ReloadWorkspace />}
      </div>
    </div>
  );
};

EmbeddedToolbar.propTypes = {
  assessment: PropTypes.bool,
  multiple: PropTypes.bool,
  project: PropTypes.object,
  projectType: PropTypes.string,
};

export default EmbeddedToolbar;
