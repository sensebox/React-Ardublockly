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

// Safe fallback returned when useFlash() is called outside a <FlashProvider>
// (e.g. the embedded toolbar). "connected" stays false so the compile button
// simply falls back to the classic download flow.
const FALLBACK_FLASH = {
  supported: false,
  connected: false,
  bootloaderReady: false,
  port: null,
  deviceLabel: "",
  status: "idle",
  progress: 0,
  log: "",
  error: null,
  binary: null,
  compileStatus: "idle",
  compileError: null,
  needsBootloaderPermission: false,
  connect: async () => false,
  selectDevice: async () => null,
  reconnectSavedDevice: async () => {},
  prepareBootloaderMode: async () => {},
  grantBootloaderPort: async () => {},
  compile: async () => null,
  startFlash: async () => {},
  resetDevice: () => {},
  resetFlashState: () => {},
};

/**
 * Access the shared flashing state from within the wizard steps.
 */
export function useFlash() {
  return useContext(FlashContext) ?? FALLBACK_FLASH;
}

/**
 * Provides device selection and flashing logic to the Compile-and-Upload wizard.
 * Holds the selected serial port and exposes actions that the individual steps
 * trigger (select a device in step 1, start the upload in step 2).
 */
export function FlashProvider({ children }) {
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
  }, [compilerUrl, sketch, board, sessionId, filename]);

  // Load a previously saved device label so the UI can show which device is
  // remembered. The actual serial port is (re-)selected explicitly by the user
  // through the "Gerät verbinden" button.
  useEffect(() => {
    if (!supported) return;
    if (savedDeviceLabel) {
      setDeviceLabel(savedDeviceLabel);
    }
  }, [supported, savedDeviceLabel]);

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
      return selectedPort;
    } catch (err) {
      // The user simply cancelled the picker – not an error worth showing.
      if (err?.name !== "NotFoundError") {
        setError(err?.message || String(err));
      }
      return null;
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
  const prepareBootloaderMode = useCallback(
    async (explicitPort) => {
      const activePort = explicitPort || port;
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
          await touchTo1200bps(activePort);
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
    },
    [port, dispatch, appendLog],
  );

  /**
   * Convenience action for the "Gerät verbinden" button in the navbar: opens the
   * serial-port picker and, once a device is chosen, immediately puts it into the
   * download (bootloader) mode so that a later click on the normal compile button
   * can upload straight away. On the very first connect the browser still needs a
   * one-off permission for the re-enumerated bootloader port – this is surfaced
   * via needsBootloaderPermission and granted through grantBootloaderPort().
   */
  const connect = useCallback(async () => {
    const selectedPort = await selectDevice();
    if (!selectedPort) return false; // user cancelled the picker
    try {
      await prepareBootloaderMode(selectedPort);
    } catch {
      // Errors are surfaced via the error state.
    }
    return true;
  }, [selectDevice, prepareBootloaderMode]);

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
        const firmware = await compile();
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
        // After flashing the board resets back into application mode, so the ROM
        // bootloader handle we just used is stale. Drop it (but keep the granted
        // permission) so the next upload re-touches and re-discovers a live port.
        setBootloaderPort(null);
      } catch (err) {
        setError(err?.message || String(err));
        setStatus("error");
      }
    },
    [compile, appendLog],
  );

  // Phase 2 of bootloader preparation: grant access to the re-enumerated ROM
  // bootloader port. This MUST be invoked directly from a user gesture (a button
  // click) so navigator.serial.requestPort() runs with fresh transient user
  // activation. At this point the bootloader device (VID 0x303a / PID 0x0002) is
  // already on the USB bus, so it appears in the picker. Once granted, the
  // permission is persisted and every following upload skips this step.
  const grantBootloaderPort = useCallback(
    async (autoFlash = false) => {
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
        // When invoked from the upload dialog we flash right away (the board is
        // already in download mode from the earlier 1200bps touch). When invoked
        // from the navbar "connect" flow we only secure the permission and leave
        // the actual upload to the compile button.
        if (autoFlash) {
          await runCompileAndFlash(authorizedPort);
        }
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
    },
    [dispatch, appendLog, runCompileAndFlash],
  );

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
      // After a previous upload the board reset and re-enumerated, which can make
      // the stored port handle stale. Prefer a currently connected senseBox port.
      let touchPort = port;
      const livePort = knownPorts.find((p) => {
        try {
          return (
            p.getInfo?.()?.usbVendorId === SENSEBOX_USB_VENDOR_ID &&
            p.connected === true
          );
        } catch {
          return false;
        }
      });
      if (livePort) {
        touchPort = livePort;
        setPort(livePort);
      }
      appendLog("Versetze Board in den Download-Modus (1200bps touch) ...\n");
      await touchTo1200bps(touchPort);
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

  // Clears the transient flashing state (status/progress/log/error) without
  // touching the device connection. Used when the upload progress dialog closes.
  const resetFlashState = useCallback(() => {
    setStatus("idle");
    setProgress(0);
    setLog("");
    setError(null);
    setNeedsBootloaderPermission(false);
  }, []);

  const value = useMemo(
    () => ({
      supported,
      connected: Boolean(port),
      bootloaderReady: Boolean(bootloaderPort),
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
      connect,
      selectDevice,
      reconnectSavedDevice,
      prepareBootloaderMode,
      grantBootloaderPort,
      compile,
      startFlash,
      resetDevice,
      resetFlashState,
    }),
    [
      supported,
      port,
      bootloaderPort,
      deviceLabel,
      status,
      progress,
      log,
      error,
      binary,
      compileStatus,
      compileError,
      needsBootloaderPermission,
      connect,
      selectDevice,
      reconnectSavedDevice,
      prepareBootloaderMode,
      grantBootloaderPort,
      compile,
      startFlash,
      resetDevice,
      resetFlashState,
    ],
  );

  return (
    <FlashContext.Provider value={value}>{children}</FlashContext.Provider>
  );
}

FlashProvider.propTypes = {
  children: PropTypes.node,
};
