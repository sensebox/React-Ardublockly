import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import * as Blockly from "blockly/core";
import { compileToBinary } from "./compileBinary";
import {
  flashBinary,
  touchTo1200bps,
  waitForBootloaderPort,
  SENSEBOX_USB_VENDOR_ID,
} from "./esptoolService";

/**
 * Maps the board selected in the workspace to the identifier expected by the
 * senseBox compiler service – mirrors the mapping used in CompilationDialog.
 *
 * @param {string} selectedBoard Board identifier from the Redux store.
 * @returns {string} Compiler board identifier.
 */
function resolveCompilerBoard(selectedBoard) {
  switch (selectedBoard) {
    case "MCU":
    case "MCU:MINI":
      return "sensebox-mcu";
    case "MCU-S2":
      return "sensebox-esp32s2";
    default:
      return "sensebox-esp32s2";
  }
}

/**
 * Flash parameters for the senseBox MCU-S2 (ESP32-S2), chosen to match the
 * Arduino IDE board definition (sensebox_mcu_esp32s2):
 *
 *   build.flash_mode = dio
 *   build.flash_freq = 80m
 *   build.flash_size = 4MB
 *
 * The senseBox compiler returns ONLY the compiled application image (not a
 * merged binary), so it is written to the application partition offset 0x10000
 * (app0 in the default/tinyuf2 partition scheme) – exactly where the Arduino
 * IDE uploads the sketch. The bootloader (0x1000), partition table (0x8000) and
 * boot_app0 (0xe000) already live on the device and are left untouched.
 */
const FLASH_ADDRESS = 0x10000;
const FLASH_MODE = "dio";
const FLASH_FREQ = "80m";
const FLASH_SIZE = "4MB";
// The MCU-S2 uses Espressif's native USB-CDC (VID 0x303A). On such a connection
// the baud rate is irrelevant for throughput, and requesting a higher rate makes
// esptool-js call changeBaud(), which re-initialises the USB-CDC stream and
// corrupts the connection ("Serial data stream stopped / Unable to verify flash
// chip connection"). Staying at the ROM baud (115200) skips changeBaud entirely.
const UPLOAD_BAUDRATE = 115200;

const FlashContext = createContext(null);

/**
 * Access the shared flashing state from within the wizard steps.
 */
export function useFlash() {
  const context = useContext(FlashContext);
  if (!context) {
    throw new Error("useFlash must be used within a <FlashProvider>.");
  }
  return context;
}

/**
 * Provides device selection and flashing logic to the Compile-and-Upload wizard.
 * Holds the selected serial port and exposes actions that the individual steps
 * trigger (select a device in step 1, start the upload in step 2).
 */
