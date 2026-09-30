import {
  NEW_CODE,
  START_SIMULATOR,
  STOP_SIMULATOR,
  SET_MODULE_VALUE,
  REMOVE_MODULE_VALUES,
} from "../actions/types";

const initialState = {
  // Simulator program generated from the workspace
  code: "",
  // Modules (sensors, display, ...) used by the program: [{ id, type }]
  modules: [],
  // Current slider values of the sensor nodes, e.g. { senseBox_hdc1080_temp: 20 }
  moduleValues: {},
  isRunning: false,
  simulationStartTimestamp: null,
};

const MODULES_COMMENT = /^\/\/\s*modules:\s*(.*?)\s*#$/m;

/**
 * Read the modules from the first line of the simulator program,
 * e.g. `// modules: senseBox_hdc1080, senseBox_display #`.
 * @param {string} code
 * @return {!Array<{id: string, type: string}>}
 */
export function parseModules(code) {
  const match = code.match(MODULES_COMMENT);
  if (!match) {
    return [];
  }
  return match[1]
    .split(",")
    .map((module) => module.trim())
    .filter((module) => module.length > 0)
    .map((type) => ({ id: type, type }));
}

function sameModules(a, b) {
  return (
    a.length === b.length && a.every((module, i) => module.type === b[i].type)
  );
}

export default function simulatorReducer(state = initialState, action) {
  switch (action.type) {
    case NEW_CODE: {
      const code = action.payload?.simulator ?? "";
      if (code === state.code) {
        return state;
      }
      const modules = parseModules(code);
      return {
        ...state,
        code,
        // Keep the reference if nothing changed, so the board view is not
        // rebuilt on every code change.
        modules: sameModules(modules, state.modules) ? state.modules : modules,
      };
    }
    case START_SIMULATOR:
      return {
        ...state,
        isRunning: true,
        simulationStartTimestamp: action.payload.timestamp,
      };
    case STOP_SIMULATOR:
      return {
        ...state,
        isRunning: false,
        simulationStartTimestamp: null,
      };
    case SET_MODULE_VALUE: {
      const { type, value } = action.payload;
      return {
        ...state,
        moduleValues: {
          ...state.moduleValues,
          [type]: value,
        },
      };
    }
    case REMOVE_MODULE_VALUES: {
      const moduleValues = { ...state.moduleValues };
      action.payload.forEach((type) => delete moduleValues[type]);
      return { ...state, moduleValues };
    }
    default:
      return state;
  }
}
