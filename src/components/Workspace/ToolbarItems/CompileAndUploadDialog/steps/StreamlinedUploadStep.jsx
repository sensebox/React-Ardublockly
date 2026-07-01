import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import UsbIcon from "@mui/icons-material/Usb";
import * as Blockly from "blockly/core";
import { useFlash } from "../useFlash";
import { useSelector } from "react-redux";
import {
  AnimatedCross,
  CuteProgress,
  Spinner,
  DetailAccordion,
} from "../StatusIndicators";

/**
 * Streamlined single-step upload flow:
 *
 * FIRST UPLOAD (no bootloaderPortPrepared):
 * - User selects device manually
 * - User clicks "Prepare Bootloader" to authorize & get permissions
 * - After 1200bps touch, automatically starts compilation & upload
 *
 * SUBSEQUENT UPLOADS (bootloaderPortPrepared === true):
 * - Automatically reconnects to saved device
 * - Automatically compiles & uploads
 * - User just opens dialog and waits
 */
function StreamlinedUploadStep({ goNext }) {
  const {
    port,
    deviceLabel,
    status,
    progress,
    log,
    error,
    compileStatus,
    compileError,
    needsBootloaderPermission,
    selectDevice,
    prepareBootloaderMode,
    grantBootloaderPort,
    startFlash,
  } = useFlash();

  const bootloaderPortPrepared = useSelector(
    (state) => state.board.bootloaderPortPrepared,
  );

  const [isSelectingDevice, setIsSelectingDevice] = useState(false);
  const [isPreparingBootloader, setIsPreparingBootloader] = useState(false);
  const [isGrantingPort, setIsGrantingPort] = useState(false);

  // Handle device selection
  const handleSelectDevice = async () => {
    setIsSelectingDevice(true);
    try {
      await selectDevice();
    } finally {
      setIsSelectingDevice(false);
    }
  };

  // Prepare bootloader with 1200bps touch & get permissions
  const handlePrepareBootloader = async () => {
    setIsPreparingBootloader(true);
    try {
      await prepareBootloaderMode();
      // After bootloader is prepared, auto-upload will trigger via useEffect
    } finally {
      setIsPreparingBootloader(false);
    }
  };

  // First-time only: grant access to the re-enumerated bootloader port. Runs
  // straight from this click so navigator.serial.requestPort() keeps the fresh
  // user activation it requires.
  const handleGrantBootloaderPort = async () => {
    setIsGrantingPort(true);
    try {
      await grantBootloaderPort();
      // Once granted, auto-upload triggers via the useEffect in FlashContext.
    } finally {
      setIsGrantingPort(false);
    }
  };

  // Manual upload trigger (fallback if auto-upload doesn't trigger)
  const handleManualUpload = async () => {
    try {
      await startFlash();
    } catch (err) {
      // Error is handled in FlashContext
    }
  };

  // Auto-advance after successful upload
  useEffect(() => {
    if (status === "done") {
      const timer = setTimeout(goNext, 200);
      return () => clearTimeout(timer);
    }
  }, [status, goNext]);

  // The bootloader-permission prompt MUST take priority over every other
  // "busy" view. After the 1200bps touch the parallel compilation is often
  // still running (compileStatus === "compiling"), and in Chrome the USB
  // re-enumeration finishes before the compile does. If the compiling spinner
  // were rendered first it would mask the "Bootloader-Port auswählen" button,
  // and the user would never get the chance to grant the second permission
  // (which requires a fresh user gesture). So check this case up front.
  if (port && needsBootloaderPermission) {
    return (
      <div className="cau-step">
        <UsbIcon style={{ fontSize: 64, color: "#3ab0e8" }} />
        <h3 className="cau-step__title">
          {Blockly.Msg.compile_upload?.uploadSelectBootloaderTitle}
        </h3>
        <p className="cau-step__text">
          {Blockly.Msg.compile_upload?.uploadSelectBootloaderText}
        </p>
        <button
          type="button"
          className="cau-button cau-button--primary"
          onClick={handleGrantBootloaderPort}
          disabled={isGrantingPort}
          style={{ marginTop: "20px" }}
        >
          {isGrantingPort
            ? Blockly.Msg.compile_upload?.uploadWaitingSelection
            : Blockly.Msg.compile_upload?.uploadSelectBootloaderButton}
        </button>
        {error && (
          <DetailAccordion
            title={Blockly.Msg.compile_upload?.deviceErrorDetails}
            content={error}
            isError
          />
        )}
      </div>
    );
  }

  // FIRST UPLOAD: Show device selection
  if (!port) {
    return (
      <div className="cau-step">
        <UsbIcon style={{ fontSize: 64, color: "#3ab0e8" }} />
        <h3 className="cau-step__title">
          {Blockly.Msg.compile_upload?.uploadStep1Title}
        </h3>
        <p className="cau-step__text">
          {Blockly.Msg.compile_upload?.uploadStep1Text}
        </p>
        <button
          type="button"
          className="cau-button cau-button--secondary"
          onClick={handleSelectDevice}
          disabled={isSelectingDevice}
          style={{ marginTop: "20px" }}
        >
          {isSelectingDevice
            ? Blockly.Msg.compile_upload?.uploadDeviceSelectionDisabled
            : Blockly.Msg.compile_upload?.deviceSelectButton}
        </button>
        {/* {compileStatus === "compiling" && (
          <p style={{ fontSize: "14px", color: "#666", marginTop: "15px" }}>
            {Blockly.Msg.compile_upload?.uploadCompileRunning}
          </p>
        )} */}
        {error && (
          <DetailAccordion
            title={Blockly.Msg.compile_upload?.deviceErrorDetails}
            content={error}
            isError
          />
        )}
      </div>
    );
  }

  // FIRST UPLOAD: Show bootloader preparation
  if (port && !bootloaderPortPrepared) {
    return (
      <div className="cau-step">
        <UsbIcon style={{ fontSize: 64, color: "#3ab0e8" }} />
        <h3 className="cau-step__title">
          {Blockly.Msg.compile_upload?.uploadStep2Title}
        </h3>
        <p className="cau-step__text">{deviceLabel}</p>
        <p style={{ fontSize: "14px", color: "#666", marginTop: "10px" }}>
          {Blockly.Msg.compile_upload?.uploadStep2Text}
        </p>
        <button
          type="button"
          className="cau-button cau-button--primary"
          onClick={handlePrepareBootloader}
          disabled={isPreparingBootloader}
          style={{ marginTop: "20px" }}
        >
          {isPreparingBootloader
            ? Blockly.Msg.compile_upload?.uploadBootloaderPreparingButton
            : Blockly.Msg.compile_upload?.uploadBootloaderPrepareButton}
        </button>
        <button
          type="button"
          className="cau-button cau-button--secondary"
          onClick={handleSelectDevice}
          style={{ marginLeft: "10px", marginTop: "20px" }}
        >
          {Blockly.Msg.compile_upload?.uploadSelectOtherDevice}
        </button>
        {compileStatus === "compiling" && (
          <p style={{ fontSize: "14px", color: "#666", marginTop: "15px" }}>
            {Blockly.Msg.compile_upload?.uploadCompileRunning}
          </p>
        )}
        {error && (
          <DetailAccordion
            title={Blockly.Msg.compile_upload?.deviceErrorDetails}
            content={error}
            isError
          />
        )}
      </div>
    );
  }

  // Show upload in progress
  if (
    (status === "flashing" || (compileStatus === "compiling" && port)) &&
    bootloaderPortPrepared
  ) {
    return (
      <div className="cau-step">
        <Spinner icon={<UsbIcon style={{ fontSize: 32 }} />} />
        <h3 className="cau-step__title">
          {compileStatus === "compiling"
            ? Blockly.Msg.compile_upload?.uploadCompiling
            : Blockly.Msg.compile_upload?.uploadUploading}
        </h3>
        {compileStatus === "compiling" && (
          <p className="cau-step__text">
            {Blockly.Msg.compile_upload?.uploadCompileText}
          </p>
        )}
        {status === "flashing" && (
          <>
            <p className="cau-step__text">
              {Blockly.Msg.compile_upload?.uploadFlashText}
            </p>
            {progress > 0 && <CuteProgress value={progress} />}
          </>
        )}
        {log && (
          <DetailAccordion
            title={Blockly.Msg.compile_upload?.uploadLog}
            content={log}
            isError={false}
          />
        )}
      </div>
    );
  }

  //   // Show upload success
  //   if (status === "done") {
  //     return (
  //       <div className="cau-step">
  //         <AnimatedCheck color="#3ab0e8" />
  //         <h3 className="cau-step__title">Upload erfolgreich! 🎉</h3>
  //         <p className="cau-step__text">
  //           Der Sketch wurde auf den Mikrocontroller hochgeladen.
  //         </p>
  //         <p style={{ fontSize: "14px", color: "#666", marginTop: "10px" }}>
  //           {bootloaderPortPrepared
  //             ? "Beim nächsten Mal startet der Upload automatisch."
  //             : ""}
  //         </p>
  //       </div>
  //     );
  //   }

  // Show upload error
  if (status === "error") {
    return (
      <div className="cau-step">
        <AnimatedCross color="#e53935" />
        <h3 className="cau-step__title">
          {Blockly.Msg.compile_upload?.uploadErrorTitle}
        </h3>
        {compileError && (
          <DetailAccordion
            title={Blockly.Msg.compile_upload?.uploadCompileErrorDetails}
            content={compileError}
            isError
          />
        )}
        {error && (
          <DetailAccordion
            title={Blockly.Msg.compile_upload?.uploadErrorDetails}
            content={error}
            isError
          />
        )}
        {log && (
          <DetailAccordion
            title={Blockly.Msg.compile_upload?.uploadErrorLog}
            content={log}
            isError
          />
        )}
        <div style={{ marginTop: "20px" }}>
          <button
            type="button"
            className="cau-button cau-button--secondary"
            onClick={handleManualUpload}
          >
            {Blockly.Msg.compile_upload?.compileRetryButton}
          </button>
          {port && (
            <button
              type="button"
              className="cau-button cau-button--secondary"
              onClick={handleSelectDevice}
              style={{ marginLeft: "10px" }}
            >
              {Blockly.Msg.compile_upload?.uploadSelectOtherDevice}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Show compilation error
  if (compileStatus === "error") {
    return (
      <div className="cau-step">
        <AnimatedCross color="#e53935" />
        <h3 className="cau-step__title">
          {Blockly.Msg.compile_upload?.uploadCompileErrorTitle}
        </h3>
        {compileError && (
          <DetailAccordion
            title={Blockly.Msg.compile_upload?.uploadCompileErrorDetails}
            content={compileError}
            isError
          />
        )}
        {log && (
          <DetailAccordion
            title={Blockly.Msg.compile_upload?.uploadLog}
            content={log}
            isError
          />
        )}
      </div>
    );
  }

  //   // SECOND+ UPLOAD: Ready and auto-uploading (bootloader prepared)
  //   // This is mostly for display while auto-upload triggers in background
  //   return (
  //     <div className="cau-step">
  //       <Spinner icon={<UsbIcon style={{ fontSize: 32 }} />} />
  //       <h3 className="cau-step__title">Bereite Upload vor...</h3>
  //       <p className="cau-step__text">
  //         {compileStatus === "compiling"
  //           ? "Kompilation wird vorbereitet..."
  //           : "Upload wird gestartet..."}
  //       </p>
  //       <p style={{ fontSize: "14px", color: "#666", marginTop: "15px" }}>
  //         Gerät: {deviceLabel}
  //       </p>
  //       {log && <DetailAccordion title="📋 Log" content={log} isError={false} />}
  //     </div>
  //   );
}

StreamlinedUploadStep.propTypes = {
  goNext: PropTypes.func.isRequired,
};

export default StreamlinedUploadStep;
