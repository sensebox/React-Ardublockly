import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { startSimulator, stopSimulator } from "../../actions/simulatorActions";
import IconButton from "@mui/material/IconButton";
import {
  faPlay,
  faStop,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SimulatorFlow from "./flow";
import moment from "moment";
import Box from "@mui/material/Box";
import { ReactFlowProvider } from "@xyflow/react";
import { setModules } from "../../actions/generalActions";
import store from "../../store";

export default function Simulator() {
  const dispatch = useDispatch();

  const simulationStartTimestamp = useSelector(
    (state) => state.simulator.simulationStartTimestamp,
  );
  const modules = useSelector((state) => state.simulator.modules);
  const isSimulatorRunning = useSelector((state) => state.simulator.isRunning);

  const [elapsedTime, setElapsedTime] = useState(0);
  // Local state to show/hide the Info panel
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (!isSimulatorRunning || !simulationStartTimestamp) {
      setElapsedTime(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsedTime(Date.now() - simulationStartTimestamp);
    }, 10); // Update every 10ms

    return () => clearInterval(interval); // Cleanup
  }, [isSimulatorRunning, simulationStartTimestamp]);

  useEffect(() => {
    console.log("Modules changed", modules);
    store.dispatch(setModules(modules));
  }, [modules]);
  // Handle start and stop actions
  const handleStart = () => {
    dispatch(startSimulator());
  };
  const resetLEDs = () => {
    const flurorLED1 = document.getElementById("fluoro_led1");
    const flurorLED2 = document.getElementById("fluoro_led2");
    const flurorLED3 = document.getElementById("fluoro_led3");
    const flurorLED4 = document.getElementById("fluoro_led4");
    flurorLED1.style.fill = "black";
    flurorLED2.style.fill = "black";
    flurorLED3.style.fill = "black";
    flurorLED4.style.fill = "black";
  };

  const handleStop = () => {
    dispatch(stopSimulator());
    if (modules.includes("sensebox_fluoroASM_init")) {
      resetLEDs();
    }
  };

  const handleInfoClick = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
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
          <IconButton onClick={handleStop}>
            <FontAwesomeIcon color="#e27136" icon={faStop} />
          </IconButton>
        ) : (
          <IconButton onClick={handleStart}>
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
            <SimulationTimer elapsedTime={elapsedTime} />
          </Box>
        </div>

        {/* Info Button */}
        <IconButton onClick={handleInfoClick}>
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
            }}
          >
            <h4 style={{ marginTop: 0 }}>Simulation Info</h4>
            {/* Replace this placeholder with actual sensor status or data */}
            <p style={{ margin: 0 }}>
              <strong>Status:</strong>{" "}
              {isSimulatorRunning ? "Running" : "Stopped"}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Modules:</strong> {modules?.length ?? 0}
            </p>
          </div>
        )}
      </div>

      {/* MAIN SIMULATOR AREA */}
      <ReactFlowProvider>
        <SimulatorFlow modules={modules} />
      </ReactFlowProvider>
    </div>
  );
}

const SimulationTimer = ({ elapsedTime }) => {
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
