import React from "react";
import { Dialog, IconButton } from "@mui/material";
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  ArrowBackIos as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIcon,
} from "@mui/icons-material";

const Lightbox = ({
  open,
  src,
  flatSamples = [],
  onClose,
  onPrev,
  onNext,
  onDelete,
}) => {
  return (
    <Dialog
      open={!!open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          backgroundColor: "rgba(0,0,0,0.95)",
          boxShadow: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          position: "relative",
        },
      }}
      BackdropProps={{ sx: { backgroundColor: "rgba(0,0,0,0.7)" } }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: 8, right: 8, color: "white" }}
        aria-label="close"
        size="large"
      >
        <CloseIcon />
      </IconButton>
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          onDelete && onDelete();
        }}
        sx={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          color: "white",
          bgcolor: "error.main",
          width: 64,
          height: 64,
          zIndex: 1400,
          "&:hover": { bgcolor: "error.dark" },
          boxShadow: 3,
        }}
        aria-label="delete"
        size="large"
      >
        <DeleteIcon sx={{ fontSize: 22 }} />
      </IconButton>

      {src && (
        <>
          {flatSamples.length > 1 && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onPrev && onPrev();
              }}
              sx={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "white",
              }}
              size="large"
              aria-label="previous"
            >
              <ArrowBackIcon />
            </IconButton>
          )}

          <img
            src={src}
            alt="Preview"
            onClick={(e) => e.stopPropagation()}
            style={{ width: "70vw", height: "70vh", objectFit: "contain" }}
          />

          {flatSamples.length > 1 && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onNext && onNext();
              }}
              sx={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "white",
              }}
              size="large"
              aria-label="next"
            >
              <ArrowForwardIcon />
            </IconButton>
          )}
        </>
      )}
    </Dialog>
  );
};

export default Lightbox;
