import {
  START_SIMULATOR,
  STOP_SIMULATOR,
  SIMULATOR_ERROR,
  SET_MODULE_VALUE,
  REMOVE_MODULE_VALUES,
} from "./types";
import { addLog } from "./logActions";
import { startRuntime, stopRuntime } from "@/components/Simulator/runtime";

export const startSimulator = () => (dispatch, getState) => {
  const { code, isRunning } = getState().simulator;
  if (isRunning) {
    return;
  }

  dispatch({ type: START_SIMULATOR, payload: { timestamp: Date.now() } });
  dispatch(addLog({ type: "simulator", title: "Simulator Started" }));

  startRuntime(code, {
    onFinish: () => dispatch(stopSimulator()),
    onError: (error) => {
      dispatch({ type: SIMULATOR_ERROR, payload: error.message });
      dispatch(
        addLog({
          type: "simulator",
          title: "Simulator Error",
          description: error.message,
        }),
      );
      dispatch(stopSimulator());
    },
  });
};

export const stopSimulator = () => (dispatch, getState) => {
  stopRuntime();
  if (!getState().simulator.isRunning) {
    return;
  }

  dispatch({ type: STOP_SIMULATOR });
  dispatch(addLog({ type: "simulator", title: "Simulator stopped" }));
};

/**
 * Current value of a sensor slider, e.g. ("senseBox_hdc1080_temp", 21.5).
 */
export const setModuleValue = (type, value) => ({
  type: SET_MODULE_VALUE,
  payload: { type, value },
});

/**
 * Forget the values of sensors that are no longer shown.
 * @param {!Array<string>} types
 */
export const removeModuleValues = (types) => ({
  type: REMOVE_MODULE_VALUES,
  payload: types,
});