export function FlashProvider({ open, children }) {
  const supported =
    typeof navigator !== "undefined" && navigator.serial !== undefined;

  const [port, setPort] = useState(null);
  const [deviceLabel, setDeviceLabel] = useState("");
  const [status, setStatus] = useState("idle"); // idle | flashing | done | error
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState("");
  const [error, setError] = useState(null);

  // Cached firmware binary produced by the online compiler.
  const [binary, setBinary] = useState(null);
  // idle | compiling | compiled | error
  const [compileStatus, setCompileStatus] = useState("idle");
  const [compileError, setCompileError] = useState(null);

  const compilerUrl = useSelector((state) => state.general.compiler);
  const sessionId = useSelector((state) => state.general.sessionId);
  const sketch = useSelector((state) => state.workspace.code.arduino);
  const selectedBoard = useSelector((state) => state.board.board);
  const filename = useSelector((state) => state.workspace.name) || "sketch";

  const board = resolveCompilerBoard(selectedBoard);

  const appendLog = useCallback((message) => {
    setLog((previous) => previous + message);
  }, []);

  /**
   * Sends the current Blockly/Arduino sketch to the online compiler, downloads
   * the resulting firmware binary and caches it for the upload step. Returns the
   * compiled binary so callers (e.g. startFlash) can use it immediately.
   */
  const compile = useCallback(async () => {
    setCompileStatus("compiling");
    setCompileError(null);
    try {
      // Always regenerate the sketch from the current workspace so we never send
      // a stale or empty sketch to the compiler (which fails with a 500 / "Can't
      // open sketch"). Falls back to the cached store value if generation fails.
      let codeToCompile = sketch;
      try {
        const workspace = Blockly.getMainWorkspace();
        if (workspace && Blockly.Generator?.Arduino) {
          codeToCompile = Blockly.Generator.Arduino.workspaceToCode(workspace);
        }
      } catch (genErr) {
        console.warn("Code generation failed, using stored sketch:", genErr);
      }

      if (!codeToCompile || !codeToCompile.trim()) {
        throw new Error(
          "Der Sketch ist leer. Bitte füge zuerst Blöcke zum Programm hinzu.",
        );
      }

      const compiled = await compileToBinary({
        compilerUrl,
        sketch: codeToCompile,
        board,
        projectId: sessionId,
        filename,
      });
      setBinary(compiled);
      setCompileStatus("compiled");
      return compiled;
    } catch (err) {
      setCompileError(err?.message || String(err));
      setCompileStatus("error");
      throw err;
    }
  }, [compilerUrl, sketch, board, sessionId, filename]);

  // Kick off compilation as soon as the dialog opens, so the cached binary is
  // ready by the time the user reaches the upload step.
  const compileStarted = useRef(false);
  useEffect(() => {
    if (open && !compileStarted.current) {
      compileStarted.current = true;
      compile().catch(() => {
        // Errors are surfaced via compileStatus/compileError.
      });
    }
  }, [open, compile]);

  const selectDevice = useCallback(async () => {
    setError(null);
    try {
      const selectedPort = await navigator.serial.requestPort({
        filters: [{ usbVendorId: SENSEBOX_USB_VENDOR_ID }],
      });
      setPort(selectedPort);

      const info = selectedPort.getInfo?.() ?? {};
      const vendor = info.usbVendorId
        ? info.usbVendorId.toString(16).padStart(4, "0")
        : "????";
      const product = info.usbProductId
        ? info.usbProductId.toString(16).padStart(4, "0")
        : "????";
      setDeviceLabel(`USB-Gerät (VID 0x${vendor} / PID 0x${product})`);
    } catch (err) {
      // The user simply cancelled the picker – not an error worth showing.
      if (err?.name !== "NotFoundError") {
        setError(err?.message || String(err));
      }
    }
  }, []);

  const startFlash = useCallback(async () => {
    if (!port) {
      setError("Es wurde noch kein Gerät ausgewählt.");
      return;
    }

    setStatus("flashing");
    setProgress(0);
    setLog("");
    setError(null);

    try {
      // Reuse the binary that was compiled when the dialog opened. Should it not
      // be available yet (e.g. compilation still running or failed), compile now.
      let firmware = binary;
      if (!firmware) {
        appendLog("Kompiliere Sketch ...\n");
        firmware = await compile();
      }
      appendLog(`Binärdatei erhalten (${firmware.length} Bytes).\n`);

      // Put the board into the ROM download mode automatically (1200bps touch),
      // exactly like the Arduino IDE does (use_1200bps_touch=true). This avoids
      // having to press BOOT + RESET by hand. After the touch the device
      // re-enumerates on the USB bus, so we wait for the new bootloader port
      // (wait_for_upload_port=true) and flash through that one instead.
      let flashPort = port;
      try {
        const knownPorts = await navigator.serial.getPorts();
        appendLog("Versetze Board in den Download-Modus (1200bps touch) ...\n");
        await touchTo1200bps(port);
        appendLog("Warte auf den Bootloader-Port ...\n");
        // Keep this short: a permitted port re-enumerates within ~1-2s, and the
        // requestPort() fallback below needs the click's user activation, which
        // expires after ~5s.
        const newPort = await waitForBootloaderPort(knownPorts, 3000);
        if (newPort) {
          // Use the bootloader port only for this upload. The persistent
          // selection stays on the application port, because the 1200bps touch
          // for the next upload has to be performed on the running firmware.
          flashPort = newPort;
          appendLog("Bootloader-Port gefunden.\n");
        } else {
          // The board re-enumerated as the ROM bootloader (different USB
          // product id), but the browser has no permission for that device yet,
          // so it cannot be detected automatically. Ask the user to pick it
          // once – the browser then remembers it for future uploads. This still
          // runs inside the original click's user activation, which is required
          // by requestPort().
          appendLog(
            "Neuer USB-Port (Bootloader) gefunden, aber noch nicht " +
              "freigegeben. Bitte im Dialog den senseBox-Port auswählen ...\n",
          );
          flashPort = await navigator.serial.requestPort({
            filters: [{ usbVendorId: SENSEBOX_USB_VENDOR_ID }],
          });
          appendLog("Bootloader-Port ausgewählt.\n");
        }
      } catch (resetErr) {
        appendLog(
          `Automatischer Reset nicht möglich (${
            resetErr?.message || resetErr
          }). Versuche es mit dem bisherigen Port.\n`,
        );
      }

      appendLog("Starte Upload auf den Mikrocontroller ...\n");

      await flashBinary({
        port: flashPort,
        fileArray: [{ data: firmware, address: FLASH_ADDRESS }],
        baudrate: UPLOAD_BAUDRATE,
        flashMode: FLASH_MODE,
        flashFreq: FLASH_FREQ,
        flashSize: FLASH_SIZE,
        eraseAll: false,
        usingUsbOtg: true,
        onLog: appendLog,
        onProgress: setProgress,
      });

      setProgress(100);
      setStatus("done");
      appendLog("\nUpload erfolgreich abgeschlossen.\n");
      appendLog("Mikrocontroller wurde neu gestartet.\n");
    } catch (err) {
      setError(err?.message || String(err));
      setStatus("error");
    }
  }, [port, binary, compile, appendLog]);

  const value = useMemo(
    () => ({
      supported,
      port,
      deviceLabel,
      status,
      progress,
      log,
      error,
      binary,
      compileStatus,
      compileError,
      selectDevice,
      compile,
      startFlash,
    }),
    [
      supported,
      port,
      deviceLabel,
      status,
      progress,
      log,
      error,
      binary,
      compileStatus,
      compileError,
      selectDevice,
      compile,
      startFlash,
    ],
  );

  return (
    <FlashContext.Provider value={value}>{children}</FlashContext.Provider>
  );
}

FlashProvider.propTypes = {
  open: PropTypes.bool,
  children: PropTypes.node,
};
