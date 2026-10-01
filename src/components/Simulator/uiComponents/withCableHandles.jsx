import React, { memo } from "react";
import { useSelector } from "react-redux";
import * as Blockly from "blockly/core";
import { Handle, Position, useNodeConnections } from "@xyflow/react";
import { BUS, MODULE_IN, MODULE_OUT, fixedBoardPort } from "../ports";

// Looks like the JST connector on the senseBox modules
const CONNECTOR_STYLE = {
  width: 12,
  height: 22,
  borderRadius: 3,
  background: "#f2ead8",
  border: "2px solid #444",
};

const ONBOARD_STYLE = {
  width: 10,
  height: 10,
  background: "rgb(255, 221, 53)",
  border: "1px solid #444",
};

/**
 * Warning above a module that is not plugged in as in the program.
 * @param {{id: string, bus: string}} props
 */
const CableWarning = ({ id, bus }) => {
  // Texts come from Blockly.Msg: re-render when the language changes.
  useSelector((s) => s.general.language);
  const module = useSelector((s) =>
    s.simulator.modules.find((m) => m.type === id),
  );
  const connections = useNodeConnections({
    handleType: "target",
    handleId: MODULE_IN,
  });

  let text = null;
  if (connections.length === 0) {
    text = Blockly.Msg.simulator_not_connected;
  } else if (bus === BUS.GPIO && module?.port) {
    // The block reads the sensor on another port.
    const expected = fixedBoardPort(module);
    if (connections[0].sourceHandle !== expected) {
      text = Blockly.Msg.simulator_wrong_port.replace("%1", module.port);
    }
  }
  if (!text) {
    return null;
  }
  return (
    <div
      className="simulator-cable-warning"
      style={{
        position: "absolute",
        bottom: "100%",
        left: 0,
        marginBottom: 6,
        background: "#b71c1c",
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
        padding: "2px 8px",
        borderRadius: 4,
        whiteSpace: "nowrap",
        pointerEvents: "none",
      }}
    >
      {text}
    </div>
  );
};

/**
 * Adds the connectors to a module node: the cable comes in on the left.
 * I2C modules have a second connector on the right for the next module.
 * @param {!React.ComponentType} Component Module node
 * @param {?string} bus See BUS
 * @return {!React.ComponentType}
 */
export default function withCableHandles(Component, bus) {
  const isI2c = bus === BUS.I2C;
  const isOnboard = bus === BUS.ONBOARD;
  const ModuleWithCables = (props) => (
    <div style={{ position: "relative" }}>
      {!isOnboard && <CableWarning id={props.id} bus={bus} />}
      <Component {...props} />
      <Handle
        type="target"
        id={MODULE_IN}
        position={Position.Left}
        isConnectable={!isOnboard}
        title={isI2c ? "I2C" : undefined}
        style={isOnboard ? ONBOARD_STYLE : CONNECTOR_STYLE}
      />
      {isI2c && (
        <Handle
          type="source"
          id={MODULE_OUT}
          position={Position.Right}
          title="I2C"
          style={CONNECTOR_STYLE}
        />
      )}
    </div>
  );
  return memo(ModuleWithCables);
}
