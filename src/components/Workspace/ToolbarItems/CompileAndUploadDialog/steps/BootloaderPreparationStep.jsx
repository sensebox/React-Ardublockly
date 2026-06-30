import React, { useState } from "react";
import PropTypes from "prop-types";
import UsbIcon from "@mui/icons-material/Usb";
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
        <h3 className="cau-step__title">Bootloader-Port vorbereitet</h3>
        <p className="cau-step__text">
          Das Board wurde erfolgreich für den Upload-Modus vorbereitet.
        </p>
      </div>
    );
  }

  return (
    <div className="cau-step">
      {isPreparing ? (
        <>
          <Spinner icon={<UsbIcon style={{ fontSize: 32 }} />} />
          <h3 className="cau-step__title">Board wird vorbereitet...</h3>
          <p className="cau-step__text">
            Versetze Board in den Download-Modus und genehmige
            Bootloader-Port...
          </p>
        </>
      ) : (
        <>
          <UsbIcon style={{ fontSize: 64, color: "#3ab0e8" }} />
          <h3 className="cau-step__title">Board vorbereiten</h3>
          <p className="cau-step__text">
            Das Board wird in den Bootloader-Modus versetzt. Dies ist nötig für
            den Upload.
          </p>
          <button
            type="button"
            className="cau-button cau-button--secondary"
            onClick={handlePrepare}
            disabled={!port}
          >
            Vorbereiten
          </button>
          {error && (
            <DetailAccordion title="🔍 Fehlerdetails" content={error} isError />
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
