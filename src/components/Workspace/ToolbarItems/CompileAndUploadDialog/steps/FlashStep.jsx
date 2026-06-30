import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import UploadIcon from "@mui/icons-material/Upload";
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
function FlashStep({ goNext }) {
  const { port, status, progress, error, log, startFlash, compileStatus } =
    useFlash();

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
    flashStarted.current = true;
    startFlash();
  };

  return (
    <div className="cau-step">
      {isDone ? (
        <>
          <AnimatedCheck />
          <h3 className="cau-step__title">Hochgeladen!</h3>
        </>
      ) : isError ? (
        <>
          <AnimatedCross />
          <h3 className="cau-step__title">Upload fehlgeschlagen</h3>
          <p className="cau-error-text">
            {error || "Beim Upload ist ein Fehler aufgetreten."}
          </p>
          <button type="button" className="cau-button" onClick={retry}>
            Erneut versuchen
          </button>
        </>
      ) : (
        <>
          <Spinner icon={<UploadIcon style={{ fontSize: 32 }} />} />
          <h3 className="cau-step__title">
            {isFlashing ? "Wird hochgeladen" : "Upload wird vorbereitet"}
          </h3>
          <p className="cau-step__text">
            Bitte trenne die senseBox jetzt nicht vom Computer.
          </p>
          {isFlashing && <CuteProgress value={progress} />}
        </>
      )}
    </div>
  );
}

FlashStep.propTypes = {
  goNext: PropTypes.func.isRequired,
};

export default FlashStep;
