import { useCallback, useEffect, useRef, memo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "@xyflow/react";
import { useSelector } from "react-redux";
import "@xyflow/react/dist/style.css";
import SenseBoxWireEdge from "./uiComponents/senseBoxWire";
import OnboardEdge from "./uiComponents/onboardEdge";
import withCableHandles from "./uiComponents/withCableHandles";
import { busOf } from "./ports";
import { BOARD_ID, canConnect, connect, wireModules } from "./wiring";
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
const moduleNodes = {
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

// The fluoro bee sits on the board, without a cable.
const FLUORO_TYPE = "sensebox_fluoroASM_init";

const nodeTypes = {
  board: SenseBoxMCUS2,
  ...Object.fromEntries(
    Object.entries(moduleNodes).map(([type, component]) => [
      type,
      type === FLUORO_TYPE
        ? component
        : withCableHandles(component, busOf(type)),
    ]),
  ),
};

const edgeTypes = {
  multicolor: SenseBoxWireEdge,
  onboard: OnboardEdge,
};

const BOARD_NODE = {
  id: BOARD_ID,
  type: "board",
  position: { x: 400, y: 100 },
  draggable: false,
  deletable: false,
};
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
const hasNode = (module) => module.type in moduleNodes;

const moduleKey = (module) => `${module.type}@${module.port ?? ""}`;

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

  // One node per module, wired to the board. Existing nodes keep their place,
  // cables the user plugged stay.
  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;
  const knownModules = useRef(new Set());
  useEffect(() => {
    const shownModules = modules.filter(hasNode);
    const currentNodes = nodesRef.current;

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
              deletable: false,
              zIndex: 1000,
            }
          : {
              id: module.type,
              type: module.type,
              position: freePosition(nextNodes),
              deletable: false,
            },
      );
    });
    setNodes(nextNodes);

    // Only new modules are plugged in, so unplugged cables stay unplugged.
    // A GPIO sensor whose port was changed in the block counts as new.
    const newModules = new Set(
      shownModules
        .filter((module) => !knownModules.current.has(moduleKey(module)))
        .map((module) => module.type),
    );
    knownModules.current = new Set(shownModules.map(moduleKey));

    // New modules join the I2C chain from left to right.
    const x = (module) =>
      nextNodes.find((node) => node.id === module.type)?.position.x ?? 0;
    const leftToRight = [...shownModules].sort((a, b) => x(a) - x(b));
    setEdges((currentEdges) =>
      wireModules(currentEdges, leftToRight, newModules),
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

  // Cables are plugged by dragging from a connector to a module. While the
  // end of a cable is dragged, the cable itself does not count.
  const reconnecting = useRef(null);
  const isValidConnection = useCallback(
    (connection) =>
      canConnect(
        edges.filter((edge) => edge.id !== reconnecting.current?.edge.id),
        connection,
      ),
    [edges],
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => connect(eds, connection)),
    [setEdges],
  );

  // Drag the end of a cable to another connector, or away to unplug it.
  const onReconnectStart = useCallback((_, edge) => {
    reconnecting.current = { edge, plugged: false };
  }, []);
  const onReconnect = useCallback(
    (oldEdge, connection) => {
      reconnecting.current.plugged = true;
      setEdges((eds) => {
        const rest = eds.filter((edge) => edge.id !== oldEdge.id);
        return canConnect(rest, connection) ? connect(rest, connection) : eds;
      });
    },
    [setEdges],
  );
  const onReconnectEnd = useCallback(
    (_, edge) => {
      if (!reconnecting.current?.plugged) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }
      reconnecting.current = null;
    },
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
        isValidConnection={isValidConnection}
        onReconnectStart={onReconnectStart}
        onReconnect={onReconnect}
        onReconnectEnd={onReconnectEnd}
        // Cables are unplugged with their button, not with the keyboard:
        // the keys also delete blocks in the workspace.
        deleteKeyCode={null}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        zoomOnDoubleClick={false}
        zoomOnPinch={false}
        // The panel is small, so allow zooming out further than the default 0.5
        minZoom={0.1}
        fitView
        fitViewOptions={FIT_VIEW_OPTIONS}
      >
        <Background />
        <Controls fitViewOptions={FIT_VIEW_OPTIONS} />
      </ReactFlow>
    </div>
  );
};

export default memo(SimulatorFlow);
