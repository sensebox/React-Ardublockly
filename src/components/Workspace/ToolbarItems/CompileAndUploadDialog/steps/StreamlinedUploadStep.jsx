import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import UsbIcon from "@mui/icons-material/Usb";
import { useFlash } from "../FlashContext";
import { useSelector } from "react-redux";
import {
  AnimatedCheck,
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

  // Show upload in progress
  if (status === "flashing" || (compileStatus === "compiling" && port)) {
    return (
      <div className="cau-step">
        <Spinner icon={<UsbIcon style={{ fontSize: 32 }} />} />
        <h3 className="cau-step__title">
          {compileStatus === "compiling" ? "Kompiliere..." : "Lade hoch..."}
        </h3>
        {compileStatus === "compiling" && (
          <p className="cau-step__text">
            Sketch wird zu Binärdatei kompiliert...
          </p>
        )}
        {status === "flashing" && (
          <>
            <p className="cau-step__text">Lade auf Mikrocontroller hoch...</p>
            {progress > 0 && <CuteProgress value={progress} />}
          </>
        )}
        {log && (
          <DetailAccordion title="📋 Log" content={log} isError={false} />
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
        <h3 className="cau-step__title">Upload fehlgeschlagen</h3>
        {compileError && (
          <DetailAccordion
            title="🔍 Kompilierungsfehler"
            content={compileError}
            isError
          />
        )}
        {error && (
          <DetailAccordion title="🔍 Upload-Fehler" content={error} isError />
        )}
        {log && <DetailAccordion title="📋 Upload-Log" content={log} isError />}
        <div style={{ marginTop: "20px" }}>
          <button
            type="button"
            className="cau-button cau-button--secondary"
            onClick={handleManualUpload}
          >
            Erneut versuchen
          </button>
          {port && (
            <button
              type="button"
              className="cau-button cau-button--secondary"
              onClick={handleSelectDevice}
              style={{ marginLeft: "10px" }}
            >
              Anderes Gerät
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
        <h3 className="cau-step__title">Kompilierung fehlgeschlagen</h3>
        {compileError && (
          <DetailAccordion
            title="🔍 Kompilierungsfehler"
            content={compileError}
            isError
          />
        )}
        {log && <DetailAccordion title="📋 Log" content={log} isError />}
      </div>
    );
  }

  // FIRST UPLOAD: Show device selection
  if (!port) {
    return (
      <div className="cau-step">
        <UsbIcon style={{ fontSize: 64, color: "#3ab0e8" }} />
        <h3 className="cau-step__title">Schritt 1: Gerät auswählen</h3>
        <p className="cau-step__text">
          Verbinde die senseBox MCU-S2 (ESP32-S2) per USB und wähle sie aus.
        </p>
        <button
          type="button"
          className="cau-button cau-button--secondary"
          onClick={handleSelectDevice}
          disabled={isSelectingDevice}
          style={{ marginTop: "20px" }}
        >
          {isSelectingDevice
            ? "Auswahl wird hergestellt..."
            : "🔌 Gerät auswählen"}
        </button>
        {compileStatus === "compiling" && (
          <p style={{ fontSize: "14px", color: "#666", marginTop: "15px" }}>
            (Kompilierung läuft parallel)
          </p>
        )}
        {error && (
          <DetailAccordion title="🔍 Fehlerdetails" content={error} isError />
        )}
      </div>
    );
  }

  // After the 1200bps touch the board re-enumerated as a new USB device the
  // browser has no permission for yet. Ask for one explicit click so the picker
  // opens with fresh user activation. This can happen in the first-time flow as
  // well as the automatic flow (where bootloaderPortPrepared is already true),
  // so it is checked independently of that flag.
  if (port && needsBootloaderPermission) {
    return (
      <div className="cau-step">
        <UsbIcon style={{ fontSize: 64, color: "#3ab0e8" }} />
        <h3 className="cau-step__title">Bootloader-Port auswählen</h3>
        <p className="cau-step__text">
          Das Board ist jetzt im Download-Modus und meldet sich als neues
          USB-Gerät. Bitte wähle es einmalig aus, damit der Browser die
          Berechtigung erhält. Danach läuft der Upload automatisch.
        </p>
        <button
          type="button"
          className="cau-button cau-button--primary"
          onClick={handleGrantBootloaderPort}
          disabled={isGrantingPort}
          style={{ marginTop: "20px" }}
        >
          {isGrantingPort
            ? "Warte auf Auswahl..."
            : "🔌 Bootloader-Port auswählen"}
        </button>
        {error && (
          <DetailAccordion title="🔍 Fehlerdetails" content={error} isError />
        )}
      </div>
    );
  }

  // FIRST UPLOAD: Show bootloader preparation
  if (port && !bootloaderPortPrepared) {
    return (
      <div className="cau-step">
        <UsbIcon style={{ fontSize: 64, color: "#3ab0e8" }} />
        <h3 className="cau-step__title">Schritt 2: Bootloader vorbereiten</h3>
        <p className="cau-step__text">{deviceLabel}</p>
        <p style={{ fontSize: "14px", color: "#666", marginTop: "10px" }}>
          Der Bootloader wird vorbereitet, um alle Berechtigungen zu erhalten.
          Dies ist nur beim ersten Mal nötig.
        </p>
        <button
          type="button"
          className="cau-button cau-button--primary"
          onClick={handlePrepareBootloader}
          disabled={isPreparingBootloader}
          style={{ marginTop: "20px" }}
        >
          {isPreparingBootloader
            ? "Bootloader wird vorbereitet..."
            : "⚙️ Bootloader vorbereiten"}
        </button>
        <button
          type="button"
          className="cau-button cau-button--secondary"
          onClick={handleSelectDevice}
          style={{ marginLeft: "10px", marginTop: "20px" }}
        >
          Anderes Gerät
        </button>
        {compileStatus === "compiling" && (
          <p style={{ fontSize: "14px", color: "#666", marginTop: "15px" }}>
            (Kompilierung läuft parallel)
          </p>
        )}
        {error && (
          <DetailAccordion title="🔍 Fehlerdetails" content={error} isError />
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
