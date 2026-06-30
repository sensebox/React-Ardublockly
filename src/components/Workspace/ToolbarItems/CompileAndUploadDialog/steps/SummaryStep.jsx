import React from "react";
import PropTypes from "prop-types";
import { useFlash } from "../FlashContext";
import { AnimatedCheck, AnimatedCross, DetailAccordion } from "../StatusIndicators";

/**
 * Step: Friendly closing screen confirming the upload and telling the user that
 * the senseBox restarts on its own and runs the freshly uploaded sketch.
 */
function SummaryStep({ onClose }) {
  const { status, error, log } = useFlash();

  if (status === "error") {
    return (
      <div className="cau-step">
        <AnimatedCross />
        <h3 className="cau-step__title">Etwas ist schiefgelaufen</h3>
        <p className="cau-error-text">
          {error || "Beim Upload ist ein Fehler aufgetreten."}
        </p>
        <button type="button" className="cau-button" onClick={onClose}>
          Schließen
        </button>
      </div>
    );
  }

  return (
    <div className="cau-step">
      <AnimatedCheck size={96} />
      <h3 className="cau-step__title">Erfolgreich hochgeladen!</h3>
      <p className="cau-step__text">
        Dein Programm wurde erfolgreich auf die senseBox übertragen. Die senseBox
        startet jetzt automatisch neu und führt deinen Sketch aus. 🎉
      </p>
      <button type="button" className="cau-button" onClick={onClose}>
        Fertig
      </button>
      {log && <DetailAccordion title="Upload Protokoll" content={log} />}
    </div>
  );
}

SummaryStep.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default SummaryStep;
