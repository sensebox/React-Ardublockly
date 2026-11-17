import { useEffect, useRef, useState } from "react";
import { matchesPort, useFlashDevice } from "@sensebox/flash-tool";

// Phases in which the start button shows a spinner and is disabled.
const BUSY_PHASES = ["waitingForData", "connecting", "flashing", "restarting"];

/**
 * useSketchFlash
 *
 * Uploads a bundled capture sketch (e.g. the camera or spell sketch) to a
 * senseBox with @sensebox/flash-tool and tracks the state of the whole
 * "start device" flow for the start button.
 *
 * Phases:
 *   idle | waitingForData | connecting | grant | flashing | restarting | done
 *
 * "waitingForData", "restarting" and "done" are set by the page (via
 * setPhase); the others are set by this hook.
 *
 * @param {Object} options
 * @param {string} options.firmwareUrl - URL of the sketch binary (.bin?url import)
 * @param {string} [options.board] - flash-tool board id (default "MCU-EYE")
 * @param {Function} [options.onFlashed] - Called after a successful upload
 *   (the board then reboots into the sketch).
 * @param {Function} [options.onFlashFailed] - Called with an error message if
 *   loading the sketch, the bootloader reset or the upload fails.
 * @param {Function} [options.onGrantFailed] - Called with an error message if
 *   the bootloader port was not selected / could not be opened.
 */
export default function useSketchFlash({
  firmwareUrl,
  board = "MCU-EYE",
  onFlashed,
  onFlashFailed,
  onGrantFailed,
}) {
  const [phase, setPhase] = useState("idle");
  // True while the bootloader port picker is open.
  const [isGrantingPort, setIsGrantingPort] = useState(false);
  const firmwareRef = useRef(null);

  // Always call the latest callbacks (they close over page state).
  const callbacksRef = useRef({});
  callbacksRef.current = { onFlashed, onFlashFailed, onGrantFailed };

  const {
    profile,
    selectDevice,
    reconnect,
    prepareBootloader,
    grantBootloaderPort,
    flash,
    resetFlashState,
    status,
    progress,
    error,
  } = useFlashDevice({ board });

  const loadFirmware = async () => {
    if (firmwareRef.current) return firmwareRef.current;
    const response = await fetch(firmwareUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    firmwareRef.current = new Uint8Array(await response.arrayBuffer());
    return firmwareRef.current;
  };

  const fail = (message) => {
    setPhase("idle");
    callbacksRef.current.onFlashFailed?.(message);
  };

  const runFlash = async () => {
    setPhase("flashing");
    await flash(firmwareRef.current);
    // Success/failure is picked up from `status` in the effect below.
  };

  /**
   * Puts the board behind `port` into bootloader mode and uploads the sketch.
   * If the browser has no permission for the bootloader port yet, switches to
   * "grant" (needs a fresh click, see grantBootloader).
   * @param {SerialPort} port - A closed port of the board
   */
  const flashSketch = async (port) => {
    resetFlashState();
    setPhase("connecting");
    try {
      await loadFirmware();
    } catch (err) {
      fail(err.message);
      return;
    }

    let bootloaderPort;
    try {
      bootloaderPort = matchesPort(port, profile, true)
        ? // Already in the bootloader – no reset needed.
          await reconnect()
        : await prepareBootloader(port);
    } catch (err) {
      fail(err?.message || String(err));
      return;
    }
    if (!bootloaderPort) {
      setPhase("grant");
      return;
    }
    await runFlash();
  };

  /**
   * Flashes the sketch to an already permitted board port, or asks for one
   * (must run from a click so the picker may open).
   * @returns {Promise<boolean>} false if no port was selected
   */
  const flashPermittedDevice = async () => {
    setPhase("connecting");
    let port = await reconnect();
    if (!port) port = await selectDevice();
    if (!port) {
      setPhase("idle");
      return false;
    }
    await flashSketch(port);
    return true;
  };

  /**
   * First upload only: grant access to the re-enumerated bootloader port.
   * Must run directly from a click so requestPort() has user activation.
   * On failure the phase stays "grant" so the button remains available.
   */
  const grantBootloader = async () => {
    let granted = null;
    let failureMessage = "No bootloader port selected";
    setIsGrantingPort(true);
    try {
      granted = await grantBootloaderPort();
    } catch (err) {
      failureMessage = err?.message || String(err);
    } finally {
      setIsGrantingPort(false);
    }
    if (!granted) {
      callbacksRef.current.onGrantFailed?.(failureMessage);
      return;
    }
    await runFlash();
  };

  /** True if `port` belongs to this board (app or bootloader mode). */
  const isBoardPort = (port) => Boolean(port) && matchesPort(port, profile);

  /**
   * Polls for the board's (non-bootloader) port after it rebooted into the
   * new sketch. Only finds it if the browser already has permission for it.
   * @returns {Promise<SerialPort|null>}
   */
  const waitForAppPort = async (timeoutMs = 10000) => {
    const bootloaderIds = profile.bootloaderProductIds ?? [];
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const ports = await navigator.serial.getPorts();
      const port = ports.find((candidate) => {
        const info = candidate.getInfo?.() ?? {};
        return (
          candidate.connected !== false &&
          matchesPort(candidate, profile) &&
          !bootloaderIds.includes(info.usbProductId)
        );
      });
      if (port) return port;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    return null;
  };

  useEffect(() => {
    if (phase !== "flashing") return;
    if (status === "done") {
      setPhase("restarting");
      callbacksRef.current.onFlashed?.();
    } else if (status === "error") {
      fail(error || "Unknown error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, status, error]);

  return {
    phase,
    setPhase,
    isBusy: BUSY_PHASES.includes(phase),
    isGrantingPort,
    progress,
    bootloaderName: profile?.bootloaderName ?? "USB_JTAG_...",
    flashSketch,
    flashPermittedDevice,
    grantBootloader,
    isBoardPort,
    waitForAppPort,
  };
}
