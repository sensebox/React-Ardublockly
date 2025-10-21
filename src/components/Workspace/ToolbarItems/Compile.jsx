import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useSelector } from "react-redux";
import { IconButton, Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardCheck } from "@fortawesome/free-solid-svg-icons";
import { workspaceName } from "../../../actions/workspaceActions";
import CompilationDialog from "../ToolbarItems/CompilationDialog/CompilationDialog";
import withStyles from "@mui/styles/withStyles";
const styles = (theme) => {
  return {
    iconButton: {
      backgroundColor: theme.palette.button.compile,
      color: theme.palette.primary.contrastText,
      width: "40px",
      height: "40px",
      "&:hover": {
        backgroundColor: theme.palette.button.compile,
        color: theme.palette.primary.contrastText,
      },
    },
  };
};

const Compile = (props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const isEmbedded = useSelector((state) => state.general.embeddedMode);

  const fallbackTexts = {
    de_DE: "Code kompilieren",
    en_US: "Compile code",
  };

  // Verwende den Tooltip aus Blockly.Msg oder den Fallback basierend auf der aktuellen Sprache
  const tooltipText =
    Blockly.Msg.tooltip_compile_code ||
    fallbackTexts[props.language] ||
    fallbackTexts.en_US; // Englisch als letzter Fallback
  const openDialog = () => {
    setDialogOpen(true);
  };

  return (
    <div>
      <Tooltip title={tooltipText} arrow style={{ marginRight: "5px" }}>
        <IconButton
          className={`compileBlocks ${isEmbedded ? `${props.classes.iconButtonEmbedded} embedded-button embedded-button-compile` : props.classes.iconButton}`}
          onClick={openDialog}
          size={"large"}
          aria-label="Compile code"
        >
          <FontAwesomeIcon icon={faClipboardCheck} size={isEmbedded ? "sm" : "xs"} />
        </IconButton>
      </Tooltip>

      <CompilationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        selectedBoard={props.selectedBoard}
        compiler={props.compiler}
        code={props.arduino}
        filename={props.name || "sketch"}
        platform={isEmbedded ? true : props.platform}
        appLink={props.appLink || ""}
        isEmbedded={isEmbedded}
      />
    </div>
  );
};

Compile.propTypes = {
  arduino: PropTypes.string.isRequired,
  name: PropTypes.string,
  workspaceName: PropTypes.func.isRequired,
  platform: PropTypes.bool.isRequired,
  compiler: PropTypes.string.isRequired,
  selectedBoard: PropTypes.string.isRequired,
  iconButton: PropTypes.bool,
  appLink: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  arduino: state.workspace.code.arduino,
  name: state.workspace.name,
  platform: state.general.platform,
  compiler: state.general.compiler,
  selectedBoard: state.board.board,
  appLink: state.general.appLink,
  language: state.general.language,
});

export default connect(mapStateToProps, { workspaceName })(
  withStyles(styles)(Compile),
);
