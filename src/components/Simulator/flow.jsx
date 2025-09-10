import { useCallback, useEffect, memo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
} from "@xyflow/react";
import SenseBoxWireEdge from "./uiComponents/senseBoxWire";
import SenseBoxMCUS2 from "./nodes/mcu-s2";
import "@xyflow/react/dist/style.css";
import HDC1080 from "./nodes/hdc1080";
import Display from "./nodes/display";
import lightuv from "./nodes/lightuv";
import WaterTemp from "./nodes/watertemp";
import SMT50 from "./nodes/smt50";
import store from "../../store";
import photodiode from "./nodes/photodiode";
import UltrasonicSensor from "./nodes/ultrasonic";
import tofimager from "./nodes/tofimager";
import bme680 from "./nodes/bme680";
import scd30 from "./nodes/scd30";
import dps310 from "./nodes/dps310";
import fluoroASM from "./nodes/fluoroASM";
import { useSelector } from "react-redux";
import accelerometer from "./nodes/accelerometer";
import sds011 from "./nodes/sds011";
import sps30 from "./nodes/sps30";
import rg15 from "./nodes/rg15";

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

const initialNodes = [
  {
    id: "b_0",
    type: "board",
    position: { x: 400, y: 100 },
  },
];

const initialEdges = [
  // { id: "e1-2", source: "1", target: "2" },
  // { id: "e1-3", source: "1", target: "3" },
  // { id: "e1-4", source: "1", target: "4" },
  // { id: "e3-5", source: "3", target: "5" },
  // { id: "e2-5", source: "2", target: "5" },
  // { id: "e4-5", source: "4", target: "5" },
];

const SimulatorFlow = (props) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const modules = useSelector((state) => state.simulator.modules);

  const reactFlow = useReactFlow();

  useEffect(() => {
    reactFlow.fitView();
  }, [modules]);
  useEffect(() => {
    // calculate new edges
    const newEdges = [];
    nodes.forEach((node) => {
      if (node.type === "board") {
        node.draggable = false;
        modules.forEach((module, index) => {
          // dont draw an edge with the fluoro bee
          if (module.type === "sensebox_fluoroASM_init") {
            return;
          }
          newEdges.push({
            id: `e${node.id}-${index}`,
            source: node.id,
            target: `m_${index}`,
            type: "multicolor",
          });
        });
      }
      if (node.type === "sensebox_fluoroASM_init") {
        const beePosition = { x: 497.69717682803514, y: 47.304223387137014 };
        node.draggable = false;
        node.position = beePosition;
        node.zIndex = 1000;
      }
    });
    setEdges([...initialEdges, ...newEdges]);
  }, [nodes]);

  useEffect(() => {
    const newNodes = modules
      .map((module, index) => {
        // skip the block for led - only use init block for node creation
        if (
          module.type === "sensebox_fluoroASM_setLED" ||
          module.type === "sensebox_button"
        ) {
          return;
        }
        if (nodes.map((n) => n.type).includes(module.type)) {
          return nodes.find((n) => n.type == module.type);
        }
        return {
          id: `m_${index.toString()}`,
          type: module.type,
          position: { x: 200 + Math.random() * 200, y: 400 },
        };
      })
      .filter((e) => e);

    setNodes([initialNodes[0], ...newNodes]);
  }, [modules]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        zoomOnDoubleClick={false}
        zoomOnPinch={false}
        fitViewOptions={{
          padding: 2,
        }}
        fitView
        connectionMode="loose"
        onInit={(e) => e.fitView()}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default memo(SimulatorFlow);
