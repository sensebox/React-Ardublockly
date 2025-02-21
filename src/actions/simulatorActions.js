import { START_SIMULATOR, STOP_SIMULATOR } from "./types";

export const startSimulator = () => (dispatch) => {
  dispatch({
    type: START_SIMULATOR,
  });
};

export const stopSimulator = () => (dispatch) => {
  dispatch({
    type: STOP_SIMULATOR,
  });
};