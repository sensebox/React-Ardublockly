import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme) => ({
  success: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  error: {
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.error.contrastText,
  },
}));

export default function AppSnackbar(props) {
  const { open: initialOpen, message, type, snackbarKey, onClose } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(initialOpen);

  // Sync open state with prop changes
  useEffect(() => {
    setOpen(initialOpen);
  }, [initialOpen]);

  useEffect(() => {
    let timeout;
    if (open) {
      timeout = setTimeout(() => {
        setOpen(false);
        if (onClose) onClose();
      }, 5000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [open, onClose]);

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      open={open}
      key={snackbarKey}
      style={{
        left: "22px",
        bottom: "40px",
        width: "300px",
        zIndex: "100",
      }}
    >
      <SnackbarContent
        style={{ flexWrap: "nowrap" }}
        className={type === "error" ? classes.error : classes.success}
        message={message}
        action={
          <IconButton
            onClick={handleClose}
            style={{ color: "inherit" }}
            size="large"
          >
            <FontAwesomeIcon icon={faTimes} size="xs" />
          </IconButton>
        }
      />
    </Snackbar>
  );
}
