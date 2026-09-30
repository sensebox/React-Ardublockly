import { useCallback, useEffect, useRef, memo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
} from "@xyflow/react";
import { useSelector } from "react-redux";
import "@xyflow/react/dist/style.css";
import SenseBoxWireEdge from "./uiComponents/senseBoxWire";
import SenseBoxMCUS2 from "./nodes/mcu-s2";
import HDC1080 from "./nodes/hdc1080";
import Display from "./nodes/display";
import lightuv from "./nodes/lightuv";
import WaterTemp from "./nodes/watertemp";
import SMT50 from "./nodes/smt50";
import photodiode from "./nodes/photodiode";
import UltrasonicSensor from "./nodes/ultrasonic";
import tofimager from "./nodes/tofimager";
import bme680 from "./nodes/bme680";
import scd30 from "./nodes/scd30";
import dps310 from "./nodes/dps310";
import fluoroASM from "./nodes/fluoroASM";
import accelerometer from "./nodes/accelerometer";
import sds011 from "./nodes/sds011";
import sps30 from "./nodes/sps30";
import rg15 from "./nodes/rg15";

// Node type = module type from the simulator program
const nodeTypes = {
  board: SenseBoxMCUS2,
  senseBox_hdc1080: HDC1080,
  senseBox_lightUv: lightuv,
  senseBox_display: Display,
  senseBox_waterTemp: WaterTemp,
  sensebox_esp32s2_light: photodiode,
  sensebox_sensor_ultrasonic_ranger: UltrasonicSensor,
  sensebox_tof_imager: tofimager,
  sensebox_sensor_bme680_bsec: bme680,
  senseBox_smt50: SMT50,
  sensebox_scd30: scd30,
  sensebox_sensor_dps310: dps310,
  sensebox_fluoroASM_init: fluoroASM,
  sensebox_esp32s2_accelerometer: accelerometer,
  sensebox_sensor_sds011: sds011,
  sensebox_sensor_sps30: sps30,
  sensebox_rg15_rainsensor: rg15,
};

const edgeTypes = {
  multicolor: SenseBoxWireEdge,
};

const BOARD_NODE = {
  id: "board",
  type: "board",
  position: { x: 400, y: 100 },
  draggable: false,
};

// The fluoro bee sits on the board, without a cable.
const FLUORO_TYPE = "sensebox_fluoroASM_init";
const FLUORO_POSITION = { x: 497.69717682803514, y: 47.304223387137014 };

// New sensors appear in a row below the board.
const ROW_Y = 450;
const FIRST_X = 50;
const SLOT_WIDTH = 340;

// Room at the top for the play/timer toolbar
const FIT_VIEW_OPTIONS = {
  padding: { top: "64px", bottom: "16px", x: "16px" },
};

// Modules without an own node, e.g. the button is part of the board.
const hasNode = (module) => module.type in nodeTypes && module.type !== "board";

function freePosition(nodes) {
  const usedX = new Set(
    nodes
      .filter((node) => node.id !== BOARD_NODE.id && node.id !== FLUORO_TYPE)
      .map((node) => Math.round(node.position.x)),
  );
  let x = FIRST_X;
  while (usedX.has(x)) {
    x += SLOT_WIDTH;
  }
  return { x, y: ROW_Y };
}

const SimulatorFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([BOARD_NODE]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const modules = useSelector((state) => state.simulator.modules);
  const reactFlow = useReactFlow();
  const containerRef = useRef(null);

  // Fit the view automatically until the user pans or zooms.
  const autoFit = useRef(true);
  const fitTimeout = useRef(null);
  const scheduleFit = useCallback(() => {
    if (!autoFit.current) {
      return;
    }
    window.clearTimeout(fitTimeout.current);
    fitTimeout.current = window.setTimeout(
      () => reactFlow.fitView(FIT_VIEW_OPTIONS),
      50,
    );
  }, [reactFlow]);
  useEffect(() => () => window.clearTimeout(fitTimeout.current), []);

  // Node sizes change when the sensor images have loaded.
  const handleNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      if (changes.some((change) => change.type === "dimensions")) {
        scheduleFit();
      }
    },
    [onNodesChange, scheduleFit],
  );

  // User interaction ends the automatic fitting (event is null otherwise).
  const handleMoveStart = useCallback((event) => {
    if (event) {
      autoFit.current = false;
    }
  }, []);

  // One node per module, wired to the board. Existing nodes keep their place.
  useEffect(() => {
    const shownModules = modules.filter(hasNode);

    setNodes((currentNodes) => {
      const board =
        currentNodes.find((node) => node.id === BOARD_NODE.id) ?? BOARD_NODE;
      // Nodes of modules that are still used keep their place.
      const keptNodes = currentNodes.filter((node) =>
        shownModules.some((module) => module.type === node.id),
      );
      const nextNodes = [board, ...keptNodes];
      shownModules.forEach((module) => {
        if (nextNodes.some((node) => node.id === module.type)) {
          return;
        }
        nextNodes.push(
          module.type === FLUORO_TYPE
            ? {
                id: module.type,
                type: module.type,
                position: FLUORO_POSITION,
                draggable: false,
                zIndex: 1000,
              }
            : {
                id: module.type,
                type: module.type,
                position: freePosition(nextNodes),
              },
        );
      });
      return nextNodes;
    });

    setEdges(
      shownModules
        .filter((module) => module.type !== FLUORO_TYPE)
        .map((module) => ({
          id: `board-${module.type}`,
          source: BOARD_NODE.id,
          target: module.type,
          type: "multicolor",
        })),
    );
  }, [modules, setNodes, setEdges]);

  // New or removed sensors: fit the view again.
  useEffect(() => {
    autoFit.current = true;
    scheduleFit();
  }, [modules, scheduleFit]);

  // Fit the view when the collapsed panel is opened again.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") {
      return undefined;
    }
    let wasVisible = container.clientHeight > 0;
    const observer = new ResizeObserver(() => {
      const visible = container.clientHeight > 0;
      if (visible && !wasVisible) {
        reactFlow.fitView(FIT_VIEW_OPTIONS);
      }
      wasVisible = visible;
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [reactFlow]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onMoveStart={handleMoveStart}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        zoomOnDoubleClick={false}
        zoomOnPinch={false}
        // The panel is small, so allow zooming out further than the default 0.5
        minZoom={0.1}
        fitView
        fitViewOptions={FIT_VIEW_OPTIONS}
        connectionMode="loose"
      >
        <Background />
        <Controls fitViewOptions={FIT_VIEW_OPTIONS} />
      </ReactFlow>
    </div>
  );
};

export default memo(SimulatorFlow);
