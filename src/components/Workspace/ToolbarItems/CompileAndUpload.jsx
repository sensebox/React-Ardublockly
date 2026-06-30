import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { IconButton, Tooltip, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import withStyles from "@mui/styles/withStyles";
import CompileAndUploadDialog from "./CompileAndUploadDialog/CompileAndUploadDialog";
import { FlashProvider } from "./CompileAndUploadDialog/FlashContext";
import compileAndUploadSteps from "./CompileAndUploadDialog/steps";

const styles = (theme) => ({
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
});

const CompileAndUpload = (props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const isEmbedded = useSelector((state) => state.general.embeddedMode);

  const tooltipText = "Compile and Upload";

  return (
    <div>
      {isEmbedded ? (
        <Button
          className="compileAndUpload embedded-button"
          onClick={() => setDialogOpen(true)}
          variant="contained"
          startIcon={<FontAwesomeIcon icon={faUpload} size="sm" />}
          aria-label="Compile and Upload"
        >
          Compile and Upload
        </Button>
      ) : (
        <Tooltip title={tooltipText} arrow style={{ marginRight: "5px" }}>
          <IconButton
            className={`compileAndUpload ${props.classes.iconButton}`}
            onClick={() => setDialogOpen(true)}
            size="large"
            aria-label="Compile and Upload"
          >
            <FontAwesomeIcon icon={faUpload} size="xs" />
          </IconButton>
        </Tooltip>
      )}

      <FlashProvider key={dialogOpen ? "open" : "closed"} open={dialogOpen}>
        <CompileAndUploadDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title={tooltipText}
          steps={compileAndUploadSteps}
        />
      </FlashProvider>
    </div>
  );
};

CompileAndUpload.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CompileAndUpload);
