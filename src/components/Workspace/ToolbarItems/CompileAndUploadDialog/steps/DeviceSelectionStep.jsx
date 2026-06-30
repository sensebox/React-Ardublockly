import React, { useEffect } from "react";
import PropTypes from "prop-types";
import UsbIcon from "@mui/icons-material/Usb";
import { useFlash } from "../FlashContext";
import {
  AnimatedCheck,
  AnimatedCross,
  DetailAccordion,
} from "../StatusIndicators";

/**
 * Step: Let the user select the senseBox MCU-S2 (ESP32-S2) via the Web Serial
 * API. Once a device is picked, the wizard advances automatically.
 */
function DeviceSelectionStep({ goNext }) {
  const { supported, port, deviceLabel, selectDevice, error } = useFlash();

  // Auto-advance shortly after a device has been selected.
  useEffect(() => {
    if (!port) return undefined;
    const timer = setTimeout(goNext, 900);
    return () => clearTimeout(timer);
  }, [port, goNext]);

  if (!supported) {
    return (
      <div className="cau-step">
        <AnimatedCross />
        <h3 className="cau-step__title">Browser nicht unterstützt</h3>
        <p className="cau-error-text">
          Die Web Serial API wird in diesem Browser nicht unterstützt. Bitte
          verwende Google Chrome oder Microsoft Edge.
        </p>
        {error && (
          <DetailAccordion title="Fehlerdetails" content={error} isError />
        )}
      </div>
    );
  }

  return (
    <div className="cau-step">
      {port ? (
        <>
          <AnimatedCheck color="#3ab0e8" />
          <h3 className="cau-step__title">Gerät verbunden</h3>
          <p className="cau-step__text">{deviceLabel}</p>
        </>
      ) : (
        <>
          <UsbIcon style={{ fontSize: 64, color: "#3ab0e8" }} />
          <h3 className="cau-step__title">Gerät auswählen</h3>
          <p className="cau-step__text">
            Verbinde die senseBox MCU-S2 (ESP32-S2) per USB und wähle sie im
            folgenden Dialog aus.
          </p>
          <button
            type="button"
            className="cau-button cau-button--secondary"
            onClick={selectDevice}
          >
            <UsbIcon style={{ fontSize: 20 }} />
            Gerät auswählen
          </button>
          {error && (
            <DetailAccordion title="🔍 Fehlerdetails" content={error} isError />
          )}
        </>
      )}
    </div>
  );
}

DeviceSelectionStep.propTypes = {
  goNext: PropTypes.func.isRequired,
};

export default DeviceSelectionStep;
