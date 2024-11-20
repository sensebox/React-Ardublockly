import Interpreter from "js-interpreter";
import { START_SIMULATOR, STOP_SIMULATOR, NEW_CODE } from "../actions/types";
import initDom from "../components/Simulator/initDom";

const initialState = {
  code: "",
  isRunning: false,
  interpreter: null,
  abortController: null, // Added for abort control
};

function runInterpreter(interpreter, abortSignal) {
  return new Promise((resolve, reject) => {
    const nextStep = () => {
      if (abortSignal.aborted) {
        reject(new Error("Interpreter execution aborted"));
        return;
      }
      if (interpreter.step()) {
        window.setTimeout(nextStep, 0);
      } else {
        resolve();
      }
    };
    nextStep();
  });
}

export default function simulatorReducer(state = initialState, action) {
  switch (action.type) {
    case NEW_CODE: {
      const newInterpreter = new Interpreter(action.payload.simulator, initDom);
      return {
        ...state,
        code: action.payload.simulator,
        interpreter: newInterpreter,
        abortController: null, // Reset abortController
      };
    }
    case START_SIMULATOR: {
      console.log("START_SIMULATOR");

      const abortController = new AbortController();

      runInterpreter(state.interpreter, abortController.signal)
        .then(() => {
          console.log("Interpreter finished running");
          action.asyncDispatch({ type: STOP_SIMULATOR });
        })
        .catch((error) => {
          if (error.message === "Interpreter execution aborted") {
            console.log("Simulation stopped manually");
          } else {
            console.error(error);
          }
        });

      return {
        ...state,
        isRunning: true,
        abortController, // Save the controller for stopping
      };
    }
    case STOP_SIMULATOR: {
      console.log("STOP_SIMULATOR");
      if (state.abortController) {
        state.abortController.abort(); // Abort the current simulation
      }

      return {
        ...state,
        isRunning: false,
        interpreter: new Interpreter(state.code, initDom), // Reset interpreter
        abortController: null, // Clear the controller
      };
    }
    default:
      return state;
  }
}
