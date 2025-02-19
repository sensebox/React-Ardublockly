
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { startSimulator, stopSimulator } from "../../actions/simulatorActions";
import IconButton from "@mui/material/IconButton";
import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SimulatorFlow from "./flow";
import moment from "moment";
import Box from "@mui/material/Box";
import { ReactFlowProvider } from "@xyflow/react";

export default function Simulator() {
  const dispatch = useDispatch();

  const simulationStartTimestamp = useSelector(
    (state) => state.simulator.simulationStartTimestamp,
  );
  const modules = useSelector((state) => state.simulator.modules);
  const isSimulatorRunning = useSelector((state) => state.simulator.isRunning);
  const [elapsedTime, setElapsedTime] = useState(0);

  console.log(modules);

  useEffect(() => {
    if (!isSimulatorRunning || !simulationStartTimestamp) {
      setElapsedTime(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsedTime(Date.now() - simulationStartTimestamp);
    }, 10); // Update 10ms

    return () => clearInterval(interval); // Cleanup
  }, [isSimulatorRunning, simulationStartTimestamp]);

  // Handle start and stop actions
  const handleStart = () => {
    dispatch(startSimulator()); // Dispatch action to start simulation
  };

  const handleStop = () => {
    dispatch(stopSimulator()); // Dispatch action to stop simulation
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
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
          padding: "0 1rem",
          marginTop: "0.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        {isSimulatorRunning ? (
          <IconButton onClick={handleStop}>
            <FontAwesomeIcon icon={faStop} />
          </IconButton>
        ) : (
          <IconButton onClick={handleStart}>
            <FontAwesomeIcon icon={faPlay} />
          </IconButton>
        )}
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
      </div>
      <ReactFlowProvider>
        <SimulatorFlow modules={modules} />
      </ReactFlowProvider>
    </div>
  );
}

const SimulationTimer = ({ elapsedTime }) => {
  // If elapsedTime is less than 60, show seconds with decimals (e.g., 1.24s)
  if (elapsedTime < 60000) {
    const formattedTime = (elapsedTime / 1000).toFixed(1) + "s"; // Convert ms to seconds and format to 2 decimal places
    return <span>{formattedTime}</span>;
  }

  // If elapsedTime is greater than or equal to 60s, show in minutes and seconds (e.g., 3m 25s)
  const duration = moment.duration(elapsedTime);

  const formattedTime = `${duration.minutes()}m ${duration.seconds()}s`;

  return <span>{formattedTime}</span>;
};