import React, { useState } from "react";
import PropTypes from "prop-types";
import UsbIcon from "@mui/icons-material/Usb";
import * as Blockly from "blockly/core";
import { useFlash } from "../FlashContext";
import { AnimatedCheck, Spinner, DetailAccordion } from "../StatusIndicators";

/**
 * Step: Prepare the device for bootloader mode by performing the 1200bps touch
 * and pre-authorizing the bootloader port. This happens BEFORE compilation so
 * that the user activation window is fresh for requestPort().
 */
function BootloaderPreparationStep({ goNext }) {
  const { port, prepareBootloaderMode, error } = useFlash();
  const [isPreparing, setIsPreparing] = useState(false);
  const [isPrepared, setIsPrepared] = useState(false);

  const handlePrepare = async () => {
    setIsPreparing(true);
    try {
      await prepareBootloaderMode();
      setIsPrepared(true);
      // Auto-advance after a short delay
      setTimeout(goNext, 1200);
    } finally {
      setIsPreparing(false);
    }
  };

  if (isPrepared) {
    return (
      <div className="cau-step">
        <AnimatedCheck color="#3ab0e8" />
        <h3 className="cau-step__title">{Blockly.Msg.compile_upload?.bootloaderPreparedTitle}</h3>
        <p className="cau-step__text">{Blockly.Msg.compile_upload?.bootloaderPreparedText}</p>
      </div>
    );
  }

  return (
    <div className="cau-step">
      {isPreparing ? (
        <>
          <Spinner icon={<UsbIcon style={{ fontSize: 32 }} />} />
          <h3 className="cau-step__title">{Blockly.Msg.compile_upload?.bootloaderPreparing}</h3>
          <p className="cau-step__text">{Blockly.Msg.compile_upload?.bootloaderPreparingText}</p>
        </>
      ) : (
        <>
          <UsbIcon style={{ fontSize: 64, color: "#3ab0e8" }} />
          <h3 className="cau-step__title">{Blockly.Msg.compile_upload?.bootloaderPrepareTitle}</h3>
          <p className="cau-step__text">{Blockly.Msg.compile_upload?.bootloaderPrepareText}</p>
          <button
            type="button"
            className="cau-button cau-button--secondary"
            onClick={handlePrepare}
            disabled={!port}
          >
            {Blockly.Msg.compile_upload?.bootloaderPrepareButton}
          </button>
          {error && (
            <DetailAccordion
              title={Blockly.Msg.compile_upload?.deviceErrorDetails}
              content={error}
              isError
            />
          )}
        </>
      )}
    </div>
  );
}

BootloaderPreparationStep.propTypes = {
  goNext: PropTypes.func.isRequired,
};

export default BootloaderPreparationStep;
  );
}

BootloaderPreparationStep.propTypes = {
  goNext: PropTypes.func.isRequired,
};

export default BootloaderPreparationStep;
