import React, { useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import UsbIcon from "@mui/icons-material/Usb";
import * as Blockly from "blockly/core";
import { useFlash } from "./useFlash";
import {
  Spinner,
  CuteProgress,
  AnimatedCheck,
  AnimatedCross,
  DetailAccordion,
} from "./StatusIndicators";
import "./wizardAnimations.css";

/**
 * Compact progress dialog for the "connected" compile flow: the user already
 * connected a device via the navbar, so pressing the normal compile button
 * compiles the sketch and flashes it straight to the microcontroller. This
 * dialog only mirrors the shared flashing state from {@link useFlash} and shows
 * compile → upload → done (or an error). The actual work is kicked off by the
 * compile button that opens this dialog.
 */
function UploadProgressDialog({ open, onClose }) {
  const {
    status,
    progress,
    log,
    error,
    compileStatus,
    compileError,
    needsBootloaderPermission,
    grantBootloaderPort,
  } = useFlash();

  // Close automatically a moment after a successful upload.
  useEffect(() => {
    if (open && status === "done") {
      const timer = setTimeout(onClose, 2500);
      return () => clearTimeout(timer);
    }
  }, [open, status, onClose]);

  const isError = status === "error" || compileStatus === "error";
  const canClose = isError || status === "done" || needsBootloaderPermission;

  let body;
  if (needsBootloaderPermission && !isError) {
    // First-time only: the re-enumerated ROM bootloader port needs a one-off
    // permission that must come from a fresh user gesture (this button).
    body = (
      <div className="cau-step">
        <UsbIcon style={{ fontSize: 64, color: "#3ab0e8" }} />
        <h3 className="cau-step__title">
          {Blockly.Msg.uploadSelectBootloaderTitle}
        </h3>
        <p className="cau-step__text">
          {Blockly.Msg.uploadSelectBootloaderText}
        </p>
        <button
          type="button"
          className="cau-button cau-button--primary"
          style={{ marginTop: "20px" }}
          onClick={() => grantBootloaderPort(true)}
        >
          {Blockly.Msg.uploadSelectBootloaderButton}
        </button>
      </div>
    );
  } else if (isError) {
    body = (
      <div className="cau-step">
        <AnimatedCross />
        <h3 className="cau-step__title">{Blockly.Msg.summaryErrorTitle}</h3>
        <p className="cau-error-text">
          {compileError || error || Blockly.Msg.summaryErrorText}
        </p>
        <button type="button" className="cau-button" onClick={onClose}>
          {Blockly.Msg.summaryCloseButton}
        </button>
        {log && (
          <DetailAccordion
            title={Blockly.Msg.uploadLog}
            content={log}
            isError
          />
        )}
      </div>
    );
  } else if (status === "done") {
    body = (
      <div className="cau-step">
        <AnimatedCheck size={96} />
        <h3 className="cau-step__title">{Blockly.Msg.summarySuccessTitle}</h3>
        <p className="cau-step__text">{Blockly.Msg.summarySuccessText}</p>
        <button type="button" className="cau-button" onClick={onClose}>
          {Blockly.Msg.summaryCloseButton}
        </button>
      </div>
    );
  } else {
    body = (
      <div className="cau-step">
        <Spinner icon={<UsbIcon style={{ fontSize: 32 }} />} />
        <h3 className="cau-step__title">
          {compileStatus === "compiling"
            ? Blockly.Msg.uploadCompiling
            : Blockly.Msg.uploadUploading}
        </h3>
        {compileStatus === "compiling" && (
          <p className="cau-step__text">{Blockly.Msg.uploadCompileText}</p>
        )}
        {status === "flashing" && (
          <>
            <p className="cau-step__text">{Blockly.Msg.uploadFlashText}</p>
            {progress > 0 && <CuteProgress value={progress} />}
          </>
        )}
        {log && <DetailAccordion title={Blockly.Msg.uploadLog} content={log} />}
      </div>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={canClose ? onClose : undefined}
      PaperProps={{
        style: {
          width: "600px",
          minHeight: "60vh",
          maxHeight: "70vh",
          borderRadius: "16px",
        },
      }}
    >
      <DialogTitle
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {Blockly.Msg.upload_dialog_title}
        {canClose && (
          <IconButton onClick={onClose} size="small" aria-label="Close">
            <FontAwesomeIcon icon={faXmark} />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent
        style={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <Box
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "auto",
          }}
        >
          {body}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

UploadProgressDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UploadProgressDialog;
