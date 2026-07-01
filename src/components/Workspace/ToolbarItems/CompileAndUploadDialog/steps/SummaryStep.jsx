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
        <h3 className="cau-step__title">
          {Blockly.Msg.compile_upload?.summaryErrorTitle}
        </h3>
        <p className="cau-error-text">
          {error || Blockly.Msg.compile_upload?.summaryErrorText}
        </p>
        <button type="button" className="cau-button" onClick={onClose}>
          {Blockly.Msg.compile_upload?.summaryCloseButton}
        </button>
      </div>
    );
  }

  return (
    <div className="cau-step">
      <AnimatedCheck size={96} />
      <h3 className="cau-step__title">
        {Blockly.Msg.compile_upload?.summarySuccessTitle}
      </h3>
      <p className="cau-step__text">
        {Blockly.Msg.compile_upload?.summarySuccessText}
      </p>
      <button type="button" className="cau-button" onClick={onClose}>
        {Blockly.Msg.compile_upload?.summaryCloseButton}
      </button>
      {log && (
        <DetailAccordion
          title={Blockly.Msg.compile_upload?.summaryLogDetails}
          content={log}
        />
      )}
    </div>
  );
}

SummaryStep.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default SummaryStep;
