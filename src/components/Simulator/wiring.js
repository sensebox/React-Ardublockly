import {
  BOARD_PORTS,
  BUS,
  DEFAULT_I2C_PORT,
  MODULE_IN,
  MODULE_OUT,
  busOf,
  fixedBoardPort,
} from "./ports";

/**
 * Cables between the board and the modules. I2C modules hang in a chain on an
 * I2C connector, like the real senseBox modules with their two connectors.
 * UART and GPIO modules are plugged into their connector on the board. The
 * user can unplug every cable and plug it again.
 */

export const BOARD_ID = "board";

/**
 * Bus of a connector a cable can start from, or null.
 * @param {string} source Node id
 * @param {?string} sourceHandle Handle id on the source node
 * @return {?string}
 */
function busOfSource(source, sourceHandle) {
  if (source === BOARD_ID) {
    return BOARD_PORTS[sourceHandle]?.bus ?? null;
  }
  return sourceHandle === MODULE_OUT ? BUS.I2C : null;
}

const isI2cCable = (edge) =>
  busOfSource(edge.source, edge.sourceHandle) === BUS.I2C;

/**
 * @param {string} source Node id
 * @param {string} sourceHandle Handle id on the source node
 * @param {string} target Module type
 * @return {!Object} React Flow edge
 */
export function cable(source, sourceHandle, target) {
  const port = source === BOARD_ID ? BOARD_PORTS[sourceHandle] : null;
  // Sensors on the board are no cable and cannot be unplugged.
  const pluggable = port?.bus !== BUS.ONBOARD;
  return {
    id: `${source}:${sourceHandle}->${target}`,
    source,
    sourceHandle,
    target,
    targetHandle: MODULE_IN,
    type: pluggable ? "multicolor" : "onboard",
    data: { label: port?.label },
    // Above the board, so the plug in the connector is visible
    zIndex: 1,
    selectable: pluggable,
    deletable: pluggable,
    reconnectable: pluggable,
  };
}
/**
 * Last connector of the I2C chain, where the next module is plugged in.
 * @param {!Array<!Object>} i2cCables
 * @return {{source: string, sourceHandle: string}}
 */
function chainEnd(i2cCables) {
  const start = BOARD_PORTS[DEFAULT_I2C_PORT];
  // Continue the chain the user plugged into the other I2C connector.
  const usedPort =
    Object.keys(BOARD_PORTS).find(
      (port) =>
        BOARD_PORTS[port].bus === start.bus &&
        i2cCables.some(
          (edge) => edge.source === BOARD_ID && edge.sourceHandle === port,
        ),
    ) ?? DEFAULT_I2C_PORT;

  let end = { source: BOARD_ID, sourceHandle: usedPort };
  const visited = new Set();
  for (;;) {
    const next = i2cCables.find(
      (edge) =>
        edge.source === end.source && edge.sourceHandle === end.sourceHandle,
    );
    if (!next || visited.has(next.target)) {
      return end;
    }
    visited.add(next.target);
    end = { source: next.target, sourceHandle: MODULE_OUT };
  }
}

/**
 * Cables for the modules shown next to the board. Cables of known modules
 * stay as the user plugged them, also when unplugged. If a module in the I2C
 * chain is removed, its neighbours are joined. New modules are plugged in:
 * I2C modules at the end of the chain, the others into their connector.
 * @param {!Array<!Object>} edges Current edges
 * @param {!Array<{type: string, port: ?string}>} modules Shown modules, from
 *     left to right
 * @param {!Set<string>} newModules Types of the modules to plug in, e.g. new
 *     modules or a GPIO sensor whose port was changed in the block
 * @return {!Array<!Object>} New edges
 */
export function wireModules(edges, modules, newModules) {
  const shown = new Set(modules.map((module) => module.type));
  const exists = (id) => id === BOARD_ID || shown.has(id);

  const outOf = new Map(
    edges
      .filter((edge) => isI2cCable(edge) && edge.source !== BOARD_ID)
      .map((edge) => [edge.source, edge]),
  );

  let cables = [];
  const hasCable = (target) => cables.some((edge) => edge.target === target);
  edges.forEach((edge) => {
    if (!exists(edge.source)) {
      return;
    }
    if (exists(edge.target)) {
      cables.push(edge);
      return;
    }
    if (!isI2cCable(edge)) {
      return;
    }
    // Skip removed modules: plug into the next module that is still there.
    let target = edge.target;
    const visited = new Set();
    while (!exists(target) && outOf.has(target) && !visited.has(target)) {
      visited.add(target);
      target = outOf.get(target).target;
    }
    if (exists(target) && target !== BOARD_ID && !hasCable(target)) {
      cables.push(cable(edge.source, edge.sourceHandle, target));
    }
  });

  modules.forEach((module) => {
    const bus = busOf(module.type);
    if (bus === BUS.ONBOARD) {
      // Always shown: the sensor is part of the board.
      if (!hasCable(module.type)) {
        cables.push(cable(BOARD_ID, fixedBoardPort(module), module.type));
      }
      return;
    }
    if (!newModules.has(module.type)) {
      return;
    }
    if (bus === BUS.I2C) {
      if (!hasCable(module.type)) {
        const end = chainEnd(cables.filter(isI2cCable));
        cables.push(cable(end.source, end.sourceHandle, module.type));
      }
      return;
    }
    const port = fixedBoardPort(module);
    if (port) {
      cables = connect(cables, {
        source: BOARD_ID,
        sourceHandle: port,
        target: module.type,
      });
    }
  });

  return cables;
}

/**
 * Whether the user may plug a cable like this: from a connector of the board
 * or the second connector of an I2C module into the input of a module on the
 * same bus. I2C cables must not form a loop.
 * @param {!Array<!Object>} edges
 * @param {{source: string, sourceHandle: ?string, target: string,
 *     targetHandle: ?string}} connection
 * @return {boolean}
 */
export function canConnect(edges, connection) {
  const { source, sourceHandle, target, targetHandle } = connection;
  const bus = busOf(target);
  if (
    source === target ||
    targetHandle !== MODULE_IN ||
    !bus ||
    bus === BUS.ONBOARD ||
    busOfSource(source, sourceHandle) !== bus
  ) {
    return false;
  }
  if (bus !== BUS.I2C) {
    return true;
  }
  // The target must not be before the source in the chain.
  const i2cCables = edges.filter(isI2cCable);
  let node = source;
  const visited = new Set();
  while (node !== BOARD_ID && !visited.has(node)) {
    visited.add(node);
    const incoming = i2cCables.find((edge) => edge.target === node);
    if (!incoming) {
      break;
    }
    if (incoming.source === target) {
      return false;
    }
    node = incoming.source;
  }
  return true;
}

/**
 * Plug a cable. A connector holds one cable, so cables already in the source
 * or target connector are pulled out.
 * @param {!Array<!Object>} edges
 * @param {!Object} connection See canConnect.
 * @return {!Array<!Object>}
 */
export function connect(edges, connection) {
  const { source, sourceHandle, target } = connection;
  const rest = edges.filter(
    (edge) =>
      edge.target !== target &&
      !(edge.source === source && edge.sourceHandle === sourceHandle),
  );
  return [...rest, cable(source, sourceHandle, target)];
}
