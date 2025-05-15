"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import { Button, IconButton, Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardCheck } from "@fortawesome/free-solid-svg-icons";
import CompilationDialog from "./compilation-dialog";

function CompileButton({
  iconButton,
  code,
  filename,
  compiler,
  selectedBoard,
  className,
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCompileClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      {iconButton ? (
        <Tooltip title="Code kompilieren" arrow>
          <IconButton
            className={className}
            onClick={handleCompileClick}
            size="large"
          >
            <FontAwesomeIcon icon={faClipboardCheck} size="xs" />
          </IconButton>
        </Tooltip>
      ) : (
        <Button
          variant="contained"
          className={className}
          onClick={handleCompileClick}
        >
          <FontAwesomeIcon
            icon={faClipboardCheck}
            style={{ marginRight: "5px" }}
          />
          Kompilieren
        </Button>
      )}

      <CompilationDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        selectedBoard={selectedBoard}
        compiler={compiler}
        code={code}
        filename={filename}
      />
    </>
  );
}

CompileButton.propTypes = {
  iconButton: PropTypes.bool,
  code: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
  compiler: PropTypes.string.isRequired,
  selectedBoard: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default CompileButton;
