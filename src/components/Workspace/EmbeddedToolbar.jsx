import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import WorkspaceName from "./ToolbarItems/WorkspaceName";
import Compile from "./ToolbarItems/Compile";
import ShareProject from "./ToolbarItems/ShareProject";
import ResetWorkspace from "./ToolbarItems/ResetWorkspace";
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
    <div className="embedded-toolbar-inner">
      <div className="embedded-toolbar-group embedded-toolbar-left">
        {!assessment && !multiple && <AutoSave />}
        <WorkspaceName
          multiple={multiple}
          project={project}
          projectType={projectType}
        />
      </div>

      <div className="embedded-toolbar-group embedded-toolbar-right">
        {!multiple && selectedBoard && <Compile iconButton />}

        {projectType !== "gallery" && !assessment && (
          <ShareProject
            multiple={multiple}
            project={project}
            projectType={projectType}
          />
        )}
        {!multiple && <ResetWorkspace />}
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
