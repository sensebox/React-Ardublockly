import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import * as Blockly from "blockly/core";
import {
  DEFAULT_BOARD,
  getBoardProfile,
  matchesPort,
  useFlashDevice,
} from "@sensebox/flash-tool";
import { compileToBinary } from "./compileBinary";
import {
  setDevicePort,
  clearDevicePort,
  setBootloaderPortPrepared,
  clearBootloaderPortPrepared,
} from "../../../../actions/boardAction";

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
  cancelCompile: () => {},
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
 * Provides device selection and flashing to the toolbar, the navbar
 * "Gerät verbinden" flow and the Compile-and-Upload wizard.
 *
 * Connecting, the bootloader reset and the actual upload (esptool-js for the
 * MCU-S2 / MCU-Eye, bossa-web for the MCU) are done by `useFlashDevice` from
 * @sensebox/flash-tool. This provider adds the Blockly parts on top: compiling
 * the current workspace, the Redux connection state and the board switch.
 *
 * `keepConnection` keeps the board connected after an upload, so it is
 * connected once via the navbar and every following compile uploads directly.
 */
export function FlashProvider({ children }) {
  const dispatch = useDispatch();

  const compilerUrl = useSelector((state) => state.general.compiler);
  const sessionId = useSelector((state) => state.general.sessionId);
  const sketch = useSelector((state) => state.workspace.code.arduino);
  const selectedBoard = useSelector((state) => state.board.board);
  const savedDeviceLabel = useSelector((state) => state.board.deviceLabel);
  const filename = useSelector((state) => state.workspace.name) || "sketch";

  const selectedBoardRef = useRef(selectedBoard);
  selectedBoardRef.current = selectedBoard;
  // null for boards without direct upload (e.g. the Mini).
  const profile = getBoardProfile(selectedBoard);
  const board = profile?.compilerBoard;

  // The device hook needs a valid board. For unsupported boards it runs with
  // the default profile but is never used, because `supported` is false.
  const device = useFlashDevice({
    board: profile?.id ?? DEFAULT_BOARD,
    keepConnection: true,
  });
  const supported = device.supported && Boolean(profile);

  // Cached firmware binary produced by the online compiler.
  const [binary, setBinary] = useState(null);
  // idle | compiling | compiled | error
  const [compileStatus, setCompileStatus] = useState("idle");
  const [compileError, setCompileError] = useState(null);

  // Holds the currently running compile() promise so that callers which become
  // ready at different moments all await the SAME compilation instead of
  // kicking off a second, redundant compile run.
  const compilePromiseRef = useRef(null);
  // AbortController of the running compile() so the user can cancel it.
  const compileAbortRef = useRef(null);
  // Binary of the upload that is waiting for the one-off bootloader
  // permission, so granting it doesn't compile the sketch a second time.
  const pendingBinaryRef = useRef(null);

  /**
   * Sends the current Blockly/Arduino sketch to the online compiler, downloads
   * the resulting firmware binary and caches it for the upload step. Returns the
   * compiled binary so callers (e.g. startFlash) can use it immediately.
   */
  const compile = useCallback(async () => {
    if (compilePromiseRef.current) return compilePromiseRef.current;

    const abortController = new AbortController();
    compileAbortRef.current = abortController;

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
          signal: abortController.signal,
        });
        setBinary(compiled);
        setCompileStatus("compiled");
        return compiled;
      } catch (err) {
        if (abortController.signal.aborted) {
          // Cancelled by the user – not an error worth showing.
          setCompileStatus("idle");
          throw err;
        }
        setCompileError(err?.message || String(err));
        setCompileStatus("error");
        throw err;
      } finally {
        compilePromiseRef.current = null;
        compileAbortRef.current = null;
      }
    })();

    compilePromiseRef.current = runCompile;
    return runCompile;
  }, [compilerUrl, sketch, board, sessionId, filename]);

  /**
   * Cancels a running compilation. Only the compiler request is aborted, an
   * upload that is already writing to the board is never interrupted.
   */
  const cancelCompile = useCallback(() => {
    compileAbortRef.current?.abort();
  }, []);

  // Persist the connected device in Redux (navbar indicator, wizard).
  useEffect(() => {
    if (device.connected && device.deviceLabel) {
      dispatch(setDevicePort("connected", device.deviceLabel));
    }
  }, [dispatch, device.connected, device.deviceLabel]);

  useEffect(() => {
    if (device.bootloaderReady) dispatch(setBootloaderPortPrepared());
  }, [dispatch, device.bootloaderReady]);

  const { selectDevice: selectDevicePort, disconnect } = device;

  const selectDevice = useCallback(async () => {
    const boardAtStart = selectedBoardRef.current;
    const selectedPort = await selectDevicePort();
    // The board was switched while the picker was open: the port belongs to
    // the old board and must not receive this board's firmware.
    if (selectedPort && selectedBoardRef.current !== boardAtStart) {
      disconnect();
      return null;
    }
    return selectedPort;
  }, [selectDevicePort, disconnect]);

  // Picks up a live, already-permitted port of the board; falls back to the
  // browser's port picker.
  const { reconnect } = device;
  const reconnectSavedDevice = useCallback(async () => {
    const livePort = await reconnect();
    if (!livePort) await selectDevice();
  }, [reconnect, selectDevice]);

  // Phase 1 of the bootloader preparation: 1200bps touch, then look for an
  // ALREADY-PERMITTED bootloader port. On the very first upload the browser
  // has no permission for it yet; then `needsBootloaderPermission` is set and
  // grantBootloaderPort() must be called from a fresh user gesture.
  const { prepareBootloader } = device;
  const prepareBootloaderMode = useCallback(
    async (explicitPort) => {
      const activePort = explicitPort || device.port;
      // A board that is already in its bootloader needs no reset.
      if (!profile) return;
      if (activePort && matchesPort(activePort, profile, true)) return;
      await prepareBootloader(explicitPort);
    },
    [prepareBootloader, device.port, profile],
  );

  /**
   * Convenience action for the "Gerät verbinden" button in the navbar: opens the
   * serial-port picker and, once a device is chosen, immediately puts it into the
   * download (bootloader) mode so that a later click on the normal compile button
   * can upload straight away.
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

  // Compiles the sketch (unless a binary is passed) and flashes it. Errors of
  // the upload land in device.status/error, compile errors in compileStatus.
  const { flash } = device;
  const runCompileAndFlash = useCallback(
    async (compiledBinary) => {
      const boardAtStart = selectedBoardRef.current;
      let firmware = compiledBinary;
      if (!firmware) {
        try {
          firmware = await compile();
        } catch {
          // Cancelled or failed – shown via compileStatus/compileError.
          return;
        }
      }
      // The board was switched during compilation: the firmware is for the
      // old board, and the board switch already dropped the device.
      if (selectedBoardRef.current !== boardAtStart) return;

      pendingBinaryRef.current = firmware;
      await flash(firmware);
    },
    [compile, flash],
  );

  /**
   * Phase 2 of the bootloader preparation: grant access to the re-enumerated
   * bootloader port. MUST be called directly from a click handler so
   * navigator.serial.requestPort() runs with fresh user activation. Once
   * granted, the permission persists and later uploads skip this step.
   *
   * @param {boolean} [autoFlash] Upload right away (upload dialog). From the
   *   navbar connect flow only the permission is secured.
   */
  const { grantBootloaderPort: grantPort } = device;
  const grantBootloaderPort = useCallback(
    async (autoFlash = false) => {
      let granted;
      try {
        granted = await grantPort();
      } catch {
        // Shown via the error state.
        return;
      }
      if (granted && autoFlash) {
        await runCompileAndFlash(pendingBinaryRef.current);
      }
    },
    [grantPort, runCompileAndFlash],
  );

  const startFlash = useCallback(async () => {
    pendingBinaryRef.current = null;
    await runCompileAndFlash();
  }, [runCompileAndFlash]);

  const resetDevice = useCallback(() => {
    disconnect();
    dispatch(clearDevicePort());
    dispatch(clearBootloaderPortPrepared());
  }, [disconnect, dispatch]);

  // A port selected for another board must never receive this board's firmware.
  useEffect(() => {
    resetDevice();
    pendingBinaryRef.current = null;
    setBinary(null);
    setCompileStatus("idle");
    setCompileError(null);
  }, [selectedBoard, resetDevice]);

  // Clears the transient flashing state (status/progress/log/error) without
  // touching the device connection. Used when the upload progress dialog closes.
  const { resetFlashState: resetDeviceFlashState } = device;
  const resetFlashState = useCallback(() => {
    pendingBinaryRef.current = null;
    resetDeviceFlashState();
  }, [resetDeviceFlashState]);

  const value = {
    supported,
    profile,
    connected: device.connected,
    bootloaderReady: device.bootloaderReady,
    port: device.port,
    deviceLabel: device.deviceLabel || (supported ? savedDeviceLabel : ""),
    status: device.status,
    progress: device.progress,
    log: device.log,
    error: device.error,
    binary,
    compileStatus,
    compileError,
    needsBootloaderPermission: device.needsBootloaderPermission,
    connect,
    selectDevice,
    reconnectSavedDevice,
    prepareBootloaderMode,
    grantBootloaderPort,
    compile,
    cancelCompile,
    startFlash,
    resetDevice,
    resetFlashState,
  };

  return (
    <FlashContext.Provider value={value}>{children}</FlashContext.Provider>
  );
}

FlashProvider.propTypes = {
  children: PropTypes.node,
};
