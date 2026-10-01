import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import * as Blockly from "blockly/core";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import {
  faPlay,
  faStop,
  faInfoCircle,
  faChartLine,
  faBug,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactFlowProvider } from "@xyflow/react";
import moment from "moment";
import { startSimulator, stopSimulator } from "@/actions/simulatorActions";
import SimulatorFlow from "./flow";
import FloatingWindow from "./uiComponents/FloatingWindow";
import GraphViewer from "@/components/Workspace/GraphViewer";
import DebugViewer from "@/components/Workspace/DebugViewer";

export default function Simulator() {
  const dispatch = useDispatch();

  // Texts come from Blockly.Msg: re-render when the language changes.
  useSelector((s) => s.general.language);
  const code = useSelector((state) => state.simulator.code);
  const modules = useSelector((state) => state.simulator.modules);
  const isSimulatorRunning = useSelector((state) => state.simulator.isRunning);
  const unsupportedBlocks = useSelector(
    (state) => state.workspace.code.simulatorUnsupported ?? [],
    shallowEqual,
  );
  const generationError = useSelector(
    (state) => state.workspace.code.simulatorError,
  );
  const runtimeError = useSelector((state) => state.simulator.error);

  // Local state to show/hide the Info panel
  const [showInfo, setShowInfo] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  // A changed program invalidates the running simulation.
  const previousCode = useRef(code);
  useEffect(() => {
    if (previousCode.current !== code) {
      previousCode.current = code;
      dispatch(stopSimulator());
    }
  }, [code, dispatch]);

  // Stop the simulation when the simulator is closed, e.g. on a board change.
  useEffect(() => () => dispatch(stopSimulator()), [dispatch]);

  const handleStart = () => {
    dispatch(startSimulator());
  };

  const handleStop = () => {
    dispatch(stopSimulator());
  };

  const handleInfoClick = () => {
    setShowInfo(!showInfo);
  };

  const hints = [];
  if (runtimeError) {
    hints.push({
      id: "simulator-error",
      isError: true,
      text: `${Blockly.Msg.simulator_runtime_error} ${runtimeError}`,
    });
  }
  if (generationError) {
    hints.push({
      id: "simulator-generation-error",
      isError: true,
      text: `${Blockly.Msg.simulator_generation_error} ${generationError}`,
    });
  }
  if (unsupportedBlocks.length > 0) {
    hints.push({
      id: "simulator-hint",
      text: `${Blockly.Msg.simulator_unsupported_blocks} ${unsupportedBlocks.join(", ")}`,
    });
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
        {/* HEADER TOOLBAR */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translate(-50%, 0)",
            zIndex: 10,
            background: "#fff",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            borderRadius: "1rem",
            border: "1px solid #ddd",
            padding: "0 1rem",
            marginTop: "0.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          {/* Play/Stop Button */}
          {isSimulatorRunning ? (
            <IconButton
              onClick={handleStop}
              aria-label={Blockly.Msg.simulator_stop}
              title={Blockly.Msg.simulator_stop}
            >
              <FontAwesomeIcon color="#e27136" icon={faStop} />
            </IconButton>
          ) : (
            <IconButton
              onClick={handleStart}
              aria-label={Blockly.Msg.simulator_start}
              title={Blockly.Msg.simulator_start}
            >
              <FontAwesomeIcon color="#4eaf47" icon={faPlay} />
            </IconButton>
          )}

          {/* Timer */}
          <div
            style={{
              background: "lightgrey",
              borderRadius: "1rem",
              height: "fit-content",
              padding: ".25rem 0.5rem",
            }}
          >
            <Box sx={{ fontFamily: "Monospace" }}>
              <SimulationTimer />
            </Box>
          </div>

          {/* Graph and debug log open in floating windows */}
          <IconButton
            id="simulator-graph-button"
            onClick={() => setShowGraph((open) => !open)}
            aria-label={Blockly.Msg.simulator_tab_graph}
            title={Blockly.Msg.simulator_tab_graph}
          >
            <FontAwesomeIcon
              color={showGraph ? "#1976d2" : "#757575"}
              icon={faChartLine}
            />
          </IconButton>
          <IconButton
            id="simulator-debug-button"
            onClick={() => setShowDebug((open) => !open)}
            aria-label={Blockly.Msg.simulator_tab_debug}
            title={Blockly.Msg.simulator_tab_debug}
          >
            <FontAwesomeIcon
              color={showDebug ? "#1976d2" : "#757575"}
              icon={faBug}
            />
          </IconButton>

          {/* Info Button */}
          <IconButton
            onClick={handleInfoClick}
            aria-label={Blockly.Msg.simulator_info_title}
            title={Blockly.Msg.simulator_info_title}
          >
            <FontAwesomeIcon color=" #45beed" icon={faInfoCircle} />
          </IconButton>

          {/* Info Panel (toggles with showInfo) */}
          {showInfo && (
            <div
              style={{
                position: "absolute",
                top: "3.5rem", // Just below the toolbar
                right: "0.5rem",
                background: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                borderRadius: "0.5rem",
                padding: "1rem",
                zIndex: 999,
                minWidth: "200px",
                maxWidth: "280px",
              }}
            >
              <h4 style={{ marginTop: 0 }}>
                {Blockly.Msg.simulator_info_title}
              </h4>
              <p style={{ margin: 0 }}>
                <strong>{Blockly.Msg.simulator_info_status}</strong>{" "}
                {isSimulatorRunning
                  ? Blockly.Msg.simulator_status_running
                  : Blockly.Msg.simulator_status_stopped}
              </p>
              <p style={{ margin: 0 }}>
                <strong>{Blockly.Msg.simulator_info_modules}</strong>{" "}
                {modules?.length ?? 0}
              </p>
              <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem" }}>
                {Blockly.Msg.simulator_info_cables}
              </p>
            </div>
          )}
        </div>

        {/* MAIN SIMULATOR AREA */}
        <ReactFlowProvider>
          <SimulatorFlow />
        </ReactFlowProvider>
      </div>

      <FloatingWindow
        id="simulator-graph-window"
        title={Blockly.Msg.simulator_tab_graph}
        open={showGraph}
        onClose={() => setShowGraph(false)}
        initialPosition={{ x: 120, y: 140 }}
      >
        <GraphViewer />
      </FloatingWindow>
      <FloatingWindow
        id="simulator-debug-window"
        title={Blockly.Msg.simulator_tab_debug}
        open={showDebug}
        onClose={() => setShowDebug(false)}
        initialPosition={{ x: 160, y: 200 }}
      >
        <DebugViewer />
      </FloatingWindow>

      {/* Errors and blocks the simulator skips */}
      {hints.length > 0 && (
        <div
          style={{
            flex: "0 0 auto",
            maxHeight: "4.5em",
            overflowY: "auto",
            background: "#fff8e1",
            borderTop: "1px solid #ffcc80",
            padding: "0.25rem 0.75rem",
            fontSize: "0.8rem",
          }}
        >
          {hints.map((hint) => (
            <div
              key={hint.id}
              id={hint.id}
              style={hint.isError ? { color: "#b71c1c" } : undefined}
            >
              {hint.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Ticks on its own, so the 100 ms updates do not re-render the whole simulator.
const SimulationTimer = () => {
  const simulationStartTimestamp = useSelector(
    (state) => state.simulator.simulationStartTimestamp,
  );
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!simulationStartTimestamp) {
      setElapsedTime(0);
      return undefined;
    }

    const interval = setInterval(() => {
      setElapsedTime(Date.now() - simulationStartTimestamp);
    }, 100);

    return () => clearInterval(interval);
  }, [simulationStartTimestamp]);

  // If elapsedTime is less than 60s, show seconds with decimals
  if (elapsedTime < 60000) {
    const formattedTime = (elapsedTime / 1000).toFixed(1) + "s";
    return <span>{formattedTime}</span>;
  }

  // If elapsedTime >= 60s, show in minutes and seconds (e.g., 3m 25s)
  const duration = moment.duration(elapsedTime);
  const formattedTime = `${duration.minutes()}m ${duration.seconds()}s`;

  return <span>{formattedTime}</span>;
};
