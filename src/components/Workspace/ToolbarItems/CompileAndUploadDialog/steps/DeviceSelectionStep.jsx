import React, { useEffect } from "react";
import PropTypes from "prop-types";
import UsbIcon from "@mui/icons-material/Usb";
import * as Blockly from "blockly/core";
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
  const {
    supported,
    port,
    deviceLabel,
    selectDevice,
    reconnectSavedDevice,
    error,
    resetDevice,
  } = useFlash();

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
        <h3 className="cau-step__title">
          {Blockly.Msg.compile_upload?.deviceBrowserNotSupported}
        </h3>
        <p className="cau-error-text">
          {Blockly.Msg.compile_upload?.deviceBrowserNotSupportedText}
        </p>
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

  return (
    <div className="cau-step">
      {port ? (
        <>
          <AnimatedCheck color="#3ab0e8" />
          <h3 className="cau-step__title">
            {Blockly.Msg.compile_upload?.deviceConnectedTitle}
          </h3>
          <p className="cau-step__text">{deviceLabel}</p>
          <button
            type="button"
            className="cau-button cau-button--secondary"
            onClick={resetDevice}
            style={{ marginTop: "20px" }}
          >
            {Blockly.Msg.compile_upload?.deviceChangeButton}
          </button>
        </>
      ) : (
        <>
          <UsbIcon style={{ fontSize: 64, color: "#3ab0e8" }} />
          <h3 className="cau-step__title">
            {Blockly.Msg.compile_upload?.deviceSelectTitle}
          </h3>
          <p className="cau-step__text">
            {Blockly.Msg.compile_upload?.deviceSelectText}
          </p>
          {deviceLabel ? (
            <>
              <p
                style={{
                  fontSize: "14px",
                  color: "#666",
                  marginBottom: "15px",
                }}
              >
                {Blockly.Msg.compile_upload?.deviceSaved} {deviceLabel}
              </p>
              <button
                type="button"
                className="cau-button cau-button--secondary"
                onClick={reconnectSavedDevice}
              >
                <UsbIcon style={{ fontSize: 20 }} />
                {Blockly.Msg.compile_upload?.deviceConnectButton}
              </button>
              <button
                type="button"
                className="cau-button cau-button--secondary"
                onClick={selectDevice}
                style={{ marginLeft: "10px" }}
              >
                {Blockly.Msg.compile_upload?.deviceSelectNewButton}
              </button>
            </>
          ) : (
            <button
              type="button"
              className="cau-button cau-button--secondary"
              onClick={selectDevice}
            >
              <UsbIcon style={{ fontSize: 20 }} />
              {Blockly.Msg.compile_upload?.deviceSelectButton}
            </button>
          )}
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

DeviceSelectionStep.propTypes = {
  goNext: PropTypes.func.isRequired,
};

export default DeviceSelectionStep;
