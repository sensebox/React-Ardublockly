import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import UploadIcon from "@mui/icons-material/Upload";
import * as Blockly from "blockly/core";
import { useFlash } from "../FlashContext";
import {
  Spinner,
  AnimatedCheck,
  AnimatedCross,
  CuteProgress,
  DetailAccordion,
} from "../StatusIndicators";

/**
 * Step: Flashes the compiled binary onto the microcontroller. The upload starts
 * automatically as soon as a device is available, shows a live progress bar that
 * turns into a checkmark when finished, and then advances to the summary.
 */
function FlashStep({ goNext, goBack }) {
  const {
    port,
    status,
    progress,
    error,
    log,
    startFlash,
    compileStatus,
    resetDevice,
  } = useFlash();

  const isFlashing = status === "flashing";
  const isDone = status === "done";
  const isError = status === "error";

  // Kick off the upload automatically once the binary is ready and a device is
  // selected. The ref guards against re-triggering on re-renders.
  const flashStarted = useRef(false);
  useEffect(() => {
    if (
      port &&
      status === "idle" &&
      compileStatus === "compiled" &&
      !flashStarted.current
    ) {
      flashStarted.current = true;
      startFlash();
    }
  }, [port, status, compileStatus, startFlash]);

  // Auto-advance to the summary once the upload finished.
  useEffect(() => {
    if (!isDone) return undefined;
    const timer = setTimeout(goNext, 1200);
    return () => clearTimeout(timer);
  }, [isDone, goNext]);

  const retry = () => {
    resetDevice();
    goBack();
  };

  return (
    <div className="cau-step">
      {isDone && (
        <>
          <AnimatedCheck />
          <h3 className="cau-step__title">
            {Blockly.Msg.compile_upload?.flashDoneTitle}
          </h3>
        </>
      )}
      {isError && (
        <>
          <AnimatedCross />
          <h3 className="cau-step__title">
            {Blockly.Msg.compile_upload?.flashErrorTitle}
          </h3>
          <p className="cau-error-text">
            {error || Blockly.Msg.compile_upload?.flashErrorText}
          </p>
          <button type="button" className="cau-button" onClick={retry}>
            {Blockly.Msg.compile_upload?.flashRetryButton}
          </button>
          {log && (
            <DetailAccordion
              title={Blockly.Msg.compile_upload?.flashLogDetails}
              content={log}
              isError={true}
            />
          )}
        </>
      )}
      {!isDone && !isError && (
        <>
          <Spinner icon={<UploadIcon style={{ fontSize: 32 }} />} />
          <h3 className="cau-step__title">
            {isFlashing
              ? Blockly.Msg.compile_upload?.flashTitleUploading
              : Blockly.Msg.compile_upload?.flashTitlePreparing}
          </h3>
          <p className="cau-step__text">
            {Blockly.Msg.compile_upload?.flashText}
          </p>
          {isFlashing && <CuteProgress value={progress} />}
        </>
      )}
    </div>
  );
}

FlashStep.propTypes = {
  goNext: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
};

export default FlashStep;
