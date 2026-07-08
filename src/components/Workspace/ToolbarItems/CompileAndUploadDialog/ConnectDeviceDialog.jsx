import React, { useEffect, useState } from "react";
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
  AnimatedCheck,
  AnimatedCross,
  DetailAccordion,
} from "./StatusIndicators";
import "./wizardAnimations.css";

/**
 * Guided "connect device" dialog opened from the navbar button.
 *
 * It briefly explains that connecting obtains the required Web Serial
 * permissions and prepares the board (1200bps touch → bootloader mode) so the
 * user can upload straight from Blockly afterwards. The user only has to pick
 * "senseBox MCU-S2 ESP32-S2" in the first browser picker and "ESP32-S2" in the
 * one-off bootloader picker.
 *
 * Phases:
 *  - intro:   explanation + connect button
 *  - working: connecting / preparing bootloader (spinner)
 *  - grant:   first-time only, pick the re-enumerated "ESP32-S2" bootloader port
 *  - done:    board connected and prepared
 *  - error:   something went wrong (retry / close)
 */
function ConnectDeviceDialog({ open, onClose }) {
  const {
    connect,
    grantBootloaderPort,
    bootloaderReady,
    needsBootloaderPermission,
    error,
    log,
  } = useFlash();

  const [phase, setPhase] = useState("intro");

  // Reset back to the intro screen whenever the dialog is (re)opened.
  useEffect(() => {
    if (open) setPhase("intro");
  }, [open]);

  // Drive the phase transitions from the shared flashing state while a
  // connect/grant operation is running.
  useEffect(() => {
    if (phase !== "working" && phase !== "grant") return;
    if (error) {
      setPhase("error");
    } else if (bootloaderReady) {
      setPhase("done");
    } else if (needsBootloaderPermission) {
      setPhase("grant");
    }
  }, [phase, error, bootloaderReady, needsBootloaderPermission]);

  const handleConnect = async () => {
    setPhase("working");
    const connected = await connect();
    // The user dismissed the browser port picker – return to the intro screen
    // instead of showing an endless spinner.
    if (!connected) setPhase("intro");
  };

  const handleGrant = async () => {
    setPhase("working");
    await grantBootloaderPort(false);
  };

  const canClose = phase === "intro" || phase === "done" || phase === "error";

  let body;
  if (phase === "done") {
    body = (
      <div className="cau-step">
        <AnimatedCheck size={96} />
        <h3 className="cau-step__title">
          {Blockly.Msg.connect_dialog_done_title}
        </h3>
        <p className="cau-step__text">{Blockly.Msg.connect_dialog_done_text}</p>
        <button type="button" className="cau-button" onClick={onClose}>
          {Blockly.Msg.connect_dialog_close}
        </button>
      </div>
    );
  } else if (phase === "error") {
    body = (
      <div className="cau-step">
        <AnimatedCross />
        <h3 className="cau-step__title">
          {Blockly.Msg.connect_dialog_error_title}
        </h3>
        <p className="cau-error-text">{error}</p>
        <button
          type="button"
          className="cau-button cau-button--primary"
          onClick={handleConnect}
        >
          {Blockly.Msg.connect_dialog_retry}
        </button>
        {log && (
          <DetailAccordion
            title={Blockly.Msg.deviceErrorDetails}
            content={log}
            isError
          />
        )}
      </div>
    );
  } else if (phase === "grant") {
    body = (
      <div className="cau-step">
        <UsbIcon style={{ fontSize: 64, color: "#3ab0e8" }} />
        <h3 className="cau-step__title">
          {Blockly.Msg.connect_dialog_grant_title}
        </h3>
        <p className="cau-step__text">
          {Blockly.Msg.connect_dialog_grant_text}
        </p>
        <button
          type="button"
          className="cau-button cau-button--primary"
          style={{ marginTop: "20px" }}
          onClick={handleGrant}
        >
          {Blockly.Msg.connect_dialog_grant_button}
        </button>
      </div>
    );
  } else if (phase === "working") {
    body = (
      <div className="cau-step">
        <Spinner icon={<UsbIcon style={{ fontSize: 32 }} />} />
        <h3 className="cau-step__title">
          {Blockly.Msg.connect_dialog_working}
        </h3>
      </div>
    );
  } else {
    // intro
    body = (
      <div className="cau-step">
        <UsbIcon style={{ fontSize: 64, color: "#3ab0e8" }} />
        <h3 className="cau-step__title">{Blockly.Msg.connect_dialog_title}</h3>
        <p className="cau-step__text">{Blockly.Msg.connect_dialog_intro}</p>
        <ul
          style={{
            textAlign: "left",
            margin: "0.5rem auto 0",
            maxWidth: "420px",
            lineHeight: 1.6,
          }}
        >
          <li>{Blockly.Msg.connect_dialog_pick_device}</li>
          <li>{Blockly.Msg.connect_dialog_pick_bootloader}</li>
        </ul>
        <button
          type="button"
          className="cau-button cau-button--primary"
          style={{ marginTop: "20px" }}
          onClick={handleConnect}
        >
          {Blockly.Msg.connect_dialog_button}
        </button>
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
          minHeight: "50vh",
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
        {Blockly.Msg.connect_dialog_title}
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

ConnectDeviceDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ConnectDeviceDialog;
