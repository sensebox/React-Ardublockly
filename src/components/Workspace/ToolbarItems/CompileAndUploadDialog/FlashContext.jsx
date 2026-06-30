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
import { useSelector, useDispatch } from "react-redux";
import * as Blockly from "blockly/core";
import { compileToBinary } from "./compileBinary";
import {
  flashBinary,
  touchTo1200bps,
  waitForBootloaderPort,
  SENSEBOX_USB_VENDOR_ID,
} from "./esptoolService";
import {
  setDevicePort,
  clearDevicePort,
  setBootloaderPortPrepared,
  clearBootloaderPortPrepared,
} from "../../../../actions/boardAction";

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
  const dispatch = useDispatch();
  const supported =
    typeof navigator !== "undefined" && navigator.serial !== undefined;

  const [port, setPort] = useState(null);
  const [bootloaderPort, setBootloaderPort] = useState(null);
  // True once the 1200bps touch has happened but the re-enumerated ROM
  // bootloader port still needs an explicit, user-gesture-driven permission
  // grant (the unavoidable first-time case – see grantBootloaderPort).
  const [needsBootloaderPermission, setNeedsBootloaderPermission] =
    useState(false);
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
  const savedDeviceLabel = useSelector((state) => state.board.deviceLabel);
  const bootloaderPortPrepared = useSelector(
    (state) => state.board.bootloaderPortPrepared,
  );
  const filename = useSelector((state) => state.workspace.name) || "sketch";

  const board = resolveCompilerBoard(selectedBoard);

  // Synchronous re-entrancy lock for the whole "touch + flash" critical
  // section. Without it, two overlapping invocations (e.g. an auto-upload effect
  // firing while another flash is already running) fight over the same serial
  // port: one opens it at 115200 and flashes successfully, the other fails to
  // open it at 1200 ("Failed to open port at 1200bps") and wrongly flips the UI
  // to the red error screen even though the upload actually succeeds.
  const flashLockRef = useRef(false);

  // Holds the currently running compile() promise so that callers which become
  // ready at different moments (e.g. the bootloader preparation finishing before
  // or after the sketch) all await the SAME compilation instead of kicking off a
  // second, redundant compile run.
  const compilePromiseRef = useRef(null);

  const appendLog = useCallback((message) => {
    setLog((previous) => previous + message);
  }, []);

  /**
   * Sends the current Blockly/Arduino sketch to the online compiler, downloads
   * the resulting firmware binary and caches it for the upload step. Returns the
   * compiled binary so callers (e.g. startFlash) can use it immediately.
   */
  const compile = useCallback(async () => {
    // Reuse a finished or in-flight compilation. This is what lets the bootloader
    // preparation run fully in parallel with the compile: whoever finishes first
    // simply awaits the other instead of recompiling.
    if (binary) return binary;
    if (compilePromiseRef.current) return compilePromiseRef.current;

    const runCompile = (async () => {
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
            codeToCompile =
              Blockly.Generator.Arduino.workspaceToCode(workspace);
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
      } finally {
        compilePromiseRef.current = null;
      }
    })();

    compilePromiseRef.current = runCompile;
    return runCompile;
  }, [binary, compilerUrl, sketch, board, sessionId, filename]);

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

  // Load saved device label from Redux when dialog opens.
  // Don't set the port yet - just show the user that a device is remembered.
  useEffect(() => {
    if (!open || !supported) return;

    if (savedDeviceLabel) {
      setDeviceLabel(savedDeviceLabel);
      // Don't set the port here - let the user confirm with a button click.
      // This avoids timing issues where the port might not be fully initialized yet.
    }
  }, [open, supported, savedDeviceLabel]);

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
      const label = `USB-Gerät (VID 0x${vendor} / PID 0x${product})`;
      setDeviceLabel(label);
      // Save device info to Redux for persistence
      dispatch(setDevicePort("connected", label));
    } catch (err) {
      // The user simply cancelled the picker – not an error worth showing.
      if (err?.name !== "NotFoundError") {
        setError(err?.message || String(err));
      }
    }
  }, [dispatch]);

  // Try to reconnect to a previously saved device
  const reconnectSavedDevice = useCallback(async () => {
    setError(null);
    try {
      const ports = await navigator.serial.getPorts();
      const sensboxPorts = ports.filter((p) => {
        try {
          return p.getInfo?.()?.usbVendorId === SENSEBOX_USB_VENDOR_ID;
        } catch {
          return false;
        }
      });

      if (sensboxPorts.length > 0) {
        // Prefer a currently CONNECTED port. After a previous upload both the
        // application port (PID 0x81b8) and the ROM bootloader port (PID 0x0002)
        // are permitted and returned here, but only the application port is live
        // – touching a disconnected bootloader handle would fail with
        // "Failed to open port".
        const livePort =
          sensboxPorts.find((p) => p.connected === true) ?? sensboxPorts[0];
        setPort(livePort);
      } else {
        // No saved ports found, fall back to manual selection
        setError("Gespeichertes Gerät nicht gefunden. Bitte erneut auswählen.");
        await selectDevice();
      }
    } catch (err) {
      setError(err?.message || String(err));
    }
  }, [selectDevice]);

  // Phase 1 of bootloader preparation: perform the 1200bps touch and try to
  // pick up an ALREADY-PERMITTED ROM bootloader port.
  //
  // After the touch the board re-enumerates as a *different* USB device (the ROM
  // serial bootloader, PID 0x0002). navigator.serial.getPorts() and the
  // `connect` event can only ever surface devices the browser already has
  // permission for, so on the very first upload nothing is found here – that is
  // expected. We deliberately do NOT call navigator.serial.requestPort() in this
  // path: by the time the touch + USB re-enumeration have finished, the
  // transient user activation from the "Vorbereiten" click has already expired,
  // and requestPort() would throw a SecurityError (which is exactly why the
  // first upload used to fail). Instead we flag that an explicit, fresh user
  // gesture is required and let grantBootloaderPort() open the picker.
  const prepareBootloaderMode = useCallback(async () => {
    if (flashLockRef.current) return;
    flashLockRef.current = true;
    setError(null);
    setNeedsBootloaderPermission(false);
    appendLog(""); // Clear previous logs
    try {
      appendLog("Vorbereitung des Bootloader-Modus ...\n");
      const knownPorts = await navigator.serial.getPorts();
      appendLog(`Bekannte Ports: ${knownPorts.length}\n`);

      // Perform the 1200bps touch to trigger bootloader mode
      appendLog("Versetze Board in den Download-Modus (1200bps touch) ...\n");
      try {
        await touchTo1200bps(port);
        appendLog("1200bps touch erfolgreich abgeschlossen.\n");
      } catch (touchErr) {
        appendLog(`Fehler beim 1200bps touch: ${touchErr?.message}\n`);
        throw new Error(`1200bps touch fehlgeschlagen: ${touchErr?.message}`);
      }

      // Give the system time to fully close the old port and re-enumerate.
      appendLog("Warte auf USB-Neuaufzählung ...\n");
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Look for a bootloader port we already have permission for (subsequent
      // uploads, or a grant that survived from a previous session).
      appendLog("Suche nach bereits genehmigtem Bootloader-Port ...\n");
      const newPort = await waitForBootloaderPort(knownPorts, 3000);

      if (newPort) {
        setBootloaderPort(newPort);
        appendLog("✓ Bootloader-Port gefunden und genehmigt.\n");
        appendLog("✓ Bootloader-Modus erfolgreich vorbereitet.\n");
        dispatch(setBootloaderPortPrepared());
        return;
      }

      // First-time case: permission for the re-enumerated device is missing and
      // must be granted from a fresh user gesture (grantBootloaderPort).
      appendLog(
        "Bootloader-Port noch nicht genehmigt – bitte im nächsten Schritt auswählen.\n",
      );
      setNeedsBootloaderPermission(true);
    } catch (err) {
      const errorMsg = err?.message || String(err);
      appendLog(`✗ Vorbereitung fehlgeschlagen: ${errorMsg}\n`);
      setError(errorMsg);
      throw err;
    } finally {
      flashLockRef.current = false;
    }
  }, [port, dispatch, appendLog]);

  // Compiles the sketch (if not already cached) and flashes it to the given ROM
  // bootloader port. Shared by every flashing entry point so the upload logic
  // lives in exactly one place.
  const runCompileAndFlash = useCallback(
    async (flashPort) => {
      setStatus("flashing");
      setProgress(0);
      setError(null);
      try {
        appendLog("Kompiliere Sketch ...\n");
        let firmware = binary;
        if (!firmware) {
          firmware = await compile();
        }
        appendLog(`Binärdatei erhalten (${firmware.length} Bytes).\n`);

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
    },
    [binary, compile, appendLog],
  );

  // Phase 2 of bootloader preparation: grant access to the re-enumerated ROM
  // bootloader port. This MUST be invoked directly from a user gesture (a button
  // click) so navigator.serial.requestPort() runs with fresh transient user
  // activation. At this point the bootloader device (VID 0x303a / PID 0x0002) is
  // already on the USB bus, so it appears in the picker. Once granted, the
  // permission is persisted and every following upload skips this step.
  const grantBootloaderPort = useCallback(async () => {
    if (flashLockRef.current) return;
    flashLockRef.current = true;
    setError(null);
    try {
      appendLog("Frage Genehmigung für den Bootloader-Port an ...\n");
      const authorizedPort = await navigator.serial.requestPort({
        filters: [{ usbVendorId: SENSEBOX_USB_VENDOR_ID }],
      });
      setBootloaderPort(authorizedPort);
      setNeedsBootloaderPermission(false);
      dispatch(setBootloaderPortPrepared());
      appendLog("✓ Bootloader-Port genehmigt.\n");
      // The board is already in download mode from the earlier 1200bps touch,
      // so flash straight away with the just-granted port.
      await runCompileAndFlash(authorizedPort);
    } catch (err) {
      if (err?.name === "NotFoundError") {
        // The user simply cancelled the picker – keep the prompt visible.
        appendLog("Auswahl abgebrochen.\n");
        return;
      }
      const errorMsg = err?.message || String(err);
      appendLog(`✗ Genehmigung fehlgeschlagen: ${errorMsg}\n`);
      setError(errorMsg);
      setStatus("error");
    } finally {
      flashLockRef.current = false;
    }
  }, [dispatch, appendLog, runCompileAndFlash]);

  const startFlash = useCallback(async () => {
    if (!port) {
      setError("Es wurde noch kein Gerät ausgewählt.");
      return;
    }
    // Prevent concurrent/duplicate runs that would clash over the serial port.
    if (flashLockRef.current) return;
    flashLockRef.current = true;

    setStatus("flashing");
    setProgress(0);
    setLog("");
    setError(null);
    setNeedsBootloaderPermission(false);

    try {
      // Already hold a permitted bootloader port → flash immediately.
      if (bootloaderPort) {
        appendLog("Nutze vorbereiteten Bootloader-Port.\n");
        await runCompileAndFlash(bootloaderPort);
        return;
      }

      // Put the board into download mode and try to pick up an ALREADY-PERMITTED
      // bootloader port. This may run from an automatic effect (no user
      // activation), so it must never call navigator.serial.requestPort().
      appendLog("Vorbereitung des Bootloader-Modus ...\n");
      const knownPorts = await navigator.serial.getPorts();
      appendLog("Versetze Board in den Download-Modus (1200bps touch) ...\n");
      await touchTo1200bps(port);
      appendLog("Warte auf den Bootloader-Port ...\n");
      const newPort = await waitForBootloaderPort(knownPorts, 3000);

      if (newPort) {
        setBootloaderPort(newPort);
        dispatch(setBootloaderPortPrepared());
        appendLog("Bootloader-Port gefunden.\n");
        await runCompileAndFlash(newPort);
        return;
      }

      // The re-enumerated device is not permitted yet. We must NOT call
      // requestPort() here (no user activation in this auto path) and must NOT
      // flash the application port (it only stalls at "Connecting..."). Surface
      // the manual grant button instead by flagging needsBootloaderPermission.
      appendLog(
        "Bootloader-Port noch nicht genehmigt – bitte unten den Port auswählen.\n",
      );
      setStatus("idle");
      setNeedsBootloaderPermission(true);
    } catch (err) {
      setError(err?.message || String(err));
      setStatus("error");
    } finally {
      flashLockRef.current = false;
    }
  }, [port, bootloaderPort, runCompileAndFlash, appendLog, dispatch]);

  const resetDevice = useCallback(() => {
    setPort(null);
    setBootloaderPort(null);
    setNeedsBootloaderPermission(false);
    setDeviceLabel("");
    setStatus("idle");
    setError(null);
    dispatch(clearDevicePort());
    dispatch(clearBootloaderPortPrepared());
  }, [dispatch]);

  // Automatically reconnect to saved device if available (only on 2nd+ uploads when bootloader is prepared)
  const reconnectStarted = useRef(false);
  useEffect(() => {
    if (
      !open ||
      !supported ||
      reconnectStarted.current ||
      port ||
      !savedDeviceLabel ||
      !bootloaderPortPrepared // Only auto-connect on subsequent uploads after first prep
    ) {
      return;
    }
    reconnectStarted.current = true;
    reconnectSavedDevice().catch(() => {
      // Errors are handled and displayed
    });
  }, [
    open,
    supported,
    port,
    savedDeviceLabel,
    bootloaderPortPrepared,
    reconnectSavedDevice,
  ]);

  // Automatically prepare + upload on subsequent uploads (bootloader already
  // prepared once). The bootloader touch is started as soon as the saved device
  // is reconnected and does NOT wait for the compilation to finish – both run in
  // parallel, and runCompileAndFlash() awaits the (possibly still in-flight)
  // binary right before flashing.
  const uploadStarted = useRef(false);
  useEffect(() => {
    if (
      !open ||
      uploadStarted.current ||
      !port ||
      compileStatus === "error" ||
      status !== "idle" ||
      !bootloaderPortPrepared // Only auto-upload after bootloader has been prepared once
    ) {
      return;
    }
    uploadStarted.current = true;
    startFlash().catch(() => {
      // Errors are handled and displayed
    });
  }, [open, port, compileStatus, status, bootloaderPortPrepared, startFlash]);

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
      needsBootloaderPermission,
      selectDevice,
      reconnectSavedDevice,
      prepareBootloaderMode,
      grantBootloaderPort,
      compile,
      startFlash,
      resetDevice,
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
      needsBootloaderPermission,
      selectDevice,
      reconnectSavedDevice,
      prepareBootloaderMode,
      grantBootloaderPort,
      compile,
      startFlash,
      resetDevice,
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
