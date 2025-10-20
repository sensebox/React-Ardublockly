import React from "react";
import PropTypes from "prop-types";
import { IPAD_CONFIG } from "../../config/ipadConfig";
import WorkspaceName from "./ToolbarItems/WorkspaceName";
import Compile from "./ToolbarItems/Compile";
import ShareProject from "./ToolbarItems/ShareProject";
import ResetWorkspace from "./ToolbarItems/ResetWorkspace";

const IpadToolbar = ({ 
  assessment = false, 
  multiple = false, 
  project, 
  projectType 
}) => {
  // iPad-optimized toolbar layout for embedded mode
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      padding: IPAD_CONFIG.TOOLBAR.padding
    }}>
      <WorkspaceName
        style={{ 
          marginRight: "8px",
          minHeight: IPAD_CONFIG.TOUCH.minHeight,
          minWidth: IPAD_CONFIG.TOUCH.minWidth,
        }}
        multiple={multiple}
        project={project}
        projectType={projectType}
        isEmbedded={true}
      />
      
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {!multiple && (
          <Compile 
            iconButton 
            style={{
              minHeight: IPAD_CONFIG.TOUCH.minHeight,
              minWidth: IPAD_CONFIG.TOUCH.minWidth,
            }}
            isEmbedded={true}
          />
        )}

        {projectType !== "gallery" && !assessment && (
          <ShareProject
            style={{
              minHeight: IPAD_CONFIG.TOUCH.minHeight,
              minWidth: IPAD_CONFIG.TOUCH.minWidth,
            }}
            multiple={multiple}
            project={project}
            projectType={projectType}
            isEmbedded={true}
          />
        )}

        {!multiple && (
          <ResetWorkspace
            style={{
              minHeight: IPAD_CONFIG.TOUCH.minHeight,
              minWidth: IPAD_CONFIG.TOUCH.minWidth,
            }}
            isEmbedded={true}
          />
        )}
      </div>
    </div>
  );
};

IpadToolbar.propTypes = {
  assessment: PropTypes.bool,
  multiple: PropTypes.bool,
  project: PropTypes.object,
  projectType: PropTypes.string,
};

export default IpadToolbar;
