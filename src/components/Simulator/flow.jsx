
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
import SenseBoxMCUS2 from "./nodes/mcu-s2";
import "@xyflow/react/dist/style.css";
import HDC1080 from "./nodes/hdc1080";
import Display from "./nodes/display";
import lightuv from "./nodes/lightuv";
import WaterTemp from "./nodes/watertemp";
import store from "../../store";
import photodiode from "./nodes/photodiode";

const nodeTypes = {
  board: SenseBoxMCUS2,
  senseBox_hdc1080: HDC1080,
  senseBox_lightUv: lightuv,
  senseBox_display: Display,
  senseBox_waterTemp: WaterTemp,
  sensebox_esp32s2_light: photodiode
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

  

  const reactFlow = useReactFlow();


  useEffect(() => {
    reactFlow.fitView();

    // calculate new edges
    const newEdges = [];
    nodes.forEach((node) => {
      if (node.type === "board") {
        props.modules.forEach((module, index) => {
          newEdges.push({
            id: `e${node.id}-${index}`,
            source: node.id,
            target: `m_${index}`,
          });
        });
      }
    });

    setEdges([...initialEdges, ...newEdges]);
  }, [nodes]);

  useEffect(() => {
    const newNodes = props.modules
      .map((module, index) => {
        if (nodes.map((n) => n.type).includes(module)) {
          return nodes.find((n) => n.type == module);
        }
        return {
          id: `m_${index.toString()}`,
          type: module,
          position: { x: 200 + Math.random()  * 200, y: 400 },
        };
      })
      .filter((e) => e);



    setNodes([initialNodes[0], ...newNodes]);
  }, [props.modules]);

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
        fitView
        connectionMode="loose"
        minZoom={0.1}
      >
        <Background />
        <Controls />
        {/* <MiniMap /> */}
      </ReactFlow>
    </div>
  );
};

export default memo(SimulatorFlow);