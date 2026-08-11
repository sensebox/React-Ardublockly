import React from "react";
import PropTypes from "prop-types";
import * as Blockly from "blockly/core";
import { useFlash } from "../useFlash";
import {
  AnimatedCheck,
  AnimatedCross,
  DetailAccordion,
} from "../StatusIndicators";

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
        <h3 className="cau-step__title">{Blockly.Msg.summaryErrorTitle}</h3>
        <p className="cau-error-text">
          {error || Blockly.Msg.summaryErrorText}
        </p>
        <button type="button" className="cau-button" onClick={onClose}>
          {Blockly.Msg.summaryCloseButton}
        </button>
      </div>
    );
  }

  return (
    <div className="cau-step">
      <AnimatedCheck size={96} />
      <h3 className="cau-step__title">{Blockly.Msg.summarySuccessTitle}</h3>
      <p className="cau-step__text">{Blockly.Msg.summarySuccessText}</p>
      <button type="button" className="cau-button" onClick={onClose}>
        {Blockly.Msg.summaryCloseButton}
      </button>
      {log && (
        <DetailAccordion title={Blockly.Msg.summaryLogDetails} content={log} />
      )}
    </div>
  );
}

SummaryStep.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default SummaryStep;
